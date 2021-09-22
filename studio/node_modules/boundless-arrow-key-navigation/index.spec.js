/* eslint no-unused-expressions:0 */

import { createElement, Component } from 'react';
import ReactDOM from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { noop } from 'lodash';
import sinon from 'sinon';

import ArrowKeyNavigation from './index';
import { conformanceChecker } from '../boundless-utils-test-helpers/index';

describe('ArrowKeyNavigation higher-order component', () => {
    const mountNode = document.body.appendChild(document.createElement('div'));
    const render = (vdom) => ReactDOM.render(vdom, mountNode);

    const event = { preventDefault: noop };
    const base = (
        <ArrowKeyNavigation>
            <li>apple</li>
            <li>orange</li>
        </ArrowKeyNavigation>
    );

    let element;
    let node;

    beforeEach(() => {
        element = render(base);
        node = ReactDOM.findDOMNode(element);
    });

    afterEach(() => ReactDOM.unmountComponentAtNode(mountNode));

    it('conforms to the Boundless prop interface standards', () => conformanceChecker(render, ArrowKeyNavigation));

    it('accepts nested children', () => {
        expect(node.children[0].textContent).toBe('apple');
        expect(node.children[1].textContent).toBe('orange');
    });

    it('updates its internal focus cache on child focus', () => {
        node.children[0].focus();
        expect(element.state.activeChildIndex).toBe(0);
    });

    it('forwards child focus events to the appropriate handler, if one is provided', () => {
        const stub = sinon.stub();

        element = render(
            <ArrowKeyNavigation>
                <li onFocus={stub}>apple</li>
                <li>orange</li>
            </ArrowKeyNavigation>
        );

        node.children[0].focus();

        expect(stub.called).toBe(true);
    });

    it('applies focus to the new active index when `state.activeChildIndex` changes', () => {
        expect(document.activeElement).toBe(document.body);

        element.setState({ activeChildIndex: 1 });
        expect(document.activeElement.textContent).toBe('orange');
    });

    it('defaults to the first child being "active" and included in the tabbing context', () => {
        expect(node.querySelector('[data-focus-index="0"][tabindex="0"]')).not.toBeNull();
    });

    it('allows the specification of a default child to be made "active" and included in the tabbing context', () => {
        ReactDOM.unmountComponentAtNode(mountNode);
        element = render(
            <ArrowKeyNavigation defaultActiveChildIndex={1}>
                <li>apple</li>
                <li>orange</li>
            </ArrowKeyNavigation>
        );

        node = ReactDOM.findDOMNode(element);

        expect(node.querySelector('[data-focus-index="1"][tabindex="0"]')).not.toBeNull();
    });

    it('ignores invalid children', () => {
        ReactDOM.unmountComponentAtNode(mountNode);
        element = render(
            <ArrowKeyNavigation>
                <li>apple</li>
                {null}
            </ArrowKeyNavigation>
        );

        node = ReactDOM.findDOMNode(element);
        node.children[0].focus();

        Simulate.keyDown(node, { ...event, key: 'ArrowDown' });
        expect(document.activeElement).toBe(node.children[0]);
    });

    describe('setFocus(index)', () => {
        it('does nothing if given an invalid index', () => {
            expect(document.activeElement).toBe(document.body);

            element.setFocus(10000);
            expect(document.activeElement).toBe(document.body);
        });

        it('moves focus if given a valid child index', () => {
            expect(document.activeElement).toBe(document.body);

            element.setFocus(1);
            expect(document.activeElement.textContent).toBe('orange');
        });

        it('works if the wrapper is a composite', () => {
            class ExampleComponent extends Component {
                render() {
                    return <div>{this.props.children}</div>;
                }
            }

            element = render(
                <ArrowKeyNavigation component={ExampleComponent}>
                    <span>apple</span>
                    <span>orange</span>
                </ArrowKeyNavigation>
            );

            expect(document.activeElement).toBe(document.body);

            element.setFocus(1);
            expect(document.activeElement.textContent).toBe('orange');
        });
    });

    describe('when `props.children` changes', () => {
        it('resets internal focus tracking if there are no children', () => {
            node.children[0].focus();
            expect(element.state.activeChildIndex).toBe(0);

            element = render(<ArrowKeyNavigation />);
            expect(element.state.activeChildIndex).toBe(0);
        });

        it('moves focus to the last child if the previous activeChildIndex is greater than the total number of available children', () => {
            element = render(
                <ArrowKeyNavigation>
                    <li>apple</li>
                    <li>orange</li>
                    <li>apricot</li>
                </ArrowKeyNavigation>
            );

            Simulate.focus(node.children[2]);
            expect(element.state.activeChildIndex).toBe(2);

            element = render(
                <ArrowKeyNavigation>
                    <li>apple</li>
                </ArrowKeyNavigation>
            );

            expect(element.state.activeChildIndex).toBe(0);
        });
    });

    describe('on keyboard `ArrowLeft`', () => {
        it('moves focus to the previous child', () => {
            node.children[1].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowLeft' });
            expect(document.activeElement).toBe(node.children[0]);
        });

        it('moves focus to the end if on the first child (reverse loop)', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowLeft' });
            expect(document.activeElement).toBe(node.children[1]);
        });
    });

    describe('on keyboard `ArrowUp`', () => {
        it('moves focus to the previous child', () => {
            node.children[1].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowUp' });
            expect(document.activeElement).toBe(node.children[0]);
        });

        it('loops back to the last item if on the first item', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowUp' });
            expect(document.activeElement).toBe(node.children[1]);
        });
    });

    describe('on keyboard `ArrowRight`', () => {
        it('moves focus to the next child', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowRight' });
            expect(document.activeElement).toBe(node.children[1]);
        });

        it('moves focus to the beginning if on the last child (loop)', () => {
            node.children[1].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowRight' });
            expect(document.activeElement).toBe(node.children[0]);
        });
    });

    describe('on keyboard `ArrowDown`', () => {
        it('moves focus to the next child', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowDown' });
            expect(document.activeElement).toBe(node.children[1]);
        });

        it('loops back to the first item if on the last item', () => {
            node.children[1].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowDown' });
            expect(document.activeElement).toBe(node.children[0]);
        });
    });

    describe('keydown event', () => {
        it('is proxied if `props.onKeyDown` is provided', () => {
            const stub = sinon.stub();

            element = render(
                <ArrowKeyNavigation onKeyDown={stub}>
                    <li>apple</li>
                    <li>orange</li>
                </ArrowKeyNavigation>
            );

            Simulate.keyDown(node, { ...event, key: 'ArrowDown' });

            expect(stub.calledOnce).toBe(true);
            expect(stub.calledWithMatch({ key: 'ArrowDown' })).toBe(true);
        });
    });

    describe('skipping focus of element with tabindex="-1"', () => {
        beforeEach(() => {
            element = render(
                <ArrowKeyNavigation>
                    <li>apple</li>
                    <li tabIndex='-1'>pear</li>
                    <li>orange</li>
                </ArrowKeyNavigation>
            );

            node = ReactDOM.findDOMNode(element);
        });

        it('moves focus to the next child that does not have tabindex="-1"', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowRight' });
            expect(document.activeElement).toBe(node.children[2]);
        });

        it('moves focus to the previous child that does not have tabindex="-1"', () => {
            Simulate.focus(node.children[2]);

            Simulate.keyDown(node, { ...event, key: 'ArrowLeft' });
            expect(document.activeElement).toBe(node.children[0]);
        });
    });

    describe('vertical mode', () => {
        const verticalBase = (
            <ArrowKeyNavigation mode={ArrowKeyNavigation.mode.VERTICAL}>
                <li>apple</li>
                <li>orange</li>
            </ArrowKeyNavigation>
        );

        beforeEach(() => {
            element = render(verticalBase);
            node = ReactDOM.findDOMNode(element);
        });

        it('should not move focus on ArrowLeft', () => {
            node.children[1].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowLeft' });
            expect(document.activeElement === node.children[1]).toBe(true);
        });

        it('should not move focus on ArrowRight', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowRight' });
            expect(document.activeElement === node.children[0]).toBe(true);
        });
    });

    describe('horizontal mode', () => {
        const horizontalBase = (
            <ArrowKeyNavigation mode={ArrowKeyNavigation.mode.HORIZONTAL}>
                <li>apple</li>
                <li>orange</li>
            </ArrowKeyNavigation>
        );

        beforeEach(() => {
            element = render(horizontalBase);
            node = ReactDOM.findDOMNode(element);
        });

        it('should not move focus on ArrowUp', () => {
            node.children[1].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowUp' });
            expect(document.activeElement === node.children[1]).toBe(true);
        });

        it('should not move focus on ArrowDown', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowDown' });
            expect(document.activeElement === node.children[0]).toBe(true);
        });
    });

    describe('both mode (default)', () => {
        const horizontalBase = (
            <ArrowKeyNavigation mode={ArrowKeyNavigation.mode.BOTH}>
                <li>apple</li>
                <li>orange</li>
            </ArrowKeyNavigation>
        );

        beforeEach(() => {
            element = render(horizontalBase);
            node = ReactDOM.findDOMNode(element);
        });

        it('should move focus on ArrowUp', () => {
            node.children[1].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowUp' });
            expect(document.activeElement === node.children[0]).toBe(true);
        });

        it('should move focus on ArrowLeft', () => {
            node.children[1].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowLeft' });
            expect(document.activeElement === node.children[0]).toBe(true);
        });

        it('should move focus on ArrowDown', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowDown' });
            expect(document.activeElement === node.children[1]).toBe(true);
        });

        it('should move focus on ArrowRight', () => {
            node.children[0].focus();

            Simulate.keyDown(node, { ...event, key: 'ArrowRight' });
            expect(document.activeElement === node.children[1]).toBe(true);
        });
    });
});
