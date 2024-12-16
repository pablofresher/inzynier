'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomClient = require('react-dom/client');

// Import createRoot instead of ReactDOM

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

require('./styles.css');

// Ensure your CSS is imported here

var container = document.getElementById('root'); // Get the root element
var root = (0, _reactDomClient.createRoot)(container); // Create a root for React 18

root.render(_react2['default'].createElement(
    _react2['default'].StrictMode,
    null,
    _react2['default'].createElement(_App2['default'], null)
));
