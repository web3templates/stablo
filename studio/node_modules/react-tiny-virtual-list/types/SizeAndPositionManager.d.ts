import { ALIGNMENT } from './constants';
export declare type ItemSizeGetter = (index: number) => number;
export declare type ItemSize = number | number[] | ItemSizeGetter;
export interface SizeAndPosition {
    size: number;
    offset: number;
}
export interface Options {
    itemCount: number;
    itemSizeGetter: ItemSizeGetter;
    estimatedItemSize: number;
}
export default class SizeAndPositionManager {
    private itemSizeGetter;
    private itemCount;
    private estimatedItemSize;
    private lastMeasuredIndex;
    private itemSizeAndPositionData;
    constructor({itemCount, itemSizeGetter, estimatedItemSize}: Options);
    updateConfig({itemCount, itemSizeGetter, estimatedItemSize}: Partial<Options>): void;
    getLastMeasuredIndex(): number;
    /**
     * This method returns the size and position for the item at the specified index.
     * It just-in-time calculates (or used cached values) for items leading up to the index.
     */
    getSizeAndPositionForIndex(index: number): SizeAndPosition;
    getSizeAndPositionOfLastMeasuredItem(): SizeAndPosition;
    /**
     * Total size of all items being measured.
     * This value will be completedly estimated initially.
     * As items as measured the estimate will be updated.
     */
    getTotalSize(): number;
    /**
     * Determines a new offset that ensures a certain item is visible, given the alignment.
     *
     * @param align Desired alignment within container; one of "start" (default), "center", or "end"
     * @param containerSize Size (width or height) of the container viewport
     * @return Offset to use to ensure the specified item is visible
     */
    getUpdatedOffsetForIndex({align, containerSize, currentOffset, targetIndex}: {
        align: ALIGNMENT | undefined;
        containerSize: number;
        currentOffset: number;
        targetIndex: number;
    }): number;
    getVisibleRange({containerSize, offset, overscanCount}: {
        containerSize: number;
        offset: number;
        overscanCount: number;
    }): {
        start?: number;
        stop?: number;
    };
    /**
     * Clear all cached values for items after the specified index.
     * This method should be called for any item that has changed its size.
     * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionForIndex() is called.
     */
    resetItem(index: number): void;
    /**
     * Searches for the item (index) nearest the specified offset.
     *
     * If no exact match is found the next lowest item index will be returned.
     * This allows partially visible items (with offsets just before/above the fold) to be visible.
     */
    findNearestItem(offset: number): number;
    private binarySearch({low, high, offset});
    private exponentialSearch({index, offset});
}
