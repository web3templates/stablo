"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var isRef = function (src) {
    var source = src;
    return source ? typeof source._ref === 'string' : false;
};
var isAsset = function (src) {
    var source = src;
    return source ? typeof source._id === 'string' : false;
};
var isAssetStub = function (src) {
    var source = src;
    return source && source.asset ? typeof source.asset.url === 'string' : false;
};
// Convert an asset-id, asset or image to an image record suitable for processing
// eslint-disable-next-line complexity
function parseSource(source) {
    if (!source) {
        return null;
    }
    var image;
    if (typeof source === 'string' && isUrl(source)) {
        // Someone passed an existing image url?
        image = {
            asset: { _ref: urlToId(source) },
        };
    }
    else if (typeof source === 'string') {
        // Just an asset id
        image = {
            asset: { _ref: source },
        };
    }
    else if (isRef(source)) {
        // We just got passed an asset directly
        image = {
            asset: source,
        };
    }
    else if (isAsset(source)) {
        // If we were passed an image asset document
        image = {
            asset: {
                _ref: source._id || '',
            },
        };
    }
    else if (isAssetStub(source)) {
        // If we were passed a partial asset (`url`, but no `_id`)
        image = {
            asset: {
                _ref: urlToId(source.asset.url),
            },
        };
    }
    else if (typeof source.asset === 'object') {
        // Probably an actual image with materialized asset
        image = source;
    }
    else {
        // We got something that does not look like an image, or it is an image
        // that currently isn't sporting an asset.
        return null;
    }
    var img = source;
    if (img.crop) {
        image.crop = img.crop;
    }
    if (img.hotspot) {
        image.hotspot = img.hotspot;
    }
    return applyDefaults(image);
}
exports.default = parseSource;
function isUrl(url) {
    return /^https?:\/\//.test("" + url);
}
function urlToId(url) {
    var parts = url.split('/').slice(-1);
    return ("image-" + parts[0]).replace(/\.([a-z]+)$/, '-$1');
}
// Mock crop and hotspot if image lacks it
function applyDefaults(image) {
    if (image.crop && image.hotspot) {
        return image;
    }
    // We need to pad in default values for crop or hotspot
    var result = __assign({}, image);
    if (!result.crop) {
        result.crop = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
        };
    }
    if (!result.hotspot) {
        result.hotspot = {
            x: 0.5,
            y: 0.5,
            height: 1.0,
            width: 1.0,
        };
    }
    return result;
}
//# sourceMappingURL=parseSource.js.map