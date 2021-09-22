'use strict';

module.exports = () => ({
  onRequest: evt => {
    if (evt.adapter !== 'xhr') {
      return;
    }

    const xhr = evt.request;
    const context = evt.context;

    if ('upload' in xhr && 'onprogress' in xhr.upload) {
      xhr.upload.onprogress = handleProgress('upload');
    }

    if ('onprogress' in xhr) {
      xhr.onprogress = handleProgress('download');
    }

    function handleProgress(stage) {
      return event => {
        const percent = event.lengthComputable ? event.loaded / event.total * 100 : -1;
        context.channels.progress.publish({
          stage,
          percent,
          total: event.total,
          loaded: event.loaded,
          lengthComputable: event.lengthComputable
        });
      };
    }
  }
});
//# sourceMappingURL=browser-progress.js.map