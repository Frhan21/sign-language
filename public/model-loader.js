(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.createModelLoader = api.createModelLoader;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createModelLoader(load, timeoutMs = 15000) {
    const models = {};
    const ready = {};
    let requestId = 0;

    function preload(mode) {
      if (!models[mode]) {
        const loading = load(mode);
        if (timeoutMs > 0) {
          let timedOut = false;
          const timeout = new Promise((_, reject) => setTimeout(() => {
            timedOut = true;
            reject(new Error(`Model ${mode} timeout`));
          }, timeoutMs));
          models[mode] = Promise.race([loading, timeout]).catch((error) => {
            delete models[mode];
            if (timedOut) loading.then((model) => model.dispose?.(), () => {});
            throw error;
          });
        } else {
          models[mode] = loading.catch((error) => {
            delete models[mode];
            throw error;
          });
        }
      }
      models[mode].then(() => { ready[mode] = true; }, () => {});
      return models[mode];
    }

    async function get(mode) {
      const id = ++requestId;
      const model = await preload(mode);
      return { model, current: id === requestId };
    }

    return { get, preload, cached: (mode) => Boolean(models[mode]), ready: (mode) => Boolean(ready[mode]) };
  }

  return { createModelLoader };
});
