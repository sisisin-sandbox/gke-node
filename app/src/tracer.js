const opentelemetry = require('@opentelemetry/api');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceExporter = new TraceExporter();
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: getNodeAutoInstrumentations(),
});

module.exports.startTrace = async () => {
  const p = sdk.start().then(() => {
    process.on('SIGTERM', () => {
      sdk.shutdown();
    });
  });
  return p;
};
