'use strict';

var progressStream = require('progress-stream');

function normalizer(stage) {
  return function (prog) {
    return {
      stage: stage,
      percent: prog.percentage,
      total: prog.length,
      loaded: prog.transferred,
      lengthComputable: !(prog.length === 0 && prog.percentage === 0)
    };
  };
}

module.exports = function () {
  return {
    onHeaders: function onHeaders(response, evt) {
      var progress = progressStream({ time: 16 });
      var normalize = normalizer('download');

      // This is supposed to be handled automatically, but it has a bug,
      // see https://github.com/freeall/progress-stream/pull/22
      var contentLength = response.headers['content-length'];
      var length = contentLength && Number(contentLength);
      if (!isNaN(length) && length > 0) {
        progress.setLength(length);
      }

      progress.on('progress', function (prog) {
        return evt.context.channels.progress.publish(normalize(prog));
      });
      return response.pipe(progress);
    },

    onRequest: function onRequest(evt) {
      if (!evt.progress) {
        return;
      }

      var normalize = normalizer('upload');
      evt.progress.on('progress', function (prog) {
        return evt.context.channels.progress.publish(normalize(prog));
      });
    }
  };
};
//# sourceMappingURL=node-progress.js.map