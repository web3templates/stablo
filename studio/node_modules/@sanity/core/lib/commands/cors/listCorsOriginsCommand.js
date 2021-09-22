"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const helpText = `
Examples
  sanity cors list
`;
var _default = {
  name: 'list',
  group: 'cors',
  signature: '[ORIGIN]',
  helpText,
  description: 'List all origins allowed to access the API for this project',
  action: async (args, context) => {
    const {
      output
    } = context;
    const {
      apiClient
    } = context;
    const client = apiClient({
      requireUser: true,
      requireProject: true
    });
    const origins = await client.request({
      url: '/cors'
    });
    output.print(origins.map(origin => origin.origin).join('\n'));
  }
};
exports.default = _default;