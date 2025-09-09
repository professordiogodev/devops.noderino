// index.js
const express = require("express");
const fs = require("fs");
require("dotenv").config();

// ---- envs (same names you already use) ----
const desiredPath = process.env.DESIRED_PATH || "/";   // e.g. "/work"
const port        = parseInt(process.env.PORT || "8080", 10);
const number      = process.env.NUMBER || "0";

const app = express();

// ---- Prometheus metrics ----
const client = require("prom-client");
const register = new client.Registry();

// default process/node metrics (includes process_resident_memory_bytes)
client.collectDefaultMetrics({ register });

// pending-requests gauge
const pending = new client.Gauge({
  name: "myapp_pending_requests",
  help: "In-flight HTTP requests being processed",
  labelNames: ["service_number"],
  registers: [register],
});

// container memory limit gauge (cgroup v2 & v1)
const memLimitGauge = new client.Gauge({
  name: "myapp_memory_limit_bytes",
  help: "Container memory limit (bytes) read from cgroup",
  labelNames: ["service_number"],
  registers: [register],
});

function readMemLimitBytes() {
  const paths = [
    "/sys/fs/cgroup/memory.max",                  // cgroup v2
    "/sys/fs/cgroup/memory/memory.limit_in_bytes" // cgroup v1
  ];
  for (const p of paths) {
    try {
      const raw = fs.readFileSync(p, "utf8").trim();
      if (raw === "max") return Number.POSITIVE_INFINITY;
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n)) return n;
    } catch (_) {}
  }
  return NaN;
}
memLimitGauge.labels(number).set(readMemLimitBytes());

// metrics endpoint
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// healthcheck (still slow by design)
app.get("/healthcheck", (_req, res) => {
  pending.labels(number).inc();
  setTimeout(() => {
    res.status(200).send("It slowly works!");
    pending.labels(number).dec();
  }, 6000);
});

// main slow endpoint (path via env)
app.get(desiredPath, (_req, res) => {
  pending.labels(number).inc();
  setTimeout(() => {
    res.send(`<h1>(Slow) Hello from ${desiredPath} number ${number}!</h1>`);
    pending.labels(number).dec();
  }, 6000);
});

app.listen(port, () => {
  console.log(`🚀 Server ${number} listening on ${port} at path ${desiredPath}`);
});
