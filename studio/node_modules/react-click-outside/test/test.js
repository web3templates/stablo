global.requestAnimationFrame = callback => setTimeout(callback, 0);

const Adapter = require('enzyme-adapter-react-16');
const { configure } = require('enzyme');

configure({ adapter: new Adapter() });

const createReactClass = require('create-react-class');
const enhanceWithClickOutside = require('../index');
const enzyme = require('enzyme');
const React = require('react');

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

function mount(element) {
  return enzyme.mount(element, { attachTo: mountNode });
}

function simulateClick(node) {
  const event = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  node.dispatchEvent(event);
  return event;
}

describe('enhanceWithClickOutside', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = undefined;
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
  });

  it('calls handleClickOutside when clicked outside of component', () => {
    const clickInsideSpy = jest.fn();
    const clickOutsideSpy = jest.fn();

    const EnhancedComponent = (() => {
      class WrappedComponent extends React.Component {
        constructor() {
          super();
          this.handleClick = this.handleClick.bind(this);
        }

        handleClick() {
          clickInsideSpy();
        }

        handleClickOutside(e) {
          this.testBoundToComponent(e);
        }

        testBoundToComponent(e) {
          clickOutsideSpy(e);
        }

        render() {
          return (
            <div id="enhancedNode" onClick={this.handleClick}>
              <div id="nestedNode" />
            </div>
          );
        }
      }

      return enhanceWithClickOutside(WrappedComponent);
    })();

    class Root extends React.Component {
      render() {
        return (
          <div>
            <EnhancedComponent />
            <div id="outsideNode" />
          </div>
        );
      }
    }

    wrapper = mount(<Root />);

    const enhancedNode = wrapper.find('#enhancedNode').getDOMNode();
    const nestedNode = wrapper.find('#nestedNode').getDOMNode();
    const outsideNode = wrapper.find('#outsideNode').getDOMNode();

    simulateClick(enhancedNode);
    expect(clickInsideSpy.mock.calls.length).toBe(1);
    expect(clickOutsideSpy.mock.calls.length).toBe(0);

    simulateClick(nestedNode);
    expect(clickInsideSpy.mock.calls.length).toBe(2);
    expect(clickOutsideSpy.mock.calls.length).toBe(0);

    // Stop propagation in the outside node should not prevent the
    // handleOutsideClick handler from being called
    outsideNode.addEventListener('click', e => e.stopPropagation());

    const event = simulateClick(outsideNode);
    expect(clickOutsideSpy).toHaveBeenCalledWith(event);
  });

  it('calls handleClickOutside even if wrapped component renders null', () => {
    const clickOutsideSpy = jest.fn();

    const EnhancedComponent = (() => {
      class WrappedComponent extends React.Component {
        handleClickOutside() {
          clickOutsideSpy();
        }

        render() {
          return null;
        }
      }

      return enhanceWithClickOutside(WrappedComponent);
    })();

    wrapper = mount(<EnhancedComponent />);

    // We shouldn't TypeError when we try to call handleClickOutside
    expect(() => {
      const instance = wrapper.instance();
      instance.handleClickOutside();
    }).not.toThrow(TypeError);

    // If the component returns null, technically every click is an outside
    // click, so we should call the inner handleClickOutside always
    expect(clickOutsideSpy.mock.calls.length).toBe(1);
  });

  it('does not call handleClickOutside when unmounted', () => {
    const clickOutsideSpy = jest.fn();

    const EnhancedComponent = (() => {
      class WrappedComponent extends React.Component {
        handleClickOutside() {
          clickOutsideSpy();
        }

        render() {
          return <div />;
        }
      }

      return enhanceWithClickOutside(WrappedComponent);
    })();

    class Root extends React.Component {
      constructor() {
        super();
        this.state = {
          showEnhancedComponent: true,
        };
      }

      render() {
        return (
          <div>
            {this.state.showEnhancedComponent && <EnhancedComponent />}
            <div id="outsideNode" />
          </div>
        );
      }
    }

    wrapper = mount(<Root />);
    const outsideNode = wrapper.find('#outsideNode').getDOMNode();

    expect(clickOutsideSpy.mock.calls.length).toBe(0);
    simulateClick(outsideNode);
    expect(clickOutsideSpy.mock.calls.length).toBe(1);

    wrapper.setState({ showEnhancedComponent: false });

    simulateClick(outsideNode);
    expect(clickOutsideSpy.mock.calls.length).toBe(1);
  });

  it('does nothing if handleClickOutside is not implemented', () => {
    const EnhancedComponent = (() => {
      class WrappedComponent extends React.Component {
        render() {
          return <div />;
        }
      }

      return enhanceWithClickOutside(WrappedComponent);
    })();
    wrapper = mount(<EnhancedComponent />);
    wrapper.instance().handleClickOutside({});
  });

  it('takes wrappedRef prop', () => {
    const EnhancedComponent = (() => {
      class WrappedComponent extends React.Component {
        wrappedInstanceMethod() {}

        render() {
          return null;
        }
      }

      return enhanceWithClickOutside(WrappedComponent);
    })();

    let instance;

    wrapper = mount(
      <EnhancedComponent
        wrappedRef={c => {
          instance = c;
        }}
      />
    );

    expect(typeof instance.wrappedInstanceMethod).toBe('function');
  });

  describe('displayName', () => {
    it('gets set for React.createClass', () => {
      const ReactClass = createReactClass({
        displayName: 'ReactClass',
        handleClickOutside() {},
        render() {},
      });
      const Wrapped = enhanceWithClickOutside(ReactClass);
      expect(Wrapped.displayName).toBe('clickOutside(ReactClass)');
    });

    it('gets set for ES6 classes', () => {
      class ES6Class extends React.Component {
        handleClickOutside() {}
        render() {}
      }
      const Wrapped = enhanceWithClickOutside(ES6Class);
      expect(Wrapped.displayName).toBe('clickOutside(ES6Class)');
    });
  });
});
