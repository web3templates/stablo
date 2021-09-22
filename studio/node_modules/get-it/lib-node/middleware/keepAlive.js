'use strict';

const http = require('http');
const https = require('https');
const objectAssign = require('object-assign');

const isHttpsProto = /^https:/i;

module.exports = function () {
  let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  const ms = config.ms || 1000;
  const maxFree = config.maxFree || 256;
  const agentOptions = { keepAlive: true, keepAliveMsecs: ms, maxFreeSockets: maxFree };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const agents = { http: httpAgent, https: httpsAgent };

  return {
    finalizeOptions: options => {
      if (options.agent) {
        return options;
      }

      const isHttps = isHttpsProto.test(options.href || options.protocol);
      const keepOpts = options.maxRedirects === 0 ? { agent: isHttps ? httpsAgent : httpAgent } : { agents };

      return objectAssign({}, options, keepOpts);
    }
  };
};
//# sourceMappingURL=keepAlive.js.map