const enhanceWithClickOutside = require('../index');
const React = require('react');
const ReactDOM = require('react-dom');

const style = {
  backgroundColor: '#fff',
  border: '1px solid #000',
  height: 100,
  width: 100,
};

const Target = (() => {
  class Target extends React.Component {
    handleClickOutside() {
      const hue = Math.floor(Math.random() * 360);
      document.body.style.backgroundColor = `hsl(${hue}, 100%, 87.5%)`;
    }

    render() {
      const isMobile = 'ontouchstart' in document.body;
      return <div style={style}>{`mobile: ${isMobile}`}</div>;
    }
  }

  return enhanceWithClickOutside(Target);
})();

const Root = () => (
  <div>
    <Target />
    <button style={style}>Button Element</button>
  </div>
);

if ('ontouchstart' in document.documentElement) {
  document.body.style.cursor = 'pointer';
  document.documentElement.style.touchAction = 'manipulation';
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Root />, root);
