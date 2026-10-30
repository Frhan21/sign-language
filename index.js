require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqtt = require("mqtt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ganti static folder ke direktori web_app_sibi
app.use(express.static(path.join(__dirname, "public"), {
  setHeaders(res, filePath) {
    if (filePath.includes(`${path.sep}tfjs_`)) res.setHeader("Cache-Control", "public, max-age=86400, must-revalidate");
  },
}));

// Arahkan root path (/) ke index.html
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/web_app_sibi/index.html"));
// });

let data;
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org");
mqttClient.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
  const topicSubs = process.env.MQTT_TOPIC_SUBS || "sibi/receive";
  mqttClient.subscribe(topicSubs, (err) => {
    if (!err)
      console.log("📥 Subscribed to topic:", topicSubs);
    else 
      console.error("❌ Failed to subscribe:", err);
  });
});
mqttClient.on("message", (topic, message) => {
  data = message.toString();
  console.log(`📩 Received data from MQTT: ${data}`);
});

// GET data from NodeMCU (if needed)
app.get("/get-data", (req, res) => {
  res.json({ data });
});

// POST data from frontend (gesture/STT) → send to NodeMCU
app.use("/prediction", express.text()); // middleware: menerima text/plain

app.post("/prediction", (req, res) => {
  const text = req.body?.trim();
  const type = req.get("X-Prediction-Type") === "message" ? "message" : "token";
  const topic = process.env.MQTT_TOPIC_PUBLISH || "sibi/send";

  if (!text) {
    return res.status(400).json({ error: "Payload is required" });
  }

  // Token stays plain text for existing consumers; completed messages carry context.
  const payload = type === "message" ? JSON.stringify({ type, text }) : text;
  mqttClient.publish(topic, payload, (err) => {
    if (err) {
      console.error("❌ Gagal publish ke MQTT:", err);
      return res.status(500).json({ error: "Failed to publish" }); // Error 500
    }

    console.log("📤 Data berhasil dipublish ke MQTT:", payload);
    res.status(200).json({ status: "ok", type, payload }); // Sukses 200
  });
});

// ✅ MENJALANKAN SERVER DI localhost
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
