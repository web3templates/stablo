import PropTypes from 'prop-types';
import { cloneElement, createElement, Children, PureComponent } from 'react';
import { findDOMNode } from 'react-dom';

import omit from 'boundless-utils-omit-keys';
import uuid from 'boundless-utils-uuid';

const DATA_ATTRIBUTE_INDEX = 'data-focus-index';
const DATA_ATTRIBUTE_SKIP = 'data-focus-skip';

/**
 * ArrowKeyNavigation is designed not to care about the component types it is wrapping. Due to this, you can pass
 * whatever HTML tag you  like into `props.component` or even a React component you've made elsewhere. Additional props
 * passed to `<ArrowKeyNavigation ...>` will  be forwarded on to the component or HTML tag name you've supplied.
 *
 * The children, similarly, can be any type of component.
 */
export default class ArrowKeyNavigation extends PureComponent {
    static mode = {
        HORIZONTAL: uuid(),
        VERTICAL: uuid(),
        BOTH: uuid(),
    }

    static propTypes = {
        /**
         * any [React-supported attribute]
         * (https://facebook.github.io/react/docs/tags-and-attributes.html#html-attributes)
         */
        '*': PropTypes.any,

        /**
         * Any valid HTML tag name or a React component factory, anything that can be passed as the first argument to
         * `React.createElement`
         */
        component: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),

        /**
         * Allows for a particular child to be initially reachable via tabbing; only applied during first render
         */
        defaultActiveChildIndex: PropTypes.number,

        /**
         * controls which arrow key events are captured to move active focus within the list:
         *
         * Mode                                 | Keys
         * ----                                 | ----
         * `ArrowKeyNavigation.mode.BOTH`       | ⬅️ ➡️ ⬆️ ⬇️
         * `ArrowKeyNavigation.mode.HORIZONTAL` | ⬅️ ➡️
         * `ArrowKeyNavigation.mode.VERTICAL`   | ⬆️ ⬇️
         *
         * _Note: focus loops when arrowing past one of the boundaries; tabbing moves the user away from the list._
         */
        mode: PropTypes.oneOf([
            ArrowKeyNavigation.mode.BOTH,
            ArrowKeyNavigation.mode.HORIZONTAL,
            ArrowKeyNavigation.mode.VERTICAL,
        ]),
    }

    static defaultProps = {
        component: 'div',
        defaultActiveChildIndex: 0,
        mode: ArrowKeyNavigation.mode.BOTH,
        onKeyDown: () => {},
    }

    static internalKeys = Object.keys(ArrowKeyNavigation.defaultProps)

    state = {
        activeChildIndex: this.props.defaultActiveChildIndex,
        children: [],
    }

    getFilteredChildren(props = this.props) {
        return Children.toArray(props.children).filter(Boolean);
    }

    setActiveChildIndex() {
        if (this.state.activeChildIndex !== 0) {
            const numChildren = Children.count(this.state.children);

            if (numChildren === 0) {
                this.setState({ activeChildIndex: 0 });
            } else if (this.state.activeChildIndex >= numChildren) {
                this.setState({ activeChildIndex: numChildren - 1 });
            }
        }
    }

    componentWillMount() { this.setState({ children: this.getFilteredChildren() }); }

    componentWillReceiveProps(nextProps) {
        if (nextProps.children !== this.props.children) {
            return this.setState({ children: this.getFilteredChildren(nextProps) }, this.setActiveChildIndex);
        }

        this.setActiveChildIndex();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.activeChildIndex !== prevState.activeChildIndex) {
            this.setFocus(this.state.activeChildIndex);
        }
    }

    setFocus(index) {
        const childNode = this.$wrapper.children[index];

        if (childNode && childNode.hasAttribute(DATA_ATTRIBUTE_SKIP)) {
            this.moveFocus(
                childNode.compareDocumentPosition(document.activeElement) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
            );
        } else if (childNode && document.activeElement !== childNode) {
            childNode.focus();
        }
    }

    moveFocus(delta) {
        const numChildren = this.state.children ? Children.count(this.state.children) : 0;
        let nextIndex = this.state.activeChildIndex + delta;

        if (nextIndex >= numChildren) {
            nextIndex = 0; // loop
        } else if (nextIndex < 0) {
            nextIndex = numChildren - 1; // reverse loop
        }

        this.setState({ activeChildIndex: nextIndex });
    }

    handleKeyDown = (event) => {
        switch (event.key) {
        case 'ArrowUp':
            if (this.props.mode === ArrowKeyNavigation.mode.VERTICAL
                || this.props.mode === ArrowKeyNavigation.mode.BOTH) {
                event.preventDefault();
                this.moveFocus(-1);
            }

            break;

        case 'ArrowLeft':
            if (this.props.mode === ArrowKeyNavigation.mode.HORIZONTAL
                || this.props.mode === ArrowKeyNavigation.mode.BOTH) {
                event.preventDefault();
                this.moveFocus(-1);
            }

            break;

        case 'ArrowDown':
            if (this.props.mode === ArrowKeyNavigation.mode.VERTICAL
                || this.props.mode === ArrowKeyNavigation.mode.BOTH) {
                event.preventDefault();
                this.moveFocus(1);
            }

            break;

        case 'ArrowRight':
            if (this.props.mode === ArrowKeyNavigation.mode.HORIZONTAL
                || this.props.mode === ArrowKeyNavigation.mode.BOTH) {
                event.preventDefault();
                this.moveFocus(1);
            }

            break;
        }

        if (this.props.onKeyDown) {
            this.props.onKeyDown(event);
        }
    }

    handleFocus = (event) => {
        if (event.target.hasAttribute(DATA_ATTRIBUTE_INDEX)) {
            const index = parseInt(event.target.getAttribute(DATA_ATTRIBUTE_INDEX), 10);
            const child = Children.toArray(this.state.children)[index];

            this.setState({ activeChildIndex: index });

            if (child.props.onFocus) {
                child.props.onFocus(event);
            }
        }
    }

    renderChildren() {
        return Children.map(this.state.children, (child, index) => {
            return cloneElement(child, {
                [DATA_ATTRIBUTE_INDEX]: index,
                [DATA_ATTRIBUTE_SKIP]: parseInt(child.props.tabIndex, 10) === -1 || undefined,
                key: child.key || index,
                tabIndex: this.state.activeChildIndex === index ? 0 : -1,
            });
        });
    }

    persistWrapperElementReference = (unknownType) => {
        this.$wrapper = unknownType instanceof HTMLElement ? unknownType : findDOMNode(unknownType);
    }

    render() {
        return (
            <this.props.component
                {...omit(this.props, ArrowKeyNavigation.internalKeys)}
                ref={this.persistWrapperElementReference}
                onFocus={this.handleFocus}
                onKeyDown={this.handleKeyDown}>
                {this.renderChildren()}
            </this.props.component>
        );
    }
}
