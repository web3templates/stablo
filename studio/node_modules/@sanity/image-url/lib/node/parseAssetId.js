"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var example = 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg';
function parseAssetId(ref) {
    var _a = ref.split('-'), id = _a[1], dimensionString = _a[2], format = _a[3];
    if (!id || !dimensionString || !format) {
        throw new Error("Malformed asset _ref '" + ref + "'. Expected an id like \"" + example + "\".");
    }
    var _b = dimensionString.split('x'), imgWidthStr = _b[0], imgHeightStr = _b[1];
    var width = +imgWidthStr;
    var height = +imgHeightStr;
    var isValidAssetId = isFinite(width) && isFinite(height);
    if (!isValidAssetId) {
        throw new Error("Malformed asset _ref '" + ref + "'. Expected an id like \"" + example + "\".");
    }
    return { id: id, width: width, height: height, format: format };
}
exports.default = parseAssetId;
//# sourceMappingURL=parseAssetId.js.map