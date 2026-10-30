const $ = (id) => document.getElementById(id);
const guide = window.GESTURE_GUIDE || [];
const labels = {
  sibi: guide.filter((item) => item.mode === "sibi").map((item) => item.label),
  bisindo: guide.filter((item) => item.mode === "bisindo").map((item) => item.label),
};
const storedTheme = localStorage.getItem("theme");
const state = {
  mode: localStorage.getItem("mode") || "sibi",
  theme: storedTheme === "light" || storedTheme === "dark" ? storedTheme : "system",
  input: "none",
  started: false,
  model: null,
  modelMode: null,
  switchingModel: false,
  stream: null,
  frameRequest: 0,
  processingFrame: false,
  selectedDeviceId: "",
  latest: "",
  operations: [],
  buffer: [],
  lastAccepted: "",
  lastAcceptedAt: 0,
  recognition: null,
  recognizing: false,
  autoReadTimer: null,
  ttsEnabled: localStorage.getItem("ttsEnabled") === "true",
  ttsMode: localStorage.getItem("ttsMode") || "training",
  ttsAuto: localStorage.getItem("ttsAuto") !== "false",
};
const video = $("webcam");
const canvas = $("output-canvas");
const ctx = canvas.getContext("2d");
let hands;
let lastGuideTrigger = null;
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const modelLoader = createModelLoader(async (mode) => {
  const startedAt = performance.now();
  const model = await tf.loadGraphModel(mode === "sibi" ? "./tfjs_model_sibi/tfjs/model.json" : "./tfjs_bisindo/model.json");
  console.debug("[model-performance]", { event: "load", mode, durationMs: Math.round(performance.now() - startedAt) });
  return model;
}, 0);

function showError(message) {
  const toast = $("error-container");
  toast.textContent = message;
  toast.style.display = "block";
  clearTimeout(showError.timer);
  showError.timer = setTimeout(() => (toast.style.display = "none"), 5000);
}
function applyTheme() {
  const resolved = state.theme === "system" ? (systemTheme.matches ? "dark" : "light") : state.theme;
  document.documentElement.dataset.theme = resolved;
  document.querySelector('meta[name="theme-color"]').content = resolved === "dark" ? "#081226" : "#f5f8ff";
  const nextTheme = resolved === "dark" ? "light" : "dark";
  $("theme-toggle").setAttribute("aria-label", `Gunakan tema ${nextTheme === "dark" ? "gelap" : "terang"}`);
  $("theme-toggle").title = `Gunakan tema ${nextTheme === "dark" ? "gelap" : "terang"}`;
}
function toggleTheme() {
  const resolved = document.documentElement.dataset.theme || (systemTheme.matches ? "dark" : "light");
  state.theme = resolved === "dark" ? "light" : "dark";
  localStorage.setItem("theme", state.theme);
  applyTheme();
}
function currentGuide(label = state.latest) {
  return guide.find((item) => item.mode === state.mode && item.label === label);
}
function guideAsset(item) {
  return window.GUIDE_ASSETS?.[`${item.mode}:${item.label.toLowerCase()}`];
}
function setAppStatus(message, status = "ready") {
  $("app-status-text").textContent = message;
  $("app-status").dataset.state = status;
}
function messageText() {
  return state.operations.join("").replace(/\s+/g, " ").trim();
}
function renderMessage() {
  const text = messageText();
  $("sentence-result").textContent = text || "Belum ada pesan.";
}
function detailMarkup(item) {
  const asset = guideAsset(item);
  const media = asset ? `<img src="${asset.detail}" alt="${item.alt}">` : `<div class="dataset-pending" role="img" aria-label="Gambar gestur ${item.label} belum tersedia">Foto belum tersedia</div>`;
  const source = asset ? `<p class="asset-credit">Sumber: <a href="${asset.url}" target="_blank" rel="noopener noreferrer">${asset.owner}, Kaggle</a> · ${asset.license}</p>` : "";
  return `${media}<h3>${item.label}</h3><p>${item.instruction}</p><dl><dt>Kategori</dt><dd>${item.category}</dd><dt>Jumlah tangan</dt><dd>${item.hands}</dd><dt>Gerakan</dt><dd>${item.motion}</dd><dt>Diucapkan</dt><dd>${item.speech}</dd></dl>${source}`;
}
function renderDetail(item = currentGuide() || guide.find((entry) => entry.mode === state.mode), openOnMobile = false) {
  if (!item) return;
  const markup = detailMarkup(item);
  $("guide-detail").innerHTML = markup;
  $("guide-dialog-content").innerHTML = markup;
  $("guide-dialog-title").textContent = `Gestur ${item.label}`;
  if (openOnMobile && window.matchMedia("(max-width: 700px)").matches) {
    const dialog = $("guide-dialog");
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
  }
}
function closeGuideDialog() {
  const dialog = $("guide-dialog");
  if (dialog.open) dialog.close();
  document.body.classList.remove("dialog-open");
}
function renderGuide() {
  const query = $("guide-search").value.trim().toLocaleLowerCase("id");
  const category = $("guide-category").value;
  const items = guide.filter((item) => item.mode === state.mode && (category === "all" || item.category === category) && item.label.toLocaleLowerCase("id").includes(query));
  const list = $("guide-list");
  list.replaceChildren();
  $("guide-reset").hidden = Boolean(items.length);
  if (!items.length) {
    list.innerHTML = '<p class="empty">Tidak ada gestur yang cocok. Ubah kata kunci atau atur ulang filter.</p>';
    return;
  }
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "guide-card";
    button.type = "button";
    button.dataset.label = item.label;
    button.setAttribute("aria-current", String(item.label === state.latest));
    const asset = guideAsset(item);
    button.innerHTML = `${asset ? `<img loading="lazy" src="${asset.thumb}" alt="Foto referensi gestur ${item.label}">` : `<span class="guide-placeholder" aria-hidden="true">${item.label.slice(0, 2).toUpperCase()}</span>`}<strong>${item.label}</strong><span>${item.category}</span>`;
    button.addEventListener("click", () => { lastGuideTrigger = button; renderDetail(item, true); });
    list.append(button);
  });
  renderDetail();
}
function updateActiveGuide() {
  document.querySelectorAll(".guide-card").forEach((card) => card.setAttribute("aria-current", String(card.dataset.label === state.latest)));
  renderDetail();
}
function addOperation(value) {
  if (!value) return;
  state.operations.push(value);
  renderMessage();
}
function acceptPrediction(label, confidence) {
  if (!label || label === state.lastAccepted || Date.now() - state.lastAcceptedAt < 2000) return;
  state.latest = label;
  state.lastAccepted = label;
  state.lastAcceptedAt = Date.now();
  const item = currentGuide(label);
  addOperation(item.category === "huruf" ? label.toUpperCase() : `${state.operations.length ? " " : ""}${label}`);
  $("gesture-highlight").textContent = label;
  $("gesture-result").textContent = `Gestur stabil: ${label}`;
  $("confidence-badge").textContent = `Akurasi ${(confidence * 100).toFixed(1)}%`;
  updateActiveGuide();
  sendPrediction(label, "token");
  if (state.ttsEnabled && state.ttsMode === "training") speak(currentGuide(label)?.speech || label);
  scheduleAutoRead();
}
function scheduleAutoRead() {
  clearTimeout(state.autoReadTimer);
  if (state.ttsEnabled && state.ttsMode === "communication" && state.ttsAuto && messageText()) state.autoReadTimer = setTimeout(readMessage, 3000);
}
function findVoice() {
  return window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("id"));
}
function updateVoiceStatus() {
  if (!("speechSynthesis" in window)) return ($("voice-status").textContent = "Browser tidak mendukung TTS.");
  const voice = findVoice();
  $("voice-status").textContent = state.ttsEnabled ? (voice ? `Suara Indonesia: ${voice.name}` : "Suara Indonesia khusus tidak tersedia; memakai suara bawaan.") : "TTS nonaktif.";
}
function speak(text) {
  if (!state.ttsEnabled || !text || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  const voice = findVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = () => ($("voice-status").textContent = "Sedang membacakan pesan.");
  utterance.onend = () => updateVoiceStatus();
  utterance.onerror = () => ($("voice-status").textContent = "Suara gagal diputar. Coba lagi.");
  window.speechSynthesis.speak(utterance);
}
function readMessage() {
  const text = messageText();
  if (text) speak(text);
}
function finishMessage() {
  const text = messageText();
  if (!text) return;
  clearTimeout(state.autoReadTimer);
  speak(text);
  sendPrediction(text, "message");
}
async function sendPrediction(text, type) {
  try {
    const response = await fetch("/prediction", { method: "POST", headers: { "Content-Type": "text/plain", "X-Prediction-Type": type }, body: text });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) { console.error("MQTT publish failed:", error); }
}
function configureHands() {
  hands.setOptions({ maxNumHands: state.mode === "bisindo" ? 2 : 1, modelComplexity: 1, minDetectionConfidence: .6, minTrackingConfidence: .6 });
}
function setSwitching(switching) {
  state.switchingModel = switching;
  $("gesture-mode-btn").disabled = switching || state.input === "gesture";
  $("voice-mode-btn").disabled = switching || !state.recognition || state.input === "voice";
}
async function loadModel() {
  const mode = state.mode;
  const cached = modelLoader.ready(mode);
  const startedAt = performance.now();
  const previousMode = state.modelMode;
  setSwitching(true);
  $("retry-model-btn").hidden = true;
  setAppStatus(`${cached ? "Mengaktifkan" : "Memuat"} model ${mode.toUpperCase()}…`, "loading");
  try {
    const result = await modelLoader.get(mode);
    if (!result.current || mode !== state.mode) return false;
    state.model = result.model;
    state.modelMode = mode;
    resetPrediction();
    configureHands();
    console.debug("[model-performance]", { event: "activate", mode, cached, durationMs: Math.round(performance.now() - startedAt) });
    setAppStatus(`Model ${mode.toUpperCase()} siap.`, "ready");
    return true;
  } catch (error) {
    console.error("Model load failed:", error);
    if (mode === state.mode) {
      if (previousMode) {
        state.mode = previousMode;
        $("mode-select").value = previousMode;
        localStorage.setItem("mode", previousMode);
        renderGuide();
        setSwitching(false);
      }
      setAppStatus(`Model ${mode.toUpperCase()} gagal dimuat.`, "error");
      $("retry-model-btn").hidden = Boolean(previousMode);
      showError("Model gagal dimuat. Model sebelumnya tetap aktif.");
    }
    return false;
  } finally {
    if (mode === state.mode) {
      setSwitching(false);
      $("gesture-mode-btn").disabled = !state.model || state.input === "gesture";
    }
  }
}
function preloadOtherModel() {
  const mode = state.mode === "sibi" ? "bisindo" : "sibi";
  const startedAt = performance.now();
  modelLoader.preload(mode).then(() => {
    console.debug("[model-performance]", { event: "preload", mode, durationMs: Math.round(performance.now() - startedAt) });
  }).catch((error) => console.warn(`Background preload ${mode} failed:`, error));
}
async function listCameras() {
  const devices = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === "videoinput");
  const select = $("camera-select");
  select.replaceChildren();
  devices.forEach((device, index) => select.add(new Option(device.label || `Kamera ${index + 1}`, device.deviceId)));
  select.disabled = !devices.length;
  if (state.selectedDeviceId && devices.some((device) => device.deviceId === state.selectedDeviceId)) select.value = state.selectedDeviceId;
  state.selectedDeviceId = select.value;
}
async function startStream() {
  state.stream?.getTracks().forEach((track) => track.stop());
  state.stream = await navigator.mediaDevices.getUserMedia({ video: state.selectedDeviceId ? { deviceId: { exact: state.selectedDeviceId } } : { facingMode: "user" }, audio: false });
  video.srcObject = state.stream;
  await video.play();
  await listCameras();
}
async function processFrames() {
  try {
    if (state.input === "gesture" && !state.switchingModel && state.model && state.modelMode === state.mode && !state.processingFrame) {
      state.processingFrame = true;
      await hands.send({ image: video });
    }
  } catch (error) {
    console.error("Frame processing failed:", error);
  } finally {
    state.processingFrame = false;
    state.frameRequest = requestAnimationFrame(processFrames);
  }
}
async function startApp() {
  if (state.started) return;
  if (!navigator.mediaDevices?.getUserMedia) return showError("Browser tidak mendukung akses kamera.");
  $("start-btn").disabled = true;
  try {
    await startStream();
    hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.onResults(handleResults);
    const modelReady = await loadModel();
    state.started = true;
    $("camera-idle").hidden = true;
    processFrames();
    $("gesture-mode-btn").disabled = !modelReady;
    $("voice-mode-btn").disabled = !state.recognition;
    $("switch-camera-btn").disabled = false;
    if (modelReady) {
      activateGestureMode();
      preloadOtherModel();
    } else $("input-mode-status").textContent = "Model belum siap";
  } catch (error) {
    console.error(error);
    state.stream?.getTracks().forEach((track) => track.stop());
    state.stream = null;
    state.started = false;
    video.srcObject = null;
    $("camera-idle").hidden = false;
    $("switch-camera-btn").disabled = true;
    const denied = error?.name === "NotAllowedError";
    setAppStatus(denied ? "Izin kamera ditolak." : "Kamera gagal dimulai.", "error");
    showError(denied ? "Izin kamera ditolak. Izinkan kamera melalui pengaturan browser, lalu coba lagi." : "Kamera gagal dimulai. Periksa perangkat dan koneksi, lalu coba lagi.");
    $("start-btn").disabled = false;
  }
}
function handleResults(results) {
  const mode = state.mode;
  const model = state.model;
  if (state.switchingModel || !model || state.modelMode !== mode) return;
  if (video.videoWidth && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const found = results.multiHandLandmarks || [];
  found.forEach((landmarks) => { drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "#6da8ff", lineWidth: 3 }); drawLandmarks(ctx, landmarks, { color: "#f4f7ff", lineWidth: 1 }); });
  if ((state.mode === "sibi" && found.length !== 1) || (state.mode === "bisindo" && !found.length)) return ($("gesture-result").textContent = "Posisikan tangan utuh di dalam kamera.");
  let landmarks = state.mode === "sibi" ? found[0] : [...found[0], ...(found[1] || Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 })))];
  const flat = landmarks.flatMap((point) => [point.x, point.y, point.z]);
  tf.tidy(() => {
    const output = model.predict(tf.tensor(flat).reshape([1, flat.length, 1]));
    output.data().then((values) => {
      if (state.switchingModel || state.mode !== mode || state.model !== model) return;
      const confidence = Math.max(...values);
      const label = labels[mode][values.indexOf(confidence)];
      $("confidence-badge").textContent = `Akurasi ${(confidence * 100).toFixed(1)}%`;
      if (confidence < .8) return ($("gesture-result").textContent = "Akurasi rendah — sesuaikan tangan dan cahaya.");
      state.buffer.push(label); if (state.buffer.length > 8) state.buffer.shift();
      const counts = state.buffer.reduce((all, item) => ({ ...all, [item]: (all[item] || 0) + 1 }), {});
      const stable = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
      if (counts[stable] >= 5) acceptPrediction(stable, confidence);
    });
  });
}
function activateGestureMode() {
  state.input = "gesture";
  if (state.recognizing) state.recognition.stop();
  $("input-mode-status").textContent = "Gestur aktif";
  $("gesture-mode-btn").disabled = true;
  $("voice-mode-btn").disabled = !state.recognition;
}
function activateVoiceMode() {
  if (!state.recognition) return showError("STT tidak didukung browser ini.");
  state.input = "voice";
  $("input-mode-status").textContent = "STT aktif";
  $("voice-mode-btn").disabled = true;
  $("gesture-mode-btn").disabled = false;
  if (!state.recognizing) try { state.recognition.start(); } catch (_) {}
}
function setupRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return;
  state.recognition = new Recognition();
  Object.assign(state.recognition, { lang: "id-ID", continuous: true, interimResults: true });
  state.recognition.onstart = () => (state.recognizing = true);
  state.recognition.onend = () => { state.recognizing = false; if (state.input === "voice") setTimeout(() => { try { state.recognition.start(); } catch (_) {} }, 600); };
  state.recognition.onerror = (event) => { if (event.error === "not-allowed") showError("Izin mikrofon ditolak."); };
  state.recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.trim();
      if (event.results[i].isFinal && transcript) {
        addOperation(`${state.operations.length ? " " : ""}${transcript}`);
        sendPrediction(transcript, "token");
        scheduleAutoRead();
      } else interim += transcript;
    }
    $("speech-result").innerHTML = `<strong>STT:</strong> ${interim || "mendengarkan…"}`;
  };
}
function resetPrediction() { state.buffer = []; state.lastAccepted = ""; state.latest = ""; }
function init() {
  if (labels.sibi.length !== 24 || labels.bisindo.length !== 47 || guide.some((item) => !item.asset || !item.speech)) throw new Error("Guide registry tidak lengkap");
  applyTheme();
  $("mode-select").value = state.mode;
  $("tts-enabled").checked = state.ttsEnabled; $("tts-mode").value = state.ttsMode; $("tts-auto").checked = state.ttsAuto;
  $("guide-notice").textContent = "Foto alfabet berasal dari dataset Kaggle. Angka dan kosakata belum seluruhnya memiliki foto. Panduan ini bukan standar linguistik resmi atau jaminan pengenalan model.";
  const sources = [...new Map(Object.values(window.GUIDE_ASSETS || {}).map((asset) => [asset.url, asset])).values()];
  $("credits-list").innerHTML = sources.map((asset) => `<p class="credit-row"><a href="${asset.url}" target="_blank" rel="noopener noreferrer">${asset.owner}, Kaggle</a> — ${asset.license}</p>`).join("");
  setupRecognition(); renderGuide(); renderMessage(); updateVoiceStatus();
  document.querySelectorAll("main > section").forEach((section, index) => { if (index > 0) section.classList.add("reveal"); });
  window.speechSynthesis?.addEventListener?.("voiceschanged", updateVoiceStatus);
}
$("theme-toggle").addEventListener("click", toggleTheme);
systemTheme.addEventListener?.("change", () => { if (state.theme === "system") applyTheme(); });
$("start-btn").addEventListener("click", startApp);
$("retry-model-btn").addEventListener("click", loadModel);
$("gesture-mode-btn").addEventListener("click", activateGestureMode);
$("voice-mode-btn").addEventListener("click", activateVoiceMode);
$("switch-camera-btn").addEventListener("click", () => startStream().catch(() => showError("Gagal mengganti kamera. Kamera sebelumnya mungkin tidak lagi aktif.")));
$("camera-select").addEventListener("change", (event) => { state.selectedDeviceId = event.target.value; startStream().catch(() => showError("Gagal mengganti kamera.")); });
$("mode-select").addEventListener("change", async (event) => { state.mode = event.target.value; localStorage.setItem("mode", state.mode); resetPrediction(); renderGuide(); if (state.started) await loadModel(); });
$("guide-search").addEventListener("input", renderGuide); $("guide-category").addEventListener("change", renderGuide);
$("guide-reset").addEventListener("click", () => { $("guide-search").value = ""; $("guide-category").value = "all"; renderGuide(); $("guide-search").focus(); });
$("guide-dialog-close").addEventListener("click", closeGuideDialog);
$("guide-dialog").addEventListener("close", () => { document.body.classList.remove("dialog-open"); if (lastGuideTrigger?.isConnected) lastGuideTrigger.focus(); });
$("guide-dialog").addEventListener("click", (event) => { if (event.target === $("guide-dialog")) closeGuideDialog(); });
$("undo-btn").addEventListener("click", () => { state.operations.pop(); renderMessage(); scheduleAutoRead(); });
$("space-btn").addEventListener("click", () => { if (messageText()) addOperation(" "); scheduleAutoRead(); });
$("clear-btn").addEventListener("click", () => { state.operations = []; resetPrediction(); renderMessage(); updateActiveGuide(); window.speechSynthesis?.cancel(); });
$("finish-btn").addEventListener("click", finishMessage); $("stop-speech-btn").addEventListener("click", () => { window.speechSynthesis?.cancel(); $("voice-status").textContent = "Pembacaan dihentikan."; });
$("tts-enabled").addEventListener("change", (event) => { state.ttsEnabled = event.target.checked; localStorage.setItem("ttsEnabled", state.ttsEnabled); if (!state.ttsEnabled) window.speechSynthesis?.cancel(); updateVoiceStatus(); });
$("tts-mode").addEventListener("change", (event) => { state.ttsMode = event.target.value; localStorage.setItem("ttsMode", state.ttsMode); scheduleAutoRead(); });
$("tts-auto").addEventListener("change", (event) => { state.ttsAuto = event.target.checked; localStorage.setItem("ttsAuto", state.ttsAuto); scheduleAutoRead(); });
init();
