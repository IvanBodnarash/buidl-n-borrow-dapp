import "./chunk-EQCVQC35.js";

// node_modules/@lit/reactive-element/development/css-tag.js
var NODE_MODE = false;
var global = globalThis;
var supportsAdoptingStyleSheets = global.ShadowRoot && (global.ShadyCSS === void 0 || global.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var constructionToken = Symbol();
var cssTagCache = /* @__PURE__ */ new WeakMap();
var CSSResult = class {
  constructor(cssText, strings, safeToken) {
    this["_$cssResult$"] = true;
    if (safeToken !== constructionToken) {
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    }
    this.cssText = cssText;
    this._strings = strings;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let styleSheet = this._styleSheet;
    const strings = this._strings;
    if (supportsAdoptingStyleSheets && styleSheet === void 0) {
      const cacheable = strings !== void 0 && strings.length === 1;
      if (cacheable) {
        styleSheet = cssTagCache.get(strings);
      }
      if (styleSheet === void 0) {
        (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
        if (cacheable) {
          cssTagCache.set(strings, styleSheet);
        }
      }
    }
    return styleSheet;
  }
  toString() {
    return this.cssText;
  }
};
var textFromCSSResult = (value) => {
  if (value["_$cssResult$"] === true) {
    return value.cssText;
  } else if (typeof value === "number") {
    return value;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`);
  }
};
var unsafeCSS = (value) => new CSSResult(typeof value === "string" ? value : String(value), void 0, constructionToken);
var css = (strings, ...values) => {
  const cssText = strings.length === 1 ? strings[0] : values.reduce((acc, v2, idx) => acc + textFromCSSResult(v2) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText, strings, constructionToken);
};
var adoptStyles = (renderRoot, styles) => {
  if (supportsAdoptingStyleSheets) {
    renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  } else {
    for (const s of styles) {
      const style = document.createElement("style");
      const nonce = global["litNonce"];
      if (nonce !== void 0) {
        style.setAttribute("nonce", nonce);
      }
      style.textContent = s.cssText;
      renderRoot.appendChild(style);
    }
  }
};
var cssResultFromStyleSheet = (sheet) => {
  let cssText = "";
  for (const rule of sheet.cssRules) {
    cssText += rule.cssText;
  }
  return unsafeCSS(cssText);
};
var getCompatibleStyle = supportsAdoptingStyleSheets || NODE_MODE && global.CSSStyleSheet === void 0 ? (s) => s : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;

// node_modules/@lit/reactive-element/development/reactive-element.js
var { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf } = Object;
var NODE_MODE2 = false;
var global2 = globalThis;
if (NODE_MODE2) {
  global2.customElements ?? (global2.customElements = customElements);
}
var DEV_MODE = true;
var issueWarning;
var trustedTypes = global2.trustedTypes;
var emptyStringForBooleanAttribute = trustedTypes ? trustedTypes.emptyScript : "";
var polyfillSupport = DEV_MODE ? global2.reactiveElementPolyfillSupportDevMode : global2.reactiveElementPolyfillSupport;
var _a;
if (DEV_MODE) {
  const issuedWarnings = global2.litIssuedWarnings ?? (global2.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
  issueWarning("dev-mode", `Lit is in dev mode. Not recommended for production!`);
  if (((_a = global2.ShadyDOM) == null ? void 0 : _a.inUse) && polyfillSupport === void 0) {
    issueWarning("polyfill-support-missing", `Shadow DOM is being polyfilled via \`ShadyDOM\` but the \`polyfill-support\` module has not been loaded.`);
  }
}
var debugLogEvent = DEV_MODE ? (event) => {
  const shouldEmit = global2.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global2.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var JSCompiler_renameProperty = (prop, _obj) => prop;
var defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        value = value ? emptyStringForBooleanAttribute : null;
        break;
      case Object:
      case Array:
        value = value == null ? value : JSON.stringify(value);
        break;
    }
    return value;
  },
  fromAttribute(value, type) {
    let fromValue = value;
    switch (type) {
      case Boolean:
        fromValue = value !== null;
        break;
      case Number:
        fromValue = value === null ? null : Number(value);
        break;
      case Object:
      case Array:
        try {
          fromValue = JSON.parse(value);
        } catch (e) {
          fromValue = null;
        }
        break;
    }
    return fromValue;
  }
};
var notEqual = (value, old) => !is(value, old);
var defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata"));
global2.litPropertyMetadata ?? (global2.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
var ReactiveElement = class extends HTMLElement {
  /**
   * Adds an initializer function to the class that is called during instance
   * construction.
   *
   * This is useful for code that runs against a `ReactiveElement`
   * subclass, such as a decorator, that needs to do work for each
   * instance, such as setting up a `ReactiveController`.
   *
   * ```ts
   * const myDecorator = (target: typeof ReactiveElement, key: string) => {
   *   target.addInitializer((instance: ReactiveElement) => {
   *     // This is run during construction of the element
   *     new MyController(instance);
   *   });
   * }
   * ```
   *
   * Decorating a field will then cause each instance to run an initializer
   * that adds a controller:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   @myDecorator foo;
   * }
   * ```
   *
   * Initializers are stored per-constructor. Adding an initializer to a
   * subclass does not add it to a superclass. Since initializers are run in
   * constructors, initializers will run in order of the class hierarchy,
   * starting with superclasses and progressing to the instance's class.
   *
   * @nocollapse
   */
  static addInitializer(initializer) {
    this.__prepare();
    (this._initializers ?? (this._initializers = [])).push(initializer);
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   * @category attributes
   */
  static get observedAttributes() {
    this.finalize();
    return this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()];
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a {@linkcode PropertyDeclaration} for the property with the
   * given options. The property setter calls the property's `hasChanged`
   * property option or uses a strict identity check to determine whether or not
   * to request an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * ```ts
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static createProperty(name, options = defaultPropertyDeclaration) {
    if (options.state) {
      options.attribute = false;
    }
    this.__prepare();
    this.elementProperties.set(name, options);
    if (!options.noAccessor) {
      const key = DEV_MODE ? (
        // Use Symbol.for in dev mode to make it easier to maintain state
        // when doing HMR.
        Symbol.for(`${String(name)} (@property() cache)`)
      ) : Symbol();
      const descriptor = this.getPropertyDescriptor(name, key, options);
      if (descriptor !== void 0) {
        defineProperty(this.prototype, name, descriptor);
      }
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   * ```ts
   * class MyElement extends LitElement {
   *   static getPropertyDescriptor(name, key, options) {
   *     const defaultDescriptor =
   *         super.getPropertyDescriptor(name, key, options);
   *     const setter = defaultDescriptor.set;
   *     return {
   *       get: defaultDescriptor.get,
   *       set(value) {
   *         setter.call(this, value);
   *         // custom action.
   *       },
   *       configurable: true,
   *       enumerable: true
   *     }
   *   }
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static getPropertyDescriptor(name, key, options) {
    const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
      get() {
        return this[key];
      },
      set(v2) {
        this[key] = v2;
      }
    };
    if (DEV_MODE && get == null) {
      if ("value" in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
        throw new Error(`Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
      }
      issueWarning("reactive-property-without-getter", `Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
    }
    return {
      get() {
        return get == null ? void 0 : get.call(this);
      },
      set(value) {
        const oldValue = get == null ? void 0 : get.call(this);
        set.call(this, value);
        this.requestUpdate(name, oldValue, options);
      },
      configurable: true,
      enumerable: true
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a `PropertyDeclaration` via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override
   * {@linkcode createProperty}.
   *
   * @nocollapse
   * @final
   * @category properties
   */
  static getPropertyOptions(name) {
    return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
  }
  /**
   * Initializes static own properties of the class used in bookkeeping
   * for element properties, initializers, etc.
   *
   * Can be called multiple times by code that needs to ensure these
   * properties exist before using them.
   *
   * This method ensures the superclass is finalized so that inherited
   * property metadata can be copied down.
   * @nocollapse
   */
  static __prepare() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("elementProperties", this))) {
      return;
    }
    const superCtor = getPrototypeOf(this);
    superCtor.finalize();
    if (superCtor._initializers !== void 0) {
      this._initializers = [...superCtor._initializers];
    }
    this.elementProperties = new Map(superCtor.elementProperties);
  }
  /**
   * Finishes setting up the class so that it's ready to be registered
   * as a custom element and instantiated.
   *
   * This method is called by the ReactiveElement.observedAttributes getter.
   * If you override the observedAttributes getter, you must either call
   * super.observedAttributes to trigger finalization, or call finalize()
   * yourself.
   *
   * @nocollapse
   */
  static finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("finalized", this))) {
      return;
    }
    this.finalized = true;
    this.__prepare();
    if (this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const props = this.properties;
      const propKeys = [
        ...getOwnPropertyNames(props),
        ...getOwnPropertySymbols(props)
      ];
      for (const p of propKeys) {
        this.createProperty(p, props[p]);
      }
    }
    const metadata = this[Symbol.metadata];
    if (metadata !== null) {
      const properties = litPropertyMetadata.get(metadata);
      if (properties !== void 0) {
        for (const [p, options] of properties) {
          this.elementProperties.set(p, options);
        }
      }
    }
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    for (const [p, options] of this.elementProperties) {
      const attr = this.__attributeNameForProperty(p, options);
      if (attr !== void 0) {
        this.__attributeToPropertyMap.set(attr, p);
      }
    }
    this.elementStyles = this.finalizeStyles(this.styles);
    if (DEV_MODE) {
      if (this.hasOwnProperty("createProperty")) {
        issueWarning("no-override-create-property", "Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");
      }
      if (this.hasOwnProperty("getPropertyDescriptor")) {
        issueWarning("no-override-get-property-descriptor", "Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators");
      }
    }
  }
  /**
   * Takes the styles the user supplied via the `static styles` property and
   * returns the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * Styles are deduplicated preserving the _last_ instance in the list. This
   * is a performance optimization to avoid duplicated styles that can occur
   * especially when composing via subclassing. The last item is kept to try
   * to preserve the cascade order with the assumption that it's most important
   * that last added styles override previous styles.
   *
   * @nocollapse
   * @category styles
   */
  static finalizeStyles(styles) {
    const elementStyles = [];
    if (Array.isArray(styles)) {
      const set = new Set(styles.flat(Infinity).reverse());
      for (const s of set) {
        elementStyles.unshift(getCompatibleStyle(s));
      }
    } else if (styles !== void 0) {
      elementStyles.push(getCompatibleStyle(styles));
    }
    return elementStyles;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? void 0 : typeof attribute === "string" ? attribute : typeof name === "string" ? name.toLowerCase() : void 0;
  }
  constructor() {
    super();
    this.__instanceProperties = void 0;
    this.isUpdatePending = false;
    this.hasUpdated = false;
    this.__reflectingProperty = null;
    this.__initialize();
  }
  /**
   * Internal only override point for customizing work done when elements
   * are constructed.
   */
  __initialize() {
    var _a4;
    this.__updatePromise = new Promise((res) => this.enableUpdating = res);
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.__saveInstanceProperties();
    this.requestUpdate();
    (_a4 = this.constructor._initializers) == null ? void 0 : _a4.forEach((i) => i(this));
  }
  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(controller) {
    var _a4;
    (this.__controllers ?? (this.__controllers = /* @__PURE__ */ new Set())).add(controller);
    if (this.renderRoot !== void 0 && this.isConnected) {
      (_a4 = controller.hostConnected) == null ? void 0 : _a4.call(controller);
    }
  }
  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(controller) {
    var _a4;
    (_a4 = this.__controllers) == null ? void 0 : _a4.delete(controller);
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */
  __saveInstanceProperties() {
    const instanceProperties = /* @__PURE__ */ new Map();
    const elementProperties = this.constructor.elementProperties;
    for (const p of elementProperties.keys()) {
      if (this.hasOwnProperty(p)) {
        instanceProperties.set(p, this[p]);
        delete this[p];
      }
    }
    if (instanceProperties.size > 0) {
      this.__instanceProperties = instanceProperties;
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   *
   * @return Returns a node into which to render.
   * @category rendering
   */
  createRenderRoot() {
    const renderRoot = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    adoptStyles(renderRoot, this.constructor.elementStyles);
    return renderRoot;
  }
  /**
   * On first connection, creates the element's renderRoot, sets up
   * element styling, and enables updating.
   * @category lifecycle
   */
  connectedCallback() {
    var _a4;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot());
    this.enableUpdating(true);
    (_a4 = this.__controllers) == null ? void 0 : _a4.forEach((c) => {
      var _a5;
      return (_a5 = c.hostConnected) == null ? void 0 : _a5.call(c);
    });
  }
  /**
   * Note, this method should be considered final and not overridden. It is
   * overridden on the element instance with a function that triggers the first
   * update.
   * @category updates
   */
  enableUpdating(_requestedUpdate) {
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   * @category lifecycle
   */
  disconnectedCallback() {
    var _a4;
    (_a4 = this.__controllers) == null ? void 0 : _a4.forEach((c) => {
      var _a5;
      return (_a5 = c.hostDisconnected) == null ? void 0 : _a5.call(c);
    });
  }
  /**
   * Synchronizes property values when attributes change.
   *
   * Specifically, when an attribute is set, the corresponding property is set.
   * You should rarely need to implement this callback. If this method is
   * overridden, `super.attributeChangedCallback(name, _old, value)` must be
   * called.
   *
   * See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
   * on MDN for more information about the `attributeChangedCallback`.
   * @category attributes
   */
  attributeChangedCallback(name, _old, value) {
    this._$attributeToProperty(name, value);
  }
  __propertyToAttribute(name, value) {
    var _a4;
    const elemProperties = this.constructor.elementProperties;
    const options = elemProperties.get(name);
    const attr = this.constructor.__attributeNameForProperty(name, options);
    if (attr !== void 0 && options.reflect === true) {
      const converter = ((_a4 = options.converter) == null ? void 0 : _a4.toAttribute) !== void 0 ? options.converter : defaultConverter;
      const attrValue = converter.toAttribute(value, options.type);
      if (DEV_MODE && this.constructor.enabledWarnings.includes("migration") && attrValue === void 0) {
        issueWarning("undefined-attribute-value", `The attribute value for the ${name} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);
      }
      this.__reflectingProperty = name;
      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      }
      this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(name, value) {
    var _a4;
    const ctor = this.constructor;
    const propName = ctor.__attributeToPropertyMap.get(name);
    if (propName !== void 0 && this.__reflectingProperty !== propName) {
      const options = ctor.getPropertyOptions(propName);
      const converter = typeof options.converter === "function" ? { fromAttribute: options.converter } : ((_a4 = options.converter) == null ? void 0 : _a4.fromAttribute) !== void 0 ? options.converter : defaultConverter;
      this.__reflectingProperty = propName;
      this[propName] = converter.fromAttribute(
        value,
        options.type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      );
      this.__reflectingProperty = null;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should be called
   * when an element should update based on some state not triggered by setting
   * a reactive property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored.
   *
   * @param name name of requesting property
   * @param oldValue old value of requesting property
   * @param options property options to use instead of the previously
   *     configured options
   * @category updates
   */
  requestUpdate(name, oldValue, options) {
    if (name !== void 0) {
      if (DEV_MODE && name instanceof Event) {
        issueWarning(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
      }
      options ?? (options = this.constructor.getPropertyOptions(name));
      const hasChanged = options.hasChanged ?? notEqual;
      const newValue = this[name];
      if (hasChanged(newValue, oldValue)) {
        this._$changeProperty(name, oldValue, options);
      } else {
        return;
      }
    }
    if (this.isUpdatePending === false) {
      this.__updatePromise = this.__enqueueUpdate();
    }
  }
  /**
   * @internal
   */
  _$changeProperty(name, oldValue, options) {
    if (!this._$changedProperties.has(name)) {
      this._$changedProperties.set(name, oldValue);
    }
    if (options.reflect === true && this.__reflectingProperty !== name) {
      (this.__reflectingProperties ?? (this.__reflectingProperties = /* @__PURE__ */ new Set())).add(name);
    }
  }
  /**
   * Sets up the element to asynchronously update.
   */
  async __enqueueUpdate() {
    this.isUpdatePending = true;
    try {
      await this.__updatePromise;
    } catch (e) {
      Promise.reject(e);
    }
    const result = this.scheduleUpdate();
    if (result != null) {
      await result;
    }
    return !this.isUpdatePending;
  }
  /**
   * Schedules an element update. You can override this method to change the
   * timing of updates by returning a Promise. The update will await the
   * returned Promise, and you should resolve the Promise to allow the update
   * to proceed. If this method is overridden, `super.scheduleUpdate()`
   * must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```ts
   * override protected async scheduleUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.scheduleUpdate();
   * }
   * ```
   * @category updates
   */
  scheduleUpdate() {
    const result = this.performUpdate();
    if (DEV_MODE && this.constructor.enabledWarnings.includes("async-perform-update") && typeof (result == null ? void 0 : result.then) === "function") {
      issueWarning("async-perform-update", `Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);
    }
    return result;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * Call `performUpdate()` to immediately process a pending update. This should
   * generally not be needed, but it can be done in rare cases when you need to
   * update synchronously.
   *
   * @category updates
   */
  performUpdate() {
    var _a4;
    if (!this.isUpdatePending) {
      return;
    }
    debugLogEvent == null ? void 0 : debugLogEvent({ kind: "update" });
    if (!this.hasUpdated) {
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot());
      if (DEV_MODE) {
        const ctor = this.constructor;
        const shadowedProperties = [...ctor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
        if (shadowedProperties.length) {
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${shadowedProperties.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
        }
      }
      if (this.__instanceProperties) {
        for (const [p, value] of this.__instanceProperties) {
          this[p] = value;
        }
        this.__instanceProperties = void 0;
      }
      const elementProperties = this.constructor.elementProperties;
      if (elementProperties.size > 0) {
        for (const [p, options] of elementProperties) {
          if (options.wrapped === true && !this._$changedProperties.has(p) && this[p] !== void 0) {
            this._$changeProperty(p, this[p], options);
          }
        }
      }
    }
    let shouldUpdate = false;
    const changedProperties = this._$changedProperties;
    try {
      shouldUpdate = this.shouldUpdate(changedProperties);
      if (shouldUpdate) {
        this.willUpdate(changedProperties);
        (_a4 = this.__controllers) == null ? void 0 : _a4.forEach((c) => {
          var _a5;
          return (_a5 = c.hostUpdate) == null ? void 0 : _a5.call(c);
        });
        this.update(changedProperties);
      } else {
        this.__markUpdated();
      }
    } catch (e) {
      shouldUpdate = false;
      this.__markUpdated();
      throw e;
    }
    if (shouldUpdate) {
      this._$didUpdate(changedProperties);
    }
  }
  /**
   * Invoked before `update()` to compute values needed during the update.
   *
   * Implement `willUpdate` to compute property values that depend on other
   * properties and are used in the rest of the update process.
   *
   * ```ts
   * willUpdate(changedProperties) {
   *   // only need to check changed properties for an expensive computation.
   *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
   *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
   *   }
   * }
   *
   * render() {
   *   return html`SHA: ${this.sha}`;
   * }
   * ```
   *
   * @category updates
   */
  willUpdate(_changedProperties) {
  }
  // Note, this is an override point for polyfill-support.
  // @internal
  _$didUpdate(changedProperties) {
    var _a4;
    (_a4 = this.__controllers) == null ? void 0 : _a4.forEach((c) => {
      var _a5;
      return (_a5 = c.hostUpdated) == null ? void 0 : _a5.call(c);
    });
    if (!this.hasUpdated) {
      this.hasUpdated = true;
      this.firstUpdated(changedProperties);
    }
    this.updated(changedProperties);
    if (DEV_MODE && this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update")) {
      issueWarning("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
    }
  }
  __markUpdated() {
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.isUpdatePending = false;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super.getUpdateComplete()`, then any subsequent state.
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  get updateComplete() {
    return this.getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   override async getUpdateComplete() {
   *     const result = await super.getUpdateComplete();
   *     await this._myChild.updateComplete;
   *     return result;
   *   }
   * }
   * ```
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  getUpdateComplete() {
    return this.__updatePromise;
  }
  /**
   * Controls whether or not `update()` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  update(_changedProperties) {
    this.__reflectingProperties && (this.__reflectingProperties = this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p])));
    this.__markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  updated(_changedProperties) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * ```ts
   * firstUpdated() {
   *   this.renderRoot.getElementById('my-text-area').focus();
   * }
   * ```
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  firstUpdated(_changedProperties) {
  }
};
ReactiveElement.elementStyles = [];
ReactiveElement.shadowRootOptions = { mode: "open" };
ReactiveElement[JSCompiler_renameProperty("elementProperties", ReactiveElement)] = /* @__PURE__ */ new Map();
ReactiveElement[JSCompiler_renameProperty("finalized", ReactiveElement)] = /* @__PURE__ */ new Map();
polyfillSupport == null ? void 0 : polyfillSupport({ ReactiveElement });
if (DEV_MODE) {
  ReactiveElement.enabledWarnings = [
    "change-in-update",
    "async-perform-update"
  ];
  const ensureOwnWarnings = function(ctor) {
    if (!ctor.hasOwnProperty(JSCompiler_renameProperty("enabledWarnings", ctor))) {
      ctor.enabledWarnings = ctor.enabledWarnings.slice();
    }
  };
  ReactiveElement.enableWarning = function(warning) {
    ensureOwnWarnings(this);
    if (!this.enabledWarnings.includes(warning)) {
      this.enabledWarnings.push(warning);
    }
  };
  ReactiveElement.disableWarning = function(warning) {
    ensureOwnWarnings(this);
    const i = this.enabledWarnings.indexOf(warning);
    if (i >= 0) {
      this.enabledWarnings.splice(i, 1);
    }
  };
}
(global2.reactiveElementVersions ?? (global2.reactiveElementVersions = [])).push("2.0.4");
if (DEV_MODE && global2.reactiveElementVersions.length > 1) {
  issueWarning("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}

// node_modules/lit-html/development/lit-html.js
var DEV_MODE2 = true;
var ENABLE_EXTRA_SECURITY_HOOKS = true;
var ENABLE_SHADYDOM_NOPATCH = true;
var NODE_MODE3 = false;
var global3 = globalThis;
var debugLogEvent2 = DEV_MODE2 ? (event) => {
  const shouldEmit = global3.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global3.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var debugLogRenderId = 0;
var issueWarning2;
if (DEV_MODE2) {
  global3.litIssuedWarnings ?? (global3.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning2 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!global3.litIssuedWarnings.has(warning)) {
      console.warn(warning);
      global3.litIssuedWarnings.add(warning);
    }
  };
  issueWarning2("dev-mode", `Lit is in dev mode. Not recommended for production!`);
}
var _a2, _b;
var wrap = ENABLE_SHADYDOM_NOPATCH && ((_a2 = global3.ShadyDOM) == null ? void 0 : _a2.inUse) && ((_b = global3.ShadyDOM) == null ? void 0 : _b.noPatch) === true ? global3.ShadyDOM.wrap : (node) => node;
var trustedTypes2 = global3.trustedTypes;
var policy = trustedTypes2 ? trustedTypes2.createPolicy("lit-html", {
  createHTML: (s) => s
}) : void 0;
var identityFunction = (value) => value;
var noopSanitizer = (_node, _name, _type) => identityFunction;
var setSanitizer = (newSanitizer) => {
  if (!ENABLE_EXTRA_SECURITY_HOOKS) {
    return;
  }
  if (sanitizerFactoryInternal !== noopSanitizer) {
    throw new Error(`Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.`);
  }
  sanitizerFactoryInternal = newSanitizer;
};
var _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
  sanitizerFactoryInternal = noopSanitizer;
};
var createSanitizer = (node, name, type) => {
  return sanitizerFactoryInternal(node, name, type);
};
var boundAttributeSuffix = "$lit$";
var marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
var markerMatch = "?" + marker;
var nodeMarker = `<${markerMatch}>`;
var d = NODE_MODE3 && global3.document === void 0 ? {
  createTreeWalker() {
    return {};
  }
} : document;
var createMarker = () => d.createComment("");
var isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
var isArray = Array.isArray;
var isIterable = (value) => isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof (value == null ? void 0 : value[Symbol.iterator]) === "function";
var SPACE_CHAR = `[ 	
\f\r]`;
var ATTR_VALUE_CHAR = `[^ 	
\f\r"'\`<>=]`;
var NAME_CHAR = `[^\\s"'>=/]`;
var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var COMMENT_START = 1;
var TAG_NAME = 2;
var DYNAMIC_TAG_NAME = 3;
var commentEndRegex = /-->/g;
var comment2EndRegex = />/g;
var tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, "g");
var ENTIRE_MATCH = 0;
var ATTRIBUTE_NAME = 1;
var SPACES_AND_EQUALS = 2;
var QUOTE_CHAR = 3;
var singleQuoteAttrEndRegex = /'/g;
var doubleQuoteAttrEndRegex = /"/g;
var rawTextElement = /^(?:script|style|textarea|title)$/i;
var HTML_RESULT = 1;
var SVG_RESULT = 2;
var MATHML_RESULT = 3;
var ATTRIBUTE_PART = 1;
var CHILD_PART = 2;
var PROPERTY_PART = 3;
var BOOLEAN_ATTRIBUTE_PART = 4;
var EVENT_PART = 5;
var ELEMENT_PART = 6;
var COMMENT_PART = 7;
var tag = (type) => (strings, ...values) => {
  if (DEV_MODE2 && strings.some((s) => s === void 0)) {
    console.warn("Some template strings are undefined.\nThis is probably caused by illegal octal escape sequences.");
  }
  if (DEV_MODE2) {
    if (values.some((val) => val == null ? void 0 : val["_$litStatic$"])) {
      issueWarning2("", `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);
    }
  }
  return {
    // This property needs to remain unminified.
    ["_$litType$"]: type,
    strings,
    values
  };
};
var html = tag(HTML_RESULT);
var svg = tag(SVG_RESULT);
var mathml = tag(MATHML_RESULT);
var noChange = Symbol.for("lit-noChange");
var nothing = Symbol.for("lit-nothing");
var templateCache = /* @__PURE__ */ new WeakMap();
var walker = d.createTreeWalker(
  d,
  129
  /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
var sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
  if (!isArray(tsa) || !tsa.hasOwnProperty("raw")) {
    let message = "invalid template strings array";
    if (DEV_MODE2) {
      message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, "\n");
    }
    throw new Error(message);
  }
  return policy !== void 0 ? policy.createHTML(stringFromTSA) : stringFromTSA;
}
var getTemplateHtml = (strings, type) => {
  const l2 = strings.length - 1;
  const attrNames = [];
  let html2 = type === SVG_RESULT ? "<svg>" : type === MATHML_RESULT ? "<math>" : "";
  let rawTextEndRegex;
  let regex = textEndRegex;
  for (let i = 0; i < l2; i++) {
    const s = strings[i];
    let attrNameEndIndex = -1;
    let attrName;
    let lastIndex = 0;
    let match;
    while (lastIndex < s.length) {
      regex.lastIndex = lastIndex;
      match = regex.exec(s);
      if (match === null) {
        break;
      }
      lastIndex = regex.lastIndex;
      if (regex === textEndRegex) {
        if (match[COMMENT_START] === "!--") {
          regex = commentEndRegex;
        } else if (match[COMMENT_START] !== void 0) {
          regex = comment2EndRegex;
        } else if (match[TAG_NAME] !== void 0) {
          if (rawTextElement.test(match[TAG_NAME])) {
            rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, "g");
          }
          regex = tagEndRegex;
        } else if (match[DYNAMIC_TAG_NAME] !== void 0) {
          if (DEV_MODE2) {
            throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
          }
          regex = tagEndRegex;
        }
      } else if (regex === tagEndRegex) {
        if (match[ENTIRE_MATCH] === ">") {
          regex = rawTextEndRegex ?? textEndRegex;
          attrNameEndIndex = -1;
        } else if (match[ATTRIBUTE_NAME] === void 0) {
          attrNameEndIndex = -2;
        } else {
          attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
          attrName = match[ATTRIBUTE_NAME];
          regex = match[QUOTE_CHAR] === void 0 ? tagEndRegex : match[QUOTE_CHAR] === '"' ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
        }
      } else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) {
        regex = tagEndRegex;
      } else if (regex === commentEndRegex || regex === comment2EndRegex) {
        regex = textEndRegex;
      } else {
        regex = tagEndRegex;
        rawTextEndRegex = void 0;
      }
    }
    if (DEV_MODE2) {
      console.assert(attrNameEndIndex === -1 || regex === tagEndRegex || regex === singleQuoteAttrEndRegex || regex === doubleQuoteAttrEndRegex, "unexpected parse state B");
    }
    const end = regex === tagEndRegex && strings[i + 1].startsWith("/>") ? " " : "";
    html2 += regex === textEndRegex ? s + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s.slice(0, attrNameEndIndex) + boundAttributeSuffix + s.slice(attrNameEndIndex)) + marker + end : s + marker + (attrNameEndIndex === -2 ? i : end);
  }
  const htmlResult = html2 + (strings[l2] || "<?>") + (type === SVG_RESULT ? "</svg>" : type === MATHML_RESULT ? "</math>" : "");
  return [trustFromTemplateString(strings, htmlResult), attrNames];
};
var Template = class _Template {
  constructor({ strings, ["_$litType$"]: type }, options) {
    this.parts = [];
    let node;
    let nodeIndex = 0;
    let attrNameIndex = 0;
    const partCount = strings.length - 1;
    const parts = this.parts;
    const [html2, attrNames] = getTemplateHtml(strings, type);
    this.el = _Template.createElement(html2, options);
    walker.currentNode = this.el.content;
    if (type === SVG_RESULT || type === MATHML_RESULT) {
      const wrapper = this.el.content.firstChild;
      wrapper.replaceWith(...wrapper.childNodes);
    }
    while ((node = walker.nextNode()) !== null && parts.length < partCount) {
      if (node.nodeType === 1) {
        if (DEV_MODE2) {
          const tag2 = node.localName;
          if (/^(?:textarea|template)$/i.test(tag2) && node.innerHTML.includes(marker)) {
            const m2 = `Expressions are not supported inside \`${tag2}\` elements. See https://lit.dev/msg/expression-in-${tag2} for more information.`;
            if (tag2 === "template") {
              throw new Error(m2);
            } else
              issueWarning2("", m2);
          }
        }
        if (node.hasAttributes()) {
          for (const name of node.getAttributeNames()) {
            if (name.endsWith(boundAttributeSuffix)) {
              const realName = attrNames[attrNameIndex++];
              const value = node.getAttribute(name);
              const statics = value.split(marker);
              const m2 = /([.?@])?(.*)/.exec(realName);
              parts.push({
                type: ATTRIBUTE_PART,
                index: nodeIndex,
                name: m2[2],
                strings: statics,
                ctor: m2[1] === "." ? PropertyPart : m2[1] === "?" ? BooleanAttributePart : m2[1] === "@" ? EventPart : AttributePart
              });
              node.removeAttribute(name);
            } else if (name.startsWith(marker)) {
              parts.push({
                type: ELEMENT_PART,
                index: nodeIndex
              });
              node.removeAttribute(name);
            }
          }
        }
        if (rawTextElement.test(node.tagName)) {
          const strings2 = node.textContent.split(marker);
          const lastIndex = strings2.length - 1;
          if (lastIndex > 0) {
            node.textContent = trustedTypes2 ? trustedTypes2.emptyScript : "";
            for (let i = 0; i < lastIndex; i++) {
              node.append(strings2[i], createMarker());
              walker.nextNode();
              parts.push({ type: CHILD_PART, index: ++nodeIndex });
            }
            node.append(strings2[lastIndex], createMarker());
          }
        }
      } else if (node.nodeType === 8) {
        const data = node.data;
        if (data === markerMatch) {
          parts.push({ type: CHILD_PART, index: nodeIndex });
        } else {
          let i = -1;
          while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
            parts.push({ type: COMMENT_PART, index: nodeIndex });
            i += marker.length - 1;
          }
        }
      }
      nodeIndex++;
    }
    if (DEV_MODE2) {
      if (attrNames.length !== attrNameIndex) {
        throw new Error(`Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=\${true} ?disabled=\${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: 
\`` + strings.join("${...}") + "`");
      }
    }
    debugLogEvent2 && debugLogEvent2({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(html2, _options) {
    const el = d.createElement("template");
    el.innerHTML = html2;
    return el;
  }
};
function resolveDirective(part, value, parent = part, attributeIndex) {
  var _a4, _b2;
  if (value === noChange) {
    return value;
  }
  let currentDirective = attributeIndex !== void 0 ? (_a4 = parent.__directives) == null ? void 0 : _a4[attributeIndex] : parent.__directive;
  const nextDirectiveConstructor = isPrimitive(value) ? void 0 : (
    // This property needs to remain unminified.
    value["_$litDirective$"]
  );
  if ((currentDirective == null ? void 0 : currentDirective.constructor) !== nextDirectiveConstructor) {
    (_b2 = currentDirective == null ? void 0 : currentDirective["_$notifyDirectiveConnectionChanged"]) == null ? void 0 : _b2.call(currentDirective, false);
    if (nextDirectiveConstructor === void 0) {
      currentDirective = void 0;
    } else {
      currentDirective = new nextDirectiveConstructor(part);
      currentDirective._$initialize(part, parent, attributeIndex);
    }
    if (attributeIndex !== void 0) {
      (parent.__directives ?? (parent.__directives = []))[attributeIndex] = currentDirective;
    } else {
      parent.__directive = currentDirective;
    }
  }
  if (currentDirective !== void 0) {
    value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
  }
  return value;
}
var TemplateInstance = class {
  constructor(template, parent) {
    this._$parts = [];
    this._$disconnectableChildren = void 0;
    this._$template = template;
    this._$parent = parent;
  }
  // Called by ChildPart parentNode getter
  get parentNode() {
    return this._$parent.parentNode;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  // This method is separate from the constructor because we need to return a
  // DocumentFragment and we don't want to hold onto it with an instance field.
  _clone(options) {
    const { el: { content }, parts } = this._$template;
    const fragment = ((options == null ? void 0 : options.creationScope) ?? d).importNode(content, true);
    walker.currentNode = fragment;
    let node = walker.nextNode();
    let nodeIndex = 0;
    let partIndex = 0;
    let templatePart = parts[0];
    while (templatePart !== void 0) {
      if (nodeIndex === templatePart.index) {
        let part;
        if (templatePart.type === CHILD_PART) {
          part = new ChildPart(node, node.nextSibling, this, options);
        } else if (templatePart.type === ATTRIBUTE_PART) {
          part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
        } else if (templatePart.type === ELEMENT_PART) {
          part = new ElementPart(node, this, options);
        }
        this._$parts.push(part);
        templatePart = parts[++partIndex];
      }
      if (nodeIndex !== (templatePart == null ? void 0 : templatePart.index)) {
        node = walker.nextNode();
        nodeIndex++;
      }
    }
    walker.currentNode = d;
    return fragment;
  }
  _update(values) {
    let i = 0;
    for (const part of this._$parts) {
      if (part !== void 0) {
        debugLogEvent2 && debugLogEvent2({
          kind: "set part",
          part,
          value: values[i],
          valueIndex: i,
          values,
          templateInstance: this
        });
        if (part.strings !== void 0) {
          part._$setValue(values, part, i);
          i += part.strings.length - 2;
        } else {
          part._$setValue(values[i]);
        }
      }
      i++;
    }
  }
};
var ChildPart = class _ChildPart {
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    var _a4;
    return ((_a4 = this._$parent) == null ? void 0 : _a4._$isConnected) ?? this.__isConnected;
  }
  constructor(startNode, endNode, parent, options) {
    this.type = CHILD_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this._$startNode = startNode;
    this._$endNode = endNode;
    this._$parent = parent;
    this.options = options;
    this.__isConnected = (options == null ? void 0 : options.isConnected) ?? true;
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._textSanitizer = void 0;
    }
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  get parentNode() {
    let parentNode = wrap(this._$startNode).parentNode;
    const parent = this._$parent;
    if (parent !== void 0 && (parentNode == null ? void 0 : parentNode.nodeType) === 11) {
      parentNode = parent.parentNode;
    }
    return parentNode;
  }
  /**
   * The part's leading marker node, if any. See `.parentNode` for more
   * information.
   */
  get startNode() {
    return this._$startNode;
  }
  /**
   * The part's trailing marker node, if any. See `.parentNode` for more
   * information.
   */
  get endNode() {
    return this._$endNode;
  }
  _$setValue(value, directiveParent = this) {
    var _a4;
    if (DEV_MODE2 && this.parentNode === null) {
      throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
    }
    value = resolveDirective(this, value, directiveParent);
    if (isPrimitive(value)) {
      if (value === nothing || value == null || value === "") {
        if (this._$committedValue !== nothing) {
          debugLogEvent2 && debugLogEvent2({
            kind: "commit nothing to child",
            start: this._$startNode,
            end: this._$endNode,
            parent: this._$parent,
            options: this.options
          });
          this._$clear();
        }
        this._$committedValue = nothing;
      } else if (value !== this._$committedValue && value !== noChange) {
        this._commitText(value);
      }
    } else if (value["_$litType$"] !== void 0) {
      this._commitTemplateResult(value);
    } else if (value.nodeType !== void 0) {
      if (DEV_MODE2 && ((_a4 = this.options) == null ? void 0 : _a4.host) === value) {
        this._commitText(`[probable mistake: rendered a template's host in itself (commonly caused by writing \${this} in a template]`);
        console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
        return;
      }
      this._commitNode(value);
    } else if (isIterable(value)) {
      this._commitIterable(value);
    } else {
      this._commitText(value);
    }
  }
  _insert(node) {
    return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
  }
  _commitNode(value) {
    var _a4;
    if (this._$committedValue !== value) {
      this._$clear();
      if (ENABLE_EXTRA_SECURITY_HOOKS && sanitizerFactoryInternal !== noopSanitizer) {
        const parentNodeName = (_a4 = this._$startNode.parentNode) == null ? void 0 : _a4.nodeName;
        if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
          let message = "Forbidden";
          if (DEV_MODE2) {
            if (parentNodeName === "STYLE") {
              message = `Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css\`...\` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.`;
            } else {
              message = `Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.`;
            }
          }
          throw new Error(message);
        }
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value,
        options: this.options
      });
      this._$committedValue = this._insert(value);
    }
  }
  _commitText(value) {
    if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
      const node = wrap(this._$startNode).nextSibling;
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(node, "data", "property");
        }
        value = this._textSanitizer(value);
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit text",
        node,
        value,
        options: this.options
      });
      node.data = value;
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        const textNode = d.createTextNode("");
        this._commitNode(textNode);
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(textNode, "data", "property");
        }
        value = this._textSanitizer(value);
        debugLogEvent2 && debugLogEvent2({
          kind: "commit text",
          node: textNode,
          value,
          options: this.options
        });
        textNode.data = value;
      } else {
        this._commitNode(d.createTextNode(value));
        debugLogEvent2 && debugLogEvent2({
          kind: "commit text",
          node: wrap(this._$startNode).nextSibling,
          value,
          options: this.options
        });
      }
    }
    this._$committedValue = value;
  }
  _commitTemplateResult(result) {
    var _a4;
    const { values, ["_$litType$"]: type } = result;
    const template = typeof type === "number" ? this._$getTemplate(result) : (type.el === void 0 && (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)), type);
    if (((_a4 = this._$committedValue) == null ? void 0 : _a4._$template) === template) {
      debugLogEvent2 && debugLogEvent2({
        kind: "template updating",
        template,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values
      });
      this._$committedValue._update(values);
    } else {
      const instance = new TemplateInstance(template, this);
      const fragment = instance._clone(this.options);
      debugLogEvent2 && debugLogEvent2({
        kind: "template instantiated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      instance._update(values);
      debugLogEvent2 && debugLogEvent2({
        kind: "template instantiated and updated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      this._commitNode(fragment);
      this._$committedValue = instance;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(result) {
    let template = templateCache.get(result.strings);
    if (template === void 0) {
      templateCache.set(result.strings, template = new Template(result));
    }
    return template;
  }
  _commitIterable(value) {
    if (!isArray(this._$committedValue)) {
      this._$committedValue = [];
      this._$clear();
    }
    const itemParts = this._$committedValue;
    let partIndex = 0;
    let itemPart;
    for (const item of value) {
      if (partIndex === itemParts.length) {
        itemParts.push(itemPart = new _ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
      } else {
        itemPart = itemParts[partIndex];
      }
      itemPart._$setValue(item);
      partIndex++;
    }
    if (partIndex < itemParts.length) {
      this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
      itemParts.length = partIndex;
    }
  }
  /**
   * Removes the nodes contained within this Part from the DOM.
   *
   * @param start Start node to clear from, for clearing a subset of the part's
   *     DOM (used when truncating iterables)
   * @param from  When `start` is specified, the index within the iterable from
   *     which ChildParts are being removed, used for disconnecting directives in
   *     those Parts.
   *
   * @internal
   */
  _$clear(start = wrap(this._$startNode).nextSibling, from) {
    var _a4;
    (_a4 = this._$notifyConnectionChanged) == null ? void 0 : _a4.call(this, false, true, from);
    while (start && start !== this._$endNode) {
      const n = wrap(start).nextSibling;
      wrap(start).remove();
      start = n;
    }
  }
  /**
   * Implementation of RootPart's `isConnected`. Note that this method
   * should only be called on `RootPart`s (the `ChildPart` returned from a
   * top-level `render()` call). It has no effect on non-root ChildParts.
   * @param isConnected Whether to set
   * @internal
   */
  setConnected(isConnected) {
    var _a4;
    if (this._$parent === void 0) {
      this.__isConnected = isConnected;
      (_a4 = this._$notifyConnectionChanged) == null ? void 0 : _a4.call(this, isConnected);
    } else if (DEV_MODE2) {
      throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
    }
  }
};
var AttributePart = class {
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  constructor(element, name, strings, parent, options) {
    this.type = ATTRIBUTE_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this.element = element;
    this.name = name;
    this._$parent = parent;
    this.options = options;
    if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
      this._$committedValue = new Array(strings.length - 1).fill(new String());
      this.strings = strings;
    } else {
      this._$committedValue = nothing;
    }
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._sanitizer = void 0;
    }
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  _$setValue(value, directiveParent = this, valueIndex, noCommit) {
    const strings = this.strings;
    let change = false;
    if (strings === void 0) {
      value = resolveDirective(this, value, directiveParent, 0);
      change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
      if (change) {
        this._$committedValue = value;
      }
    } else {
      const values = value;
      value = strings[0];
      let i, v2;
      for (i = 0; i < strings.length - 1; i++) {
        v2 = resolveDirective(this, values[valueIndex + i], directiveParent, i);
        if (v2 === noChange) {
          v2 = this._$committedValue[i];
        }
        change || (change = !isPrimitive(v2) || v2 !== this._$committedValue[i]);
        if (v2 === nothing) {
          value = nothing;
        } else if (value !== nothing) {
          value += (v2 ?? "") + strings[i + 1];
        }
        this._$committedValue[i] = v2;
      }
    }
    if (change && !noCommit) {
      this._commitValue(value);
    }
  }
  /** @internal */
  _commitValue(value) {
    if (value === nothing) {
      wrap(this.element).removeAttribute(this.name);
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._sanitizer === void 0) {
          this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "attribute");
        }
        value = this._sanitizer(value ?? "");
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit attribute",
        element: this.element,
        name: this.name,
        value,
        options: this.options
      });
      wrap(this.element).setAttribute(this.name, value ?? "");
    }
  }
};
var PropertyPart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = PROPERTY_PART;
  }
  /** @internal */
  _commitValue(value) {
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      if (this._sanitizer === void 0) {
        this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "property");
      }
      value = this._sanitizer(value);
    }
    debugLogEvent2 && debugLogEvent2({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value,
      options: this.options
    });
    this.element[this.name] = value === nothing ? void 0 : value;
  }
};
var BooleanAttributePart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = BOOLEAN_ATTRIBUTE_PART;
  }
  /** @internal */
  _commitValue(value) {
    debugLogEvent2 && debugLogEvent2({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(value && value !== nothing),
      options: this.options
    });
    wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
  }
};
var EventPart = class extends AttributePart {
  constructor(element, name, strings, parent, options) {
    super(element, name, strings, parent, options);
    this.type = EVENT_PART;
    if (DEV_MODE2 && this.strings !== void 0) {
      throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
    }
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(newListener, directiveParent = this) {
    newListener = resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
    if (newListener === noChange) {
      return;
    }
    const oldListener = this._$committedValue;
    const shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
    const shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
    debugLogEvent2 && debugLogEvent2({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: newListener,
      options: this.options,
      removeListener: shouldRemoveListener,
      addListener: shouldAddListener,
      oldListener
    });
    if (shouldRemoveListener) {
      this.element.removeEventListener(this.name, this, oldListener);
    }
    if (shouldAddListener) {
      this.element.addEventListener(this.name, this, newListener);
    }
    this._$committedValue = newListener;
  }
  handleEvent(event) {
    var _a4;
    if (typeof this._$committedValue === "function") {
      this._$committedValue.call(((_a4 = this.options) == null ? void 0 : _a4.host) ?? this.element, event);
    } else {
      this._$committedValue.handleEvent(event);
    }
  }
};
var ElementPart = class {
  constructor(element, parent, options) {
    this.element = element;
    this.type = ELEMENT_PART;
    this._$disconnectableChildren = void 0;
    this._$parent = parent;
    this.options = options;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(value) {
    debugLogEvent2 && debugLogEvent2({
      kind: "commit to element binding",
      element: this.element,
      value,
      options: this.options
    });
    resolveDirective(this, value);
  }
};
var polyfillSupport2 = DEV_MODE2 ? global3.litHtmlPolyfillSupportDevMode : global3.litHtmlPolyfillSupport;
polyfillSupport2 == null ? void 0 : polyfillSupport2(Template, ChildPart);
(global3.litHtmlVersions ?? (global3.litHtmlVersions = [])).push("3.2.0");
if (DEV_MODE2 && global3.litHtmlVersions.length > 1) {
  issueWarning2("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}
var render = (value, container, options) => {
  if (DEV_MODE2 && container == null) {
    throw new TypeError(`The container to render into may not be ${container}`);
  }
  const renderId = DEV_MODE2 ? debugLogRenderId++ : 0;
  const partOwnerNode = (options == null ? void 0 : options.renderBefore) ?? container;
  let part = partOwnerNode["_$litPart$"];
  debugLogEvent2 && debugLogEvent2({
    kind: "begin render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  if (part === void 0) {
    const endNode = (options == null ? void 0 : options.renderBefore) ?? null;
    partOwnerNode["_$litPart$"] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, void 0, options ?? {});
  }
  part._$setValue(value);
  debugLogEvent2 && debugLogEvent2({
    kind: "end render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
  render.setSanitizer = setSanitizer;
  render.createSanitizer = createSanitizer;
  if (DEV_MODE2) {
    render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
  }
}

// node_modules/lit-element/development/lit-element.js
var JSCompiler_renameProperty2 = (prop, _obj) => prop;
var DEV_MODE3 = true;
var issueWarning3;
if (DEV_MODE3) {
  const issuedWarnings = globalThis.litIssuedWarnings ?? (globalThis.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning3 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
var LitElement = class extends ReactiveElement {
  constructor() {
    super(...arguments);
    this.renderOptions = { host: this };
    this.__childPart = void 0;
  }
  /**
   * @category rendering
   */
  createRenderRoot() {
    var _a4;
    const renderRoot = super.createRenderRoot();
    (_a4 = this.renderOptions).renderBefore ?? (_a4.renderBefore = renderRoot.firstChild);
    return renderRoot;
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  update(changedProperties) {
    const value = this.render();
    if (!this.hasUpdated) {
      this.renderOptions.isConnected = this.isConnected;
    }
    super.update(changedProperties);
    this.__childPart = render(value, this.renderRoot, this.renderOptions);
  }
  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   *
   * @category lifecycle
   */
  connectedCallback() {
    var _a4;
    super.connectedCallback();
    (_a4 = this.__childPart) == null ? void 0 : _a4.setConnected(true);
  }
  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   *
   * @category lifecycle
   */
  disconnectedCallback() {
    var _a4;
    super.disconnectedCallback();
    (_a4 = this.__childPart) == null ? void 0 : _a4.setConnected(false);
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `ChildPart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   * @category rendering
   */
  render() {
    return noChange;
  }
};
LitElement["_$litElement$"] = true;
LitElement[JSCompiler_renameProperty2("finalized", LitElement)] = true;
var _a3;
(_a3 = globalThis.litElementHydrateSupport) == null ? void 0 : _a3.call(globalThis, { LitElement });
var polyfillSupport3 = DEV_MODE3 ? globalThis.litElementPolyfillSupportDevMode : globalThis.litElementPolyfillSupport;
polyfillSupport3 == null ? void 0 : polyfillSupport3({ LitElement });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.0");
if (DEV_MODE3 && globalThis.litElementVersions.length > 1) {
  issueWarning3("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}

// node_modules/@lit/reactive-element/development/decorators/custom-element.js
var customElement = (tagName) => (classOrTarget, context) => {
  if (context !== void 0) {
    context.addInitializer(() => {
      customElements.define(tagName, classOrTarget);
    });
  } else {
    customElements.define(tagName, classOrTarget);
  }
};

// node_modules/@lit/reactive-element/development/decorators/property.js
var DEV_MODE4 = true;
var issueWarning4;
if (DEV_MODE4) {
  const issuedWarnings = globalThis.litIssuedWarnings ?? (globalThis.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning4 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
var legacyProperty = (options, proto, name) => {
  const hasOwnProperty = proto.hasOwnProperty(name);
  proto.constructor.createProperty(name, hasOwnProperty ? { ...options, wrapped: true } : options);
  return hasOwnProperty ? Object.getOwnPropertyDescriptor(proto, name) : void 0;
};
var defaultPropertyDeclaration2 = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
var standardProperty = (options = defaultPropertyDeclaration2, target, context) => {
  const { kind, metadata } = context;
  if (DEV_MODE4 && metadata == null) {
    issueWarning4("missing-class-metadata", `The class ${target} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
  }
  let properties = globalThis.litPropertyMetadata.get(metadata);
  if (properties === void 0) {
    globalThis.litPropertyMetadata.set(metadata, properties = /* @__PURE__ */ new Map());
  }
  properties.set(context.name, options);
  if (kind === "accessor") {
    const { name } = context;
    return {
      set(v2) {
        const oldValue = target.get.call(this);
        target.set.call(this, v2);
        this.requestUpdate(name, oldValue, options);
      },
      init(v2) {
        if (v2 !== void 0) {
          this._$changeProperty(name, void 0, options);
        }
        return v2;
      }
    };
  } else if (kind === "setter") {
    const { name } = context;
    return function(value) {
      const oldValue = this[name];
      target.call(this, value);
      this.requestUpdate(name, oldValue, options);
    };
  }
  throw new Error(`Unsupported decorator location: ${kind}`);
};
function property(options) {
  return (protoOrTarget, nameOrContext) => {
    return typeof nameOrContext === "object" ? standardProperty(options, protoOrTarget, nameOrContext) : legacyProperty(options, protoOrTarget, nameOrContext);
  };
}

// node_modules/@lit/reactive-element/development/decorators/state.js
function state(options) {
  return property({
    ...options,
    // Add both `state` and `attribute` because we found a third party
    // controller that is keying off of PropertyOptions.state to determine
    // whether a field is a private internal property or not.
    state: true,
    attribute: false
  });
}

// node_modules/@lit/reactive-element/development/decorators/query.js
var DEV_MODE5 = true;
var issueWarning5;
if (DEV_MODE5) {
  const issuedWarnings = globalThis.litIssuedWarnings ?? (globalThis.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning5 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}

// node_modules/lit-html/development/directive.js
var PartType = {
  ATTRIBUTE: 1,
  CHILD: 2,
  PROPERTY: 3,
  BOOLEAN_ATTRIBUTE: 4,
  EVENT: 5,
  ELEMENT: 6
};
var directive = (c) => (...values) => ({
  // This property needs to remain unminified.
  ["_$litDirective$"]: c,
  values
});
var Directive = class {
  constructor(_partInfo) {
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  /** @internal */
  _$initialize(part, parent, attributeIndex) {
    this.__part = part;
    this._$parent = parent;
    this.__attributeIndex = attributeIndex;
  }
  /** @internal */
  _$resolve(part, props) {
    return this.update(part, props);
  }
  update(_part, props) {
    return this.render(...props);
  }
};

// node_modules/lit-html/development/directives/class-map.js
var ClassMapDirective = class extends Directive {
  constructor(partInfo) {
    var _a4;
    super(partInfo);
    if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== "class" || ((_a4 = partInfo.strings) == null ? void 0 : _a4.length) > 2) {
      throw new Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
    }
  }
  render(classInfo) {
    return " " + Object.keys(classInfo).filter((key) => classInfo[key]).join(" ") + " ";
  }
  update(part, [classInfo]) {
    var _a4, _b2;
    if (this._previousClasses === void 0) {
      this._previousClasses = /* @__PURE__ */ new Set();
      if (part.strings !== void 0) {
        this._staticClasses = new Set(part.strings.join(" ").split(/\s/).filter((s) => s !== ""));
      }
      for (const name in classInfo) {
        if (classInfo[name] && !((_a4 = this._staticClasses) == null ? void 0 : _a4.has(name))) {
          this._previousClasses.add(name);
        }
      }
      return this.render(classInfo);
    }
    const classList = part.element.classList;
    for (const name of this._previousClasses) {
      if (!(name in classInfo)) {
        classList.remove(name);
        this._previousClasses.delete(name);
      }
    }
    for (const name in classInfo) {
      const value = !!classInfo[name];
      if (value !== this._previousClasses.has(name) && !((_b2 = this._staticClasses) == null ? void 0 : _b2.has(name))) {
        if (value) {
          classList.add(name);
          this._previousClasses.add(name);
        } else {
          classList.remove(name);
          this._previousClasses.delete(name);
        }
      }
    }
    return noChange;
  }
};
var classMap = directive(ClassMapDirective);

// node_modules/lit-html/development/directives/style-map.js
var important = "important";
var importantFlag = " !" + important;
var flagTrim = 0 - importantFlag.length;
var StyleMapDirective = class extends Directive {
  constructor(partInfo) {
    var _a4;
    super(partInfo);
    if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== "style" || ((_a4 = partInfo.strings) == null ? void 0 : _a4.length) > 2) {
      throw new Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
    }
  }
  render(styleInfo) {
    return Object.keys(styleInfo).reduce((style, prop) => {
      const value = styleInfo[prop];
      if (value == null) {
        return style;
      }
      prop = prop.includes("-") ? prop : prop.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase();
      return style + `${prop}:${value};`;
    }, "");
  }
  update(part, [styleInfo]) {
    const { style } = part.element;
    if (this._previousStyleProperties === void 0) {
      this._previousStyleProperties = new Set(Object.keys(styleInfo));
      return this.render(styleInfo);
    }
    for (const name of this._previousStyleProperties) {
      if (styleInfo[name] == null) {
        this._previousStyleProperties.delete(name);
        if (name.includes("-")) {
          style.removeProperty(name);
        } else {
          style[name] = null;
        }
      }
    }
    for (const name in styleInfo) {
      const value = styleInfo[name];
      if (value != null) {
        this._previousStyleProperties.add(name);
        const isImportant = typeof value === "string" && value.endsWith(importantFlag);
        if (name.includes("-") || isImportant) {
          style.setProperty(name, isImportant ? value.slice(0, flagTrim) : value, isImportant ? important : "");
        } else {
          style[name] = value;
        }
      }
    }
    return noChange;
  }
};
var styleMap = directive(StyleMapDirective);

// node_modules/@radixdlt/radix-dapp-toolkit/dist/chunk-3ILQWVML.js
var pt = css`:host{--color-radix-green-1:#00ab84;--color-radix-green-2:#00c389;--color-radix-green-3:#21ffbe;--color-radix-blue-1:#060f8f;--color-radix-blue-2:#052cc0;--color-radix-blue-3:#20e4ff;--color-light:#ffffff;--color-dark:#000000;--color-accent-red:#ef4136;--color-accent-blue:#00aeef;--color-accent-yellow:#fff200;--color-alert:#e59700;--color-radix-error-red-1:#c82020;--color-radix-error-red-2:#fcebeb;--color-grey-1:#003057;--color-grey-2:#8a8fa4;--color-grey-3:#ced0d6;--color-grey-4:#e2e5ed;--color-grey-5:#f4f5f9}`;
var H = css`:host{font-family:'IBM Plex Sans',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}:host([mode=light]){--radix-popover-background:color-mix(in srgb, #efefef 50%, transparent);--radix-popover-border-color:var(--color-grey-3);--radix-popover-text-color:var(--color-grey-1);--radix-popover-tabs-background:color-mix(
      in srgb,
      var(--color-grey-2) 15%,
      transparent
    );--radix-popover-tabs-button-active-background:var(--color-light);--radix-link-color:var(--color-radix-blue-2);--radix-card-background:var(--color-light);--radix-card-text-color:var(--color-grey-1);--radix-card-text-dimmed-color:var(--color-grey-2);--radix-card-inverted-background:var(--color-grey-1);--radix-card-inverted-text-color:var(--color-light);--radix-avatar-border-color:var(--color-grey-5);--radix-mask-background:color-mix(
      in srgb,
      var(--color-light) 50%,
      transparent
    );--radix-button-background:color-mix(
      in srgb,
      var(--color-light) 80%,
      transparent
    );--radix-button-background-hover:var(--color-light);--radix-button-background-pressed:var(--color-grey-5);--radix-button-text-color:var(--color-radix-blue-2);--radix-button-disabled-background:color-mix(
      in srgb,
      var(--color-light) 80%,
      transparent
    );--radix-button-disabled-text-color:var(--color-grey-3);color:var(--color-grey-1)}:host([mode=dark]){--radix-popover-background:color-mix(in srgb, #000000 50%, transparent);--radix-popover-border-color:var(--color-dark);--radix-popover-text-color:var(--color-light);--radix-popover-tabs-background:color-mix(
      in srgb,
      var(--color-dark) 60%,
      transparent
    );--radix-popover-tabs-button-active-text-color:var(--color-light);--radix-popover-tabs-button-active-background:#515151;--radix-link-color:var(--color-white);--radix-card-background:#515151;--radix-card-text-color:var(--color-light);--radix-card-text-dimmed-color:var(--color-grey-3);--radix-card-inverted-background:var(--color-grey-5);--radix-card-inverted-text-color:var(--color-grey-1);--radix-avatar-border-color:#656565;--radix-mask-background:color-mix(
      in srgb,
      var(--color-dark) 40%,
      transparent
    );--radix-button-background:color-mix(
      in srgb,
      var(--color-dark) 40%,
      transparent
    );--radix-button-background-hover:var(--color-dark);--radix-button-background-pressed:#414141;--radix-button-text-color:var(--color-light);--radix-button-disabled-background:color-mix(
      in srgb,
      var(--color-dark) 40%,
      transparent
    );--radix-button-disabled-text-color:color-mix(
      in srgb,
      var(--color-light) 20%,
      transparent
    );color:var(--color-light)}:host([theme=radix-blue]){--radix-connect-button-background:var(--color-radix-blue-2);--radix-connect-button-background-hover:var(--color-radix-blue-1);--radix-connect-button-border-color:var(--color-radix-blue-2);--radix-connect-button-text-color:var(--color-light)}:host([theme=black]){--radix-connect-button-background:var(--color-dark);--radix-connect-button-background-hover:#3e3e3e;--radix-connect-button-border-color:var(--color-dark);--radix-connect-button-text-color:var(--color-light)}:host([theme=white-with-outline]){--radix-connect-button-background:var(--color-light);--radix-connect-button-background-hover:var(--color-grey-5);--radix-connect-button-border-color:var(--color-dark);--radix-connect-button-text-color:var(--color-dark)}:host([theme=white]){--radix-connect-button-background:var(--color-light);--radix-connect-button-background-hover:var(--color-grey-5);--radix-connect-button-border-color:var(--color-light);--radix-connect-button-text-color:var(--color-dark)}`;
var Ct = Object.defineProperty;
var yt = Object.getOwnPropertyDescriptor;
var Mt = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? yt(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Ct(i, r, e), e;
};
var U = class extends LitElement {
  constructor() {
    super(...arguments), this.active = "sharing";
  }
  onClick(t, i) {
    this.dispatchEvent(
      new CustomEvent("onClick", {
        detail: { value: t, event: i },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return html`<div class="tabs"><button @click="${(t) => this.onClick("sharing", t)}" class="${classMap({
      active: this.active === "sharing"
    })}">Sharing</button> <button @click="${(t) => this.onClick("requests", t)}" class="${classMap({
      active: this.active === "requests"
    })}">Requests</button><div class="active-indicator"></div></div>`;
  }
};
U.styles = [
  css`:host{display:block;width:100%;user-select:none}.tabs{width:calc(100% - 10px);display:grid;grid-template-columns:1fr 1fr;justify-content:space-between;padding:5px;border-radius:12px;position:relative;background:var(--radix-popover-tabs-background)}button{border:unset;font-size:14px;background:0 0;text-align:center;flex:1;border-radius:8px;font-weight:600;color:var(--radix-popover-text-color);width:100%;height:32px;z-index:1;margin:0;padding:0}button:not(.active){cursor:pointer}.active-indicator{width:calc(50% - 5px);height:32px;border-radius:8px;position:absolute;box-shadow:0 4px 5px 0 #0000001a;background:var(--radix-popover-tabs-button-active-background);top:5px;transition:transform 125ms cubic-bezier(.45,0,.55,1)}:host([active=sharing]) .active-indicator{transform:translateX(5px)}:host([active=requests]) .active-indicator{transform:translateX(calc(100% + 5px))}button:focus,button:focus-visible{outline:0 auto -webkit-focus-ring-color}`
];
Mt([
  property({
    type: String,
    reflect: true
  })
], U.prototype, "active", 2);
U = Mt([
  customElement("radix-tabs-menu")
], U);
var mt = (t) => {
  if (typeof btoa == "function")
    return btoa(t);
  if (typeof Buffer == "function")
    return Buffer.from(t, "utf-8").toString("base64");
  throw new Error("Failed to determine the platform specific encoder");
};
var $ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xNzU4XzE0NjkpIj4KICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNMTkgNi40MUwxNy41OSA1TDEyIDEwLjU5TDYuNDEgNUw1IDYuNDFMMTAuNTkgMTJMNSAxNy41OUw2LjQxIDE5TDEyIDEzLjQxTDE3LjU5IDE5TDE5IDE3LjU5TDEzLjQxIDEyTDE5IDYuNDFaIgogICAgICAgICAgICBmaWxsPSIjMzIzMjMyIiAvPgogICAgPC9nPgogICAgPGRlZnM+CiAgICAgICAgPGNsaXBQYXRoIGlkPSJjbGlwMF8xNzU4XzE0NjkiPgogICAgICAgICAgICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIiAvPgogICAgICAgIDwvY2xpcFBhdGg+CiAgICA8L2RlZnM+Cjwvc3ZnPgogICAg";
var zt = Object.defineProperty;
var wt = Object.getOwnPropertyDescriptor;
var Z = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? wt(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && zt(i, r, e), e;
};
var j = class extends LitElement {
  constructor() {
    super(...arguments), this.connected = false, this.compact = false, this.isMobile = false, this.showCloseButton = false, this.svgBorder = `data:image/svg+xml;base64,${mt('<svg width="352" height="352" viewBox="0 0 352 352" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1.5H339V0.5H13V1.5ZM350.5 13V339H351.5V13H350.5ZM339 350.5H13V351.5H339V350.5ZM1.5 339V13H0.5V339H1.5ZM13 350.5C6.64873 350.5 1.5 345.351 1.5 339H0.5C0.5 345.904 6.09644 351.5 13 351.5V350.5ZM350.5 339C350.5 345.351 345.351 350.5 339 350.5V351.5C345.904 351.5 351.5 345.904 351.5 339H350.5ZM339 1.5C345.351 1.5 350.5 6.64873 350.5 13H351.5C351.5 6.09644 345.904 0.5 339 0.5V1.5ZM13 0.5C6.09644 0.5 0.5 6.09644 0.5 13H1.5C1.5 6.64873 6.64873 1.5 13 1.5V0.5Z" fill="url(#gradient)"/><defs><linearGradient id="gradient" x1="340.017" y1="27.6666" x2="36.936" y2="352.447" gradientUnits="userSpaceOnUse"><stop stop-color="#CE0D98"/><stop offset="0.210873" stop-color="#052CC0"/><stop offset="0.479167" stop-color="#20E4FF"/><stop offset="0.729604" stop-color="#052CC0"/><stop offset="1" stop-color="#21FFBE"/></linearGradient></defs></svg>')}`;
  }
  closePopover() {
    this.dispatchEvent(
      new CustomEvent("onClosePopover", {
        bubbles: true,
        composed: true
      })
    );
  }
  closeButton() {
    return html`<button id="close-button" @click="${() => {
      this.closePopover();
    }}"></button>`;
  }
  render() {
    return html`<style>:host([connected]){border-image:url('${this.svgBorder}') 10/10px stretch;border-image-outset:1px}</style><div id="radix-popover-content">${this.showCloseButton ? this.closeButton() : ""}<slot></slot></div>`;
  }
};
j.styles = [
  H,
  css`:host{user-select:none;display:inline-flex;background-position:center top;background-repeat:no-repeat;justify-content:center;align-items:flex-start;background:var(--radix-popover-background);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);box-sizing:border-box;max-height:100vh;border-radius:12px;padding:12px;border:1px solid var(--radix-popover-border-color);box-shadow:0 11px 35px 0 #00000047}:host([isMobile]){max-width:100%;max-height:calc(100% - 5px)}#radix-popover-content{width:344px;display:flex;justify-content:flex-start;align-items:center;flex-direction:column;overflow:auto}#close-button{-webkit-mask-image:url('${unsafeCSS($)}');mask-image:url('${unsafeCSS($)}');background-color:var(--radix-card-text-color);width:24px;height:24px;background-repeat:no-repeat;align-self:flex-start;margin-bottom:10px;cursor:pointer}#close-button:hover{opacity:.8}@-webkit-keyframes slide-bottom{0%{-webkit-transform:translateY(-10px);transform:translateY(-10px);opacity:0}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@keyframes slide-bottom{0%{-webkit-transform:translateY(-10px);transform:translateY(-10px);opacity:0}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@-webkit-keyframes slide-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}100%{-webkit-transform:translateY(-10px);transform:translateY(-10px);opacity:0}}@keyframes slide-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}100%{-webkit-transform:translateY(-10px);transform:translateY(-10px);opacity:0}}:host(.hide){pointer-events:none;-webkit-animation:slide-up .2s cubic-bezier(.25,.46,.45,.94) both;animation:slide-up .2s cubic-bezier(.25,.46,.45,.94) both}:host(.show){-webkit-animation:slide-bottom .2s cubic-bezier(.25,.46,.45,.94) both;animation:slide-bottom .2s cubic-bezier(.25,.46,.45,.94) both}`
];
Z([
  property({
    type: Boolean
  })
], j.prototype, "connected", 2);
Z([
  property({
    type: Boolean
  })
], j.prototype, "compact", 2);
Z([
  property({
    type: Boolean,
    reflect: true
  })
], j.prototype, "isMobile", 2);
Z([
  property({
    type: Boolean,
    reflect: true
  })
], j.prototype, "showCloseButton", 2);
j = Z([
  customElement("radix-popover")
], j);
var vt = 32;
var Tt = 32;
var G = 138;
var Lt = Object.defineProperty;
var kt = Object.getOwnPropertyDescriptor;
var R = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? kt(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Lt(i, r, e), e;
};
var _ = html`<div class="loading-spinner-container"><div class="loading-spinner"></div></div>`;
var ft = css`.loading-spinner-container{display:flex}@container (max-width: ${G - 16}px){margin-right:0}.loading-spinner{width:22px;height:22px;min-width:22px;min-height:22px;border:2px solid var(--radix-connect-button-text-color);border-left-color:color-mix(in srgb,var(--radix-connect-button-text-color) 30%,transparent);border-top-color:color-mix(in srgb,var(--radix-connect-button-text-color) 30%,transparent);border-bottom-color:color-mix(in srgb,var(--radix-connect-button-text-color) 30%,transparent);border-radius:50%;display:inline-block;box-sizing:border-box;animation:rotation 1s linear infinite;align-self:center}@keyframes rotation{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`;
var w = class extends LitElement {
  constructor() {
    super(...arguments), this.size = 48, this.weight = 5, this.color = "var(--color-grey-2)";
  }
  render() {
    return html`<div class="loading-spinner-container"><div class="loading-spinner" style="${styleMap({
      width: `${this.size}px`,
      height: `${this.size}px`,
      minWidth: `${this.size}px`,
      minHeight: `${this.size}px`,
      border: `${this.weight}px solid color-mix(in srgb, ${this.color} 30%, transparent)`,
      borderBottomColor: this.color
    })}"></div></div>`;
  }
};
w.styles = [
  css`.loading-spinner-container{display:flex}.loading-spinner{border-radius:50%;display:inline-block;box-sizing:border-box;animation:rotation 1s linear infinite;align-self:center}@keyframes rotation{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`
];
R([
  property({
    type: Number
  })
], w.prototype, "size", 2);
R([
  property({
    type: Number
  })
], w.prototype, "weight", 2);
R([
  property({
    type: String
  })
], w.prototype, "color", 2);
w = R([
  customElement("radix-loading-spinner")
], w);
var tt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuNzYzNzEgMTEuNzE4M0M1LjUxNDM0IDExLjcxODMgNS4yNzcyNiAxMS41OTg2IDUuMTI4NjIgMTEuMzkyNUwyLjAyNDQyIDcuMDcwOTdIMFY1LjQ5NzU4SDIuNDI0ODhDMi42NzY3MSA1LjQ5NzU4IDIuOTEyNTYgNS42MTg1MiAzLjA1OTk3IDUuODIzMzdMNS41OTY2NCA5LjM1MzkxTDkuNDY3MzcgMC40NzEzOThDOS41OTI2NiAwLjE4NTEwNCA5Ljg3Mzk3IDAgMTAuMTg0OCAwSDE1LjAyMzVWMS41NzMzOEgxMC42OTdMNi40ODExIDExLjI0NjlDNi4zNjgwOSAxMS41MDYxIDYuMTI2MDkgMTEuNjgzOCA1Ljg0NjAxIDExLjcxMzRDNS44MjAyMSAxMS43MTcxIDUuNzkxOTYgMTEuNzE4MyA1Ljc2MzcxIDExLjcxODNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
var St = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTM4IDQyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGcgZmlsdGVyPSJ1cmwoI3RvcC1sZWZ0LXRlYWwpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLCAwKSI+CiAgICAgICAgPHBhdGgKICAgICAgICAgICAgZD0iTTAuNDA2MzI5IC0zNC40OTU3QzE2LjYxMSAtNDEuODMzMSAzNC42MTc0IC0zNy4wMjU4IDQwLjYyNSAtMjMuNzU4M0M0Ni42MzI1IC0xMC40OTA4IDM4LjM2NjEgNi4yMTI4NiAyMi4xNjE1IDEzLjU1MDNDNS45NTY4NiAyMC44ODc3IC00Mi41MTI3IC0xLjE3MzYgLTQ4LjUyMDIgLTE0LjQ0MTFDLTU0LjUyNzcgLTI3LjcwODcgLTE1Ljc5ODMgLTI3LjE1ODMgMC40MDYzMjkgLTM0LjQ5NTdaIgogICAgICAgICAgICBmaWxsPSIjMjFGRkJFIiAvPgoKICAgICAgICA8ZmlsdGVyIGlkPSJ0b3AtbGVmdC10ZWFsIiB4PSItNzkuMzQzIiB5PSItNjguMTI1NCIgd2lkdGg9IjE1MiIgaGVpZ2h0PSIxMTMiCiAgICAgICAgICAgIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTUuMDk3OSIgLz4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZz4KCgogICAgPGcgZmlsdGVyPSJ1cmwoI2JvdHRvbS1yaWdodC1henVyZSkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIDApIj4KICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNNzcuOTQ4MiAyOC40NjdDODYuNzM2MiAyMi4wODY5IDk4LjA5NSAyMi43NDc4IDEwMy4zMTkgMjkuOTQzQzEwOC41NDIgMzcuMTM4MiAxMDUuNjUzIDQ4LjE0MzIgOTYuODY0OSA1NC41MjMzQzg4LjA3NjggNjAuOTAzNCA1Ni4zNzk5IDUzLjY3MDMgNTEuMTU2MiA0Ni40NzUxQzQ1LjkzMjUgMzkuMjc5OCA2OS4xNjAxIDM0Ljg0NzEgNzcuOTQ4MiAyOC40NjdaIgogICAgICAgICAgICBmaWxsPSIjMjBFNEZGIiAvPgoKICAgICAgICA8ZmlsdGVyIGlkPSJib3R0b20tcmlnaHQtYXp1cmUiIHg9IjI2LjM5OTciIHk9IjAuMDgyNzcxMyIgd2lkdGg9IjEwMyIgaGVpZ2h0PSI4MSIKICAgICAgICAgICAgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMiIgLz4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZz4KCgogICAgPGcgZmlsdGVyPSJ1cmwoI2JvdHRvbS1sZWZ0LWJsdWUpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLCAwKSI+CiAgICAgICAgPHBhdGgKICAgICAgICAgICAgZD0iTTE2LjE0MjEgMjkuNTA5QzI2LjkyNjYgMzQuMDQyNyAzMi41MTE2IDQ1LjIyOTIgMjguNjE2NCA1NC40OTQ5QzI0LjcyMTMgNjMuNzYwNiAxMi44MjExIDY3LjU5NjYgMi4wMzY1OCA2My4wNjNDLTguNzQ3OTIgNTguNTI5MyAtMTkuMjc4MSAyNC4wOTA0IC0xNS4zODMgMTQuODI0N0MtMTEuNDg3OCA1LjU1OTAzIDUuMzU3NjUgMjQuOTc1NCAxNi4xNDIxIDI5LjUwOVoiCiAgICAgICAgICAgIGZpbGw9IiMwNjBGOEYiIC8+CgogICAgICAgIDxmaWx0ZXIgaWQ9ImJvdHRvbS1sZWZ0LWJsdWUiIHg9Ii0zNi4yMTA3IiB5PSItNy42NDk0MSIgd2lkdGg9Ijg2IiBoZWlnaHQ9IjkzIgogICAgICAgICAgICBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwIiAvPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9nPgoKICAgIDxnIGZpbHRlcj0idXJsKCNib3R0b20tcmlnaHQtcHVycGxlKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwgMCkiPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0xMjAuMTM1IDE2LjI2MTNDMTAzLjU3IDE3LjMyMDkgODkuNDM4MiA3LjE4NTI1IDg4LjU3MDcgLTYuMzc3MThDODcuNzAzMiAtMTkuOTM5NiAxMDAuNDI4IC0zMS43OTMgMTE2Ljk5MyAtMzIuODUyNkMxMzMuNTU4IC0zMy45MTIxIDE2OC41ODkgMS4zMzIzMiAxNjkuNDU2IDE0Ljg5NDdDMTcwLjMyNCAyOC40NTcyIDEzNi42OTkgMTUuMjAxOCAxMjAuMTM1IDE2LjI2MTNaIgogICAgICAgICAgICBmaWxsPSIjRkY0M0NBIiAvPgoKICAgICAgICA8ZmlsdGVyIGlkPSJib3R0b20tcmlnaHQtcHVycGxlIiB4PSI0OC41Mjg5IiB5PSItNzIuODc1OSIgd2lkdGg9IjE2MSIgaGVpZ2h0PSIxMzQiCiAgICAgICAgICAgIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMjAiIC8+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2c+Cjwvc3ZnPgogICAg";
var Et = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDIgNDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8Zz4KICAgICAgICA8cGF0aCBmaWx0ZXI9InVybCgjdG9wLWxlZnQtdGVhbCkiCiAgICAgICAgICAgIGQ9Ik0tNS4wMjMyMyAtMTUuMTI2NUMzLjYwMTggLTE5LjU0MTMgMTQuMTAyOCAtMTQuMzU5NyAxOC40MzE1IC0zLjU1Mjk5QzIyLjc2MDEgNy4yNTM2OCAxOS4yNzcyIDE5LjU5MzEgMTAuNjUyMiAyNC4wMDc5QzIuMDI3MTMgMjguNDIyNyAtMjYuODg0NiA3LjM3NTg3IC0zMS4yMTMzIC0zLjQzMDhDLTM1LjU0MTkgLTE0LjIzNzUgLTEzLjY0ODMgLTEwLjcxMTcgLTUuMDIzMjMgLTE1LjEyNjVaIgogICAgICAgICAgICBmaWxsPSIjMjFGRkJFIiAvPgogICAgICAgIDxmaWx0ZXIgaWQ9InRvcC1sZWZ0LXRlYWwiIHg9Ii01MS43NzM3IiB5PSItMzYuNzAxOSIgd2lkdGg9IjkyLjA2NTQiIGhlaWdodD0iODEuMzA5NiIKICAgICAgICAgICAgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMCIgLz4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZz4KICAgIDxnPgogICAgICAgIDxwYXRoIGZpbHRlcj0idXJsKCNib3R0b20tcmlnaHQtYXp1cmUpIgogICAgICAgICAgICBkPSJNMjYuNjA3OSAyOS40NjdDMzQuMzgyIDIzLjA4NjkgNDQuNDMwMiAyMy43NDc3IDQ5LjA1MTIgMzAuOTQzQzUzLjY3MjEgMzguMTM4MiA1MS4xMTYgNDkuMTQzMiA0My4zNDIgNTUuNTIzM0MzNS41Njc5IDYxLjkwMzQgNy41MjgzNiA1NC42NzAzIDIuOTA3NCA0Ny40NzUxQy0xLjcxMzU3IDQwLjI3OTggMTguODMzOSAzNS44NDcxIDI2LjYwNzkgMjkuNDY3WiIKICAgICAgICAgICAgZmlsbD0iIzIwRTRGRiIgLz4KICAgICAgICA8ZmlsdGVyIGlkPSJib3R0b20tcmlnaHQtYXp1cmUiIHg9Ii0xNy43NjE4IiB5PSI1LjA4Mjc2IiB3aWR0aD0iODkuMTE0NSIgaGVpZ2h0PSI3Mi45IgogICAgICAgICAgICBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwIiAvPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9nPgogICAgPGc+CiAgICAgICAgPHBhdGggZmlsdGVyPSJ1cmwoI2JvdHRvbS1sZWZ0LWJsdWUpIgogICAgICAgICAgICBkPSJNMTQuMjc5NiAyOS41MDlDMjMuODE5NyAzNC4wNDI3IDI4Ljc2MDIgNDUuMjI5MiAyNS4zMTQ1IDU0LjQ5NDlDMjEuODY4OCA2My43NjA1IDExLjM0MTcgNjcuNTk2NiAxLjgwMTU4IDYzLjA2M0MtNy43Mzg1NSA1OC41MjkzIC0xNy4wNTM3IDI0LjA5MDQgLTEzLjYwOCAxNC44MjQ3Qy0xMC4xNjIzIDUuNTU5MDQgNC43Mzk0NSAyNC45NzU0IDE0LjI3OTYgMjkuNTA5WiIKICAgICAgICAgICAgZmlsbD0iIzA2MEY4RiIgLz4KICAgICAgICA8ZmlsdGVyIGlkPSJib3R0b20tbGVmdC1ibHVlIiB4PSItMzQuMzQwMiIgeT0iLTcuNjQ5NDEiIHdpZHRoPSI4MC43NTE5IiBoZWlnaHQ9IjkyLjYxNzIiCiAgICAgICAgICAgIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTAiIC8+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2c+CiAgICA8Zz4KICAgICAgICA8cGF0aCBmaWx0ZXI9InVybCgjdG9wLXJpZ2h0LXB1cnBsZSkiCiAgICAgICAgICAgIGQ9Ik01NC4yNDk4IDI3LjQwMDFDMzkuNTA5MSAyOC40NjU5IDI2Ljk4NjUgMTkuMjA0IDI2LjI3OTggNi43MTI5NkMyNS41NzMgLTUuNzc4MDQgMzYuOTQ5NyAtMTYuNzY4IDUxLjY5MDMgLTE3LjgzMzhDNjYuNDMxIC0xOC44OTk3IDk3LjQyNDYgMTMuMzgzMSA5OC4xMzE0IDI1Ljg3NDFDOTguODM4MSAzOC4zNjUxIDY4Ljk5MDQgMjYuMzM0MiA1NC4yNDk4IDI3LjQwMDFaIgogICAgICAgICAgICBmaWxsPSIjRkY0M0NBIiAvPgogICAgICAgIDxmaWx0ZXIgaWQ9InRvcC1yaWdodC1wdXJwbGUiIHg9IjYuMjQ4NTIiIHk9Ii0zNy44NTk2IiB3aWR0aD0iMTExLjg5NSIgaGVpZ2h0PSI4OS40NTA2IgogICAgICAgICAgICBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwIiAvPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9nPgo8L3N2Zz4KICAgIA==";
var et = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMC40IiB5PSIwLjQiIHdpZHRoPSIyMS4yIiBoZWlnaHQ9IjIxLjIiIHJ4PSIxMC42IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8bWFzayBpZD0ibWFzazBfMTg5N18xODg5IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPgo8cmVjdCB4PSIwLjI0OTc1NiIgeT0iMC41IiB3aWR0aD0iMjEuNTExIiBoZWlnaHQ9IjIxLjUxMSIgcng9IjEwLjc1NTUiIGZpbGw9IiNGNEY1RjkiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzE4OTdfMTg4OSkiPgo8Y2lyY2xlIG9wYWNpdHk9IjAuMiIgY3g9IjguODc0MDIiIGN5PSI5LjEyNSIgcj0iMy45NzUiIHN0cm9rZT0iI0NFRDBENiIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPGNpcmNsZSBvcGFjaXR5PSIwLjIiIGN4PSIxMy4xMjQzIiBjeT0iOS4xMjUiIHI9IjMuOTc1IiBzdHJva2U9IiNDRUQwRDYiIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIG9wYWNpdHk9IjAuMiIgZD0iTTIxLjM0OTMgMjEuNUMyMS4zNDkzIDI1LjMwMzQgMTguNDMwNiAyOC4zNSAxNC44NzQzIDI4LjM1QzExLjMxOCAyOC4zNSA4LjM5OTI3IDI1LjMwMzQgOC4zOTkyNyAyMS41QzguMzk5MjcgMTcuNjk2NiAxMS4zMTggMTQuNjUgMTQuODc0MyAxNC42NUMxOC40MzA2IDE0LjY1IDIxLjM0OTMgMTcuNjk2NiAyMS4zNDkzIDIxLjVaIiBzdHJva2U9IiNDRUQwRDYiIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIG9wYWNpdHk9IjAuMiIgZD0iTTEzLjM0OTUgMjEuNUMxMy4zNDk1IDI1LjMwMzQgMTAuNDMwOCAyOC4zNSA2Ljg3NDUxIDI4LjM1QzMuMzE4MjIgMjguMzUgMC4zOTk1MTIgMjUuMzAzNCAwLjM5OTUxMiAyMS41QzAuMzk5NTEyIDE3LjY5NjYgMy4zMTgyMiAxNC42NSA2Ljg3NDUxIDE0LjY1QzEwLjQzMDggMTQuNjUgMTMuMzQ5NSAxNy42OTY2IDEzLjM0OTUgMjEuNVoiIHN0cm9rZT0iI0NFRDBENiIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPGNpcmNsZSBjeD0iMTEiIGN5PSI5IiByPSI0LjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0xNy4zNDkzIDIxLjVDMTcuMzQ5MyAyNS4zMDM0IDE0LjQzMDYgMjguMzUgMTAuODc0MyAyOC4zNUM3LjMxNzk4IDI4LjM1IDQuMzk5MjcgMjUuMzAzNCA0LjM5OTI3IDIxLjVDNC4zOTkyNyAxNy42OTY2IDcuMzE3OTggMTQuNjUgMTAuODc0MyAxNC42NUMxNC40MzA2IDE0LjY1IDE3LjM0OTMgMTcuNjk2NiAxNy4zNDkzIDIxLjVaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8L2c+Cjwvc3ZnPgo=";
var it = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTEwLjUgMC41QzQuOTggMC41IDAuNSA0Ljk4IDAuNSAxMC41QzAuNSAxNi4wMiA0Ljk4IDIwLjUgMTAuNSAyMC41QzE2LjAyIDIwLjUgMjAuNSAxNi4wMiAyMC41IDEwLjVDMjAuNSA0Ljk4IDE2LjAyIDAuNSAxMC41IDAuNVpNMTAuNSAxOC41QzYuMDkgMTguNSAyLjUgMTQuOTEgMi41IDEwLjVDMi41IDYuMDkgNi4wOSAyLjUgMTAuNSAyLjVDMTQuOTEgMi41IDE4LjUgNi4wOSAxOC41IDEwLjVDMTguNSAxNC45MSAxNC45MSAxOC41IDEwLjUgMTguNVpNMTUuMDkgNi4wOEw4LjUgMTIuNjdMNS45MSAxMC4wOUw0LjUgMTEuNUw4LjUgMTUuNUwxNi41IDcuNUwxNS4wOSA2LjA4WiIKICAgICAgICBmaWxsPSJ3aGl0ZSIgLz4KPC9zdmc+CiAgICA=";
var ot = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjMiIHZpZXdCb3g9IjAgMCAyMyAyMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTE1Ljk2ODkgOC41MjA4N0wxNC40NzkzIDcuMDMxMjNMMTEuNSAxMC4wMTA1TDguNTIwNzIgNy4wMzEyM0w3LjAzMTA4IDguNTIwODdMMTAuMDEwNCAxMS41MDAxTDcuMDMxMDggMTQuNDc5NEw4LjUyMDcyIDE1Ljk2OTFMMTEuNSAxMi45ODk4TDE0LjQ3OTMgMTUuOTY5MUwxNS45Njg5IDE0LjQ3OTRMMTIuOTg5NiAxMS41MDAxTDE1Ljk2ODkgOC41MjA4N1pNMTguOTQ4MiA0LjA1MTk1QzE0Ljg0NDIgLTAuMDUyMDAyNCA4LjE1NTc2IC0wLjA1MjAwMjcgNC4wNTE4MSA0LjA1MTk1Qy0wLjA1MjE0NTMgOC4xNTU5IC0wLjA1MjE0NTYgMTQuODQ0NCA0LjA1MTgxIDE4Ljk0ODNDOC4xNTU3NiAyMy4wNTIzIDE0Ljg0NDIgMjMuMDUyMyAxOC45NDgyIDE4Ljk0ODNDMjMuMDUyMSAxNC44NDQ0IDIzLjA1MjEgOC4xNTU5MSAxOC45NDgyIDQuMDUxOTVaTTUuNTQxNDUgMTcuNDU4N0MyLjI1Njc5IDE0LjE3NCAyLjI1Njc5IDguODI2MjQgNS41NDE0NSA1LjU0MTU5QzguODI2MSAyLjI1Njk0IDE0LjE3MzkgMi4yNTY5NCAxNy40NTg2IDUuNTQxNTlDMjAuNzQzMiA4LjgyNjI0IDIwLjc0MzIgMTQuMTc0IDE3LjQ1ODYgMTcuNDU4N0MxNC4xNzM5IDIwLjc0MzMgOC44MjYxIDIwLjc0MzMgNS41NDE0NSAxNy40NTg3WiIKICAgICAgICBmaWxsPSJ3aGl0ZSIgLz4KPC9zdmc+CiAgICA=";
var z = {
  pending: "pending",
  success: "success",
  error: "error",
  default: "default"
};
var m = {
  pending: "pending",
  success: "success",
  fail: "fail",
  cancelled: "cancelled",
  ignored: "ignored"
};
var Zt = Object.defineProperty;
var Ot = Object.getOwnPropertyDescriptor;
var O = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Ot(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Zt(i, r, e), e;
};
var C = class extends LitElement {
  constructor() {
    super(...arguments), this.status = z.default, this.connected = false, this.fullWidth = false, this.theme = "radix-blue";
  }
  onClick(t) {
    this.dispatchEvent(
      new CustomEvent("onClick", {
        detail: t,
        bubbles: true,
        composed: true
      })
    );
  }
  connectedCallback() {
    super.connectedCallback(), setTimeout(() => {
      const t = this.shadowRoot.querySelector("button");
      this.resizeObserver = new ResizeObserver(() => {
        this.dispatchEvent(
          new CustomEvent("onResize", {
            bubbles: true,
            composed: false,
            detail: t
          })
        );
      }), this.resizeObserver.observe(t);
    });
  }
  disconnectedCallback() {
    var i;
    super.disconnectedCallback();
    const t = this.shadowRoot.querySelector("button");
    (i = this.resizeObserver) == null || i.unobserve(t);
  }
  render() {
    const t = () => this.status === z.pending && this.connected ? html`${_} <slot></slot>` : this.status === z.pending ? _ : !this.connected && ["success", "error"].includes(this.status) ? "" : html`<slot></slot>`, i = this.status !== "pending" && !this.connected, r = this.connected;
    return html`
      <button
        @click=${this.onClick}
        class=${classMap({
      logo: i,
      gradient: r
    })}
        aria-label="Radix Connect Button"
      >
        ${t()}
      </button>
    `;
  }
};
C.styles = [
  H,
  ft,
  css`
      :host {
        width: max(var(--radix-connect-button-width, 138px), 40px);
        min-width: 40px;
        display: flex;
        justify-content: flex-end;
        container-type: inline-size;
        user-select: none;
        --radix-connect-button-text-color: var(--color-light);
      }

      :host([full-width]) > button {
        width: 100%;
      }

      :host([full-width]) {
        width: 100%;
        display: inline-block;
      }

      ::slotted(*) {
        overflow: hidden;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
        width: auto;
      }

      .gradient ::slotted(*) {
        padding: 0 4px;
      }

      button {
        width: max(var(--radix-connect-button-width, 138px), 40px);
        height: var(--radix-connect-button-height, 40px);
        min-width: ${Tt}px;
        min-height: ${vt}px;
        border-radius: var(--radix-connect-button-border-radius, 0);
        background-color: var(--radix-connect-button-background);
        border: 1px solid var(--radix-connect-button-border-color);
        color: var(--radix-connect-button-text-color);
        font-size: 14px;
        align-content: center;
        align-items: center;
        font-family: inherit;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.1s cubic-bezier(0.45, 0, 0.55, 1);

        display: flex;
        gap: 3px;
        justify-content: center;
        padding: 0 10px;
      }

      button::before {
        min-height: 0.94em;
        min-width: 1.25em;
        display: block;
        -webkit-mask-position: center right;
        mask-position: center right;
        mask-repeat: no-repeat;
        -webkit-mask-repeat: no-repeat;
        background-color: var(--radix-connect-button-text-color);
        width: 16px;
      }

      button:hover {
        background-color: var(--radix-connect-button-background-hover);
      }

      button.logo::before {
        content: '';
        mask-image: url(${unsafeCSS(tt)});
        -webkit-mask-image: url(${unsafeCSS(tt)});
      }

      button.gradient.logo::before {
        background-color: var(--color-light);
      }

      :host([status='pending']) > button.gradient::before {
        display: none;
      }

      button.gradient {
        border: 1px solid transparent;
        background-repeat: no-repeat;
        background-origin: border-box;
        background-size: cover;
        background-position: center;
        background-color: var(--color-radix-blue-2);
        color: var(--color-light);
        background-image: url(${unsafeCSS(St)});
        padding-right: 7px;
      }

      button.gradient::before {
        content: '';
        background-color: var(--color-light);
      }

      :host([status='default']) > button.gradient::before {
        mask-image: url(${unsafeCSS(et)});
        -webkit-mask-image: url(${unsafeCSS(et)});
        width: 22px;
        min-width: 22px;
        height: 22px;
        -webkit-mask-position: center;
        mask-position: center;
      }

      :host([status='success']) > button::before {
        mask-image: url(${unsafeCSS(it)});
        -webkit-mask-image: url(${unsafeCSS(it)});
        width: 22px;
        min-width: 22px;
        height: 22px;
        -webkit-mask-position: center;
        mask-position: center;
      }

      :host([status='error']) > button::before {
        mask-image: url(${unsafeCSS(ot)});
        -webkit-mask-image: url(${unsafeCSS(ot)});
        width: 22px;
        min-width: 22px;
        height: 22px;
        -webkit-mask-position: center;
        mask-position: center;
      }

      button.gradient:hover {
        background-color: var(--color-radix-blue-1);
      }

      button:focus,
      button:focus-visible {
        outline: 0px auto -webkit-focus-ring-color;
      }

      @container (width < ${G - 0.1}px) {
        button {
          width: var(--radix-connect-button-height, 40px);
          max-width: ${G}px;
          max-height: ${G}px;
          justify-content: center;
          padding: 0;
        }
        button::before {
          -webkit-mask-position: center;
          mask-position: center;
        }
        button.gradient {
          background-image: url(${unsafeCSS(Et)});
          padding: 0;
        }
        button.logo::before {
          font-size: 16px;
        }
        ::slotted(*) {
          display: none;
        }
      }
    `
];
O([
  property({
    type: String,
    reflect: true
  })
], C.prototype, "status", 2);
O([
  property({
    type: Boolean
  })
], C.prototype, "connected", 2);
O([
  property({
    type: Boolean,
    reflect: true
  })
], C.prototype, "fullWidth", 2);
O([
  property({
    type: String,
    reflect: true
  })
], C.prototype, "theme", 2);
C = O([
  customElement("radix-button")
], C);
var rt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xMDU5Xzg3NikiPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0xMiAyLjVDNi40OCAyLjUgMiA2Ljk4IDIgMTIuNUMyIDE4LjAyIDYuNDggMjIuNSAxMiAyMi41QzE3LjUyIDIyLjUgMjIgMTguMDIgMjIgMTIuNUMyMiA2Ljk4IDE3LjUyIDIuNSAxMiAyLjVaTTEyIDIwLjVDNy41OCAyMC41IDQgMTYuOTIgNCAxMi41QzQgOC4wOCA3LjU4IDQuNSAxMiA0LjVDMTYuNDIgNC41IDIwIDguMDggMjAgMTIuNUMyMCAxNi45MiAxNi40MiAyMC41IDEyIDIwLjVaIgogICAgICAgICAgICBmaWxsPSIjMDAzMDU3IiAvPgogICAgPC9nPgogICAgPGRlZnM+CiAgICAgICAgPGNsaXBQYXRoIGlkPSJjbGlwMF8xMDU5Xzg3NiI+CiAgICAgICAgICAgIDxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMC41KSIgLz4KICAgICAgICA8L2NsaXBQYXRoPgogICAgPC9kZWZzPgo8L3N2Zz4KICAgIA==";
var at = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzYxNF8yODQ4KSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMiAxMkMyIDYuNDggNi40OCAyIDEyIDJDMTcuNTIgMiAyMiA2LjQ4IDIyIDEyQzIyIDE3LjUyIDE3LjUyIDIyIDEyIDIyQzYuNDggMjIgMiAxNy41MiAyIDEyWk03LjgxNjYxIDEyLjAwMDlMMTAuMjQ5MSAxNC40MzM0TDE2LjQyNjYgOC4yNjE3MkwxNy4yNDkxIDkuMDg0MjJMMTAuMjQ5MSAxNi4wODQyTDYuOTg4MjggMTIuODIzNEw3LjgxNjYxIDEyLjAwMDlaIiBmaWxsPSIjMDAzMDU3Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfNjE0XzI4NDgiPgo8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";
var nt = "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMiwxQTExLDExLDAsMSwwLDIzLDEyLDExLDExLDAsMCwwLDEyLDFabTAsMTlhOCw4LDAsMSwxLDgtOEE4LDgsMCwwLDEsMTIsMjBaIiBvcGFjaXR5PSIuMjUiLz4KPHBhdGggZD0iTTEwLjE0LDEuMTZhMTEsMTEsMCwwLDAtOSw4LjkyQTEuNTksMS41OSwwLDAsMCwyLjQ2LDEyLDEuNTIsMS41MiwwLDAsMCw0LjExLDEwLjdhOCw4LDAsMCwxLDYuNjYtNi42MUExLjQyLDEuNDIsMCwwLDAsMTIsMi42OWgwQTEuNTcsMS41NywwLDAsMCwxMC4xNCwxLjE2WiIvPgo8L3N2Zz4=";
var st = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KICA8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNjE0XzI4NDkpIj4KICAgIDxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMkMyIDE3LjUyIDYuNDggMjIgMTIgMjJDMTcuNTIgMjIgMjIgMTcuNTIgMjIgMTJDMjIgNi40OCAxNy41MiAyIDEyIDJaTSAxMS4xOTQzIDEyIEwgOCA4LjgwNTcxIEwgOC44MDU3MSA4IEwgMTIgMTEuMTk0MyBMIDE1LjE5NDMgOCBMIDE2IDguODA1NzEgTCAxMi44MDU3IDEyIEwgMTYgMTUuMTk0MyBMIDE1LjE5NDMgMTYgTCAxMiAxMi44MDU3IEwgOC44MDU3MSAxNiBMIDggMTUuMTk0MyBaIiBmaWxsPSIjOEE4RkE0Ii8+CiAgPC9nPgogIDxkZWZzPgogICAgPGNsaXBQYXRoIGlkPSJjbGlwMF82MTRfMjg0OSI+CiAgICAgIDxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0id2hpdGUiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgo8L3N2Zz4=";
var gt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzI4MjJfMTkzMykiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJDMiAxNy41MiA2LjQ4IDIyIDEyIDIyQzE3LjUyIDIyIDIyIDE3LjUyIDIyIDEyQzIyIDYuNDggMTcuNTIgMiAxMiAyWk0xNyAxM0g3VjExSDE3VjEzWiIgZmlsbD0iIzAwMzA1NyIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzI4MjJfMTkzMyI+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";
var Pt = (t) => {
  const i = /* @__PURE__ */ new Date();
  return t.getDate() == i.getDate() && t.getMonth() == i.getMonth() && t.getFullYear() == i.getFullYear();
};
var Gt = (t) => {
  const i = /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() - 1), t.getDate() == i.getDate() && t.getMonth() == i.getMonth() && t.getFullYear() == i.getFullYear();
};
var ut = (t, i = " ") => {
  const r = new Date(Number(t)), o = Pt(r), e = Gt(r), a = r.toLocaleTimeString("en-Gb", {
    // en-GB is causing midnight to be 00:00
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });
  return o ? `Today${i}${a}` : e ? `Yesterday${i}${a}` : `${r.getDate()} ${r.toLocaleString("en-US", {
    month: "short"
  })}${i}${a}`;
};
var Ut = Object.defineProperty;
var Yt = Object.getOwnPropertyDescriptor;
var V = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Yt(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Ut(i, r, e), e;
};
var v = class extends LitElement {
  constructor() {
    super(...arguments), this.header = "";
  }
  render() {
    const t = () => this.timestamp ? html`<div class="timestamp">${ut(this.timestamp)}</div>` : "", i = `${this.icon ? "30px" : ""} 1fr ${this.timestamp ? "42px" : ""}`;
    return html`<div class="card" style="${styleMap({ gridTemplateColumns: i })}"><i></i><div class="content"><span>${this.header}</span><slot></slot></div>${t()}</div>`;
  }
};
v.styles = [
  css`:host{background-color:var(--radix-card-background);color:var(--radix-card-text-color);display:block;padding:11px 20px;user-select:none;border-radius:12px;width:100%;box-sizing:border-box}:host(.inverted){background-color:var(--radix-card-inverted-background);color:var(--radix-card-inverted-text-color)}:host(.inverted) .card i::before{background-color:var(--radix-card-inverted-text-color)}:host(.dimmed) .card i::before{background-color:var(--radix-card-text-dimmed-color)}:host(.dimmed) .content{color:var(--radix-card-text-dimmed-color)}.timestamp{text-align:right;color:var(--radix-card-text-dimmed-color);font-size:12px}.card{display:grid;align-items:center;column-gap:10px}i::before{content:'';display:block;-webkit-mask-size:cover;mask-size:cover;background-color:var(--radix-card-text-color)}span{display:block;font-weight:600;font-size:14px}p{margin:0}:host([icon=unchecked]) i::before{-webkit-mask-image:url('${unsafeCSS(rt)}');mask-image:url('${unsafeCSS(rt)}');width:24px;height:24px}:host([icon=pending]) i::before{-webkit-mask-image:url('${unsafeCSS(nt)}');mask-image:url('${unsafeCSS(nt)}');width:24px;height:24px;transform-origin:center;animation:spinner .75s infinite linear}@keyframes spinner{100%{transform:rotate(360deg)}}:host([icon=ignored]) i::before{-webkit-mask-image:url('${unsafeCSS(gt)}');mask-image:url('${unsafeCSS(gt)}');width:24px;height:24px}:host([icon=checked]) i::before{-webkit-mask-image:url('${unsafeCSS(at)}');mask-image:url('${unsafeCSS(at)}');width:24px;height:24px}:host([icon=error]) i::before{-webkit-mask-image:url('${unsafeCSS(st)}');mask-image:url('${unsafeCSS(st)}');width:24px;height:24px}`
];
V([
  property({
    type: String,
    reflect: true
  })
], v.prototype, "icon", 2);
V([
  property({
    type: String
  })
], v.prototype, "header", 2);
V([
  property({
    type: String,
    reflect: true
  })
], v.prototype, "timestamp", 2);
v = V([
  customElement("radix-card")
], v);
var ct = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNiAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzE0MDNfMTI3MSkiPgo8cGF0aCBkPSJNNS45OTkzNSAzLjgzMzk4VjUuMTY3MzJIMTAuMzkyN0wyLjY2NjAyIDEyLjg5NEwzLjYwNjAyIDEzLjgzNEwxMS4zMzI3IDYuMTA3MzJWMTAuNTAwN0gxMi42NjZWMy44MzM5OEg1Ljk5OTM1WiIgZmlsbD0iIzhBOEZBNCIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzE0MDNfMTI3MSI+CjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMC41KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";
var Wt = Object.defineProperty;
var Bt = Object.getOwnPropertyDescriptor;
var xt = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Bt(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Wt(i, r, e), e;
};
var Y = class extends LitElement {
  constructor() {
    super(...arguments), this.displayText = "";
  }
  render() {
    return html`<span class="link">${this.displayText} <i class="icon-north-east-arrow"></i></span>`;
  }
};
Y.styles = [
  css`.link{color:var(--radix-link-color);font-weight:600;text-decoration:none;display:flex;gap:4px;align-items:center;font-size:14px;cursor:pointer}.icon-north-east-arrow::before{content:'';display:block;-webkit-mask-size:cover;mask-size:cover;background-color:var(--radix-card-text-dimmed-color);-webkit-mask-image:url('${unsafeCSS(ct)}');mask-image:url('${unsafeCSS(ct)}');width:16px;height:16px}`
];
xt([
  property({
    type: String
  })
], Y.prototype, "displayText", 2);
Y = xt([
  customElement("radix-link")
], Y);
var At = "data:image/png;base64,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";
var Qt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMyAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIG9wYWNpdHk9IjAuOCI+CiAgICAgICAgPHBhdGggb3BhY2l0eT0iMC44IgogICAgICAgICAgICBkPSJNOC4xMjQ5OCAwLjU0MTc0OEgyLjE2NjY1QzEuNTcwODEgMC41NDE3NDggMS4wODMzMSAxLjAyOTI1IDEuMDgzMzEgMS42MjUwOFY4LjY2Njc1QzEuMDgzMzEgOC45NjQ2NiAxLjMyNzA2IDkuMjA4NDEgMS42MjQ5OCA5LjIwODQxQzEuOTIyOSA5LjIwODQxIDIuMTY2NjUgOC45NjQ2NiAyLjE2NjY1IDguNjY2NzVWMi4xNjY3NUMyLjE2NjY1IDEuODY4ODMgMi40MTA0IDEuNjI1MDggMi43MDgzMSAxLjYyNTA4SDguMTI0OThDOC40MjI5IDEuNjI1MDggOC42NjY2NSAxLjM4MTMzIDguNjY2NjUgMS4wODM0MUM4LjY2NjY1IDAuNzg1NDk4IDguNDIyOSAwLjU0MTc0OCA4LjEyNDk4IDAuNTQxNzQ4Wk0xMC4yOTE2IDIuNzA4NDFINC4zMzMzMUMzLjczNzQ4IDIuNzA4NDEgMy4yNDk5OCAzLjE5NTkxIDMuMjQ5OTggMy43OTE3NVYxMS4zNzUxQzMuMjQ5OTggMTEuOTcwOSAzLjczNzQ4IDEyLjQ1ODQgNC4zMzMzMSAxMi40NTg0SDEwLjI5MTZDMTAuODg3NSAxMi40NTg0IDExLjM3NSAxMS45NzA5IDExLjM3NSAxMS4zNzUxVjMuNzkxNzVDMTEuMzc1IDMuMTk1OTEgMTAuODg3NSAyLjcwODQxIDEwLjI5MTYgMi43MDg0MVpNOS43NDk5OCAxMS4zNzUxSDQuODc0OThDNC41NzcwNiAxMS4zNzUxIDQuMzMzMzEgMTEuMTMxMyA0LjMzMzMxIDEwLjgzMzRWNC4zMzM0MUM0LjMzMzMxIDQuMDM1NSA0LjU3NzA2IDMuNzkxNzUgNC44NzQ5OCAzLjc5MTc1SDkuNzQ5OThDMTAuMDQ3OSAzLjc5MTc1IDEwLjI5MTYgNC4wMzU1IDEwLjI5MTYgNC4zMzM0MVYxMC44MzM0QzEwLjI5MTYgMTEuMTMxMyAxMC4wNDc5IDExLjM3NTEgOS43NDk5OCAxMS4zNzUxWiIKICAgICAgICAgICAgZmlsbD0id2hpdGUiIC8+CiAgICA8L2c+Cjwvc3ZnPgogICAg";
var Nt = (t) => t ? `${t.slice(0, 4)}...${t.slice(
  t.length - 6,
  t.length
)}` : "";
var Ht = Object.defineProperty;
var Rt = Object.getOwnPropertyDescriptor;
var k = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Rt(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Ht(i, r, e), e;
};
var A = class extends LitElement {
  constructor() {
    super(...arguments), this.address = "", this.label = "", this.appearanceId = 0, this.tooltipVisible = false, this.copiedTooltipTimeout = 1500;
  }
  disconnectedCallback() {
    this.setTimeoutInstance && clearTimeout(this.setTimeoutInstance), super.disconnectedCallback();
  }
  render() {
    return html`<span class="label">${this.label}</span> <a class="address" target="_blank" href="${`${this.address}`}" @click="${(t) => {
      t.preventDefault(), this.dispatchEvent(
        new CustomEvent("onLinkClick", {
          bubbles: true,
          composed: true,
          detail: { type: "account", data: this.address }
        })
      );
    }}">${Nt(this.address)} <button aria-label="Copied!" class="${classMap({
      "tooltip-wrapper": true,
      "tooltip-visible": this.tooltipVisible
    })}"><i @click="${(t) => {
      t.preventDefault(), t.stopImmediatePropagation(), navigator.clipboard.writeText(this.address), this.tooltipVisible = true, this.setTimeoutInstance = setTimeout(() => {
        this.tooltipVisible = false;
      }, this.copiedTooltipTimeout);
    }}"></i></button></a>`;
  }
};
A.styles = [
  css`:host{display:flex;width:100%;box-sizing:border-box;justify-content:space-between;margin-top:.5rem;border-radius:12px;color:var(--color-light);font-size:14px;height:40px;align-items:center;padding:0 20px}.tooltip-wrapper{all:unset;display:inline-flex;position:relative}.tooltip-wrapper::after,.tooltip-wrapper::before{transition:opacity .1s ease-out .2s}.tooltip-wrapper::after{background:#000;color:#fff;border-radius:8px;content:attr(aria-label);padding:.5rem 1rem;position:absolute;white-space:nowrap;z-index:10;opacity:0;pointer-events:none;transform:translate(-70%,-30%);bottom:100%}.tooltip-wrapper::before{content:'';position:absolute;z-index:10;opacity:0;pointer-events:none;width:0;height:0;border:8px solid transparent;border-top-color:#000;transform:translate(-15%,25%);bottom:100%}.tooltip-wrapper.tooltip-visible::after,.tooltip-wrapper.tooltip-visible::before{opacity:1}.label{font-weight:600;color:var(--color-light);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:10px}a{color:var(--color-light);display:flex;align-items:center;gap:4px;opacity:.8;font-size:12px}i{background-image:url('${unsafeCSS(Qt)}');display:inline-block;background-repeat:no-repeat;background-size:cover;background-position:center bottom;width:13px;height:13px}.label,a,i{text-shadow:0 4px 3px rgba(0,0,0,.08)}:host([appearanceId='0']){background:linear-gradient(276.58deg,#01e2a0 -.6%,#052cc0 102.8%)}:host([appearanceId='1']){background:linear-gradient(276.33deg,#ff43ca -14.55%,#052cc0 102.71%)}:host([appearanceId='2']){background:linear-gradient(276.33deg,#20e4ff -14.55%,#052cc0 102.71%)}:host([appearanceId='3']){background:linear-gradient(94.8deg,#00ab84 -1.2%,#052cc0 103.67%)}:host([appearanceId='4']){background:linear-gradient(94.62deg,#ce0d98 -10.14%,#052cc0 104.1%)}:host([appearanceId='5']){background:linear-gradient(276.33deg,#052cc0 -14.55%,#0dcae4 102.71%)}:host([appearanceId='6']){background:linear-gradient(90.89deg,#003057 -2.21%,#03d597 102.16%)}:host([appearanceId='7']){background:linear-gradient(276.23deg,#f31dbe -2.1%,#003057 102.67%)}:host([appearanceId='8']){background:linear-gradient(276.48deg,#003057 -.14%,#052cc0 102.77%)}:host([appearanceId='9']){background:linear-gradient(276.32deg,#1af4b5 -5.15%,#0ba97d 102.7%)}:host([appearanceId='10']){background:linear-gradient(276.23deg,#e225b3 -2.1%,#7e0d5f 102.67%)}:host([appearanceId='11']){background:linear-gradient(276.48deg,#1f48e2 -.14%,#040b72 102.77%)}`
];
k([
  property({
    type: String
  })
], A.prototype, "address", 2);
k([
  property({
    type: String
  })
], A.prototype, "label", 2);
k([
  property({
    type: Number,
    reflect: true
  })
], A.prototype, "appearanceId", 2);
k([
  state()
], A.prototype, "tooltipVisible", 2);
k([
  state()
], A.prototype, "setTimeoutInstance", 2);
A = k([
  customElement("radix-account")
], A);
var Vt = Object.defineProperty;
var Xt = Object.getOwnPropertyDescriptor;
var h = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Xt(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Vt(i, r, e), e;
};
var x = class extends LitElement {
  constructor() {
    super(...arguments), this.type = "dataRequest", this.status = "pending", this.showCancel = false, this.showIgnore = false, this.timestamp = "", this.id = "", this.transactionIntentHash = "";
  }
  render() {
    const t = this.getIconFromStatus(), i = this.getStylingFromStatus(), r = {
      sendTransaction: {
        pending: "Pending Transaction",
        fail: "Transaction Failed",
        cancelled: "Transaction Cancelled",
        ignored: "Transaction Ignored",
        success: "Send transaction",
        content: html`${this.renderTxIntentHash()} ${this.status === "pending" ? html`<div class="request-content">Open your Radix Wallet app to review the transaction ${this.showCancel ? html`<div class="cancel" @click="${this.onCancel}">Cancel</div>` : html`<div class="cancel" @click="${this.onIgnore}">Ignore</div>`}</div>` : ""}`
      },
      dataRequest: {
        pending: "Data Request Pending",
        fail: "Data Request Rejected",
        cancelled: "Data Request Rejected",
        ignored: "",
        success: "Data Request",
        content: this.getRequestContentTemplate(
          "Open Your Radix Wallet App to complete the request"
        )
      },
      loginRequest: {
        pending: "Login Request Pending",
        fail: "Login Request Rejected",
        cancelled: "Login Request Rejected",
        success: "Login Request",
        ignored: "",
        content: this.getRequestContentTemplate(
          "Open Your Radix Wallet App to complete the request"
        )
      }
    };
    return html`<radix-card icon="${t}" class="${i}" timestamp="${this.timestamp}" header="${r[this.type][this.status]}">${r[this.type].content}</radix-card>`;
  }
  getRequestContentTemplate(t) {
    return this.status === m.pending ? html`<div class="request-content">${t} ${this.showCancel ? html`<div class="cancel" @click="${this.onCancel}">Cancel</div>` : ""}</div>` : "";
  }
  isErrorStatus(t) {
    return [
      m.cancelled,
      m.fail,
      m.ignored
    ].includes(t);
  }
  getIconFromStatus() {
    return this.status === m.pending ? "pending" : this.status === m.ignored ? "ignored" : this.isErrorStatus(this.status) ? "error" : "checked";
  }
  getStylingFromStatus() {
    return classMap({
      dimmed: this.isErrorStatus(this.status),
      inverted: this.status === "pending"
    });
  }
  onCancel(t) {
    this.dispatchEvent(
      new CustomEvent("onCancelRequestItem", {
        detail: {
          ...t,
          id: this.id
        },
        bubbles: true,
        composed: true
      })
    );
  }
  onIgnore(t) {
    this.dispatchEvent(
      new CustomEvent("onIgnoreTransactionItem", {
        detail: {
          ...t,
          id: this.id
        },
        bubbles: true,
        composed: true
      })
    );
  }
  renderTxIntentHash() {
    return this.transactionIntentHash ? html`<div class="transaction"><span class="text-dimmed">ID:</span><radix-link displayText="${Nt(this.transactionIntentHash)}" @click="${(t) => {
      t.preventDefault(), this.dispatchEvent(
        new CustomEvent("onLinkClick", {
          bubbles: true,
          composed: true,
          detail: {
            type: "transaction",
            data: this.transactionIntentHash
          }
        })
      );
    }}"></radix-link></div>` : "";
  }
};
x.styles = [
  css`:host{display:flex;width:100%;margin-bottom:10px}.text-dimmed{color:var(--radix-card-text-dimmed-color);margin-right:5px}.transaction{font-weight:600;text-decoration:none;display:flex;align-items:center;font-size:14px}.cancel{cursor:pointer;text-decoration:underline}.request-content{margin-top:5px;display:flex;flex-direction:column;gap:10px;font-size:14px}`
];
h([
  property({
    type: String
  })
], x.prototype, "type", 2);
h([
  property({
    type: String
  })
], x.prototype, "status", 2);
h([
  property({
    type: Boolean
  })
], x.prototype, "showCancel", 2);
h([
  property({
    type: Boolean
  })
], x.prototype, "showIgnore", 2);
h([
  property({
    type: String
  })
], x.prototype, "timestamp", 2);
h([
  property({
    type: String
  })
], x.prototype, "id", 2);
h([
  property({
    type: String
  })
], x.prototype, "transactionIntentHash", 2);
x = h([
  customElement("radix-request-card")
], x);
var Jt = Object.defineProperty;
var Ft = Object.getOwnPropertyDescriptor;
var bt = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Ft(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Jt(i, r, e), e;
};
var W = class extends LitElement {
  constructor() {
    super(...arguments), this.requestItems = [];
  }
  render() {
    return (this.requestItems || []).map(
      (t) => html`<radix-request-card type="${t.type}" status="${t.status}" id="${t.interactionId}" ?showCancel="${t.showCancel}" timestamp="${t.createdAt}"></radix-request-card>`
    );
  }
};
W.styles = [H];
bt([
  property({ type: Array })
], W.prototype, "requestItems", 2);
W = bt([
  customElement("radix-request-cards")
], W);
var Kt = Object.defineProperty;
var qt = Object.getOwnPropertyDescriptor;
var $t = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? qt(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Kt(i, r, e), e;
};
var F = class extends LitElement {
  render() {
    return html`<button><slot></slot></button>`;
  }
};
F.styles = [
  css`button{transition:background-color .1s cubic-bezier(.45,0,.55,1);border-radius:12px;border:none;background:var(--radix-button-background);color:var(--radix-button-text-color);font-size:14px;font-weight:600;padding:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px}button:hover{background:var(--radix-button-background-hover)}button:active{background:var(--radix-button-background-pressed)}:host(.primary) button{background:var(--color-radix-blue-2);color:var(--color-light)}:host(.full) button{width:100%}:host(.disabled) button,:host(.primary.disabled) button{background:var(--radix-button-disabled-background);color:var(--radix-button-disabled-text-color);cursor:default;pointer-events:none}`
];
F = $t([
  customElement("radix-themed-button")
], F);
var _t = Object.defineProperty;
var te = Object.getOwnPropertyDescriptor;
var f = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? te(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && _t(i, r, e), e;
};
var N = class extends LitElement {
  constructor() {
    super(...arguments), this.isMobile = false, this.status = z.default, this.isWalletLinked = false, this.isExtensionAvailable = false, this.requestItems = [];
  }
  render() {
    let t = this.renderConnectTemplate();
    return !this.isExtensionAvailable && !this.isMobile ? t = this.renderCeNotInstalledTemplate() : !this.isWalletLinked && !this.isMobile ? t = this.renderCeNotLinkedTemplate() : this.status === z.pending && (t = this.renderRequestItemsTemplate()), html`<div class="wrapper connect-your-wallet"><img width="44" height="44" src="${At}" alt="Radix Logo"> <span class="text connect">Connect Your Radix Wallet</span></div>${t}`;
  }
  renderRequestItemsTemplate() {
    return html`<radix-request-cards class="request-cards" .requestItems="${this.requestItems}"></radix-request-cards>`;
  }
  connectNowButtonTemplate() {
    const t = (!this.isExtensionAvailable || !this.isWalletLinked) && !this.isMobile, i = this.isMobile ? html`<div class="cta-link"><radix-link displayText="Don't have the Radix Wallet?" @click="${() => {
      this.dispatchEvent(
        new CustomEvent("onLinkClick", {
          bubbles: true,
          composed: true,
          detail: { type: "getWallet" }
        })
      );
    }}"></radix-link></div>` : html``;
    return html`<radix-themed-button class="${classMap({
      full: true,
      primary: true,
      disabled: t
    })}" @click="${() => {
      t || this.dispatchEvent(
        new CustomEvent("onConnect", {
          bubbles: true,
          composed: true
        })
      );
    }}">Connect Now</radix-themed-button>${i}`;
  }
  renderCeNotInstalledTemplate() {
    return html`<div class="info">Before you can connect your Radix Wallet, you need the Radix Connector browser extension.</div><div class="cta-link"><radix-link displayText="Download and Setup Guide" @click="${() => {
      this.dispatchEvent(
        new CustomEvent("onLinkClick", {
          bubbles: true,
          composed: true,
          detail: { type: "setupGuide" }
        })
      );
    }}"></radix-link></div>${this.connectNowButtonTemplate()}`;
  }
  renderCeNotLinkedTemplate() {
    return html`<div class="info">To connect your Radix Wallet, you need to link it to your Radix Connector browser extension using a QR code.</div><radix-themed-button class="primary full" @click="${() => {
      this.dispatchEvent(
        new CustomEvent("onLinkClick", {
          bubbles: true,
          composed: true,
          detail: { type: "showQrCode" }
        })
      );
    }}">Open QR Code to Link Wallet</radix-themed-button><div class="cta-link"><radix-link displayText="Download and Setup Guide" @click="${() => {
      this.dispatchEvent(
        new CustomEvent("onLinkClick", {
          bubbles: true,
          composed: true,
          detail: { type: "setupGuide" }
        })
      );
    }}"></radix-link></div>${this.connectNowButtonTemplate()}`;
  }
  renderConnectTemplate() {
    return html`${this.connectNowButtonTemplate()}`;
  }
};
N.styles = [
  css`:host{width:100%;box-sizing:border-box}.wrapper.connect-your-wallet{display:flex;align-items:center;margin:12px .5rem 1.5rem;line-height:23px;justify-content:center;gap:12px}.request-cards{display:block;max-height:410px;overflow-y:auto}.card{margin-bottom:10px}.info{margin-bottom:20px;padding:0 20px;font-size:14px;line-height:18px;text-align:center}.cta-link{display:flex;justify-content:center;margin:25px 0}.text.connect{color:var(--color-text-primary);font-size:18px;width:7.2rem;font-weight:600;text-align:left}.subtitle{color:var(--radix-card-text-dimmed-color)}.mobile-wrapper{display:flex;flex-direction:column;text-align:center;align-items:center;margin-bottom:18px;margin-top:25px;font-size:14px}.mobile-wrapper .header{font-size:18px;font-weight:600;margin-bottom:5px}.mobile-wrapper .content{font-size:16px;margin-bottom:5px}`
];
f([
  property({
    type: Boolean
  })
], N.prototype, "isMobile", 2);
f([
  property({
    type: String
  })
], N.prototype, "status", 2);
f([
  property({
    type: Boolean
  })
], N.prototype, "isWalletLinked", 2);
f([
  property({
    type: Boolean
  })
], N.prototype, "isExtensionAvailable", 2);
f([
  property({
    type: Array
  })
], N.prototype, "requestItems", 2);
N = f([
  customElement("radix-not-connected-page")
], N);
var ee = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMC43MjcyNzMiIHk9IjAuNzI3MjczIiB3aWR0aD0iNjIuNTQ1NSIgaGVpZ2h0PSI2Mi41NDU1IiByeD0iMzEuMjcyNyIgZmlsbD0iI0UyRTVFRCIgc3Ryb2tlPSIjQ0VEMEQ2IiBzdHJva2Utd2lkdGg9IjEuNDU0NTUiLz4KPG1hc2sgaWQ9Im1hc2swXzExMjgxXzQxNDAiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjEiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCAiPgo8cmVjdCB4PSIwLjcyNjU2MiIgeT0iMS4zMzUwOCIgd2lkdGg9IjYyLjU3NzQiIGhlaWdodD0iNjIuNTc3NCIgcng9IjMxLjI4ODciIGZpbGw9IiNGNEY1RjkiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzExMjgxXzQxNDApIj4KPGNpcmNsZSBvcGFjaXR5PSIwLjIiIGN4PSIyNS44MTcxIiBjeT0iMjYuNTQ1NSIgcj0iMTIiIHN0cm9rZT0iI0NFRDBENiIgc3Ryb2tlLXdpZHRoPSIxLjQ1NDU1Ii8+CjxjaXJjbGUgb3BhY2l0eT0iMC4yIiBjeD0iMzguMTgwNCIgY3k9IjI2LjU0NTUiIHI9IjEyIiBzdHJva2U9IiNDRUQwRDYiIHN0cm9rZS13aWR0aD0iMS40NTQ1NSIvPgo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik02Mi41NDQyIDYyLjU0NTVDNjIuNTQ0MiA3My44Mjg5IDUzLjg3OTYgODIuOTA5MSA0My4yNzE1IDgyLjkwOTFDMzIuNjYzNCA4Mi45MDkxIDIzLjk5ODggNzMuODI4OSAyMy45OTg4IDYyLjU0NTVDMjMuOTk4OCA1MS4yNjIxIDMyLjY2MzQgNDIuMTgxOSA0My4yNzE1IDQyLjE4MTlDNTMuODc5NiA0Mi4xODE5IDYyLjU0NDIgNTEuMjYyMSA2Mi41NDQyIDYyLjU0NTVaIiBzdHJva2U9IiNDRUQwRDYiIHN0cm9rZS13aWR0aD0iMS40NTQ1NSIvPgo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0zOS4yNzE3IDYyLjU0NTVDMzkuMjcxNyA3My44Mjg5IDMwLjYwNzEgODIuOTA5MSAxOS45OTkgODIuOTA5MUM5LjM5MDkgODIuOTA5MSAwLjcyNjI5NiA3My44Mjg5IDAuNzI2Mjk2IDYyLjU0NTVDMC43MjYyOTYgNTEuMjYyMSA5LjM5MDkgNDIuMTgxOSAxOS45OTkgNDIuMTgxOUMzMC42MDcxIDQyLjE4MTkgMzkuMjcxNyA1MS4yNjIxIDM5LjI3MTcgNjIuNTQ1NVoiIHN0cm9rZT0iI0NFRDBENiIgc3Ryb2tlLXdpZHRoPSIxLjQ1NDU1Ii8+CjxjaXJjbGUgY3g9IjMxLjk5OTEiIGN5PSIyNi4xODE5IiByPSIxMi4zNjM2IiBmaWxsPSIjRTJFNUVEIiBmaWxsLW9wYWNpdHk9IjAuNSIgc3Ryb2tlPSIjQ0VEMEQ2IiBzdHJva2Utd2lkdGg9IjEuNDU0NTUiLz4KPHBhdGggZD0iTTUwLjkwODUgNjIuNTQ1NUM1MC45MDg1IDczLjgyODkgNDIuMjQzOSA4Mi45MDkxIDMxLjYzNTcgODIuOTA5MUMyMS4wMjc2IDgyLjkwOTEgMTIuMzYzIDczLjgyODkgMTIuMzYzIDYyLjU0NTVDMTIuMzYzIDUxLjI2MjEgMjEuMDI3NiA0Mi4xODE5IDMxLjYzNTcgNDIuMTgxOUM0Mi4yNDM5IDQyLjE4MTkgNTAuOTA4NSA1MS4yNjIxIDUwLjkwODUgNjIuNTQ1NVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xMTI4MV80MTQwKSIgc3Ryb2tlPSIjQ0VEMEQ2IiBzdHJva2Utd2lkdGg9IjEuNDU0NTUiLz4KPC9nPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzExMjgxXzQxNDAiIHgxPSIzMS42MzU3IiB5MT0iNDUuMDkxIiB4Mj0iMzEuNjM1NyIgeTI9IjU3LjgxODIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0UyRTVFRCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNFMkU1RUQiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";
var ie = Object.defineProperty;
var oe = Object.getOwnPropertyDescriptor;
var P = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? oe(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && ie(i, r, e), e;
};
var y = class extends LitElement {
  constructor() {
    super(...arguments), this.persona = "", this.personaData = [];
  }
  render() {
    return html`<radix-card><div class="${classMap({
      center: (this.personaData || []).length < 2,
      "persona-card": true
    })}"><div class="placeholder"><div class="${classMap({
      avatar: !!this.avatarUrl
    })}" style="${styleMap({
      backgroundImage: `url(${unsafeCSS(this.avatarUrl)})`
    })}"></div></div><div class="content"><span class="persona">${this.persona}</span><ul>${(this.personaData || []).map((t) => html`<li>${t}</li>`)}</ul></div></div></radix-card>`;
  }
};
y.styles = [
  css`:host{display:flex;width:100%}.avatar{background-size:cover;background-repeat:no-repeat;background-position:center;border-radius:50%;width:60px;height:60px;align-self:center;border:2px solid var(--radix-avatar-border-color)}.placeholder{width:64px;height:64px;background-image:url('${unsafeCSS(ee)}')}.persona-card{display:grid;gap:20px;align-items:flex-start;grid-template-columns:1fr 230px}.persona-card.center{align-items:center}.persona{font-size:14px;font-weight:600;text-overflow:ellipsis;overflow:hidden;display:block;white-space:nowrap}ul{margin-top:5px;margin-bottom:0;padding-inline-start:20px}li{font-size:12px;word-break:break-word;line-height:18px}`
];
P([
  property({
    type: String,
    reflect: true
  })
], y.prototype, "icon", 2);
P([
  property({
    type: String
  })
], y.prototype, "persona", 2);
P([
  property({
    type: String
  })
], y.prototype, "avatarUrl", 2);
P([
  property({
    type: Array
  })
], y.prototype, "personaData", 2);
y = P([
  customElement("radix-persona-card")
], y);
var dt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOSAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xMTg4XzQyOCkiPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0xMy43Mzc4IDQuNzYyNUMxMi42NTAzIDMuNjc1IDExLjE1NzggMyA5LjUwMDMxIDNDNi4xODUzMSAzIDMuNTA3ODEgNS42ODUgMy41MDc4MSA5QzMuNTA3ODEgMTIuMzE1IDYuMTg1MzEgMTUgOS41MDAzMSAxNUMxMi4yOTc4IDE1IDE0LjYzMDMgMTMuMDg3NSAxNS4yOTc4IDEwLjVIMTMuNzM3OEMxMy4xMjI4IDEyLjI0NzUgMTEuNDU3OCAxMy41IDkuNTAwMzEgMTMuNUM3LjAxNzgxIDEzLjUgNS4wMDAzMSAxMS40ODI1IDUuMDAwMzEgOUM1LjAwMDMxIDYuNTE3NSA3LjAxNzgxIDQuNSA5LjUwMDMxIDQuNUMxMC43NDUzIDQuNSAxMS44NTUzIDUuMDE3NSAxMi42NjUzIDUuODM1TDEwLjI1MDMgOC4yNUgxNS41MDAzVjNMMTMuNzM3OCA0Ljc2MjVaIgogICAgICAgICAgICBmaWxsPSIjMDUyQ0MwIiAvPgogICAgPC9nPgogICAgPGRlZnM+CiAgICAgICAgPGNsaXBQYXRoIGlkPSJjbGlwMF8xMTg4XzQyOCI+CiAgICAgICAgICAgIDxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNSkiIC8+CiAgICAgICAgPC9jbGlwUGF0aD4KICAgIDwvZGVmcz4KPC9zdmc+CiAgICA=";
var lt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xMTg4XzQyNCkiPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0xMi43NSA1LjI1TDExLjY5MjUgNi4zMDc1TDEzLjYyNzUgOC4yNUg2VjkuNzVIMTMuNjI3NUwxMS42OTI1IDExLjY4NUwxMi43NSAxMi43NUwxNi41IDlMMTIuNzUgNS4yNVpNMyAzLjc1SDlWMi4yNUgzQzIuMTc1IDIuMjUgMS41IDIuOTI1IDEuNSAzLjc1VjE0LjI1QzEuNSAxNS4wNzUgMi4xNzUgMTUuNzUgMyAxNS43NUg5VjE0LjI1SDNWMy43NVoiCiAgICAgICAgICAgIGZpbGw9IiMwNTJDQzAiIC8+CiAgICA8L2c+CiAgICA8ZGVmcz4KICAgICAgICA8Y2xpcFBhdGggaWQ9ImNsaXAwXzExODhfNDI0Ij4KICAgICAgICAgICAgPHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiBmaWxsPSJ3aGl0ZSIgLz4KICAgICAgICA8L2NsaXBQYXRoPgogICAgPC9kZWZzPgo8L3N2Zz4KICAgIA==";
var Dt = css`:host{width:100%}.header{font-size:12px;font-weight:400;margin:15px 0;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;width:100%;text-align:center}.content{overflow:auto;width:100%;margin-bottom:0;position:relative;-webkit-mask-image:linear-gradient(180deg,#000 90%,transparent 100%);mask-image:linear-gradient(180deg,#000 90%,transparent 95%)}`;
var re = Object.defineProperty;
var ae = Object.getOwnPropertyDescriptor;
var S = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? ae(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && re(i, r, e), e;
};
var b = class extends LitElement {
  constructor() {
    super(...arguments), this.avatarUrl = "", this.persona = "", this.dAppName = "", this.personaData = [], this.accounts = [];
  }
  onUpdateData(t) {
    this.dispatchEvent(
      new CustomEvent("onUpdateData", {
        detail: t,
        bubbles: true,
        composed: true
      })
    );
  }
  onLogout(t) {
    this.dispatchEvent(
      new CustomEvent("onLogout", {
        detail: t,
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return html`<div class="header">Sharing with ${this.dAppName}</div><div class="content"><radix-persona-card avatarUrl="${this.avatarUrl}" persona="${this.persona}" .personaData="${this.personaData}"></radix-persona-card><div>${(this.accounts || []).map(
      ({ label: t, address: i, appearanceId: r }) => html`<radix-account label="${t}" address="${i}" appearanceId="${r}"></radix-account>`
    )}</div></div><div class="buttons"><radix-themed-button class="${classMap({
      full: true,
      disabled: this.accounts.length === 0
    })}" @click="${this.onUpdateData}"><div class="${classMap({
      icon: true,
      "update-data": true,
      disabled: this.accounts.length === 0
    })}"></div>Update Account Sharing</radix-themed-button><radix-themed-button class="full" @click="${this.onLogout}"><div class="icon logout"></div>Log Out</radix-themed-button></div>`;
  }
};
b.styles = [
  Dt,
  css`:host{width:100%}.icon::before{content:'';-webkit-mask-position:center;mask-position:center;-webkit-mask-size:cover;mask-size:cover;background:var(--radix-button-text-color);display:block;width:20px;height:20px}.icon.disabled::before{background:var(--radix-button-disabled-text-color)}.content{max-height:193px;overflow-x:hidden;padding-bottom:19px}.buttons{display:grid;bottom:0;width:100%;grid-template-columns:1fr 115px;grid-gap:10px;width:100%;padding-top:5px;align-items:end}.update-data::before{-webkit-mask-image:url('${unsafeCSS(dt)}');mask-image:url('${unsafeCSS(dt)}')}.logout::before{-webkit-mask-image:url('${unsafeCSS(lt)}');mask-image:url('${unsafeCSS(lt)}')}`
];
S([
  property({
    type: String
  })
], b.prototype, "avatarUrl", 2);
S([
  property({
    type: String
  })
], b.prototype, "persona", 2);
S([
  property({
    type: String
  })
], b.prototype, "dAppName", 2);
S([
  property({
    type: Array
  })
], b.prototype, "personaData", 2);
S([
  property({
    type: Array
  })
], b.prototype, "accounts", 2);
b = S([
  customElement("radix-sharing-page")
], b);
var ne = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzc1IiBoZWlnaHQ9IjU1OSIgdmlld0JveD0iMCAwIDM3NSA1NTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8yXzUzKSI+CjxwYXRoIGQ9Ik0wIDBIMzc1VjU1OUgwVjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB3aWR0aD0iMzc1IiBoZWlnaHQ9IjU1OSIgZmlsbD0iIzA1MkNDMCIvPgo8bWFzayBpZD0ibWFzazBfMl81MyIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjM3NSIgaGVpZ2h0PSI1NTkiPgo8cmVjdCB3aWR0aD0iMzc1IiBoZWlnaHQ9IjU1OSIgZmlsbD0iIzA1MkNDMCIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfMl81MykiPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMF9mXzJfNTMpIj4KPHBhdGggZD0iTTE0OC42NTkgLTM5NS4xMzJDMTQ2LjY1MSAtNDczLjIzOSAyMTguMDY2IC0zODkuODg2IDMwOC4xNjkgLTIwOC45NTZDMzk4LjI3MSAtMjguMDI2NSA0NzIuOTQyIDE4MS45NjUgNDc0Ljk0OSAyNjAuMDcyQzQ3Ni45NTcgMzM4LjE4IDIzMi44OTUgLTUuOTMyMTggMTQyLjc5MiAtMTg2Ljg2MkM1Mi42ODkzIC0zNjcuNzkxIDE1MC42NjYgLTMxNy4wMjQgMTQ4LjY1OSAtMzk1LjEzMloiIGZpbGw9IiMyMEU0RkYiLz4KPC9nPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMV9mXzJfNTMpIj4KPHBhdGggZD0iTTExNC41ODIgNDUwLjgyNEMxNzQuNzcgMzQ1Ljk1NiAyMzAuMzU4IDUxNi45NTYgMjM4Ljc0MSA4MzIuNzYzQzI0Ny4xMjUgMTE0OC41NyAxNzQuNzY5IDU0Ny42MzIgMTE0LjU4MSA2NTIuNUM1NC4zOTI5IDc1Ny4zNjggLTU2LjkzMDUgMTAzNi42OSAtNjUuMzE0MSA3MjAuODc4Qy03My42OTc2IDQwNS4wNzEgNTQuMzkzOCA1NTUuNjkxIDExNC41ODIgNDUwLjgyNFoiIGZpbGw9IiMwNjBGOEYiLz4KPC9nPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMl9mXzJfNTMpIj4KPHBhdGggZD0iTS04MC4yMjgyIDY4NS4yODJDLTEwNC41NDggODk1LjQwOSAtMjAwLjA5NiA4MzYuOTM4IC0yMjAuMDYxIDY4NS4yODFDLTI0MC4wMjUgNTMzLjYyMyAtMzYxLjg4MiA2NjUuNDYyIC0zMzcuNTYyIDQ1NS4zMzVDLTMxMy4yNDIgMjQ1LjIwNyAxMDYuNDc0IDE1MC4xNzcgMTI2LjQzOSAzMDEuODM0QzE0Ni40MDQgNDUzLjQ5MiAtNTUuOTA4NCA0NzUuMTU0IC04MC4yMjgyIDY4NS4yODJaIiBmaWxsPSIjMjFGRkJFIi8+CjwvZz4KPC9nPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyM19mXzJfNTMpIj4KPHBhdGggZD0iTTM2Ny43NTQgMTY4LjI0NEMzNzQuMTIzIDM5LjMyMjEgNTExLjI1NCA4MC43NDQxIDUxMS4yNTQgMTE1LjI0NEM1NjYuMzk2IDI5NC4wMzIgNDc3LjI3NCA1MzkuMjU5IDQ3MC45MDUgNjY4LjE4MUM0NjQuNTM2IDc5Ny4xMDMgMzAwLjIgNTU5LjAxOSAyNDUuMDU4IDM4MC4yMzFDMTg5LjkxNiAyMDEuNDQyIDM2MS4zODUgMjk3LjE2NiAzNjcuNzU0IDE2OC4yNDRaIiBmaWxsPSIjRkY0M0NBIi8+CjwvZz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9mXzJfNTMiIHg9Ii00NS4zNzI0IiB5PSItNTc0LjQ0NiIgd2lkdGg9IjY3MC4zMzQiIGhlaWdodD0iOTk1Ljg3IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249Ijc1IiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMl81MyIvPgo8L2ZpbHRlcj4KPGZpbHRlciBpZD0iZmlsdGVyMV9mXzJfNTMiIHg9Ii0xMTkuNTUzIiB5PSIzNjYuMTEyIiB3aWR0aD0iNDEyLjgwNyIgaGVpZ2h0PSI2MTMuMjA0IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjI2LjkyMzMiIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8yXzUzIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIyX2ZfMl81MyIgeD0iLTQ5MC43NTciIHk9Ijc3LjUyIiB3aWR0aD0iNzY4LjU3OSIgaGVpZ2h0PSI4OTQuMzA1IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249Ijc1IiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMl81MyIvPgo8L2ZpbHRlcj4KPGZpbHRlciBpZD0iZmlsdGVyM19mXzJfNTMiIHg9Ijg0LjE0NjgiIHk9Ii02OS42MTcxIiB3aWR0aD0iNTk1LjAyNyIgaGVpZ2h0PSI5MjQuNTIzIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249Ijc1IiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMl81MyIvPgo8L2ZpbHRlcj4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yXzUzIj4KPHBhdGggZD0iTTAgMEgzNzVWNTU5SDBWMFoiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";
var se = Object.defineProperty;
var ge = Object.getOwnPropertyDescriptor;
var ht = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? ge(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && se(i, r, e), e;
};
var B = class extends LitElement {
  constructor() {
    super(...arguments), this.isBranded = false;
  }
  render() {
    return html`<slot></slot>`;
  }
};
B.styles = [
  css`:host{position:fixed;top:0;left:0;right:unset;height:100%;width:100%;padding:16px;box-sizing:border-box;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;transition:opacity .2s;background:var(--radix-mask-background);z-index:2147483647}:host([isBranded]){align-items:flex-start;background:#000;background-image:url('${unsafeCSS(ne)}');background-size:cover}:host(.hide){opacity:0;pointer-events:none}:host(.show){opacity:1}`
];
ht([
  property({
    type: Boolean,
    reflect: true
  })
], B.prototype, "isBranded", 2);
B = ht([
  customElement("radix-mask")
], B);
var ce = Object.defineProperty;
var de = Object.getOwnPropertyDescriptor;
var X = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? de(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && ce(i, r, e), e;
};
var T = class extends LitElement {
  constructor() {
    super(...arguments), this.requestItems = [], this.dAppName = "", this.loggedInTimestamp = "";
  }
  render() {
    return html`<div class="header">Connected to ${this.dAppName}</div><slot name="subheader"></slot>${this.loggedInTimestamp ? html`<div class="subheader">Since logged in: ${ut(this.loggedInTimestamp, ", ")}</div>` : ""}<div class="content">${(this.requestItems || []).map(
      (t) => html`<radix-request-card type="${t.type}" status="${t.status}" id="${t.interactionId}" transactionIntentHash="${t.transactionIntentHash || ""}" ?showCancel="${t.showCancel}" timestamp="${t.createdAt}"></radix-request-card>`
    )}</div>`;
  }
};
T.styles = [
  Dt,
  css`.subheader{color:var(--radix-card-text-dimmed-color);margin-top:-12px;margin-bottom:15px;text-align:center;font-size:12px}.content{padding-bottom:25px;max-height:calc(100vh - 270px)}@media (min-height:580px){.content{max-height:360px}}`
];
X([
  property({ type: Array })
], T.prototype, "requestItems", 2);
X([
  property({
    type: String
  })
], T.prototype, "dAppName", 2);
X([
  property({
    type: String
  })
], T.prototype, "loggedInTimestamp", 2);
T = X([
  customElement("radix-requests-page")
], T);
var le = Object.defineProperty;
var Ie = Object.getOwnPropertyDescriptor;
var M = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Ie(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && le(i, r, e), e;
};
var l = class extends LitElement {
  constructor() {
    super(), this.theme = "radix-blue", this.dAppName = "", this.personaLabel = "", this.connected = false, this.status = z.default, this.loggedInTimestamp = "", this.showPopoverMenu = false, this.requestItems = [], this.accounts = [], this.personaData = [], this.isMobile = false, this.isWalletLinked = false, this.isExtensionAvailable = false, this.fullWidth = false, this.activeTab = "sharing", this.mode = "light", this.avatarUrl = "", this.compact = false, this.pristine = true, this.fontGoogleApiHref = "https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600", this.initialBodyOverflow = document.body.style.overflow, this.initialBackdropFilter = "", this.parentElementWithBackdropFilter = null, this.injectFontCSS(), this.windowClickEventHandler = (t) => {
      this.showPopoverMenu && (this.contains(t.target) || (this.showPopoverMenu = false));
    }, document.addEventListener("click", this.windowClickEventHandler);
  }
  get hasSharedData() {
    return !!(this.accounts.length || this.personaData.length);
  }
  attributeChangedCallback(t, i, r) {
    super.attributeChangedCallback(t, i, r), t === "showpopovermenu" && (this.pristine = false, this.toggleBodyOverflow());
  }
  connectedCallback() {
    super.connectedCallback(), window.dispatchEvent(new Event("onConnectButtonRender")), this.dispatchEvent(
      new CustomEvent("onRender", {
        bubbles: true,
        composed: true
      })
    );
  }
  disconnectedCallback() {
    document.removeEventListener("click", this.windowClickEventHandler), this.dispatchEvent(
      new CustomEvent("onDestroy", {
        bubbles: true,
        composed: true
      })
    );
  }
  injectFontCSS() {
    if (this.shouldSkipFontInjection())
      return;
    const t = document.createElement("link");
    t.setAttribute("rel", "stylesheet"), t.setAttribute("href", this.fontGoogleApiHref), document.head.append(t);
  }
  shouldSkipFontInjection() {
    return !!document.head.querySelector(
      `link[href|="${this.fontGoogleApiHref}"]`
    ) || document.fonts.check("16px IBM Plex Sans");
  }
  togglePopoverMenu() {
    this.pristine = false, this.showPopoverMenu = !this.showPopoverMenu, this.toggleBodyOverflow(), this.toggleParentBackdropFilter(), this.showPopoverMenu && this.dispatchEvent(
      new CustomEvent("onShowPopover", {
        bubbles: true,
        composed: true
      })
    );
  }
  toggleBodyOverflow() {
    this.isMobile && (document.body.style.overflow = this.showPopoverMenu && this.isMobile ? "hidden" : this.initialBodyOverflow);
  }
  toggleParentBackdropFilter() {
    if (this.isMobile)
      if (!this.showPopoverMenu && this.parentElementWithBackdropFilter) {
        setTimeout(() => {
          var i;
          (i = this.parentElementWithBackdropFilter) == null || i.style.setProperty(
            "backdrop-filter",
            this.initialBackdropFilter
          ), this.initialBackdropFilter = "", this.parentElementWithBackdropFilter = null;
        }, 180);
        return;
      } else {
        const i = this.findParentWithBackdropFilter(this);
        if (i === null)
          return;
        this.initialBackdropFilter = i.backdropFilter, this.parentElementWithBackdropFilter = i.element, i.element.style.backdropFilter = "none";
      }
  }
  findParentWithBackdropFilter(t) {
    if (!t)
      return null;
    const r = window.getComputedStyle(t).getPropertyValue("backdrop-filter");
    return r !== "none" ? { element: t, backdropFilter: r } : this.findParentWithBackdropFilter(t.parentElement);
  }
  connectButtonTemplate() {
    const t = this.connected ? this.personaLabel : "Connect";
    return html`<radix-button status="${this.status}" theme="${this.theme}" ?connected="${this.connected}" ?fullWidth="${this.fullWidth}" @onClick="${this.togglePopoverMenu}" @onResize="${(i) => {
      this.compact = i.detail.offsetWidth === 40;
    }}"><div>${t}</div></radix-button>`;
  }
  connectTemplate() {
    if (!this.connected)
      return html`<radix-not-connected-page status="${this.status}" ?isMobile="${this.isMobile}" .requestItems="${this.requestItems}" ?isWalletLinked="${this.isWalletLinked}" ?isExtensionAvailable="${this.isExtensionAvailable}"></radix-not-connected-page>`;
  }
  renderSharingTemplate() {
    return html`<radix-sharing-page dAppName="${this.dAppName}" avatarUrl="${this.avatarUrl}" persona="${this.personaLabel}" .personaData="${(this.personaData || []).map((t) => t.value)}" .accounts="${this.accounts}" @onLogout="${() => {
      this.dispatchEvent(
        new CustomEvent("onDisconnect", {
          bubbles: true,
          composed: true
        })
      );
    }}" @onUpdateData="${() => {
      this.accounts.length && this.dispatchEvent(
        new CustomEvent("onUpdateSharedAccounts", {
          bubbles: true,
          composed: true
        })
      );
    }}"></radix-sharing-page>`;
  }
  renderRequestItemsTemplate() {
    return html`<radix-requests-page loggedInTimestamp="${this.loggedInTimestamp}" dAppName="${this.dAppName}" .requestItems="${this.requestItems}"></radix-requests-page>`;
  }
  get showPopoverCloseButton() {
    return this.isMobile;
  }
  popoverTemplate() {
    return this.pristine ? "" : html`<radix-popover ?isMobile="${this.isMobile}" ?connected="${this.connected}" ?compact="${this.compact}" ?showCloseButton="${this.showPopoverCloseButton}" @onClosePopover="${() => {
      this.togglePopoverMenu();
    }}" class="${classMap({
      show: this.showPopoverMenu,
      hide: !this.showPopoverMenu,
      popoverPosition: !this.isMobile
    })}">${this.renderPopoverContentTemplate()}</radix-popover>`;
  }
  renderPopoverContentTemplate() {
    return this.connected ? html`<radix-tabs-menu active="${this.activeTab}" @onClick="${(t) => {
      this.activeTab = t.detail.value;
    }}"></radix-tabs-menu>${this.activeTab === "sharing" ? this.renderSharingTemplate() : this.renderRequestItemsTemplate()}` : this.connectTemplate();
  }
  render() {
    return html`${this.connectButtonTemplate()} ${this.isMobile ? html`<radix-mask class="${classMap({
      show: this.showPopoverMenu,
      hide: !this.showPopoverMenu
    })}">${this.popoverTemplate()}</radix-mask>` : this.popoverTemplate()}`;
  }
};
l.styles = [
  pt,
  H,
  css`:root{font-family:'IBM Plex Sans';margin:0;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:rgba(255,255,255,.87);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}:host{all:initial;text-align:left;font-family:'IBM Plex Sans';position:relative;z-index:1000;display:inline-block}.mobile-wrapper{display:flex;flex-direction:column;text-align:center;align-items:center;margin-bottom:18px;margin-top:25px;font-size:14px}.mobile-wrapper .header{font-size:18px;font-weight:600;margin-bottom:5px}.mobile-wrapper .content{font-size:16px;margin-bottom:5px}.popoverPosition{position:absolute;top:calc(100% + .5rem);right:0}`
];
M([
  property({
    type: String
  })
], l.prototype, "theme", 2);
M([
  property({ type: String })
], l.prototype, "dAppName", 2);
M([
  property({ type: String })
], l.prototype, "personaLabel", 2);
M([
  property({ type: Boolean })
], l.prototype, "connected", 2);
M([
  property({
    type: String
  })
], l.prototype, "status", 2);
M([
  property({ type: String })
], l.prototype, "loggedInTimestamp", 2);
M([
  property({ type: Boolean, reflect: true })
], l.prototype, "showPopoverMenu", 2);
M([
  property({ type: Array })
], l.prototype, "requestItems", 2);
M([
  property({ type: Array })
], l.prototype, "accounts", 2);
M([
  property({
    type: Array
  })
], l.prototype, "personaData", 2);
M([
  property({
    type: Boolean
  })
], l.prototype, "isMobile", 2);
M([
  property({
    type: Boolean
  })
], l.prototype, "isWalletLinked", 2);
M([
  property({
    type: Boolean
  })
], l.prototype, "isExtensionAvailable", 2);
M([
  property({
    type: Boolean
  })
], l.prototype, "fullWidth", 2);
M([
  property({
    type: String
  })
], l.prototype, "activeTab", 2);
M([
  property({ type: String, reflect: true })
], l.prototype, "mode", 2);
M([
  property({ type: String })
], l.prototype, "avatarUrl", 2);
M([
  property({ type: Boolean, state: true })
], l.prototype, "compact", 2);
l = M([
  customElement("radix-connect-button")
], l);
var pe = Object.defineProperty;
var Me = Object.getOwnPropertyDescriptor;
var jt = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Me(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && pe(i, r, e), e;
};
var Q = class extends LitElement {
  constructor() {
    super(...arguments), this.header = "Radix Wallet Connector";
  }
  render() {
    return html`<div class="radix-wallet-connector-card"><div class="radix-wallet-connector-card__logo"><img width="78" height="78" src="${At}" alt="Radix Wallet Connector Logo"></div><div class="radix-wallet-connector-card__header">${this.header}</div><slot></slot></div>`;
  }
};
Q.styles = [
  css`.radix-wallet-connector-card{background:#fff;padding:24px;border-radius:16px;position:relative;margin-top:60px;text-align:center;box-shadow:0 4px 7px 0 #00000040}.radix-wallet-connector-card__logo{position:absolute;left:0;right:0}.radix-wallet-connector-card__logo img{width:78px;height:78px;transform:translateY(-66px);box-shadow:0 4px 10px 0 rgba(0,0,0,.25);border-radius:16px}.radix-wallet-connector-card__header{margin-top:32px;margin-bottom:24px;font-size:18px;color:var(--color-grey-2)}`
];
jt([
  property({
    type: String
  })
], Q.prototype, "header", 2);
Q = jt([
  customElement("radix-wallet-connector-card")
], Q);
var ue = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAzNCAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3IDUuOTg1TDI4LjI5NSAyNS41SDUuNzA1TDE3IDUuOTg1Wk0xNyAwTDAuNSAyOC41SDMzLjVMMTcgMFpNMTguNSAyMUgxNS41VjI0SDE4LjVWMjFaTTE4LjUgMTJIMTUuNVYxOEgxOC41VjEyWiIgZmlsbD0iI0YwMDAwMCIvPgo8L3N2Zz4K";
var xe = Object.defineProperty;
var Ae = Object.getOwnPropertyDescriptor;
var J = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? Ae(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && xe(i, r, e), e;
};
var L = class extends LitElement {
  constructor() {
    super(...arguments), this.header = "", this.subheader = "", this.isError = false;
  }
  render() {
    return html`<div class="connector-error">${this.isError ? html`<img src="${ue}" alt="Warning" width="33">` : ""}<h1 class="${classMap({ error: this.isError })}">${this.header}</h1>${this.subheader ? html`<h3>${this.subheader}</h3>` : ""}</div>`;
  }
};
L.styles = [
  css`.connector-error{display:flex;align-items:center;flex-direction:column;gap:16px}h1{font-size:24px;font-weight:700;margin:0;color:var(--color-grey-1)}.error{color:#f00000}h3{margin:0;color:var(--color-grey-2);font-size:16px;font-weight:500}`
];
J([
  property({
    type: String
  })
], L.prototype, "header", 2);
J([
  property({
    type: String
  })
], L.prototype, "subheader", 2);
J([
  property({
    type: Boolean
  })
], L.prototype, "isError", 2);
L = J([
  customElement("radix-wallet-connector-info")
], L);
var Ne = Object.defineProperty;
var be = Object.getOwnPropertyDescriptor;
var E = (t, i, r, o) => {
  for (var e = o > 1 ? void 0 : o ? be(i, r) : i, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (e = (o ? n(i, r, e) : n(e)) || e);
  return o && e && Ne(i, r, e), e;
};
var D = class extends LitElement {
  constructor() {
    super(...arguments), this.header = "", this.subheader = "", this.isError = false, this.isLoading = false, this.isHidden = true;
  }
  render() {
    return this.isHidden ? html`` : html`<radix-mask isBranded><radix-wallet-connector-card>${this.isLoading ? html`<div class="loading-container"><radix-loading-spinner></radix-loading-spinner></div>` : html`<radix-wallet-connector-info header="${this.header}" subheader="${this.subheader}" ?isError="${this.isError}"></radix-wallet-connector-info>`}</radix-wallet-connector-card></radix-mask>`;
  }
};
D.styles = [
  pt,
  css`.loading-container{display:flex;justify-content:center;padding:18px 0}`
];
E([
  property({
    type: String
  })
], D.prototype, "header", 2);
E([
  property({
    type: String
  })
], D.prototype, "subheader", 2);
E([
  property({
    type: Boolean
  })
], D.prototype, "isError", 2);
E([
  property({
    type: Boolean
  })
], D.prototype, "isLoading", 2);
E([
  property({
    type: Boolean
  })
], D.prototype, "isHidden", 2);
D = E([
  customElement("radix-rcfm-page")
], D);
export {
  l as ConnectButton,
  D as RadixRcfmPage
};
/*! Bundled license information:

@lit/reactive-element/development/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/development/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=connect-button-LXZ2YJET-GM2KMADY.js.map
