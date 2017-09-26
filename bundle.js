/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/** JSX/hyperscript reviver
*	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

/** Copy own-properties from `props` onto `obj`.
 *	@returns obj
 *	@private
 */
function extend(obj, props) {
	for (var i in props) {
		obj[i] = props[i];
	}return obj;
}

/** Call a function asynchronously, as soon as possible.
 *	@param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
	return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

// DOM properties that should NOT have "px" added when numeric
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */
function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

/** Check if an Element has a given normalized name.
*	@param {Element} node
*	@param {String} nodeName
 */
function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) old(null);
		if (value) value(node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) flushMounts();
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if (component.__ref = props.ref) delete props.ref;
	if (component.__key = props.key) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) flushMounts();
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) component.__ref(null);
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) this.prevState = extend({}, s);
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		enqueueRender(this);
	},

	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		renderComponent(this, 2);
	},

	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
	return diff(merge, vnode, {}, false, parent, false);
}

var preact = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};

exports.h = h;
exports.createElement = h;
exports.cloneElement = cloneElement;
exports.Component = Component;
exports.render = render;
exports.rerender = rerender;
exports.options = options;
exports.default = preact;
//# sourceMappingURL=preact.esm.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _preact = __webpack_require__(0);

var _src = __webpack_require__(2);

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _preact.render)((0, _preact.h)(_src2.default, null), document.getElementById('root'));

__webpack_require__(10);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _preact = __webpack_require__(0);

var _index = __webpack_require__(3);

const Theme = {
	light: {
		name: 'light',
		icons: ''
	},
	dark: {
		name: 'dark',
		icons: '-light'
	}
};

class App extends _preact.Component {
	constructor(props) {
		super(props);

		this.state = {
			theme: {
				name: localStorage.themeName || Theme.light.name,
				icons: localStorage.themeIcons || Theme.light.icons
				// theme: localStorage.themeName || Theme.light
			} };
	}

	toggleTheme() {
		let newTheme = this.state.theme == Theme.light ? Theme.dark : Theme.light;
		this.setState({ theme: newTheme });
		localStorage.setItem('themeName', Theme[newTheme.name].name);
		localStorage.setItem('themeIcons', Theme[newTheme.name].icons);
	}

	render(props, { theme }) {
		return (0, _preact.h)(
			'main',
			{ role: 'application' },
			(0, _preact.h)(
				_index.Menu,
				{ tag: 'nav' },
				(0, _preact.h)(
					'h2',
					null,
					'juandc.co'
				),
				(0, _preact.h)(
					'ul',
					null,
					(0, _preact.h)(
						'span',
						{ onClick: this.toggleTheme.bind(this) },
						'theme: ',
						this.state.theme.name
					)
				)
			),
			(0, _preact.h)(
				_index.Content,
				{ theme: theme.name },
				(0, _preact.h)(
					'div',
					{ 'class': 'above' },
					(0, _preact.h)(
						'h1',
						null,
						'Juan David Castro'
					),
					(0, _preact.h)(
						'h2',
						null,
						'Frontend Developer at ',
						(0, _preact.h)(
							'strong',
							null,
							(0, _preact.h)(
								'a',
								{ href: 'https://blackome.co', target: '_blank' },
								'Blackome'
							)
						),
						(0, _preact.h)('br', null),
						' and ',
						(0, _preact.h)(
							'strong',
							null,
							(0, _preact.h)(
								'a',
								{ href: 'https://softy365.com', target: '_blank' },
								'Softy365'
							)
						)
					),
					(0, _preact.h)(
						'div',
						{ 'class': 'icons' },
						(0, _preact.h)(
							'a',
							{ href: 'https://medium.com/@fjuandc', target: '_blank' },
							(0, _preact.h)('img', { src: `./icons/medium${theme.icons}.svg`, alt: 'medium' })
						),
						(0, _preact.h)(
							'a',
							{ href: 'https://www.youtube.com/channel/UCQpaaApq0J_OT12xUxMrnkQ', target: '_blank' },
							(0, _preact.h)('img', { src: `./icons/youtube${theme.icons}.svg`, alt: 'youtube' })
						),
						(0, _preact.h)(
							'a',
							{ href: 'https://twitter.com/fjuandc', target: '_blank' },
							(0, _preact.h)('img', { src: `./icons/twitter${theme.icons}.svg`, alt: 'twitter' })
						),
						(0, _preact.h)(
							'a',
							{ href: 'https://github.com/juandc', target: '_blank' },
							(0, _preact.h)('img', { src: `./icons/github${theme.icons}.svg`, alt: 'github' })
						)
					)
				)
			)
		);
	}
}

exports.default = App; // export default function App () {
// 	return (
// 		<main role="application">
// 			<Menu tag="nav">
// 				<h2>juandc.co</h2>
// 				<ul>
// 					<span>Light</span>
// 				</ul>
// 			</Menu>
// 			<Content>
// 				<div class="above">
// 					<h1>Juan David Castro</h1>
// 					<h2>Frontend Developer at <strong>Blackome</strong>
// 					<br/> and <strong>Softy365</strong></h2>
// 					<div class="icons">
// 						<img src="/icons/medium.svg" alt="medium" />
// 						<img src="/icons/youtube.svg" alt="twitter" />
// 						<img src="/icons/twitter.svg" alt="twitter" />
// 						<img src="/icons/github.svg" alt="twitter" />
// 					</div>
// 				</div>
// 			</Content>
// 			{/*<Footer>Footer</Footer>*/}
// 		</main>
// 	)
// }

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/decss-loader/preact.js!../node_modules/css-loader/index.js??ref--1-2!./index.css", function() {
			var newContent = require("!!../node_modules/decss-loader/preact.js!../node_modules/css-loader/index.js??ref--1-2!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, ".Menu-2Rn-3,\n.Content-3Vz9V,\n.Footer-2FF4P {\n\talign-items: center;\n\tdisplay: flex;\n\tjustify-content: center;\n}\n\n/* Top bar */\n.Menu-2Rn-3 {\n\tbackground-color: #000;\n\tbox-shadow: 0 0 7px 0 rgba(109, 113, 117, .5);\n\tcolor: #fff;\n\tjustify-content: space-between;\n\theight: 50px;\n\tpadding: 0 10px;\n\tposition: fixed;\n\tleft: 0;\n\tright: 0;\n\ttop: 0;\n}\n.Menu-2Rn-3 h2 { font-family: Rokkitt; font-size: 1.1em; }\n.Menu-2Rn-3 span { cursor: pointer; }\n.Menu-2Rn-3 span:hover { color: #93e473; text-decoration: underline; }\n\n\n\n/* Above */\n.Content-3Vz9V {\n\tpadding: 50px 10px;\n\theight: 100vh;\n\tflex-wrap: wrap;\n}\n.Content-3Vz9V,\n.Content-theme-light-OSsY9 {\n\tbackground-color: #FFF;\n\tcolor: #000;\n}\n.Content-theme-dark-2sd0P {\n\tbackground-color: #000;\n\tcolor: #FFF;\n}\n\n.Content-3Vz9V h1,\n.Content-3Vz9V h2 {\n\tfont-weight: 200;\n\tpadding: 0;\n\tline-height: 1.5;\n\tmargin: 0;\n\ttransition: .1s;\n}\n.Content-3Vz9V strong { border-bottom: 1px solid transparent; cursor: pointer; }\n.Content-theme-light-OSsY9 strong:hover { border-bottom-color: #000; }\n.Content-theme-dark-2sd0P strong:hover { border-bottom-color: #FFF; }\n.Content-3Vz9V a { color: inherit; text-decoration: none; }\n.Content-3Vz9V div[class=icons] {\n\talign-items: center;\n\tdisplay: flex;\n\tjustify-content: space-around;\n\tmargin: 25px 12.5px;\n}\n.Content-3Vz9V img {\n\tcursor: pointer;\n\theight: 25px;\n\twidth: 25px;\n\ttransform: none;\n}\n.Content-3Vz9V img:hover { animation: reel-1NUC6 .6s linear; animation-fill-mode: forwards; }\n\n\n\n/* Footer */\n.Footer-2FF4P {\n\tbackground-color: #fff;\n\tbox-shadow: 0 0 3px 0 rgba(109, 113, 117, .3);\n\theight: 50px;\n\tpadding: 10px;\n\tposition: fixed;\n\tleft: 0;\n\tbottom: 0;\n\tright: 0;\n}\n\n@keyframes reel-1NUC6 {\n\tfrom { transform: scale(1) rotate(0); }\n\t25% { transform: scale(1.5) rotate(3deg); }\n\t37% { transform: scale(1.5) rotate(-3deg); }\n\t50% { transform: scale(1) rotate(6deg); }\n\t75% { transform: scale(1) rotate(-6deg); }\n\t90% { transform: scale(1) rotate(3deg); }\n\tto { transform: scale(1.2) rotate(-3deg); }\n}\n\n\n@media screen and (min-width: 768px) {\n\t.Content-3Vz9V div[class=above] { font-size: 22px; }\n}\n", ""]);

// exports
exports.locals = {
	"Menu": "Menu-2Rn-3",
	"Content": "Content-3Vz9V",
	"Footer": "Footer-2FF4P",
	"Content-theme-light": "Content-theme-light-OSsY9",
	"Content-theme-dark": "Content-theme-dark-2sd0P",
	"reel": "reel-1NUC6"
};
var decss = __webpack_require__(6)
var classNames = exports.locals || {}
exports.locals = decss(classNames)
exports.locals.classNames = classNames


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var decss = __webpack_require__(7);
var h = __webpack_require__(0).h;

module.exports = decss.bind(null, h);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = decss;

/**
 * @name decss
 * @summary Generate components using passed CSS modules object.
 *
 * @description
 * The function generates components using passed CSS modules object.
 * It's optionally accepting default props object that allows binding
 * individual props values.
 *
 * @param {Function} h
 * The helper function (e.g. `React.createElement` or Preact's `h`).
 *
 * @param {Object} style
 * The CSS modules object with original (local) class names as keys
 * and unique names as values.
 *
 * @param {Object} [defaultProps]
 * The object with the default props.
 *
 * @returns {Object}
 * The object with component names as keys and components as values.
 *
 * @example
 * import { createElement } from 'react'
 * import style from './style.css'
 * import decss from 'decss'

 * // Basic usage
 * const { Button, Icon } = decss(createElement, style)
 * <Button tag='button' type='button'>
 *   <Icon type='close' />
 *   Close
 * </Button>

 * // Usage with default props
 * const { Button, Icon } = decss(createElement, style, {
 *   Button: {tag: 'button', type: 'button'},
 *   Icon: {type: 'close'}
 * })
 * <Button><Icon />Close</Button>
 */
function decss(h, style, defaultProps) {
  defaultProps = defaultProps || {};
  var components = getComponents(style);

  return Object.keys(components).reduce(function (acc, componentName) {
    acc[componentName] = createComponent(h, components[componentName], componentName, defaultProps[componentName] || {});
    return acc;
  }, {});
}

function createComponent(h, componentObj, componentName, defaultProps) {
  var component = function (props) {
    var tag = props.tag || defaultProps.tag || 'div';
    var className = getClassName(componentObj.class, componentObj.modifiers, Object.assign({}, props, defaultProps));
    var tagProps = without(props, ['tag', 'children'].concat(Object.keys(componentObj.modifiers)));
    var compoundProps = Object.assign({ className: className }, tagProps);
    var helperArgs = [tag, compoundProps].concat(props && props.children || []);
    return h.apply(null, helperArgs);
  };
  component.displayName = componentName;
  return component;
}

function getComponents(style) {
  var classes = Object.keys(style);
  return classes.reduce(function (acc, className) {
    var isModifier = className.includes('-');
    if (isModifier) {
      var classNameCaptures = className.match(/([^-]+)-(.+)/);
      var componentClass = classNameCaptures[1];
      var modifierPart = classNameCaptures[2];
      var isEnum = modifierPart.includes('-');

      ensureComponentMap(componentClass);
      var modifiers = acc[componentClass].modifiers;

      if (isEnum) {
        var modifierCaptures = modifierPart.match(/^(.+)-(.+)$/);
        var propName = modifierCaptures[1];
        var element = modifierCaptures[2];
        var modifier = modifiers[propName] = modifiers[propName] || {
          type: 'enum',
          elements: {}
        };

        modifier.elements[element] = style[className];
      } else {
        // is bool
        var propName = modifierPart;
        modifiers[propName] = {
          type: 'bool',
          class: style[className]
        };
      }
    } else {
      ensureComponentMap(className);
    }

    function ensureComponentMap(className) {
      acc[className] = acc[className] || {
        class: style[className],
        modifiers: {}
      };
    }

    return acc;
  }, {});
}

function getClassName(componentClass, modifiers, props) {
  var modifierNames = Object.keys(modifiers);
  var modifierClasses = modifierNames.reduce(function (acc, modifierName) {
    var modifier = modifiers[modifierName];
    var propValue = props[modifierName];
    return acc.concat(findModifierClassName(modifier, propValue) || []);
  }, []);
  return classesToString([componentClass].concat(modifierClasses));
}

function findModifierClassName(modifier, propValue) {
  if (modifier) {
    switch (modifier.type) {
      case 'bool':
        if (propValue) {
          return modifier.class;
        }
        break;
      case 'enum':
        return modifier.elements[propValue];
    }
  }
}

function classesToString(classes) {
  return classes.filter(function (c) {
    return c;
  }).sort().join(' ');
}

function without(obj, excludeKeys) {
  return Object.keys(obj).reduce(function (acc, currentKey) {
    if (!excludeKeys.includes(currentKey)) {
      acc[currentKey] = obj[currentKey];
    }
    return acc;
  }, {});
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(9);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function (global, factory) {
	 true ? factory(__webpack_require__(0)) : typeof define === 'function' && define.amd ? define(['preact'], factory) : factory(global.preact);
})(undefined, function (preact) {
	'use strict';

	// render modes


	var ATTR_KEY = '__preactattr_';

	// DOM properties that should NOT have "px" added when numeric

	/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */

	// Internal helpers from preact
	/**
  * Return a ReactElement-compatible object for the current state of a preact
  * component.
  */
	function createReactElement(component) {
		return {
			type: component.constructor,
			key: component.key,
			ref: null, // Unsupported
			props: component.props
		};
	}

	/**
  * Create a ReactDOMComponent-compatible object for a given DOM node rendered
  * by preact.
  *
  * This implements the subset of the ReactDOMComponent interface that
  * React DevTools requires in order to display DOM nodes in the inspector with
  * the correct type and properties.
  *
  * @param {Node} node
  */
	function createReactDOMComponent(node) {
		var childNodes = node.nodeType === Node.ELEMENT_NODE ? Array.from(node.childNodes) : [];

		var isText = node.nodeType === Node.TEXT_NODE;

		return {
			// --- ReactDOMComponent interface
			_currentElement: isText ? node.textContent : {
				type: node.nodeName.toLowerCase(),
				props: node[ATTR_KEY]
			},
			_renderedChildren: childNodes.map(function (child) {
				if (child._component) {
					return updateReactComponent(child._component);
				}
				return updateReactComponent(child);
			}),
			_stringText: isText ? node.textContent : null,

			// --- Additional properties used by preact devtools

			// A flag indicating whether the devtools have been notified about the
			// existence of this component instance yet.
			// This is used to send the appropriate notifications when DOM components
			// are added or updated between composite component updates.
			_inDevTools: false,
			node: node
		};
	}

	/**
  * Return the name of a component created by a `ReactElement`-like object.
  *
  * @param {ReactElement} element
  */
	function typeName(element) {
		if (typeof element.type === 'function') {
			return element.type.displayName || element.type.name;
		}
		return element.type;
	}

	/**
  * Return a ReactCompositeComponent-compatible object for a given preact
  * component instance.
  *
  * This implements the subset of the ReactCompositeComponent interface that
  * the DevTools requires in order to walk the component tree and inspect the
  * component's properties.
  *
  * See https://github.com/facebook/react-devtools/blob/e31ec5825342eda570acfc9bcb43a44258fceb28/backend/getData.js
  */
	function createReactCompositeComponent(component) {
		var _currentElement = createReactElement(component);
		var node = component.base;

		var instance = {
			// --- ReactDOMComponent properties
			getName: function getName() {
				return typeName(_currentElement);
			},

			_currentElement: createReactElement(component),
			props: component.props,
			state: component.state,
			forceUpdate: component.forceUpdate && component.forceUpdate.bind(component),
			setState: component.setState && component.setState.bind(component),

			// --- Additional properties used by preact devtools
			node: node
		};

		// React DevTools exposes the `_instance` field of the selected item in the
		// component tree as `$r` in the console.  `_instance` must refer to a
		// React Component (or compatible) class instance with `props` and `state`
		// fields and `setState()`, `forceUpdate()` methods.
		instance._instance = component;

		// If the root node returned by this component instance's render function
		// was itself a composite component, there will be a `_component` property
		// containing the child component instance.
		if (component._component) {
			instance._renderedComponent = updateReactComponent(component._component);
		} else {
			// Otherwise, if the render() function returned an HTML/SVG element,
			// create a ReactDOMComponent-like object for the DOM node itself.
			instance._renderedComponent = updateReactComponent(node);
		}

		return instance;
	}

	/**
  * Map of Component|Node to ReactDOMComponent|ReactCompositeComponent-like
  * object.
  *
  * The same React*Component instance must be used when notifying devtools
  * about the initial mount of a component and subsequent updates.
  */
	var instanceMap = typeof Map === 'function' && new Map();

	/**
  * Update (and create if necessary) the ReactDOMComponent|ReactCompositeComponent-like
  * instance for a given preact component instance or DOM Node.
  *
  * @param {Component|Node} componentOrNode
  */
	function updateReactComponent(componentOrNode) {
		var newInstance = componentOrNode instanceof Node ? createReactDOMComponent(componentOrNode) : createReactCompositeComponent(componentOrNode);
		if (instanceMap.has(componentOrNode)) {
			var inst = instanceMap.get(componentOrNode);
			Object.assign(inst, newInstance);
			return inst;
		}
		instanceMap.set(componentOrNode, newInstance);
		return newInstance;
	}

	function nextRootKey(roots) {
		return '.' + Object.keys(roots).length;
	}

	/**
  * Find all root component instances rendered by preact in `node`'s children
  * and add them to the `roots` map.
  *
  * @param {DOMElement} node
  * @param {[key: string] => ReactDOMComponent|ReactCompositeComponent}
  */
	function findRoots(node, roots) {
		Array.from(node.childNodes).forEach(function (child) {
			if (child._component) {
				roots[nextRootKey(roots)] = updateReactComponent(child._component);
			} else {
				findRoots(child, roots);
			}
		});
	}

	/**
  * Create a bridge for exposing preact's component tree to React DevTools.
  *
  * It creates implementations of the interfaces that ReactDOM passes to
  * devtools to enable it to query the component tree and hook into component
  * updates.
  *
  * See https://github.com/facebook/react/blob/59ff7749eda0cd858d5ee568315bcba1be75a1ca/src/renderers/dom/ReactDOM.js
  * for how ReactDOM exports its internals for use by the devtools and
  * the `attachRenderer()` function in
  * https://github.com/facebook/react-devtools/blob/e31ec5825342eda570acfc9bcb43a44258fceb28/backend/attachRenderer.js
  * for how the devtools consumes the resulting objects.
  */
	function createDevToolsBridge() {
		// The devtools has different paths for interacting with the renderers from
		// React Native, legacy React DOM and current React DOM.
		//
		// Here we emulate the interface for the current React DOM (v15+) lib.

		// ReactDOMComponentTree-like object
		var ComponentTree = {
			getNodeFromInstance: function getNodeFromInstance(instance) {
				return instance.node;
			},
			getClosestInstanceFromNode: function getClosestInstanceFromNode(node) {
				while (node && !node._component) {
					node = node.parentNode;
				}
				return node ? updateReactComponent(node._component) : null;
			}
		};

		// Map of root ID (the ID is unimportant) to component instance.
		var roots = {};
		findRoots(document.body, roots);

		// ReactMount-like object
		//
		// Used by devtools to discover the list of root component instances and get
		// notified when new root components are rendered.
		var Mount = {
			_instancesByReactRootID: roots,

			// Stub - React DevTools expects to find this method and replace it
			// with a wrapper in order to observe new root components being added
			_renderNewRootComponent: function _renderNewRootComponent() /* instance, ... */{}
		};

		// ReactReconciler-like object
		var Reconciler = {
			// Stubs - React DevTools expects to find these methods and replace them
			// with wrappers in order to observe components being mounted, updated and
			// unmounted
			mountComponent: function mountComponent() /* instance, ... */{},
			performUpdateIfNecessary: function performUpdateIfNecessary() /* instance, ... */{},
			receiveComponent: function receiveComponent() /* instance, ... */{},
			unmountComponent: function unmountComponent() /* instance, ... */{}
		};

		/** Notify devtools that a new component instance has been mounted into the DOM. */
		var componentAdded = function componentAdded(component) {
			var instance = updateReactComponent(component);
			if (isRootComponent(component)) {
				instance._rootID = nextRootKey(roots);
				roots[instance._rootID] = instance;
				Mount._renderNewRootComponent(instance);
			}
			visitNonCompositeChildren(instance, function (childInst) {
				childInst._inDevTools = true;
				Reconciler.mountComponent(childInst);
			});
			Reconciler.mountComponent(instance);
		};

		/** Notify devtools that a component has been updated with new props/state. */
		var componentUpdated = function componentUpdated(component) {
			var prevRenderedChildren = [];
			visitNonCompositeChildren(instanceMap.get(component), function (childInst) {
				prevRenderedChildren.push(childInst);
			});

			// Notify devtools about updates to this component and any non-composite
			// children
			var instance = updateReactComponent(component);
			Reconciler.receiveComponent(instance);
			visitNonCompositeChildren(instance, function (childInst) {
				if (!childInst._inDevTools) {
					// New DOM child component
					childInst._inDevTools = true;
					Reconciler.mountComponent(childInst);
				} else {
					// Updated DOM child component
					Reconciler.receiveComponent(childInst);
				}
			});

			// For any non-composite children that were removed by the latest render,
			// remove the corresponding ReactDOMComponent-like instances and notify
			// the devtools
			prevRenderedChildren.forEach(function (childInst) {
				if (!document.body.contains(childInst.node)) {
					instanceMap.delete(childInst.node);
					Reconciler.unmountComponent(childInst);
				}
			});
		};

		/** Notify devtools that a component has been unmounted from the DOM. */
		var componentRemoved = function componentRemoved(component) {
			var instance = updateReactComponent(component);
			visitNonCompositeChildren(function (childInst) {
				instanceMap.delete(childInst.node);
				Reconciler.unmountComponent(childInst);
			});
			Reconciler.unmountComponent(instance);
			instanceMap.delete(component);
			if (instance._rootID) {
				delete roots[instance._rootID];
			}
		};

		return {
			componentAdded: componentAdded,
			componentUpdated: componentUpdated,
			componentRemoved: componentRemoved,

			// Interfaces passed to devtools via __REACT_DEVTOOLS_GLOBAL_HOOK__.inject()
			ComponentTree: ComponentTree,
			Mount: Mount,
			Reconciler: Reconciler
		};
	}

	/**
  * Return `true` if a preact component is a top level component rendered by
  * `render()` into a container Element.
  */
	function isRootComponent(component) {
		// `_parentComponent` is actually `__u` after minification
		if (component._parentComponent || component.__u) {
			// Component with a composite parent
			return false;
		}
		if (component.base.parentElement && component.base.parentElement[ATTR_KEY]) {
			// Component with a parent DOM element rendered by Preact
			return false;
		}
		return true;
	}

	/**
  * Visit all child instances of a ReactCompositeComponent-like object that are
  * not composite components (ie. they represent DOM elements or text)
  *
  * @param {Component} component
  * @param {(Component) => void} visitor
  */
	function visitNonCompositeChildren(component, visitor) {
		if (component._renderedComponent) {
			if (!component._renderedComponent._component) {
				visitor(component._renderedComponent);
				visitNonCompositeChildren(component._renderedComponent, visitor);
			}
		} else if (component._renderedChildren) {
			component._renderedChildren.forEach(function (child) {
				visitor(child);
				if (!child._component) visitNonCompositeChildren(child, visitor);
			});
		}
	}

	/**
  * Create a bridge between the preact component tree and React's dev tools
  * and register it.
  *
  * After this function is called, the React Dev Tools should be able to detect
  * "React" on the page and show the component tree.
  *
  * This function hooks into preact VNode creation in order to expose functional
  * components correctly, so it should be called before the root component(s)
  * are rendered.
  *
  * Returns a cleanup function which unregisters the hooks.
  */
	function initDevTools() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
			// React DevTools are not installed
			return;
		}

		// Notify devtools when preact components are mounted, updated or unmounted
		var bridge = createDevToolsBridge();

		var nextAfterMount = preact.options.afterMount;
		preact.options.afterMount = function (component) {
			bridge.componentAdded(component);
			if (nextAfterMount) nextAfterMount(component);
		};

		var nextAfterUpdate = preact.options.afterUpdate;
		preact.options.afterUpdate = function (component) {
			bridge.componentUpdated(component);
			if (nextAfterUpdate) nextAfterUpdate(component);
		};

		var nextBeforeUnmount = preact.options.beforeUnmount;
		preact.options.beforeUnmount = function (component) {
			bridge.componentRemoved(component);
			if (nextBeforeUnmount) nextBeforeUnmount(component);
		};

		// Notify devtools about this instance of "React"
		__REACT_DEVTOOLS_GLOBAL_HOOK__.inject(bridge);

		return function () {
			preact.options.afterMount = nextAfterMount;
			preact.options.afterUpdate = nextAfterUpdate;
			preact.options.beforeUnmount = nextBeforeUnmount;
		};
	}

	initDevTools();
});
//# sourceMappingURL=devtools.js.map

/***/ })
/******/ ]);