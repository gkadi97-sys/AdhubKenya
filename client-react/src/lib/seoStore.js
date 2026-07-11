let currentSeo = {};
const listeners = new Set();

export const setSEO = (seo) => {
  currentSeo = seo;
  listeners.forEach(l => l(currentSeo));
};

export const subscribeSEO = (listener) => {
  listeners.add(listener);
  listener(currentSeo);
  return () => listeners.delete(listener);
};
