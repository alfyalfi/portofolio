import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import {
  defaultLocale,
  isLocale,
  localeCookie,
  localeCookieMaxAge,
  locales,
  type AppLocale,
} from "@/common/i18n";

// Normalize legacy tag: 'in' (Old Indonesian) -> 'id'
function normalizeLangTag(tag: string) {
  // in, in-ID -> id, id-ID
  return tag.replace(/^in(-|$)/i, "id$1");
}

function getLocale(request: NextRequest): AppLocale {
  const cookie = request.cookies.get(localeCookie)?.value;
  if (isLocale(cookie)) return cookie;

  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  })
    .languages()
    .map(normalizeLangTag);

  try {
    return match(languages, [...locales], defaultLocale) as AppLocale;
  } catch {
    // match() throws on tags that are not valid locales, e.g. the
    // "Accept-Language: *" some bots and HTTP clients send
    return defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Old /en and /id URLs (bookmarks, backlinks, the previous sitemap) move
  // permanently to the same path without the prefix, keeping their language.
  const prefix = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (prefix) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(prefix.length + 1) || "/";

    const res = NextResponse.redirect(url, 301);
    res.cookies.set({
      name: localeCookie,
      value: prefix,
      path: "/",
      maxAge: localeCookieMaxAge,
      sameSite: "lax",
    });
    return res;
  }

  // Legacy /studio path redirects to "/" (Alfaristudio Creative Homepage)
  if (pathname === "/studio" || pathname === "/studio/") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 301);
  }

  // Every language lives at the same URL:
  // - "/" serves /{locale} (Alfaristudio Creative Homepage)
  // - "/portofolio" serves /{locale}/portofolio (Personal Portfolio of M. Firdaus Alfarizi)
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  // Skips Next internals and every file with an extension (assets, robots.txt,
  // sitemap.xml, llms.txt, Search Console verification files)
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)",
  ],
};
