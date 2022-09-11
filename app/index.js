const express = require('express')
const app = express()

// const opentelemetry = require("@opentelemetry/api");
// const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
// const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
// const {
//   TraceExporter,
// } = require("@google-cloud/opentelemetry-cloud-trace-exporter");

// // Enable OpenTelemetry exporters to export traces to Google Cloud Trace.
// // Exporters use Application Default Credentials (ADCs) to authenticate.
// // See https://developers.google.com/identity/protocols/application-default-credentials
// // for more details.
// const provider = new NodeTracerProvider();

// // Initialize the exporter. When your application is running on Google Cloud,
// // you don't need to provide auth credentials or a project id.
// const exporter = new TraceExporter();

// // Configure the span processor to send spans to the exporter
// provider.addSpanProcessor(new SimpleSpanProcessor(exporter));


app.get('/', (req,res)=>{
  res.json({ok:true})
})

app.listen(process.env.PORT ?? 3000, () => {
  console.log(`server running`);
});
