const p = require('./src/tracer').startTrace();

const express = require('express');
const fetch = require('node-fetch');

const app = express();

configureApp(app);

p.then(() => {
  app.listen(process.env.PORT ?? 3000, () => {
    console.log(`server running`);
  });
});

/**
 *
 * @param {import('express').Express} app
 */
function configureApp(app) {
  app.get('/req', (req, res) => {
    const host = req.query.host ?? '';
    const path = req.query.path ?? '';
    if (host === '') {
      res.status(400).json({ ok: false, detail: 'invalid parameter' });
      return;
    }

    let url = `http://${host}/`;
    if (path !== '') url += `${path}`;
    fetch(url).then(
      (response) => {
        return response.json().then((body) => {
          res.status(response.status).json({ ok: response.ok, response: body });
        });
      },
      (response) => {
        console.log(response);
        res.status(500).json({ ok: false, response });
      },
    );
  });

  app.get('/', (req, res) => {
    res.json({ ok: true });
  });
  app.get('/internal_error', (req, res) => {
    res.status(500).json({ ok: false, message: 'internal error' });
  });

  return app;
}
