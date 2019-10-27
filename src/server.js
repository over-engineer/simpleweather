const express = require('express');
const http = require('http');

// Create Express server
const app = express();

// Serve client files
app.use('/images', express.static(`${__dirname}/client/images`));
app.use('/css', express.static(`${__dirname}/client/css`));
app.use('/js', express.static(`${__dirname}/client/js`));
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
});

// HTTP server
const server = http.createServer(app);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
