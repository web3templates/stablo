'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var PropTypes = require('prop-types');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

var ALIGNMENT;
(function (ALIGNMENT) {
    ALIGNMENT["AUTO"] = "auto";
    ALIGNMENT["START"] = "start";
    ALIGNMENT["CENTER"] = "center";
    ALIGNMENT["END"] = "end";
})(ALIGNMENT || (ALIGNMENT = {}));

(function (DIRECTION) {
    DIRECTION["HORIZONTAL"] = "horizontal";
    DIRECTION["VERTICAL"] = "vertical";
})(exports.ScrollDirection || (exports.ScrollDirection = {}));
var SCROLL_CHANGE_REASON;
(function (SCROLL_CHANGE_REASON) {
    SCROLL_CHANGE_REASON["OBSERVED"] = "observed";
    SCROLL_CHANGE_REASON["REQUESTED"] = "requested";
})(SCROLL_CHANGE_REASON || (SCROLL_CHANGE_REASON = {}));
var scrollProp = (_a = {}, _a[exports.ScrollDirection.VERTICAL] = 'scrollTop', _a[exports.ScrollDirection.HORIZONTAL] = 'scrollLeft', _a);
var sizeProp = (_b = {}, _b[exports.ScrollDirection.VERTICAL] = 'height', _b[exports.ScrollDirection.HORIZONTAL] = 'width', _b);
var positionProp = (_c = {}, _c[exports.ScrollDirection.VERTICAL] = 'top', _c[exports.ScrollDirection.HORIZONTAL] = 'left', _c);
var marginProp = (_d = {}, _d[exports.ScrollDirection.VERTICAL] = 'marginTop', _d[exports.ScrollDirection.HORIZONTAL] = 'marginLeft', _d);
var oppositeMarginProp = (_e = {}, _e[exports.ScrollDirection.VERTICAL] = 'marginBottom', _e[exports.ScrollDirection.HORIZONTAL] = 'marginRight', _e);
var _a;
var _b;
var _c;
var _d;
var _e;

/* Forked from react-virtualized 💖 */
var SizeAndPositionManager = /** @class */function () {
    function SizeAndPositionManager(_a) {
        var itemCount = _a.itemCount,
            itemSizeGetter = _a.itemSizeGetter,
            estimatedItemSize = _a.estimatedItemSize;
        this.itemSizeGetter = itemSizeGetter;
        this.itemCount = itemCount;
        this.estimatedItemSize = estimatedItemSize;
        // Cache of size and position data for items, mapped by item index.
        this.itemSizeAndPositionData = {};
        // Measurements for items up to this index can be trusted; items afterward should be estimated.
        this.lastMeasuredIndex = -1;
    }
    SizeAndPositionManager.prototype.updateConfig = function (_a) {
        var itemCount = _a.itemCount,
            itemSizeGetter = _a.itemSizeGetter,
            estimatedItemSize = _a.estimatedItemSize;
        if (itemCount != null) {
            this.itemCount = itemCount;
        }
        if (estimatedItemSize != null) {
            this.estimatedItemSize = estimatedItemSize;
        }
        if (itemSizeGetter != null) {
            this.itemSizeGetter = itemSizeGetter;
        }
    };
    SizeAndPositionManager.prototype.getLastMeasuredIndex = function () {
        return this.lastMeasuredIndex;
    };
    /**
     * This method returns the size and position for the item at the specified index.
     * It just-in-time calculates (or used cached values) for items leading up to the index.
     */
    SizeAndPositionManager.prototype.getSizeAndPositionForIndex = function (index) {
        if (index < 0 || index >= this.itemCount) {
            throw Error("Requested index " + index + " is outside of range 0.." + this.itemCount);
        }
        if (index > this.lastMeasuredIndex) {
            var lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
            var offset = lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size;
            for (var i = this.lastMeasuredIndex + 1; i <= index; i++) {
                var size = this.itemSizeGetter(i);
                if (size == null || isNaN(size)) {
                    throw Error("Invalid size returned for index " + i + " of value " + size);
                }
                this.itemSizeAndPositionData[i] = {
                    offset: offset,
                    size: size
                };
                offset += size;
            }
            this.lastMeasuredIndex = index;
        }
        return this.itemSizeAndPositionData[index];
    };
    SizeAndPositionManager.prototype.getSizeAndPositionOfLastMeasuredItem = function () {
        return this.lastMeasuredIndex >= 0 ? this.itemSizeAndPositionData[this.lastMeasuredIndex] : { offset: 0, size: 0 };
    };
    /**
     * Total size of all items being measured.
     * This value will be completedly estimated initially.
     * As items as measured the estimate will be updated.
     */
    SizeAndPositionManager.prototype.getTotalSize = function () {
        var lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
        return lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size + (this.itemCount - this.lastMeasuredIndex - 1) * this.estimatedItemSize;
    };
    /**
     * Determines a new offset that ensures a certain item is visible, given the alignment.
     *
     * @param align Desired alignment within container; one of "start" (default), "center", or "end"
     * @param containerSize Size (width or height) of the container viewport
     * @return Offset to use to ensure the specified item is visible
     */
    SizeAndPositionManager.prototype.getUpdatedOffsetForIndex = function (_a) {
        var _b = _a.align,
            align = _b === void 0 ? ALIGNMENT.START : _b,
            containerSize = _a.containerSize,
            currentOffset = _a.currentOffset,
            targetIndex = _a.targetIndex;
        if (containerSize <= 0) {
            return 0;
        }
        var datum = this.getSizeAndPositionForIndex(targetIndex);
        var maxOffset = datum.offset;
        var minOffset = maxOffset - containerSize + datum.size;
        var idealOffset;
        switch (align) {
            case ALIGNMENT.END:
                idealOffset = minOffset;
                break;
            case ALIGNMENT.CENTER:
                idealOffset = maxOffset - (containerSize - datum.size) / 2;
                break;
            case ALIGNMENT.START:
                idealOffset = maxOffset;
                break;
            default:
                idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
        }
        var totalSize = this.getTotalSize();
        return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
    };
    SizeAndPositionManager.prototype.getVisibleRange = function (_a) {
        var containerSize = _a.containerSize,
            offset = _a.offset,
            overscanCount = _a.overscanCount;
        var totalSize = this.getTotalSize();
        if (totalSize === 0) {
            return {};
        }
        var maxOffset = offset + containerSize;
        var start = this.findNearestItem(offset);
        if (typeof start === 'undefined') {
            throw Error("Invalid offset " + offset + " specified");
        }
        var datum = this.getSizeAndPositionForIndex(start);
        offset = datum.offset + datum.size;
        var stop = start;
        while (offset < maxOffset && stop < this.itemCount - 1) {
            stop++;
            offset += this.getSizeAndPositionForIndex(stop).size;
        }
        if (overscanCount) {
            start = Math.max(0, start - overscanCount);
            stop = Math.min(stop + overscanCount, this.itemCount - 1);
        }
        return {
            start: start,
            stop: stop
        };
    };
    /**
     * Clear all cached values for items after the specified index.
     * This method should be called for any item that has changed its size.
     * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionForIndex() is called.
     */
    SizeAndPositionManager.prototype.resetItem = function (index) {
        this.lastMeasuredIndex = Math.min(this.lastMeasuredIndex, index - 1);
    };
    /**
     * Searches for the item (index) nearest the specified offset.
     *
     * If no exact match is found the next lowest item index will be returned.
     * This allows partially visible items (with offsets just before/above the fold) to be visible.
     */
    SizeAndPositionManager.prototype.findNearestItem = function (offset) {
        if (isNaN(offset)) {
            throw Error("Invalid offset " + offset + " specified");
        }
        // Our search algorithms find the nearest match at or below the specified offset.
        // So make sure the offset is at least 0 or no match will be found.
        offset = Math.max(0, offset);
        var lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
        var lastMeasuredIndex = Math.max(0, this.lastMeasuredIndex);
        if (lastMeasuredSizeAndPosition.offset >= offset) {
            // If we've already measured items within this range just use a binary search as it's faster.
            return this.binarySearch({
                high: lastMeasuredIndex,
                low: 0,
                offset: offset
            });
        } else {
            // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
            // The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
            // The overall complexity for this approach is O(log n).
            return this.exponentialSearch({
                index: lastMeasuredIndex,
                offset: offset
            });
        }
    };
    SizeAndPositionManager.prototype.binarySearch = function (_a) {
        var low = _a.low,
            high = _a.high,
            offset = _a.offset;
        var middle = 0;
        var currentOffset = 0;
        while (low <= high) {
            middle = low + Math.floor((high - low) / 2);
            currentOffset = this.getSizeAndPositionForIndex(middle).offset;
            if (currentOffset === offset) {
                return middle;
            } else if (currentOffset < offset) {
                low = middle + 1;
            } else if (currentOffset > offset) {
                high = middle - 1;
            }
        }
        if (low > 0) {
            return low - 1;
        }
        return 0;
    };
    SizeAndPositionManager.prototype.exponentialSearch = function (_a) {
        var index = _a.index,
            offset = _a.offset;
        var interval = 1;
        while (index < this.itemCount && this.getSizeAndPositionForIndex(index).offset < offset) {
            index += interval;
            interval *= 2;
        }
        return this.binarySearch({
            high: Math.min(index, this.itemCount - 1),
            low: Math.floor(index / 2),
            offset: offset
        });
    };
    return SizeAndPositionManager;
}();

var STYLE_WRAPPER = {
    overflow: 'auto',
    willChange: 'transform',
    WebkitOverflowScrolling: 'touch'
};
var STYLE_INNER = {
    position: 'relative',
    width: '100%',
    minHeight: '100%'
};
var STYLE_ITEM = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
};
var STYLE_STICKY_ITEM = __assign({}, STYLE_ITEM, { position: 'sticky' });
var VirtualList = /** @class */function (_super) {
    __extends(VirtualList, _super);
    function VirtualList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.itemSizeGetter = function (itemSize) {
            return function (index) {
                return _this.getSize(index, itemSize);
            };
        };
        _this.sizeAndPositionManager = new SizeAndPositionManager({
            itemCount: _this.props.itemCount,
            itemSizeGetter: _this.itemSizeGetter(_this.props.itemSize),
            estimatedItemSize: _this.getEstimatedItemSize()
        });
        _this.state = {
            offset: _this.props.scrollOffset || _this.props.scrollToIndex != null && _this.getOffsetForIndex(_this.props.scrollToIndex) || 0,
            scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
        };
        _this.styleCache = {};
        _this.getRef = function (node) {
            _this.rootNode = node;
        };
        _this.handleScroll = function (event) {
            var onScroll = _this.props.onScroll;
            var offset = _this.getNodeOffset();
            if (offset < 0 || _this.state.offset === offset || event.target !== _this.rootNode) {
                return;
            }
            _this.setState({
                offset: offset,
                scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED
            });
            if (typeof onScroll === 'function') {
                onScroll(offset, event);
            }
        };
        return _this;
    }
    VirtualList.prototype.componentDidMount = function () {
        var _a = this.props,
            scrollOffset = _a.scrollOffset,
            scrollToIndex = _a.scrollToIndex;
        this.rootNode.addEventListener('scroll', this.handleScroll, {
            passive: true
        });
        if (scrollOffset != null) {
            this.scrollTo(scrollOffset);
        } else if (scrollToIndex != null) {
            this.scrollTo(this.getOffsetForIndex(scrollToIndex));
        }
    };
    VirtualList.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = this.props,
            estimatedItemSize = _a.estimatedItemSize,
            itemCount = _a.itemCount,
            itemSize = _a.itemSize,
            scrollOffset = _a.scrollOffset,
            scrollToAlignment = _a.scrollToAlignment,
            scrollToIndex = _a.scrollToIndex;
        var scrollPropsHaveChanged = nextProps.scrollToIndex !== scrollToIndex || nextProps.scrollToAlignment !== scrollToAlignment;
        var itemPropsHaveChanged = nextProps.itemCount !== itemCount || nextProps.itemSize !== itemSize || nextProps.estimatedItemSize !== estimatedItemSize;
        if (nextProps.itemSize !== itemSize) {
            this.sizeAndPositionManager.updateConfig({
                itemSizeGetter: this.itemSizeGetter(nextProps.itemSize)
            });
        }
        if (nextProps.itemCount !== itemCount || nextProps.estimatedItemSize !== estimatedItemSize) {
            this.sizeAndPositionManager.updateConfig({
                itemCount: nextProps.itemCount,
                estimatedItemSize: this.getEstimatedItemSize(nextProps)
            });
        }
        if (itemPropsHaveChanged) {
            this.recomputeSizes();
        }
        if (nextProps.scrollOffset !== scrollOffset) {
            this.setState({
                offset: nextProps.scrollOffset || 0,
                scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
            });
        } else if (typeof nextProps.scrollToIndex === 'number' && (scrollPropsHaveChanged || itemPropsHaveChanged)) {
            this.setState({
                offset: this.getOffsetForIndex(nextProps.scrollToIndex, nextProps.scrollToAlignment, nextProps.itemCount),
                scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
            });
        }
    };
    VirtualList.prototype.componentDidUpdate = function (_, prevState) {
        var _a = this.state,
            offset = _a.offset,
            scrollChangeReason = _a.scrollChangeReason;
        if (prevState.offset !== offset && scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
            this.scrollTo(offset);
        }
    };
    VirtualList.prototype.componentWillUnmount = function () {
        this.rootNode.removeEventListener('scroll', this.handleScroll);
    };
    VirtualList.prototype.scrollTo = function (value) {
        var _a = this.props.scrollDirection,
            scrollDirection = _a === void 0 ? exports.ScrollDirection.VERTICAL : _a;
        this.rootNode[scrollProp[scrollDirection]] = value;
    };
    VirtualList.prototype.getOffsetForIndex = function (index, scrollToAlignment, itemCount) {
        if (scrollToAlignment === void 0) {
            scrollToAlignment = this.props.scrollToAlignment;
        }
        if (itemCount === void 0) {
            itemCount = this.props.itemCount;
        }
        var _a = this.props.scrollDirection,
            scrollDirection = _a === void 0 ? exports.ScrollDirection.VERTICAL : _a;
        if (index < 0 || index >= itemCount) {
            index = 0;
        }
        return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
            align: scrollToAlignment,
            containerSize: this.props[sizeProp[scrollDirection]],
            currentOffset: this.state && this.state.offset || 0,
            targetIndex: index
        });
    };
    VirtualList.prototype.recomputeSizes = function (startIndex) {
        if (startIndex === void 0) {
            startIndex = 0;
        }
        this.styleCache = {};
        this.sizeAndPositionManager.resetItem(startIndex);
    };
    VirtualList.prototype.render = function () {
        var _this = this;
        var _a = this.props,
            estimatedItemSize = _a.estimatedItemSize,
            height = _a.height,
            _b = _a.overscanCount,
            overscanCount = _b === void 0 ? 3 : _b,
            renderItem = _a.renderItem,
            itemCount = _a.itemCount,
            itemSize = _a.itemSize,
            onItemsRendered = _a.onItemsRendered,
            onScroll = _a.onScroll,
            _c = _a.scrollDirection,
            scrollDirection = _c === void 0 ? exports.ScrollDirection.VERTICAL : _c,
            scrollOffset = _a.scrollOffset,
            scrollToIndex = _a.scrollToIndex,
            scrollToAlignment = _a.scrollToAlignment,
            stickyIndices = _a.stickyIndices,
            style = _a.style,
            width = _a.width,
            props = __rest(_a, ["estimatedItemSize", "height", "overscanCount", "renderItem", "itemCount", "itemSize", "onItemsRendered", "onScroll", "scrollDirection", "scrollOffset", "scrollToIndex", "scrollToAlignment", "stickyIndices", "style", "width"]);
        var offset = this.state.offset;
        var _d = this.sizeAndPositionManager.getVisibleRange({
            containerSize: this.props[sizeProp[scrollDirection]] || 0,
            offset: offset,
            overscanCount: overscanCount
        }),
            start = _d.start,
            stop = _d.stop;
        var items = [];
        var wrapperStyle = __assign({}, STYLE_WRAPPER, style, { height: height, width: width });
        var innerStyle = __assign({}, STYLE_INNER, (_e = {}, _e[sizeProp[scrollDirection]] = this.sizeAndPositionManager.getTotalSize(), _e));
        if (stickyIndices != null && stickyIndices.length !== 0) {
            stickyIndices.forEach(function (index) {
                return items.push(renderItem({
                    index: index,
                    style: _this.getStyle(index, true)
                }));
            });
            if (scrollDirection === exports.ScrollDirection.HORIZONTAL) {
                innerStyle.display = 'flex';
            }
        }
        if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
            for (var index = start; index <= stop; index++) {
                if (stickyIndices != null && stickyIndices.includes(index)) {
                    continue;
                }
                items.push(renderItem({
                    index: index,
                    style: this.getStyle(index, false)
                }));
            }
            if (typeof onItemsRendered === 'function') {
                onItemsRendered({
                    startIndex: start,
                    stopIndex: stop
                });
            }
        }
        return React.createElement("div", __assign({ ref: this.getRef }, props, { style: wrapperStyle }), React.createElement("div", { style: innerStyle }, items));
        var _e;
    };
    VirtualList.prototype.getNodeOffset = function () {
        var _a = this.props.scrollDirection,
            scrollDirection = _a === void 0 ? exports.ScrollDirection.VERTICAL : _a;
        return this.rootNode[scrollProp[scrollDirection]];
    };
    VirtualList.prototype.getEstimatedItemSize = function (props) {
        if (props === void 0) {
            props = this.props;
        }
        return props.estimatedItemSize || typeof props.itemSize === 'number' && props.itemSize || 50;
    };
    VirtualList.prototype.getSize = function (index, itemSize) {
        if (typeof itemSize === 'function') {
            return itemSize(index);
        }
        return Array.isArray(itemSize) ? itemSize[index] : itemSize;
    };
    VirtualList.prototype.getStyle = function (index, sticky) {
        var style = this.styleCache[index];
        if (style) {
            return style;
        }
        var _a = this.props.scrollDirection,
            scrollDirection = _a === void 0 ? exports.ScrollDirection.VERTICAL : _a;
        var _b = this.sizeAndPositionManager.getSizeAndPositionForIndex(index),
            size = _b.size,
            offset = _b.offset;
        return this.styleCache[index] = sticky ? __assign({}, STYLE_STICKY_ITEM, (_c = {}, _c[sizeProp[scrollDirection]] = size, _c[marginProp[scrollDirection]] = offset, _c[oppositeMarginProp[scrollDirection]] = -(offset + size), _c.zIndex = 1, _c)) : __assign({}, STYLE_ITEM, (_d = {}, _d[sizeProp[scrollDirection]] = size, _d[positionProp[scrollDirection]] = offset, _d));
        var _c, _d;
    };
    VirtualList.defaultProps = {
        overscanCount: 3,
        scrollDirection: exports.ScrollDirection.VERTICAL,
        width: '100%'
    };
    VirtualList.propTypes = {
        estimatedItemSize: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        itemCount: PropTypes.number.isRequired,
        itemSize: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.func]).isRequired,
        onScroll: PropTypes.func,
        onItemsRendered: PropTypes.func,
        overscanCount: PropTypes.number,
        renderItem: PropTypes.func.isRequired,
        scrollOffset: PropTypes.number,
        scrollToIndex: PropTypes.number,
        scrollToAlignment: PropTypes.oneOf([ALIGNMENT.AUTO, ALIGNMENT.START, ALIGNMENT.CENTER, ALIGNMENT.END]),
        scrollDirection: PropTypes.oneOf([exports.ScrollDirection.HORIZONTAL, exports.ScrollDirection.VERTICAL]),
        stickyIndices: PropTypes.arrayOf(PropTypes.number),
        style: PropTypes.object,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    };
    return VirtualList;
}(React.PureComponent);

exports['default'] = VirtualList;
