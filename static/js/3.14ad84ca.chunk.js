(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{113:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.withMDXComponents=void 0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=c(n(0)),a=c(n(117)),u=c(n(14));function c(e){return e&&e.__esModule?e:{default:e}}var i=(0,a.default)({}),l=i.Provider,s=i.Consumer;t.withMDXComponents=function(e){return function(t){var n=t.components,a=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["components"]);return o.default.createElement(s,null,function(t){return o.default.createElement(e,r({components:n||t},a))})}};var p=function(e){var t=e.components,n=e.children;return o.default.createElement(l,{value:t},n)};p.propTypes={components:u.default.object.isRequired,children:u.default.element.isRequired},t.default=p},114:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(115);Object.defineProperty(t,"MDXTag",{enumerable:!0,get:function(){return a(r).default}});var o=n(113);function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"MDXProvider",{enumerable:!0,get:function(){return a(o).default}})},115:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(0),u=l(a),c=l(n(116)),i=n(113);function l(e){return e&&e.__esModule?e:{default:e}}var s={inlineCode:"code",wrapper:"div"},p=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.Component),o(t,[{key:"render",value:function(){var e=this.props,t=e.name,n=e.parentName,o=e.props,a=void 0===o?{}:o,i=e.children,l=e.components,p=void 0===l?{}:l,f=e.Layout,d=e.layoutProps,m=p[n+"."+t]||p[t]||s[t]||t;return f?((0,c.default)(this,f),u.default.createElement(f,r({components:p},d),u.default.createElement(m,a,i))):u.default.createElement(m,a,i)}}]),t}();t.default=(0,i.withMDXComponents)(p)},116:function(e,t,n){"use strict";var r={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},o={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a=Object.defineProperty,u=Object.getOwnPropertyNames,c=Object.getOwnPropertySymbols,i=Object.getOwnPropertyDescriptor,l=Object.getPrototypeOf,s=l&&l(Object);e.exports=function e(t,n,p){if("string"!==typeof n){if(s){var f=l(n);f&&f!==s&&e(t,f,p)}var d=u(n);c&&(d=d.concat(c(n)));for(var m=0;m<d.length;++m){var h=d[m];if(!r[h]&&!o[h]&&(!p||!p[h])){var v=i(n,h);try{a(t,h,v)}catch(y){}}}return t}return t}},117:function(e,t,n){"use strict";t.__esModule=!0;var r=a(n(0)),o=a(n(118));function a(e){return e&&e.__esModule?e:{default:e}}t.default=r.default.createContext||o.default,e.exports=t.default},118:function(e,t,n){"use strict";t.__esModule=!0;var r=n(0),o=(u(r),u(n(14))),a=u(n(49));u(n(119));function u(e){return e&&e.__esModule?e:{default:e}}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function l(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=1073741823;t.default=function(e,t){var n,u,p="__create-react-context-"+(0,a.default)()+"__",f=function(e){function n(){var t,r;c(this,n);for(var o=arguments.length,a=Array(o),u=0;u<o;u++)a[u]=arguments[u];return t=r=i(this,e.call.apply(e,[this].concat(a))),r.emitter=function(e){var t=[];return{on:function(e){t.push(e)},off:function(e){t=t.filter(function(t){return t!==e})},get:function(){return e},set:function(n,r){e=n,t.forEach(function(t){return t(e,r)})}}}(r.props.value),i(r,t)}return l(n,e),n.prototype.getChildContext=function(){var e;return(e={})[p]=this.emitter,e},n.prototype.componentWillReceiveProps=function(e){if(this.props.value!==e.value){var n=this.props.value,r=e.value,o=void 0;((a=n)===(u=r)?0!==a||1/a===1/u:a!==a&&u!==u)?o=0:(o="function"===typeof t?t(n,r):s,0!==(o|=0)&&this.emitter.set(e.value,o))}var a,u},n.prototype.render=function(){return this.props.children},n}(r.Component);f.childContextTypes=((n={})[p]=o.default.object.isRequired,n);var d=function(t){function n(){var e,r;c(this,n);for(var o=arguments.length,a=Array(o),u=0;u<o;u++)a[u]=arguments[u];return e=r=i(this,t.call.apply(t,[this].concat(a))),r.state={value:r.getValue()},r.onUpdate=function(e,t){0!==((0|r.observedBits)&t)&&r.setState({value:r.getValue()})},i(r,e)}return l(n,t),n.prototype.componentWillReceiveProps=function(e){var t=e.observedBits;this.observedBits=void 0===t||null===t?s:t},n.prototype.componentDidMount=function(){this.context[p]&&this.context[p].on(this.onUpdate);var e=this.props.observedBits;this.observedBits=void 0===e||null===e?s:e},n.prototype.componentWillUnmount=function(){this.context[p]&&this.context[p].off(this.onUpdate)},n.prototype.getValue=function(){return this.context[p]?this.context[p].get():e},n.prototype.render=function(){return(e=this.props.children,Array.isArray(e)?e[0]:e)(this.state.value);var e},n}(r.Component);return d.contextTypes=((u={})[p]=o.default.object,u),{Provider:f,Consumer:d}},e.exports=t.default},119:function(e,t,n){"use strict";var r=n(120);e.exports=r},120:function(e,t,n){"use strict";function r(e){return function(){return e}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},e.exports=o},121:function(e,t,n){"use strict";function r(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}n.r(t);var o=n(0),a=n.n(o),u=n(114);t.default=function(e){var t=e.components;r(e,["components"]);return a.a.createElement(u.MDXTag,{name:"wrapper",components:t},a.a.createElement(u.MDXTag,{name:"h1",components:t},"Zettel Changelog"),a.a.createElement(u.MDXTag,{name:"h2",components:t},"[0.0.17]"," - 2019-10-25"),a.a.createElement(u.MDXTag,{name:"h3",components:t},"Added"),a.a.createElement(u.MDXTag,{name:"ul",components:t},a.a.createElement(u.MDXTag,{name:"li",components:t,parentName:"ul"},"changelog.md")),a.a.createElement(u.MDXTag,{name:"h3",components:t},"Changed"),a.a.createElement(u.MDXTag,{name:"ul",components:t},a.a.createElement(u.MDXTag,{name:"li",components:t,parentName:"ul"},"Add block offsets to renderblock components so that all selection changes are captured."),a.a.createElement(u.MDXTag,{name:"li",components:t,parentName:"ul"},"Use mdx macro to render .md and evtl .mdx files \ud83c\udf89\ud83c\udf89\ud83c\udf89"),a.a.createElement(u.MDXTag,{name:"li",components:t,parentName:"ul"},"Update index page to render changelog")))}}}]);
//# sourceMappingURL=3.14ad84ca.chunk.js.map