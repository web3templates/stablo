'use strict';

const progressStream = require('progress-stream');

function normalizer(stage) {
  return prog => ({
    stage,
    percent: prog.percentage,
    total: prog.length,
    loaded: prog.transferred,
    lengthComputable: !(prog.length === 0 && prog.percentage === 0)
  });
}

module.exports = () => ({
  onHeaders: (response, evt) => {
    const progress = progressStream({ time: 16 });
    const normalize = normalizer('download');

    // This is supposed to be handled automatically, but it has a bug,
    // see https://github.com/freeall/progress-stream/pull/22
    const contentLength = response.headers['content-length'];
    const length = contentLength && Number(contentLength);
    if (!isNaN(length) && length > 0) {
      progress.setLength(length);
    }

    progress.on('progress', prog => evt.context.channels.progress.publish(normalize(prog)));
    return response.pipe(progress);
  },

  onRequest: evt => {
    if (!evt.progress) {
      return;
    }

    const normalize = normalizer('upload');
    evt.progress.on('progress', prog => evt.context.channels.progress.publish(normalize(prog)));
  }
});
//# sourceMappingURL=node-progress.js.map