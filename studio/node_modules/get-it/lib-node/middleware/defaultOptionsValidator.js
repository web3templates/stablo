"use strict";

const validUrl = /^https?:\/\//i;

module.exports = options => {
  if (!validUrl.test(options.url)) {
    throw new Error(`"${options.url}" is not a valid URL`);
  }
};
//# sourceMappingURL=defaultOptionsValidator.js.map