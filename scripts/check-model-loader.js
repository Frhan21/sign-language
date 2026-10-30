const assert = require("node:assert/strict");
const { createModelLoader } = require("../public/model-loader");

(async () => {
  const calls = [];
  const loader = createModelLoader(async (mode) => {
    calls.push(mode);
    return { mode };
  }, 50);
  assert.equal((await loader.get("sibi")).model.mode, "sibi");
  assert.equal((await loader.get("sibi")).model.mode, "sibi");
  assert.deepEqual(calls, ["sibi"]);

  let finishPreload;
  const preloadedCalls = [];
  const preloaded = createModelLoader((mode) => {
    preloadedCalls.push(mode);
    return new Promise((resolve) => { finishPreload = () => resolve({ mode }); });
  }, 0);
  const warming = preloaded.preload("bisindo");
  const activating = preloaded.get("bisindo");
  assert.deepEqual(preloadedCalls, ["bisindo"]);
  assert.equal(preloaded.cached("bisindo"), true);
  assert.equal(preloaded.ready("bisindo"), false);
  finishPreload();
  assert.strictEqual(await warming, (await activating).model);
  assert.equal(preloaded.ready("bisindo"), true);
  assert.deepEqual(preloadedCalls, ["bisindo"]);

  let preloadAttempts = 0;
  const retryPreload = createModelLoader(() => ++preloadAttempts === 1 ? Promise.reject(new Error("preload failed")) : Promise.resolve({ mode: "sibi" }), 0);
  await assert.rejects(retryPreload.preload("sibi"), /preload failed/);
  assert.equal(retryPreload.cached("sibi"), false);
  assert.equal((await retryPreload.get("sibi")).model.mode, "sibi");

  let release;
  const racing = createModelLoader((mode) => mode === "sibi" ? new Promise((resolve) => { release = () => resolve({ mode }); }) : Promise.resolve({ mode }), 50);
  const stale = racing.get("sibi");
  assert.equal((await racing.get("bisindo")).current, true);
  release();
  assert.equal((await stale).current, false);

  let timeoutCalls = 0;
  const timeout = createModelLoader(() => ++timeoutCalls === 1 ? new Promise(() => {}) : Promise.resolve({ mode: "sibi" }), 5);
  await assert.rejects(timeout.get("sibi"), /timeout/);
  assert.equal(timeout.cached("sibi"), false);
  assert.equal((await timeout.get("sibi")).model.mode, "sibi");

  const noTimeout = createModelLoader(() => new Promise((resolve) => setTimeout(() => resolve({ mode: "bisindo" }), 10)), 0);
  assert.equal((await noTimeout.get("bisindo")).model.mode, "bisindo");

  let disposeLate;
  const late = createModelLoader(() => new Promise((resolve) => { disposeLate = () => resolve({ dispose: () => { disposeLate.called = true; } }); }), 5);
  await assert.rejects(late.get("sibi"), /timeout/);
  disposeLate();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(disposeLate.called, true);
  console.log("model loader checks passed");
})().catch((error) => { console.error(error); process.exit(1); });
