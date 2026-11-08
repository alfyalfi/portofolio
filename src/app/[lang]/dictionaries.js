import "server-only";

const dictionaries = {
  en: () => import("@/locales/en.json").then((module) => module.default),
  id: () => import("@/locales/id.json").then((module) => module.default),
};

const getDictionary = async (locale) => dictionaries[locale]();

export default getDictionary;
