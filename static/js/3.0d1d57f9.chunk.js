(this["webpackJsonp@zettel/site"]=this["webpackJsonp@zettel/site"]||[]).push([[3],{129:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.withMDXComponents=void 0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=i(n(0)),a=i(n(133)),c=i(n(16));function i(e){return e&&e.__esModule?e:{default:e}}var l=(0,a.default)({}),u=l.Provider,s=l.Consumer;t.withMDXComponents=function(e){return function(t){var n=t.components,a=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["components"]);return o.default.createElement(s,null,(function(t){return o.default.createElement(e,r({components:n||t},a))}))}};var p=function(e){var t=e.components,n=e.children;return o.default.createElement(u,{value:t},n)};p.propTypes={components:c.default.object.isRequired,children:c.default.element.isRequired},t.default=p},130:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(131);Object.defineProperty(t,"MDXTag",{enumerable:!0,get:function(){return a(r).default}});var o=n(129);function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"MDXProvider",{enumerable:!0,get:function(){return a(o).default}})},131:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(0),c=u(a),i=u(n(132)),l=n(129);function u(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}var m={inlineCode:"code",wrapper:"div"},f=function(e){function t(){return s(this,t),p(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"render",value:function(){var e=this.props,t=e.name,n=e.parentName,o=e.props,a=void 0===o?{}:o,l=e.children,u=e.components,s=void 0===u?{}:u,p=e.Layout,f=e.layoutProps,d=s[n+"."+t]||s[t]||m[t]||t;return p?((0,i.default)(this,p),c.default.createElement(p,r({components:s},f),c.default.createElement(d,a,l))):c.default.createElement(d,a,l)}}]),t}(a.Component);t.default=(0,l.withMDXComponents)(f)},132:function(e,t,n){"use strict";var r={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},o={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a=Object.defineProperty,c=Object.getOwnPropertyNames,i=Object.getOwnPropertySymbols,l=Object.getOwnPropertyDescriptor,u=Object.getPrototypeOf,s=u&&u(Object);e.exports=function e(t,n,p){if("string"!==typeof n){if(s){var m=u(n);m&&m!==s&&e(t,m,p)}var f=c(n);i&&(f=f.concat(i(n)));for(var d=0;d<f.length;++d){var h=f[d];if(!r[h]&&!o[h]&&(!p||!p[h])){var g=l(n,h);try{a(t,h,g)}catch(v){}}}return t}return t}},133:function(e,t,n){"use strict";t.__esModule=!0;var r=a(n(0)),o=a(n(134));function a(e){return e&&e.__esModule?e:{default:e}}t.default=r.default.createContext||o.default,e.exports=t.default},134:function(e,t,n){"use strict";t.__esModule=!0;var r=n(0),o=(c(r),c(n(16))),a=c(n(60));c(n(135));function c(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function u(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e){var t=[];return{on:function(e){t.push(e)},off:function(e){t=t.filter((function(t){return t!==e}))},get:function(){return e},set:function(n,r){e=n,t.forEach((function(t){return t(e,r)}))}}}t.default=function(e,t){var n,c,p="__create-react-context-"+(0,a.default)()+"__",m=function(e){function n(){var t,r;i(this,n);for(var o=arguments.length,a=Array(o),c=0;c<o;c++)a[c]=arguments[c];return t=r=l(this,e.call.apply(e,[this].concat(a))),r.emitter=s(r.props.value),l(r,t)}return u(n,e),n.prototype.getChildContext=function(){var e;return(e={})[p]=this.emitter,e},n.prototype.componentWillReceiveProps=function(e){if(this.props.value!==e.value){var n=this.props.value,r=e.value,o=void 0;((a=n)===(c=r)?0!==a||1/a===1/c:a!==a&&c!==c)?o=0:(o="function"===typeof t?t(n,r):1073741823,0!==(o|=0)&&this.emitter.set(e.value,o))}var a,c},n.prototype.render=function(){return this.props.children},n}(r.Component);m.childContextTypes=((n={})[p]=o.default.object.isRequired,n);var f=function(t){function n(){var e,r;i(this,n);for(var o=arguments.length,a=Array(o),c=0;c<o;c++)a[c]=arguments[c];return e=r=l(this,t.call.apply(t,[this].concat(a))),r.state={value:r.getValue()},r.onUpdate=function(e,t){0!==((0|r.observedBits)&t)&&r.setState({value:r.getValue()})},l(r,e)}return u(n,t),n.prototype.componentWillReceiveProps=function(e){var t=e.observedBits;this.observedBits=void 0===t||null===t?1073741823:t},n.prototype.componentDidMount=function(){this.context[p]&&this.context[p].on(this.onUpdate);var e=this.props.observedBits;this.observedBits=void 0===e||null===e?1073741823:e},n.prototype.componentWillUnmount=function(){this.context[p]&&this.context[p].off(this.onUpdate)},n.prototype.getValue=function(){return this.context[p]?this.context[p].get():e},n.prototype.render=function(){return(e=this.props.children,Array.isArray(e)?e[0]:e)(this.state.value);var e},n}(r.Component);return f.contextTypes=((c={})[p]=o.default.object,c),{Provider:m,Consumer:f}},e.exports=t.default},135:function(e,t,n){"use strict";var r=n(136);e.exports=r},136:function(e,t,n){"use strict";function r(e){return function(){return e}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},e.exports=o},137:function(e,t,n){"use strict";function r(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}n.r(t);var o=n(0),a=n.n(o),c=n(130);t.default=function(e){var t=e.components;r(e,["components"]);return a.a.createElement(c.MDXTag,{name:"wrapper",components:t},a.a.createElement(c.MDXTag,{name:"h1",components:t},"Zettel"),a.a.createElement(c.MDXTag,{name:"h2",components:t},"[0.0.21]"," - 2020-05-18"),a.a.createElement(c.MDXTag,{name:"h3",components:t},"Changed"),a.a.createElement(c.MDXTag,{name:"ul",components:t},a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Tidied up list of examples, better names and better urls, removed examples which are misleading/incomplete")),a.a.createElement(c.MDXTag,{name:"h3",components:t},"Fixed"),a.a.createElement(c.MDXTag,{name:"ul",components:t},a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Remove unused dependencies from @zettel/core"),a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Remove useMemo in @zettel/react which breaks draggable example")),a.a.createElement(c.MDXTag,{name:"h2",components:t},"[0.0.20]"," - 2019-10-29"),a.a.createElement(c.MDXTag,{name:"h3",components:t},"Added"),a.a.createElement(c.MDXTag,{name:"ul",components:t},a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Added tables example"),a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Expose DefaultRenderBlock and EditorChildren from @zettel/react")),a.a.createElement(c.MDXTag,{name:"h3",components:t},"Fixed"),a.a.createElement(c.MDXTag,{name:"ul",components:t},a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Regression - Current styles not applied when inserting character #22")),a.a.createElement(c.MDXTag,{name:"h2",components:t},"[0.0.19]"," - 2019-10-28"),a.a.createElement(c.MDXTag,{name:"h3",components:t},"Fixed"),a.a.createElement(c.MDXTag,{name:"ul",components:t},a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Updated ",a.a.createElement(c.MDXTag,{name:"inlineCode",components:t,parentName:"li"},"setDomSelection")," to look focus and anchor fragment elements with the ",a.a.createElement(c.MDXTag,{name:"inlineCode",components:t,parentName:"li"},"data-text-fragment")," html attribute and add ",a.a.createElement(c.MDXTag,{name:"inlineCode",components:t,parentName:"li"},"data-text-fragment")," to text-fragment render prop so we can differentiate text fragments form blocks. Fixes #18")),a.a.createElement(c.MDXTag,{name:"h2",components:t},"[0.0.17]"," - 2019-10-25"),a.a.createElement(c.MDXTag,{name:"h3",components:t},"Added"),a.a.createElement(c.MDXTag,{name:"ul",components:t},a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"changelog.md")),a.a.createElement(c.MDXTag,{name:"h3",components:t},"Changed"),a.a.createElement(c.MDXTag,{name:"ul",components:t},a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Add block offsets to renderblock components so that all selection changes are captured."),a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Use mdx macro to render .md and evtl .mdx files \ud83c\udf89\ud83c\udf89\ud83c\udf89"),a.a.createElement(c.MDXTag,{name:"li",components:t,parentName:"ul"},"Update index page to render changelog")))}}}]);
//# sourceMappingURL=3.0d1d57f9.chunk.js.map