
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/Editor.svelte generated by Svelte v3.6.8 */
    const { console: console_1 } = globals;

    const file = "src/Editor.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.block = list[i];
    	return child_ctx;
    }

    // (7:2) {#each editorState.tree.blocks as block}
    function create_each_block(ctx) {
    	var div, t_value = ctx.block.value.map(func).join(''), t;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file, 7, 4, 125);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.editorState) && t_value !== (t_value = ctx.block.value.map(func).join(''))) {
    				set_data(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function create_fragment(ctx) {
    	var div;

    	var each_value = ctx.editorState.tree.blocks;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			div = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			add_location(div, file, 5, 0, 72);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.editorState) {
    				each_value = ctx.editorState.tree.blocks;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function func(v) {
    	return v.char;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { editorState } = $$props;
      console.log(editorState);

    	const writable_props = ['editorState'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1.warn(`<Editor> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('editorState' in $$props) $$invalidate('editorState', editorState = $$props.editorState);
    	};

    	return { editorState };
    }

    class Editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["editorState"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.editorState === undefined && !('editorState' in props)) {
    			console_1.warn("<Editor> was created without expected prop 'editorState'");
    		}
    	}

    	get editorState() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.6.8 */

    function create_fragment$1(ctx) {
    	var current;

    	var editor = new Editor({
    		props: { editorState: ctx.editorState },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			editor.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(editor, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var editor_changes = {};
    			if (changed.editorState) editor_changes.editorState = ctx.editorState;
    			editor.$set(editor_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(editor.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(editor.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(editor, detaching);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { editorState } = $$props;

    	const writable_props = ['editorState'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('editorState' in $$props) $$invalidate('editorState', editorState = $$props.editorState);
    	};

    	return { editorState };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["editorState"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.editorState === undefined && !('editorState' in props)) {
    			console.warn("<App> was created without expected prop 'editorState'");
    		}
    	}

    	get editorState() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var findAfter_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function findAfter(value, startIndex, find) {
        for (let i = startIndex; i < value.length; i++) {
            if (find(value[i])) {
                return value[i];
            }
        }
    }
    exports.default = findAfter;
    //# sourceMappingURL=findAfter.js.map
    });

    unwrapExports(findAfter_1);

    var findBefore_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function findBefore(value, startIndex, find) {
        for (let i = startIndex; i >= 0; i--) {
            if (find(value[i])) {
                return value[i];
            }
        }
    }
    exports.default = findBefore;
    //# sourceMappingURL=findBefore.js.map
    });

    unwrapExports(findBefore_1);

    var getIndexAfter_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getIndexAfter(value, startIndex, find) {
        for (let i = startIndex + 1; i < value.length; i++) {
            if (find(value[i])) {
                return i;
            }
        }
        return null;
    }
    exports.default = getIndexAfter;
    //# sourceMappingURL=getIndexAfter.js.map
    });

    unwrapExports(getIndexAfter_1);

    var getIndexBefore_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getIndexBefore(value, startIndex, find) {
        for (let i = startIndex - 1; i >= -1; i--) {
            if (find(value[i + 1])) {
                return i;
            }
        }
        return null;
    }
    exports.default = getIndexBefore;
    //# sourceMappingURL=getIndexBefore.js.map
    });

    unwrapExports(getIndexBefore_1);

    var id_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function id() {
        let firstPart = (Math.random() * 46656) | 0;
        let secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return `${firstPart}${secondPart}`;
    }
    exports.default = id;
    //# sourceMappingURL=id.js.map
    });

    unwrapExports(id_1);

    var rawToFlat = createCommonjsModule(function (module, exports) {
    var __rest = (commonjsGlobal && commonjsGlobal.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };
    Object.defineProperty(exports, "__esModule", { value: true });

    const parseFlatState = (raw) => {
        const state = {
            value: [],
            entityMap: raw.entityMap
        };
        let ignore = true;
        raw.text.split('').forEach(char => {
            if (char === '[') {
                ignore = false;
                const val = {
                    type: 'block-start',
                    blockKey: id_1.default()
                };
                state.value.push(val);
            }
            else if (char === ']') {
                ignore = true;
                const val = {
                    type: 'block-end'
                };
                state.value.push(val);
            }
            else if (ignore === false) {
                const val = {
                    char,
                    styles: [],
                };
                state.value.push(val);
            }
        });
        raw.ranges.forEach((_a) => {
            var { offset, length, entity: entityKey } = _a, charData = __rest(_a, ["offset", "length", "entity"]);
            for (var i = offset; i < offset + length; i++) {
                const value = state.value[i];
                if (value.type == null || value.type === 'block-start') {
                    const entity = (entityKey != null && state.entityMap[entityKey]) ? entityKey : null;
                    const newValue = Object.assign({}, value, charData);
                    if (entity != null) {
                        newValue.entity = entity;
                    }
                    state.value[i] = newValue;
                }
            }
        });
        return state;
    };
    exports.default = parseFlatState;
    //# sourceMappingURL=rawToFlat.js.map
    });

    unwrapExports(rawToFlat);

    var change_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function change(update) {
        const { value: currentValue, entityMap } = update.current;
        const [start, end] = [
            update.change.start,
            update.change.end,
        ].sort((a, b) => a - b);
        const selectedValue = update.current.value.slice(start + 1, end + 1);
        let valueUpdate = update.change.value;
        let newValue = update.current.value;
        if (!Array.isArray(valueUpdate)) {
            valueUpdate = currentValue.slice(start + 1, end + 1)
                .map(char => (Object.assign({}, char, valueUpdate)));
            newValue = currentValue.slice(0, start + 2)
                .concat(valueUpdate)
                .concat(currentValue.slice(end + 2));
        }
        else {
            newValue = currentValue.slice(0, start + 1)
                .concat(valueUpdate)
                .concat(currentValue.slice(end + 1));
        }
        if (newValue[0].type !== 'block-start') {
            throw new Error('First character always needs to be block-start');
        }
        else if (newValue[newValue.length - 1].type !== 'block-end') {
            throw new Error('Last character always needs to be block-end');
        }
        const newChange = {
            start: start + 1,
            end: end - selectedValue.length + valueUpdate.length + 1,
            value: selectedValue
        };
        return {
            current: {
                value: newValue,
                entityMap,
            },
            change: newChange,
        };
    }
    exports.default = change;
    //# sourceMappingURL=change.js.map
    });

    unwrapExports(change_1);

    var textToFlat_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    const textToFlat = (text) => {
        return rawToFlat.default({
            text: `[${text.replace(/\n/gi, '][')}]`,
            ranges: [],
            entityMap: {}
        });
    };
    exports.default = textToFlat;
    //# sourceMappingURL=textToFlat.js.map
    });

    unwrapExports(textToFlat_1);

    var flatToTree = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const getNode = (state, path) => {
        return path.reduce((acc, val) => {
            return acc.blocks[val];
        }, state);
    };
    const getNodes = (state, path) => {
        if (path.length === 0) {
            return state.blocks;
        }
        else {
            return path.reduce((acc, val) => {
                return acc[val].blocks || acc;
            }, state.blocks);
        }
    };
    const parseBlockTree = (flat) => {
        const state = {
            blocks: [],
            entityMap: flat.entityMap,
        };
        let path = [];
        flat.value.forEach((char, index) => {
            if (char.type === 'block-start') {
                const blocks = getNodes(state, path);
                blocks.push({
                    value: [],
                    blocks: [],
                    blockKey: char.blockKey,
                    entity: char.entity != null ? flat.entityMap[char.entity] : null
                });
                path.push(blocks.length - 1);
            }
            else if (char.type === 'block-end') {
                path.pop();
            }
            else {
                if (path.length === 0) {
                    throw new Error(`Invalid List State`);
                }
                const node = getNode(state, path);
                node.value.push(char);
            }
        });
        return state;
    };
    exports.default = parseBlockTree;
    //# sourceMappingURL=flatToTree.js.map
    });

    unwrapExports(flatToTree);

    var constants = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.COMMAND = {
        CHANGE_SELECTION: 'CHANGE_SELECTION',
        BACKSPACE: 'BACKSPACE',
        BACKSPACE_BLOCK_START: 'BACKSPACE_BLOCK_START',
        BACKSPACE_PREV_WORD: 'BACKSPACE_PREV_WORD',
        REMOVE_RANGE: 'REMOVE_RANGE',
        DELETE_FORWARD: 'DELETE_FORWARD',
        INSERT_CHARACTER: 'INSERT_CHARACTER',
        SPLIT_BLOCK: 'SPLIT_BLOCK',
        UNDO: 'UNDO',
        REDO: 'REDO',
        UPDATE_BLOCK_ENTITIES: 'UPDATE_BLOCK_ENTITIES'
    };
    //# sourceMappingURL=constants.js.map
    });

    unwrapExports(constants);
    var constants_1 = constants.COMMAND;

    var backspaceToPrevWord_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function backspaceToPrevWord(editorState, start, end) {
        let newEditorState = editorState;
        const prevChar = editorState.list.value[start];
        if (prevChar.type == null) {
            let spaceBefore = false;
            let isBlockStart = false;
            const prevWordEnd = getIndexBefore_1.default(editorState.list.value, start, (ch) => {
                if (ch.type !== 'block-start' && ch.type !== 'block-end') {
                    spaceBefore = ch.char === ' ';
                }
                if (ch.type === 'block-start') {
                    isBlockStart = true;
                    return true;
                }
                if (ch.type == null && spaceBefore) {
                    return true;
                }
                return false;
            });
            if (prevWordEnd != null) {
                newEditorState = editorState.change({
                    type: constants.COMMAND.BACKSPACE_PREV_WORD,
                    start: isBlockStart ? prevWordEnd + 1 : prevWordEnd,
                    end,
                    value: [],
                    isBoundary: true
                });
            }
        }
        return newEditorState;
    }
    exports.default = backspaceToPrevWord;
    //# sourceMappingURL=backspaceToPrevWord.js.map
    });

    unwrapExports(backspaceToPrevWord_1);

    var backspaceToBlockStart_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function backspaceToBlockStart(editorState, start, end) {
        const prevChar = editorState.list.value[start - 1];
        let newEditorState = editorState;
        if (prevChar.type == null) {
            const blockBeginning = getIndexBefore_1.default(editorState.list.value, start, (ch) => {
                if (ch.type === 'block-start') {
                    return true;
                }
                return false;
            });
            if (blockBeginning != null) {
                newEditorState = editorState.change({
                    type: constants.COMMAND.BACKSPACE_BLOCK_START,
                    start: blockBeginning + 1,
                    end,
                    value: [],
                    isBoundary: true
                });
            }
        }
        return newEditorState;
    }
    exports.default = backspaceToBlockStart;
    //# sourceMappingURL=backspaceToBlockStart.js.map
    });

    unwrapExports(backspaceToBlockStart_1);

    var redo_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });



    function redo(editorState) {
        if (editorState.redoStack.length === 0) {
            return null;
        }
        const emptyChange = [];
        let newEditorState = new EditorState.default({
            start: editorState.start,
            end: editorState.end,
            list: editorState.list,
            redoStack: editorState.redoStack,
            undoStack: [emptyChange].concat([...editorState.undoStack])
        });
        const [lastChanges, ...rest] = editorState.redoStack;
        newEditorState = lastChanges.reduce((editorState, lastChange) => {
            const updated = dist.change({
                current: editorState.list,
                change: Object.assign({}, lastChange, { start: lastChange.start - 1, end: lastChange.end - 1 })
            });
            const [lastUndo, ...undoStack] = editorState.undoStack;
            return new EditorState.default({
                start: updated.change.start,
                end: updated.change.end,
                list: updated.current,
                redoStack: rest,
                undoStack: [[updated.change].concat(lastUndo || [])].concat(undoStack),
            });
        }, newEditorState);
        return new EditorState.default({
            start: newEditorState.start - 1,
            lastChangeType: constants.COMMAND.REDO,
            end: newEditorState.end - 1,
            list: newEditorState.list,
            redoStack: newEditorState.redoStack,
            undoStack: newEditorState.undoStack
        });
        return editorState.redo();
    }
    exports.default = redo;
    //# sourceMappingURL=redo.js.map
    });

    unwrapExports(redo_1);

    var undo_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });



    function undo(editorState) {
        if (editorState.undoStack.length === 0) {
            return null;
        }
        const [lastChanges, ...rest] = editorState.undoStack;
        const emptyChange = [];
        let newEditorState = new EditorState.default({
            start: editorState.start,
            end: editorState.end,
            list: editorState.list,
            redoStack: [emptyChange].concat([...editorState.redoStack]),
            undoStack: editorState.undoStack
        });
        newEditorState = lastChanges.reduce((editorState, lastChange) => {
            const updated = change_1.default({
                current: editorState.list,
                change: Object.assign({}, lastChange, { start: lastChange.start - 1, end: lastChange.end - 1 })
            });
            const [lastRedo, ...redoStack] = editorState.redoStack;
            return new EditorState.default({
                start: updated.change.start,
                end: updated.change.end,
                list: updated.current,
                redoStack: [[updated.change].concat(lastRedo || [])].concat(redoStack),
                undoStack: rest
            });
        }, newEditorState);
        return new EditorState.default({
            start: newEditorState.start - 1,
            lastChangeType: constants.COMMAND.UNDO,
            end: newEditorState.end - 1,
            list: newEditorState.list,
            redoStack: newEditorState.redoStack,
            undoStack: newEditorState.undoStack
        });
    }
    exports.default = undo;
    //# sourceMappingURL=undo.js.map
    });

    unwrapExports(undo_1);

    var backspace_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function backspace(editorState, start, end) {
        let newEditorState = editorState;
        const previousCharIndex = getIndexBefore_1.default(editorState.list.value, start, (ch) => ch.type == null || ch.type === 'block-end');
        if (previousCharIndex != null) {
            let _start = previousCharIndex;
            newEditorState = editorState.change({
                isBoundary: editorState.lastChangeType !== constants.COMMAND.BACKSPACE,
                type: constants.COMMAND.BACKSPACE,
                start: _start,
                end,
                value: []
            }).change({
                type: constants.COMMAND.BACKSPACE,
                start: _start,
                end: _start,
                value: [],
            });
        }
        return newEditorState;
    }
    exports.default = backspace;
    //# sourceMappingURL=backspace.js.map
    });

    unwrapExports(backspace_1);

    var insertCharacter_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function insertCharacter(editorState, start, end, char) {
        const prevValue = editorState.list.value[start];
        const nextValue = editorState.list.value[end + 1];
        let entity;
        if (nextValue != null && nextValue.type == null
            && prevValue != null && prevValue.type == null
            && prevValue.entity === nextValue.entity) {
            entity = prevValue.entity;
        }
        return editorState.change({
            isBoundary: editorState.lastChangeType !== constants.COMMAND.INSERT_CHARACTER,
            type: constants.COMMAND.INSERT_CHARACTER,
            start,
            end,
            value: [{
                    char: char,
                    styles: editorState.currentStyles,
                    entity,
                }]
        }).change({
            type: constants.COMMAND.INSERT_CHARACTER,
            start: start + 1,
            end: start + 1,
            value: [],
        });
    }
    exports.default = insertCharacter;
    //# sourceMappingURL=insertCharacter.js.map
    });

    unwrapExports(insertCharacter_1);

    var removeRange_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function removeRange(editorState, start, end) {
        return editorState.change({
            isBoundary: true,
            type: constants.COMMAND.REMOVE_RANGE,
            start,
            end,
            value: []
        }).change({
            type: constants.COMMAND.REMOVE_RANGE,
            start,
            end: start,
            value: [],
        });
    }
    exports.default = removeRange;
    //# sourceMappingURL=removeRange.js.map
    });

    unwrapExports(removeRange_1);

    var getBlockForIndex_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getBlockForIndex(value, index) {
        let block = null;
        let blockOffset = 0;
        for (let i = 0; i <= index; i++) {
            const val = value[i];
            if (val != null && val.type === 'block-start') {
                block = val;
                blockOffset = i;
            }
        }
        return {
            blockOffset,
            block
        };
    }
    exports.default = getBlockForIndex;
    //# sourceMappingURL=getBlockForIndex.js.map
    });

    unwrapExports(getBlockForIndex_1);

    var splitBlock_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });



    function splitBlock(editorState, start, end) {
        const { block: currentBlock } = getBlockForIndex_1.default(editorState.list.value, start);
        return editorState.change({
            isBoundary: true,
            type: constants.COMMAND.SPLIT_BLOCK,
            start,
            end,
            value: [
                { type: 'block-end' },
                Object.assign({}, currentBlock, { type: 'block-start', blockKey: id_1.default() })
            ]
        }).change({
            type: constants.COMMAND.SPLIT_BLOCK,
            start: start + 2,
            end: start + 2,
            value: [],
        });
    }
    exports.default = splitBlock;
    //# sourceMappingURL=splitBlock.js.map
    });

    unwrapExports(splitBlock_1);

    var updateSelection_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function updateSelection(editorState, selection) {
        return new EditorState.default(Object.assign({ lastChangeType: constants.COMMAND.CHANGE_SELECTION }, editorState, selection));
    }
    exports.default = updateSelection;
    //# sourceMappingURL=updateSelection.js.map
    });

    unwrapExports(updateSelection_1);

    var getPreviousCharacterIndex = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function getNextCharacterIndex(editorState, currIndex) {
        const index = getIndexBefore_1.default(editorState.list.value, currIndex, ch => {
            return ch.type == null;
        });
        if (index != null) {
            return index;
        }
        else {
            return currIndex;
        }
    }
    exports.default = getNextCharacterIndex;
    //# sourceMappingURL=getPreviousCharacterIndex.js.map
    });

    unwrapExports(getPreviousCharacterIndex);

    var moveFocusBack_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function moveFocusBack(editorState) {
        const focusOffset = getPreviousCharacterIndex.default(editorState, editorState.focusOffset);
        return updateSelection_1.default(editorState, {
            anchorOffset: editorState.anchorOffset,
            focusOffset: focusOffset
        });
    }
    exports.default = moveFocusBack;
    //# sourceMappingURL=moveFocusBack.js.map
    });

    unwrapExports(moveFocusBack_1);

    var getNextCharacterIndex_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function getNextCharacterIndex(editorState, currIndex) {
        const index = getIndexAfter_1.default(editorState.list.value, currIndex, ch => {
            return ch.type == null;
        });
        if (index != null) {
            return index;
        }
        else {
            return currIndex;
        }
    }
    exports.default = getNextCharacterIndex;
    //# sourceMappingURL=getNextCharacterIndex.js.map
    });

    unwrapExports(getNextCharacterIndex_1);

    var moveFocusForward_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function moveFocusForward(editorState) {
        return updateSelection_1.default(editorState, {
            anchorOffset: editorState.anchorOffset,
            focusOffset: getNextCharacterIndex_1.default(editorState, editorState.focusOffset)
        });
    }
    exports.default = moveFocusForward;
    //# sourceMappingURL=moveFocusForward.js.map
    });

    unwrapExports(moveFocusForward_1);

    var deleteForward_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function deleteForward(editorState, start, end) {
        return editorState.change({
            isBoundary: editorState.lastChangeType !== constants.COMMAND.DELETE_FORWARD,
            type: constants.COMMAND.DELETE_FORWARD,
            start,
            end,
            value: []
        }).change({
            type: constants.COMMAND.DELETE_FORWARD,
            start: end + 1,
            end: end + 1,
            value: [],
        });
    }
    exports.default = deleteForward;
    //# sourceMappingURL=deleteForward.js.map
    });

    unwrapExports(deleteForward_1);

    var commands = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.backspaceToPrevWord = backspaceToPrevWord_1.default;

    exports.backspaceToBlockStart = backspaceToBlockStart_1.default;

    exports.redo = redo_1.default;

    exports.undo = undo_1.default;

    exports.backspace = backspace_1.default;

    exports.insertCharacter = insertCharacter_1.default;

    exports.removeRange = removeRange_1.default;

    exports.splitBlock = splitBlock_1.default;

    exports.updateSelection = updateSelection_1.default;

    exports.moveFocusBack = moveFocusBack_1.default;

    exports.moveFocusForward = moveFocusForward_1.default;

    exports.deleteForward = deleteForward_1.default;
    //# sourceMappingURL=index.js.map
    });

    unwrapExports(commands);
    var commands_1 = commands.backspaceToPrevWord;
    var commands_2 = commands.backspaceToBlockStart;
    var commands_3 = commands.redo;
    var commands_4 = commands.undo;
    var commands_5 = commands.backspace;
    var commands_6 = commands.insertCharacter;
    var commands_7 = commands.removeRange;
    var commands_8 = commands.splitBlock;
    var commands_9 = commands.updateSelection;
    var commands_10 = commands.moveFocusBack;
    var commands_11 = commands.moveFocusForward;
    var commands_12 = commands.deleteForward;

    var EditorState_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });






    const emptyList = {
        value: [],
        entityMap: {}
    };
    class EditorState {
        constructor({ start = 0, end = 0, anchorOffset, focusOffset, list = emptyList, lastChangeType = null, currentStyles = [], undoStack = [], redoStack = [] }) {
            this.redoStack = [];
            this.undoStack = [];
            this.list = list;
            this.undoStack = undoStack;
            this.currentStyles = currentStyles;
            this.anchorOffset = typeof anchorOffset === 'number' ? anchorOffset : start;
            this.focusOffset = typeof focusOffset === 'number' ? focusOffset : end;
            let [_start, _end] = [this.anchorOffset, this.focusOffset].sort((a, b) => a - b);
            this.start = _start;
            this.end = _end;
            this.lastChangeType = lastChangeType;
            this.redoStack = redoStack;
            this.tree = flatToTree.default(this.list);
        }
        change(_change) {
            const defaultChange = {
                start: this.start,
                end: this.end,
                value: []
            };
            const update = {
                current: this.list,
                change: Object.assign({}, defaultChange, _change)
            };
            const updated = change_1.default(update);
            let undoStack = this.undoStack;
            const [lastUndo, ...undoRest] = this.undoStack;
            const lastChangeType = _change.type || null;
            if (Boolean(_change.isBoundary) === false || this.undoStack.length === 0) {
                undoStack = [[updated.change].concat(lastUndo || [])].concat(undoRest);
            }
            else {
                undoStack = [[updated.change]].concat([lastUndo || []].concat(undoRest));
            }
            return new EditorState({
                start: (updated.change.start || this.start) - 1,
                end: (updated.change.end || this.end) - 1,
                currentStyles: this.currentStyles,
                lastChangeType,
                list: updated.current,
                redoStack: [],
                undoStack
            });
        }
        createEntity(entity) {
            const entityKey = id_1.default();
            this.list.entityMap[entityKey] = entity;
            return entityKey;
        }
        undo() {
            return commands.undo(this) || this;
        }
        redo() {
            return commands.redo(this) || this;
        }
        setCurrentStyles(styles) {
            this.currentStyles = styles;
            return this;
        }
        toggleStyle(style, _start = this.start, _end = this.end) {
            const start = _start + 1;
            const end = _end + 1;
            const selectedValue = this.list.value.slice(start, end);
            const hasStyle = selectedValue.every(char => char.type != null ||
                char.styles.includes(style));
            const updatedValue = selectedValue.map(char => {
                const newChar = Object.assign({}, char);
                if (newChar.type == null) {
                    if (hasStyle) {
                        newChar.styles = newChar.styles.filter(st => st !== style);
                    }
                    else if (!newChar.styles.includes(style)) {
                        newChar.styles = newChar.styles.concat([style]);
                    }
                }
                return newChar;
            });
            let newEditorState = this.change({
                start,
                end,
                isBoundary: true,
                value: updatedValue
            });
            newEditorState.start = _start;
            newEditorState.end = _end;
            if (!hasStyle || !this.currentStyles.includes(style)) {
                newEditorState.currentStyles = newEditorState.currentStyles.concat([style]);
            }
            else {
                newEditorState.currentStyles = newEditorState.currentStyles.filter(st => st !== style);
            }
            return newEditorState;
        }
        static fromJSON(json) {
            return new EditorState({
                list: rawToFlat.default(json)
            });
        }
        static fromText(text) {
            return new EditorState({
                list: textToFlat_1.default(text)
            });
        }
    }
    exports.default = EditorState;
    //# sourceMappingURL=EditorState.js.map
    });

    unwrapExports(EditorState_1);

    var EditorState = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.default = EditorState_1.default;
    //# sourceMappingURL=index.js.map
    });

    unwrapExports(EditorState);

    var getBlockOffset_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getBlockOffset(list, key) {
        for (let i = 0; i < list.value.length; i++) {
            const val = list.value[i];
            if (val.type === 'block-start' && val.blockKey === key) {
                return i;
            }
        }
        return null;
    }
    exports.default = getBlockOffset;
    //# sourceMappingURL=getBlockOffset.js.map
    });

    unwrapExports(getBlockOffset_1);

    var getDomSelection = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    const getFragmentNode = (el) => {
        if (el == null) {
            return null;
        }
        if (el.dataset && el.dataset.blockKey != null && el.dataset.fragmentStart != null) {
            const _el = el;
            return _el;
        }
        else if (el.parentElement) {
            return getFragmentNode(el.parentElement);
        }
        return null;
    };
    exports.default = (listState) => {
        const domSelection = window.getSelection();
        if (domSelection == null || domSelection.anchorNode == null) {
            return null;
        }
        let { anchorOffset, focusOffset } = domSelection;
        const _anchorNode = domSelection.anchorNode;
        const _focusNode = domSelection.focusNode;
        const anchorNode = getFragmentNode(_anchorNode);
        const focusNode = getFragmentNode(_focusNode);
        if (anchorNode == null || focusNode == null) {
            return null;
        }
        const anchorKey = anchorNode.dataset.blockKey;
        const focusKey = focusNode.dataset.blockKey;
        const anchorFragmentOffset = parseInt(anchorNode.dataset.fragmentStart);
        const focusFragmentOffset = parseInt(focusNode.dataset.fragmentStart);
        anchorOffset += (getBlockOffset_1.default(listState, anchorKey) || 0) + anchorFragmentOffset;
        focusOffset += (getBlockOffset_1.default(listState, focusKey) || 0) + focusFragmentOffset;
        const [start, end] = [anchorOffset, focusOffset].sort((a, b) => a - b);
        return {
            start,
            end,
            anchorOffset,
            focusOffset,
        };
    };
    //# sourceMappingURL=getDomSelection.js.map
    });

    unwrapExports(getDomSelection);

    var onKeyDown = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    const actionKeys = ['Backspace', 'Delete', 'Meta', 'Alt', 'Enter', 'Control', 'Shift', 'Tab', 'Escape', 'CapsLock'];
    const isCharacterInsert = (e) => !e.altKey &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.key.includes('Arrow') &&
        !actionKeys.includes(e.key);
    const isMoveFocus = (e) => e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key);
    const isSelectAll = (e) => e.metaKey && e.key.toLowerCase() === 'a';
    const isUndo = (e) => !e.shiftKey && e.metaKey && e.key === 'z';
    const isRedo = (e) => e.shiftKey && e.metaKey && e.key === 'z';
    function handleKeyDown(editorState, event) {
        let newEditorState;
        let position = getDomSelection.default(editorState.list);
        if (position === null) {
            console.warn('cant get start and end selection, resume with current state');
            position = {
                start: editorState.start,
                end: editorState.end,
                anchorOffset: editorState.anchorOffset,
                focusOffset: editorState.focusOffset
            };
        }
        const { start, end } = position;
        const isCollapsed = start === end;
        if (isUndo(event)) {
            newEditorState = commands.undo(editorState);
        }
        else if (isMoveFocus(event)) {
            if (event.key === 'ArrowLeft' && event.metaKey) ;
            else if (event.key === 'ArrowLeft' && event.altKey) ;
            else if (event.key === 'ArrowLeft') {
                newEditorState = commands.moveFocusBack(editorState);
            }
            else if (event.key === 'ArrowRight' && event.metaKey) ;
            else if (event.key === 'ArrowRight' && event.altKey) ;
            else if (event.key === 'ArrowRight') {
                newEditorState = commands.moveFocusForward(editorState);
            }
        }
        else if (isSelectAll(event)) {
            newEditorState = commands.updateSelection(editorState, {
                start: 0,
                end: editorState.list.value.length - 2,
                anchorOffset: 0,
                focusOffset: editorState.list.value.length - 2
            });
        }
        else if (isRedo(event)) {
            newEditorState = commands.redo(editorState);
        }
        else if (isCollapsed && event.key === 'Backspace' && event.metaKey === true) {
            newEditorState = commands.backspaceToBlockStart(editorState, start, end);
        }
        else if (isCollapsed && event.key === 'Backspace' && event.altKey === true) {
            newEditorState = commands.backspaceToPrevWord(editorState, start, end);
        }
        else if (event.key === 'Backspace' && isCollapsed) {
            newEditorState = commands.backspace(editorState, start, end);
        }
        else if (event.key === 'Backspace' && !isCollapsed) {
            newEditorState = commands.removeRange(editorState, start, end);
        }
        else if (event.key === 'Enter') {
            newEditorState = commands.splitBlock(editorState, start, end);
        }
        else if (event.key === 'Delete' && isCollapsed) {
            newEditorState = commands.deleteForward(editorState, start, end);
        }
        else if (event.key === 'Delete' && !isCollapsed) {
            newEditorState = commands.removeRange(editorState, start, end);
        }
        else if (isCharacterInsert(event)) {
            newEditorState = commands.insertCharacter(editorState, start, end, event.key);
        }
        return newEditorState;
    }
    exports.default = handleKeyDown;
    //# sourceMappingURL=onKeyDown.js.map
    });

    unwrapExports(onKeyDown);

    var valueFromText_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    const valueFromText = (text) => {
        return rawToFlat.default({
            text: `[${text.replace(/\n/gi, '][')}]`,
            ranges: [],
            entityMap: {}
        }).value.slice(1, -1);
    };
    exports.default = valueFromText;
    //# sourceMappingURL=valueFromText.js.map
    });

    unwrapExports(valueFromText_1);

    var onPaste_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function onPaste(editorState, event) {
        const position = getDomSelection.default(editorState.list);
        if (position === null) {
            console.warn('cant get start and end selection');
            return editorState;
        }
        event.preventDefault();
        const { start, end } = position;
        if (event.clipboardData == null) {
            return editorState;
        }
        const text = event.clipboardData.getData('text');
        const value = valueFromText_1.default(text);
        const changed = editorState.change({
            start,
            end,
            value,
        }).change({
            start: start + value.length,
            end: start + value.length,
            value: []
        });
        return changed;
    }
    exports.default = onPaste;
    //# sourceMappingURL=onPaste.js.map
    });

    unwrapExports(onPaste_1);

    var createTextFragments_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function hasEqualCharacterData(left = { styles: [] }, right = { styles: [] }) {
        return left != null && right != null && right.entity === left.entity &&
            Array.from(left.styles || []).sort().join('') === Array.from(right.styles || []).sort().join('');
    }
    function createTextFragments(block, entityMap = {}) {
        const start = [];
        return block.value.reduce((acc, data, index) => {
            if (acc.length < 1) {
                return [{
                        styles: data.styles,
                        entity: data.entity,
                        offset: index,
                        text: block.value[index].char
                    }];
            }
            else {
                const lastFragment = acc[acc.length - 1];
                if (hasEqualCharacterData(lastFragment, data)) {
                    return acc.slice(0, -1).concat([Object.assign({}, lastFragment, { text: lastFragment.text + block.value[index].char })]);
                }
                else {
                    return [
                        ...acc,
                        {
                            styles: data.styles,
                            entity: data.entity,
                            offset: index,
                            text: block.value[index].char
                        }
                    ];
                }
            }
        }, start).map((fragment) => (Object.assign({}, fragment, { entity: fragment.entity != null ? entityMap[fragment.entity] : null })));
    }
    exports.default = createTextFragments;
    //# sourceMappingURL=createTextFragments.js.map
    });

    unwrapExports(createTextFragments_1);

    var getBlocksForRange_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function getBlocksForRange(value, start, end) {
        const blocks = [getBlockForIndex_1.default(value, start)];
        return value.slice(start, end).reduce((acc, ch, index) => {
            if (ch.type === 'block-start') {
                return acc.concat({
                    blockOffset: start + index,
                    block: ch
                });
            }
            return acc;
        }, blocks);
    }
    exports.default = getBlocksForRange;
    //# sourceMappingURL=getBlocksForRange.js.map
    });

    unwrapExports(getBlocksForRange_1);

    var textToListIndex_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function textToListIndex(value, textIndex) {
        let offset = 0;
        for (let i = 0; i < value.length; i++) {
            const ch = value[i];
            if (textIndex === offset && ch.type == null) {
                return i;
            }
            else if (ch.type == null) {
                offset++;
            }
        }
        return offset;
    }
    exports.default = textToListIndex;
    //# sourceMappingURL=textToListIndex.js.map
    });

    unwrapExports(textToListIndex_1);

    var setDomSelection_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    const findRangeTarget = (el) => {
        if (el == null) {
            return null;
        }
        else if (['#text', 'BR'].includes(el.nodeName)) {
            return el;
        }
        else if (el.childNodes) {
            const childNodes = Array.from(el.childNodes);
            for (let i = 0; i <= childNodes.length; i++) {
                let child = findRangeTarget(childNodes[i]);
                if (child != null) {
                    return child;
                }
            }
        }
        return null;
    };
    function setDomSelection(editorState, containerNode) {
        const { list } = editorState;
        const { block: focusBlock, blockOffset: focusBlockOffset, } = getBlockForIndex_1.default(list.value, editorState.focusOffset);
        const { block: anchorBlock, blockOffset: anchorBlockOffset, } = getBlockForIndex_1.default(list.value, editorState.anchorOffset);
        if (focusBlock == null || anchorBlock == null) {
            return;
            console.warn('cannot select current start and end position');
        }
        const anchorNodes = containerNode.querySelectorAll(`[data-block-key="${anchorBlock.blockKey}"]`);
        const focusNodes = containerNode.querySelectorAll(`[data-block-key="${focusBlock.blockKey}"]`);
        const anchorOffset = editorState.anchorOffset - anchorBlockOffset;
        const focusOffset = editorState.focusOffset - focusBlockOffset;
        const anchorFragment = Array.from(anchorNodes).find((node) => {
            return parseInt(node.dataset.fragmentStart) <= anchorOffset &&
                parseInt(node.dataset.fragmentEnd) >= anchorOffset;
        });
        if (anchorFragment == null) {
            return;
        }
        const anchorFragmentOffset = parseInt(anchorFragment.dataset.fragmentStart);
        const focusFragment = Array.from(focusNodes).find((node) => {
            return parseInt(node.dataset.fragmentStart) <= focusOffset &&
                parseInt(node.dataset.fragmentEnd) >= focusOffset;
        });
        const focusFragmentOffset = parseInt(focusFragment.dataset.fragmentStart);
        const anchorNode = findRangeTarget(anchorFragment);
        const focusNode = findRangeTarget(focusFragment);
        const newSelection = window.getSelection();
        if (newSelection != null && anchorNode != null && focusNode != null) {
            newSelection.setBaseAndExtent(anchorNode, anchorOffset - anchorFragmentOffset, focusNode, focusOffset - focusFragmentOffset);
        }
    }
    exports.default = setDomSelection;
    //# sourceMappingURL=setDomSelection.js.map
    });

    unwrapExports(setDomSelection_1);

    var getBlockNumber_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getBlockNumber(value, blockKey) {
        for (let i = 0; i <= value.length; i++) {
            const val = value[i];
            if (val.type === 'block-start' && val.blockKey === blockKey) {
                return i;
            }
            i++;
        }
    }
    exports.default = getBlockNumber;
    //# sourceMappingURL=getBlockNumber.js.map
    });

    unwrapExports(getBlockNumber_1);

    var onInput_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function onInput(editorState, _event) {
        const event = _event;
        const position = getDomSelection.default(editorState.list);
        if (position === null) {
            console.warn('cant get start and end selection');
            return editorState;
        }
        event.preventDefault();
        const { start, end } = position;
        if (event.inputType !== 'insertText' || event.data == null) {
            return editorState;
        }
        const text = event.data;
        const changed = editorState.change({
            start: start - 2,
            end: start,
            value: valueFromText_1.default(text),
        }).change({
            start: +1,
            end: start + 1,
            value: []
        });
        return changed;
    }
    exports.default = onInput;
    //# sourceMappingURL=onInput.js.map
    });

    unwrapExports(onInput_1);

    var onCut_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function onCut(editorState, event) {
        event.preventDefault();
        document.execCommand('copy');
        return commands.removeRange(editorState, editorState.start, editorState.end);
    }
    exports.default = onCut;
    //# sourceMappingURL=onCut.js.map
    });

    unwrapExports(onCut_1);

    var onSelectionChange_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function onSelectionChange(editorState) {
        const result = getDomSelection.default(editorState.list);
        if (result != null) {
            return commands.updateSelection(editorState, result);
        }
    }
    exports.default = onSelectionChange;
    //# sourceMappingURL=onSelectionChange.js.map
    });

    unwrapExports(onSelectionChange_1);

    var dist = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.findAfter = findAfter_1.default;

    exports.findBefore = findBefore_1.default;

    exports.getIndexAfter = getIndexAfter_1.default;

    exports.getIndexBefore = getIndexBefore_1.default;

    exports.EditorState = EditorState.default;

    exports.getNextCharacterIndex = getNextCharacterIndex_1.default;

    exports.getPreviousCharacterIndex = getPreviousCharacterIndex.default;

    exports.change = change_1.default;

    exports.onKeyDown = onKeyDown.default;

    exports.onPaste = onPaste_1.default;

    exports.createTextFragments = createTextFragments_1.default;

    exports.rawToFlat = rawToFlat.default;

    exports.getBlocksForRange = getBlocksForRange_1.default;

    exports.textToFlat = textToFlat_1.default;

    exports.textToListIndex = textToListIndex_1.default;

    exports.getDomSelection = getDomSelection.default;

    exports.setDomSelection = setDomSelection_1.default;

    exports.valueFromText = valueFromText_1.default;

    exports.getBlockNumber = getBlockNumber_1.default;

    exports.getBlockOffset = getBlockOffset_1.default;

    exports.onInput = onInput_1.default;

    exports.onCut = onCut_1.default;

    exports.onSelectionChange = onSelectionChange_1.default;

    exports.flatToTree = flatToTree.default;
    //# sourceMappingURL=index.js.map
    });

    unwrapExports(dist);
    var dist_1 = dist.findAfter;
    var dist_2 = dist.findBefore;
    var dist_3 = dist.getIndexAfter;
    var dist_4 = dist.getIndexBefore;
    var dist_5 = dist.EditorState;
    var dist_6 = dist.getNextCharacterIndex;
    var dist_7 = dist.getPreviousCharacterIndex;
    var dist_8 = dist.change;
    var dist_9 = dist.onKeyDown;
    var dist_10 = dist.onPaste;
    var dist_11 = dist.createTextFragments;
    var dist_12 = dist.rawToFlat;
    var dist_13 = dist.getBlocksForRange;
    var dist_14 = dist.textToFlat;
    var dist_15 = dist.textToListIndex;
    var dist_16 = dist.getDomSelection;
    var dist_17 = dist.setDomSelection;
    var dist_18 = dist.valueFromText;
    var dist_19 = dist.getBlockNumber;
    var dist_20 = dist.getBlockOffset;
    var dist_21 = dist.onInput;
    var dist_22 = dist.onCut;
    var dist_23 = dist.onSelectionChange;
    var dist_24 = dist.flatToTree;

    const text$1 = `[One Line][And another line of text][And another line]`;
    const initialEditorState = dist_5.fromJSON({
      text: text$1,
      ranges: [],
      entityMap: {}
    });

    var app = new App({
      target: document.body,
      props: {
        editorState: initialEditorState
      }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
