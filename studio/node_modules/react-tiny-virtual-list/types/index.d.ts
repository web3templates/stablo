/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import SizeAndPositionManager, { ItemSize } from './SizeAndPositionManager';
import { ALIGNMENT, DIRECTION, SCROLL_CHANGE_REASON } from './constants';
export { DIRECTION as ScrollDirection } from './constants';
export declare type ItemPosition = 'absolute' | 'sticky';
export interface ItemStyle {
    position: ItemPosition;
    top?: number;
    left: number;
    width: string | number;
    height?: number;
    marginTop?: number;
    marginLeft?: number;
    marginRight?: number;
    marginBottom?: number;
    zIndex?: number;
}
export interface ItemInfo {
    index: number;
    style: ItemStyle;
}
export interface RenderedRows {
    startIndex: number;
    stopIndex: number;
}
export interface Props {
    className?: string;
    estimatedItemSize?: number;
    height: number | string;
    itemCount: number;
    itemSize: ItemSize;
    overscanCount?: number;
    scrollOffset?: number;
    scrollToIndex?: number;
    scrollToAlignment?: ALIGNMENT;
    scrollDirection?: DIRECTION;
    stickyIndices?: number[];
    style?: React.CSSProperties;
    width?: number | string;
    onItemsRendered?({startIndex, stopIndex}: RenderedRows): void;
    onScroll?(offset: number, event: UIEvent): void;
    renderItem(itemInfo: ItemInfo): React.ReactNode;
}
export interface State {
    offset: number;
    scrollChangeReason: SCROLL_CHANGE_REASON;
}
export default class VirtualList extends React.PureComponent<Props, State> {
    static defaultProps: {
        overscanCount: number;
        scrollDirection: DIRECTION;
        width: string;
    };
    static propTypes: {
        estimatedItemSize: PropTypes.Requireable<any>;
        height: PropTypes.Validator<any>;
        itemCount: PropTypes.Validator<any>;
        itemSize: PropTypes.Validator<any>;
        onScroll: PropTypes.Requireable<any>;
        onItemsRendered: PropTypes.Requireable<any>;
        overscanCount: PropTypes.Requireable<any>;
        renderItem: PropTypes.Validator<any>;
        scrollOffset: PropTypes.Requireable<any>;
        scrollToIndex: PropTypes.Requireable<any>;
        scrollToAlignment: PropTypes.Requireable<any>;
        scrollDirection: PropTypes.Requireable<any>;
        stickyIndices: PropTypes.Requireable<any>;
        style: PropTypes.Requireable<any>;
        width: PropTypes.Requireable<any>;
    };
    itemSizeGetter: (itemSize: ItemSize) => (index: any) => any;
    sizeAndPositionManager: SizeAndPositionManager;
    readonly state: State;
    private rootNode;
    private styleCache;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    componentDidUpdate(_: Props, prevState: State): void;
    componentWillUnmount(): void;
    scrollTo(value: number): void;
    getOffsetForIndex(index: number, scrollToAlignment?: ALIGNMENT | undefined, itemCount?: number): number;
    recomputeSizes(startIndex?: number): void;
    render(): JSX.Element;
    private getRef;
    private handleScroll;
    private getNodeOffset();
    private getEstimatedItemSize(props?);
    private getSize(index, itemSize);
    private getStyle(index, sticky);
}
