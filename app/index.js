const express = require('express');
const app = express();

const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { NodeSDK } = require('@opentelemetry/sdk-node');

const traceExporter = new TraceExporter();
const sdk = new NodeSDK({
  traceExporter,
});

const p = sdk.start().then(() => {
  process.on('SIGTERM', () => {
    sdk.shutdown();
  });
});

app.get('/', (req, res) => {
  res.json({ ok: true });
});

p.then(() => {
  app.listen(process.env.PORT ?? 3000, () => {
    console.log(`server running`);
  });
});
