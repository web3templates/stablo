'use strict';

var http = require('http');
var https = require('https');
var objectAssign = require('object-assign');

var isHttpsProto = /^https:/i;

module.exports = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var ms = config.ms || 1000;
  var maxFree = config.maxFree || 256;
  var agentOptions = { keepAlive: true, keepAliveMsecs: ms, maxFreeSockets: maxFree };
  var httpAgent = new http.Agent(agentOptions);
  var httpsAgent = new https.Agent(agentOptions);
  var agents = { http: httpAgent, https: httpsAgent };

  return {
    finalizeOptions: function finalizeOptions(options) {
      if (options.agent) {
        return options;
      }

      var isHttps = isHttpsProto.test(options.href || options.protocol);
      var keepOpts = options.maxRedirects === 0 ? { agent: isHttps ? httpsAgent : httpAgent } : { agents: agents };

      return objectAssign({}, options, keepOpts);
    }
  };
};
//# sourceMappingURL=keepAlive.js.map