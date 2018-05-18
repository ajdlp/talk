const helmet = require('helmet');
const { WEBSOCKET_LIVE_URI, ONLY_REPORT_CSP_VIOLATIONS } = require('../config');
const { BASE_PATH, BASE_URL, STATIC_URL } = require('../url');
const { URL } = require('url');

// websocketSrc represents the host where we can connect for websocket requests.
const websocketSrc = new URL(WEBSOCKET_LIVE_URI || BASE_URL).host;

// staticSrc represents any static asset hosted on the static host.
const staticSrc = new URL(STATIC_URL).host;

// nonceSrc represents the nonce source that is used to indicate a safe resource
// to load.
const nonceSrc = (req, res) => `'nonce-${res.locals.nonce}'`;

module.exports = helmet.contentSecurityPolicy({
  directives: {
    reportUri: `${BASE_PATH}api/v1/csp`, // report all policy violations to our reporting uri
    defaultSrc: ["'none'"], // by default, do not allow anything at all
    scriptSrc: [
      "'self'",
      'https://ajax.googleapis.com', // for jquery
      staticSrc, // for any static files loaded from a cdn
      nonceSrc,
    ],
    styleSrc: [
      "'self'",
      'https://maxcdn.bootstrapcdn.com', // for bootstrap css
      'https://fonts.googleapis.com', // for google fonts
      'https://code.getmdl.io', // for mdl css
      staticSrc, // for any static files loaded from a cdn
      nonceSrc,
    ],
    connectSrc: ["'self'", websocketSrc],
    fontSrc: [
      "'self'",
      'https://maxcdn.bootstrapcdn.com', // for font-awesome
      'https://fonts.gstatic.com', // for google fonts
      staticSrc, // for any static files loaded from a cdn
      nonceSrc,
    ],
    imgSrc: [
      "'self'",
      staticSrc, // for any static files loaded from a cdn
      nonceSrc,
    ],
  },
  browserSniff: false,
  // Allow the configuration to disable strict enforcement of CSP.
  reportOnly: ONLY_REPORT_CSP_VIOLATIONS,
});
