import {
  __commonJS,
  __publicField,
  __toESM
} from "./chunk-EQCVQC35.js";

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output3 = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output3.push(tripletToBase64(tmp));
      }
      return output3.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports) {
    exports.read = function(buffer2, offset, isLE3, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE3 ? nBytes - 1 : 0;
      var d = isLE3 ? -1 : 1;
      var s = buffer2[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer2, value, offset, isLE3, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE3 ? 0 : nBytes - 1;
      var d = isLE3 ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer2[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer9;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer9.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer9.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer9.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer9.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer9.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer9.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer9.prototype);
      return buf;
    }
    function Buffer9(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from2(arg, encodingOrOffset, length);
    }
    Buffer9.poolSize = 8192;
    function from2(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer9.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer9.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer9.from = function(value, encodingOrOffset, length) {
      return from2(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer9.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer9, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer9.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer9.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer9.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string2, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer9.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string2, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string2, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike2(array2) {
      const length = array2.length < 0 ? 0 : checked(array2.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array2[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike2(arrayView);
    }
    function fromArrayBuffer(array2, byteOffset, length) {
      if (byteOffset < 0 || array2.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array2.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array2);
      } else if (length === void 0) {
        buf = new Uint8Array(array2, byteOffset);
      } else {
        buf = new Uint8Array(array2, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer9.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer9.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike2(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike2(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer9.alloc(+length);
    }
    Buffer9.isBuffer = function isBuffer2(b) {
      return b != null && b._isBuffer === true && b !== Buffer9.prototype;
    };
    Buffer9.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer9.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer9.from(b, b.offset, b.byteLength);
      if (!Buffer9.isBuffer(a) || !Buffer9.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer9.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer9.concat = function concat3(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer9.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer2 = Buffer9.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer2.length) {
            if (!Buffer9.isBuffer(buf)) buf = Buffer9.from(buf);
            buf.copy(buffer2, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer2,
              buf,
              pos
            );
          }
        } else if (!Buffer9.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer2, pos);
        }
        pos += buf.length;
      }
      return buffer2;
    };
    function byteLength(string2, encoding) {
      if (Buffer9.isBuffer(string2)) {
        return string2.length;
      }
      if (ArrayBuffer.isView(string2) || isInstance(string2, ArrayBuffer)) {
        return string2.byteLength;
      }
      if (typeof string2 !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string2
        );
      }
      const len = string2.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes4(string2).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string2).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes4(string2).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer9.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer9.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer9.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer9.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer9.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer9.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer9.prototype.toLocaleString = Buffer9.prototype.toString;
    Buffer9.prototype.equals = function equals(b) {
      if (!Buffer9.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer9.compare(this, b) === 0;
    };
    Buffer9.prototype.inspect = function inspect2() {
      let str = "";
      const max2 = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max2).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max2) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer9.prototype[customInspectSymbol] = Buffer9.prototype.inspect;
    }
    Buffer9.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer9.from(target, target.offset, target.byteLength);
      }
      if (!Buffer9.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
      if (buffer2.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer2.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
      if (byteOffset >= buffer2.length) {
        if (dir) return -1;
        else byteOffset = buffer2.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer9.from(val, encoding);
      }
      if (Buffer9.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer9.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer9.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer9.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string2, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string2.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string2.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string2, offset, length) {
      return blitBuffer(utf8ToBytes4(string2, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string2, offset, length) {
      return blitBuffer(asciiToBytes(string2), buf, offset, length);
    }
    function base64Write(buf, string2, offset, length) {
      return blitBuffer(base64ToBytes(string2), buf, offset, length);
    }
    function ucs2Write(buf, string2, offset, length) {
      return blitBuffer(utf16leToBytes(string2, buf.length - offset), buf, offset, length);
    }
    Buffer9.prototype.write = function write(string2, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string2.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string2, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string2, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string2, offset, length);
          case "base64":
            return base64Write(this, string2, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string2, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer9.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes3 = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes3.length - 1; i += 2) {
        res += String.fromCharCode(bytes3[i] + bytes3[i + 1] * 256);
      }
      return res;
    }
    Buffer9.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer9.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer9.prototype.readUintLE = Buffer9.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer9.prototype.readUintBE = Buffer9.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer9.prototype.readUint8 = Buffer9.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer9.prototype.readUint16LE = Buffer9.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer9.prototype.readUint16BE = Buffer9.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer9.prototype.readUint32LE = Buffer9.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer9.prototype.readUint32BE = Buffer9.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer9.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first2 = this[offset];
      const last3 = this[offset + 7];
      if (first2 === void 0 || last3 === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first2 + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last3 * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer9.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first2 = this[offset];
      const last3 = this[offset + 7];
      if (first2 === void 0 || last3 === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first2 * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last3;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer9.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer9.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer9.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer9.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer9.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer9.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer9.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer9.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first2 = this[offset];
      const last3 = this[offset + 7];
      if (first2 === void 0 || last3 === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last3 << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first2 + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer9.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first2 = this[offset];
      const last3 = this[offset + 7];
      if (first2 === void 0 || last3 === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first2 << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last3);
    });
    Buffer9.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer9.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer9.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer9.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max2, min2) {
      if (!Buffer9.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max2 || value < min2) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer9.prototype.writeUintLE = Buffer9.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer9.prototype.writeUintBE = Buffer9.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer9.prototype.writeUint8 = Buffer9.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer9.prototype.writeUint16LE = Buffer9.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer9.prototype.writeUint16BE = Buffer9.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer9.prototype.writeUint32LE = Buffer9.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer9.prototype.writeUint32BE = Buffer9.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min2, max2) {
      checkIntBI(value, min2, max2, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min2, max2) {
      checkIntBI(value, min2, max2, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer9.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer9.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer9.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer9.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer9.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer9.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer9.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer9.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer9.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer9.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer9.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max2, min2) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer9.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer9.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer9.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer9.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer9.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer9.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer9.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer9.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes3 = Buffer9.isBuffer(val) ? val : Buffer9.from(val, encoding);
        const len = bytes3.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes3[i % len];
        }
      }
      return this;
    };
    var errors2 = {};
    function E(sym, getMessage, Base) {
      errors2[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range2, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range2}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min2, max2, buf, offset, byteLength2) {
      if (value > max2 || value < min2) {
        const n = typeof min2 === "bigint" ? "n" : "";
        let range2;
        if (byteLength2 > 3) {
          if (min2 === 0 || min2 === BigInt(0)) {
            range2 = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range2 = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range2 = `>= ${min2}${n} and <= ${max2}${n}`;
        }
        throw new errors2.ERR_OUT_OF_RANGE("value", range2, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors2.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors2.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors2.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors2.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes4(string2, units) {
      units = units || Infinity;
      let codePoint;
      const length = string2.length;
      let leadSurrogate = null;
      const bytes3 = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string2.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes3.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes3.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes3.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes3.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes3.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes3.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes3.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes3.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes3;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    }();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// node_modules/blakejs/util.js
var require_util = __commonJS({
  "node_modules/blakejs/util.js"(exports, module) {
    var ERROR_MSG_INPUT = "Input must be an string, Buffer or Uint8Array";
    function normalizeInput(input) {
      let ret;
      if (input instanceof Uint8Array) {
        ret = input;
      } else if (typeof input === "string") {
        const encoder = new TextEncoder();
        ret = encoder.encode(input);
      } else {
        throw new Error(ERROR_MSG_INPUT);
      }
      return ret;
    }
    function toHex2(bytes3) {
      return Array.prototype.map.call(bytes3, function(n) {
        return (n < 16 ? "0" : "") + n.toString(16);
      }).join("");
    }
    function uint32ToHex(val) {
      return (4294967296 + val).toString(16).substring(1);
    }
    function debugPrint(label, arr, size) {
      let msg = "\n" + label + " = ";
      for (let i = 0; i < arr.length; i += 2) {
        if (size === 32) {
          msg += uint32ToHex(arr[i]).toUpperCase();
          msg += " ";
          msg += uint32ToHex(arr[i + 1]).toUpperCase();
        } else if (size === 64) {
          msg += uint32ToHex(arr[i + 1]).toUpperCase();
          msg += uint32ToHex(arr[i]).toUpperCase();
        } else throw new Error("Invalid size " + size);
        if (i % 6 === 4) {
          msg += "\n" + new Array(label.length + 4).join(" ");
        } else if (i < arr.length - 2) {
          msg += " ";
        }
      }
      console.log(msg);
    }
    function testSpeed(hashFn, N, M) {
      let startMs = (/* @__PURE__ */ new Date()).getTime();
      const input = new Uint8Array(N);
      for (let i = 0; i < N; i++) {
        input[i] = i % 256;
      }
      const genMs = (/* @__PURE__ */ new Date()).getTime();
      console.log("Generated random input in " + (genMs - startMs) + "ms");
      startMs = genMs;
      for (let i = 0; i < M; i++) {
        const hashHex = hashFn(input);
        const hashMs = (/* @__PURE__ */ new Date()).getTime();
        const ms = hashMs - startMs;
        startMs = hashMs;
        console.log("Hashed in " + ms + "ms: " + hashHex.substring(0, 20) + "...");
        console.log(
          Math.round(N / (1 << 20) / (ms / 1e3) * 100) / 100 + " MB PER SECOND"
        );
      }
    }
    module.exports = {
      normalizeInput,
      toHex: toHex2,
      debugPrint,
      testSpeed
    };
  }
});

// node_modules/blakejs/blake2b.js
var require_blake2b = __commonJS({
  "node_modules/blakejs/blake2b.js"(exports, module) {
    var util = require_util();
    function ADD64AA(v2, a, b) {
      const o0 = v2[a] + v2[b];
      let o1 = v2[a + 1] + v2[b + 1];
      if (o0 >= 4294967296) {
        o1++;
      }
      v2[a] = o0;
      v2[a + 1] = o1;
    }
    function ADD64AC(v2, a, b0, b1) {
      let o0 = v2[a] + b0;
      if (b0 < 0) {
        o0 += 4294967296;
      }
      let o1 = v2[a + 1] + b1;
      if (o0 >= 4294967296) {
        o1++;
      }
      v2[a] = o0;
      v2[a + 1] = o1;
    }
    function B2B_GET32(arr, i) {
      return arr[i] ^ arr[i + 1] << 8 ^ arr[i + 2] << 16 ^ arr[i + 3] << 24;
    }
    function B2B_G(a, b, c, d, ix, iy) {
      const x0 = m[ix];
      const x1 = m[ix + 1];
      const y0 = m[iy];
      const y1 = m[iy + 1];
      ADD64AA(v, a, b);
      ADD64AC(v, a, x0, x1);
      let xor0 = v[d] ^ v[a];
      let xor1 = v[d + 1] ^ v[a + 1];
      v[d] = xor1;
      v[d + 1] = xor0;
      ADD64AA(v, c, d);
      xor0 = v[b] ^ v[c];
      xor1 = v[b + 1] ^ v[c + 1];
      v[b] = xor0 >>> 24 ^ xor1 << 8;
      v[b + 1] = xor1 >>> 24 ^ xor0 << 8;
      ADD64AA(v, a, b);
      ADD64AC(v, a, y0, y1);
      xor0 = v[d] ^ v[a];
      xor1 = v[d + 1] ^ v[a + 1];
      v[d] = xor0 >>> 16 ^ xor1 << 16;
      v[d + 1] = xor1 >>> 16 ^ xor0 << 16;
      ADD64AA(v, c, d);
      xor0 = v[b] ^ v[c];
      xor1 = v[b + 1] ^ v[c + 1];
      v[b] = xor1 >>> 31 ^ xor0 << 1;
      v[b + 1] = xor0 >>> 31 ^ xor1 << 1;
    }
    var BLAKE2B_IV32 = new Uint32Array([
      4089235720,
      1779033703,
      2227873595,
      3144134277,
      4271175723,
      1013904242,
      1595750129,
      2773480762,
      2917565137,
      1359893119,
      725511199,
      2600822924,
      4215389547,
      528734635,
      327033209,
      1541459225
    ]);
    var SIGMA8 = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3,
      11,
      8,
      12,
      0,
      5,
      2,
      15,
      13,
      10,
      14,
      3,
      6,
      7,
      1,
      9,
      4,
      7,
      9,
      3,
      1,
      13,
      12,
      11,
      14,
      2,
      6,
      5,
      10,
      4,
      0,
      15,
      8,
      9,
      0,
      5,
      7,
      2,
      4,
      10,
      15,
      14,
      1,
      11,
      12,
      6,
      8,
      3,
      13,
      2,
      12,
      6,
      10,
      0,
      11,
      8,
      3,
      4,
      13,
      7,
      5,
      15,
      14,
      1,
      9,
      12,
      5,
      1,
      15,
      14,
      13,
      4,
      10,
      0,
      7,
      6,
      3,
      9,
      2,
      8,
      11,
      13,
      11,
      7,
      14,
      12,
      1,
      3,
      9,
      5,
      0,
      15,
      4,
      8,
      6,
      2,
      10,
      6,
      15,
      14,
      9,
      11,
      3,
      0,
      8,
      12,
      2,
      13,
      7,
      1,
      4,
      10,
      5,
      10,
      2,
      8,
      4,
      7,
      6,
      1,
      5,
      15,
      11,
      9,
      14,
      3,
      12,
      13,
      0,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3
    ];
    var SIGMA82 = new Uint8Array(
      SIGMA8.map(function(x) {
        return x * 2;
      })
    );
    var v = new Uint32Array(32);
    var m = new Uint32Array(32);
    function blake2bCompress(ctx, last3) {
      let i = 0;
      for (i = 0; i < 16; i++) {
        v[i] = ctx.h[i];
        v[i + 16] = BLAKE2B_IV32[i];
      }
      v[24] = v[24] ^ ctx.t;
      v[25] = v[25] ^ ctx.t / 4294967296;
      if (last3) {
        v[28] = ~v[28];
        v[29] = ~v[29];
      }
      for (i = 0; i < 32; i++) {
        m[i] = B2B_GET32(ctx.b, 4 * i);
      }
      for (i = 0; i < 12; i++) {
        B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
        B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
        B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
        B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
        B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
        B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
        B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
        B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
      }
      for (i = 0; i < 16; i++) {
        ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
      }
    }
    var parameterBlock = new Uint8Array([
      0,
      0,
      0,
      0,
      //  0: outlen, keylen, fanout, depth
      0,
      0,
      0,
      0,
      //  4: leaf length, sequential mode
      0,
      0,
      0,
      0,
      //  8: node offset
      0,
      0,
      0,
      0,
      // 12: node offset
      0,
      0,
      0,
      0,
      // 16: node depth, inner length, rfu
      0,
      0,
      0,
      0,
      // 20: rfu
      0,
      0,
      0,
      0,
      // 24: rfu
      0,
      0,
      0,
      0,
      // 28: rfu
      0,
      0,
      0,
      0,
      // 32: salt
      0,
      0,
      0,
      0,
      // 36: salt
      0,
      0,
      0,
      0,
      // 40: salt
      0,
      0,
      0,
      0,
      // 44: salt
      0,
      0,
      0,
      0,
      // 48: personal
      0,
      0,
      0,
      0,
      // 52: personal
      0,
      0,
      0,
      0,
      // 56: personal
      0,
      0,
      0,
      0
      // 60: personal
    ]);
    function blake2bInit(outlen, key, salt, personal) {
      if (outlen === 0 || outlen > 64) {
        throw new Error("Illegal output length, expected 0 < length <= 64");
      }
      if (key && key.length > 64) {
        throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
      }
      if (salt && salt.length !== 16) {
        throw new Error("Illegal salt, expected Uint8Array with length is 16");
      }
      if (personal && personal.length !== 16) {
        throw new Error("Illegal personal, expected Uint8Array with length is 16");
      }
      const ctx = {
        b: new Uint8Array(128),
        h: new Uint32Array(16),
        t: 0,
        // input count
        c: 0,
        // pointer within buffer
        outlen
        // output length in bytes
      };
      parameterBlock.fill(0);
      parameterBlock[0] = outlen;
      if (key) parameterBlock[1] = key.length;
      parameterBlock[2] = 1;
      parameterBlock[3] = 1;
      if (salt) parameterBlock.set(salt, 32);
      if (personal) parameterBlock.set(personal, 48);
      for (let i = 0; i < 16; i++) {
        ctx.h[i] = BLAKE2B_IV32[i] ^ B2B_GET32(parameterBlock, i * 4);
      }
      if (key) {
        blake2bUpdate(ctx, key);
        ctx.c = 128;
      }
      return ctx;
    }
    function blake2bUpdate(ctx, input) {
      for (let i = 0; i < input.length; i++) {
        if (ctx.c === 128) {
          ctx.t += ctx.c;
          blake2bCompress(ctx, false);
          ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i];
      }
    }
    function blake2bFinal(ctx) {
      ctx.t += ctx.c;
      while (ctx.c < 128) {
        ctx.b[ctx.c++] = 0;
      }
      blake2bCompress(ctx, true);
      const out = new Uint8Array(ctx.outlen);
      for (let i = 0; i < ctx.outlen; i++) {
        out[i] = ctx.h[i >> 2] >> 8 * (i & 3);
      }
      return out;
    }
    function blake2b2(input, key, outlen, salt, personal) {
      outlen = outlen || 64;
      input = util.normalizeInput(input);
      if (salt) {
        salt = util.normalizeInput(salt);
      }
      if (personal) {
        personal = util.normalizeInput(personal);
      }
      const ctx = blake2bInit(outlen, key, salt, personal);
      blake2bUpdate(ctx, input);
      return blake2bFinal(ctx);
    }
    function blake2bHex(input, key, outlen, salt, personal) {
      const output3 = blake2b2(input, key, outlen, salt, personal);
      return util.toHex(output3);
    }
    module.exports = {
      blake2b: blake2b2,
      blake2bHex,
      blake2bInit,
      blake2bUpdate,
      blake2bFinal
    };
  }
});

// node_modules/blakejs/blake2s.js
var require_blake2s = __commonJS({
  "node_modules/blakejs/blake2s.js"(exports, module) {
    var util = require_util();
    function B2S_GET32(v2, i) {
      return v2[i] ^ v2[i + 1] << 8 ^ v2[i + 2] << 16 ^ v2[i + 3] << 24;
    }
    function B2S_G(a, b, c, d, x, y) {
      v[a] = v[a] + v[b] + x;
      v[d] = ROTR32(v[d] ^ v[a], 16);
      v[c] = v[c] + v[d];
      v[b] = ROTR32(v[b] ^ v[c], 12);
      v[a] = v[a] + v[b] + y;
      v[d] = ROTR32(v[d] ^ v[a], 8);
      v[c] = v[c] + v[d];
      v[b] = ROTR32(v[b] ^ v[c], 7);
    }
    function ROTR32(x, y) {
      return x >>> y ^ x << 32 - y;
    }
    var BLAKE2S_IV = new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    var SIGMA = new Uint8Array([
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3,
      11,
      8,
      12,
      0,
      5,
      2,
      15,
      13,
      10,
      14,
      3,
      6,
      7,
      1,
      9,
      4,
      7,
      9,
      3,
      1,
      13,
      12,
      11,
      14,
      2,
      6,
      5,
      10,
      4,
      0,
      15,
      8,
      9,
      0,
      5,
      7,
      2,
      4,
      10,
      15,
      14,
      1,
      11,
      12,
      6,
      8,
      3,
      13,
      2,
      12,
      6,
      10,
      0,
      11,
      8,
      3,
      4,
      13,
      7,
      5,
      15,
      14,
      1,
      9,
      12,
      5,
      1,
      15,
      14,
      13,
      4,
      10,
      0,
      7,
      6,
      3,
      9,
      2,
      8,
      11,
      13,
      11,
      7,
      14,
      12,
      1,
      3,
      9,
      5,
      0,
      15,
      4,
      8,
      6,
      2,
      10,
      6,
      15,
      14,
      9,
      11,
      3,
      0,
      8,
      12,
      2,
      13,
      7,
      1,
      4,
      10,
      5,
      10,
      2,
      8,
      4,
      7,
      6,
      1,
      5,
      15,
      11,
      9,
      14,
      3,
      12,
      13,
      0
    ]);
    var v = new Uint32Array(16);
    var m = new Uint32Array(16);
    function blake2sCompress(ctx, last3) {
      let i = 0;
      for (i = 0; i < 8; i++) {
        v[i] = ctx.h[i];
        v[i + 8] = BLAKE2S_IV[i];
      }
      v[12] ^= ctx.t;
      v[13] ^= ctx.t / 4294967296;
      if (last3) {
        v[14] = ~v[14];
      }
      for (i = 0; i < 16; i++) {
        m[i] = B2S_GET32(ctx.b, 4 * i);
      }
      for (i = 0; i < 10; i++) {
        B2S_G(0, 4, 8, 12, m[SIGMA[i * 16 + 0]], m[SIGMA[i * 16 + 1]]);
        B2S_G(1, 5, 9, 13, m[SIGMA[i * 16 + 2]], m[SIGMA[i * 16 + 3]]);
        B2S_G(2, 6, 10, 14, m[SIGMA[i * 16 + 4]], m[SIGMA[i * 16 + 5]]);
        B2S_G(3, 7, 11, 15, m[SIGMA[i * 16 + 6]], m[SIGMA[i * 16 + 7]]);
        B2S_G(0, 5, 10, 15, m[SIGMA[i * 16 + 8]], m[SIGMA[i * 16 + 9]]);
        B2S_G(1, 6, 11, 12, m[SIGMA[i * 16 + 10]], m[SIGMA[i * 16 + 11]]);
        B2S_G(2, 7, 8, 13, m[SIGMA[i * 16 + 12]], m[SIGMA[i * 16 + 13]]);
        B2S_G(3, 4, 9, 14, m[SIGMA[i * 16 + 14]], m[SIGMA[i * 16 + 15]]);
      }
      for (i = 0; i < 8; i++) {
        ctx.h[i] ^= v[i] ^ v[i + 8];
      }
    }
    function blake2sInit(outlen, key) {
      if (!(outlen > 0 && outlen <= 32)) {
        throw new Error("Incorrect output length, should be in [1, 32]");
      }
      const keylen = key ? key.length : 0;
      if (key && !(keylen > 0 && keylen <= 32)) {
        throw new Error("Incorrect key length, should be in [1, 32]");
      }
      const ctx = {
        h: new Uint32Array(BLAKE2S_IV),
        // hash state
        b: new Uint8Array(64),
        // input block
        c: 0,
        // pointer within block
        t: 0,
        // input count
        outlen
        // output length in bytes
      };
      ctx.h[0] ^= 16842752 ^ keylen << 8 ^ outlen;
      if (keylen > 0) {
        blake2sUpdate(ctx, key);
        ctx.c = 64;
      }
      return ctx;
    }
    function blake2sUpdate(ctx, input) {
      for (let i = 0; i < input.length; i++) {
        if (ctx.c === 64) {
          ctx.t += ctx.c;
          blake2sCompress(ctx, false);
          ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i];
      }
    }
    function blake2sFinal(ctx) {
      ctx.t += ctx.c;
      while (ctx.c < 64) {
        ctx.b[ctx.c++] = 0;
      }
      blake2sCompress(ctx, true);
      const out = new Uint8Array(ctx.outlen);
      for (let i = 0; i < ctx.outlen; i++) {
        out[i] = ctx.h[i >> 2] >> 8 * (i & 3) & 255;
      }
      return out;
    }
    function blake2s(input, key, outlen) {
      outlen = outlen || 32;
      input = util.normalizeInput(input);
      const ctx = blake2sInit(outlen, key);
      blake2sUpdate(ctx, input);
      return blake2sFinal(ctx);
    }
    function blake2sHex(input, key, outlen) {
      const output3 = blake2s(input, key, outlen);
      return util.toHex(output3);
    }
    module.exports = {
      blake2s,
      blake2sHex,
      blake2sInit,
      blake2sUpdate,
      blake2sFinal
    };
  }
});

// node_modules/blakejs/index.js
var require_blakejs = __commonJS({
  "node_modules/blakejs/index.js"(exports, module) {
    var b2b = require_blake2b();
    var b2s = require_blake2s();
    module.exports = {
      blake2b: b2b.blake2b,
      blake2bHex: b2b.blake2bHex,
      blake2bInit: b2b.blake2bInit,
      blake2bUpdate: b2b.blake2bUpdate,
      blake2bFinal: b2b.blake2bFinal,
      blake2s: b2s.blake2s,
      blake2sHex: b2s.blake2sHex,
      blake2sInit: b2s.blake2sInit,
      blake2sUpdate: b2s.blake2sUpdate,
      blake2sFinal: b2s.blake2sFinal
    };
  }
});

// node_modules/base64url/dist/pad-string.js
var require_pad_string = __commonJS({
  "node_modules/base64url/dist/pad-string.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function padString(input) {
      var segmentLength = 4;
      var stringLength = input.length;
      var diff = stringLength % segmentLength;
      if (!diff) {
        return input;
      }
      var position = stringLength;
      var padLength = segmentLength - diff;
      var paddedStringLength = stringLength + padLength;
      var buffer2 = Buffer.alloc(paddedStringLength);
      buffer2.write(input);
      while (padLength--) {
        buffer2.write("=", position++);
      }
      return buffer2.toString();
    }
    exports.default = padString;
  }
});

// node_modules/base64url/dist/base64url.js
var require_base64url = __commonJS({
  "node_modules/base64url/dist/base64url.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pad_string_1 = require_pad_string();
    function encode(input, encoding) {
      if (encoding === void 0) {
        encoding = "utf8";
      }
      if (Buffer.isBuffer(input)) {
        return fromBase64(input.toString("base64"));
      }
      return fromBase64(Buffer.from(input, encoding).toString("base64"));
    }
    function decode(base64url3, encoding) {
      if (encoding === void 0) {
        encoding = "utf8";
      }
      return Buffer.from(toBase64(base64url3), "base64").toString(encoding);
    }
    function toBase64(base64url3) {
      base64url3 = base64url3.toString();
      return pad_string_1.default(base64url3).replace(/\-/g, "+").replace(/_/g, "/");
    }
    function fromBase64(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function toBuffer(base64url3) {
      return Buffer.from(toBase64(base64url3), "base64");
    }
    var base64url2 = encode;
    base64url2.encode = encode;
    base64url2.decode = decode;
    base64url2.toBase64 = toBase64;
    base64url2.fromBase64 = fromBase64;
    base64url2.toBuffer = toBuffer;
    exports.default = base64url2;
  }
});

// node_modules/base64url/index.js
var require_base64url2 = __commonJS({
  "node_modules/base64url/index.js"(exports, module) {
    module.exports = require_base64url().default;
    module.exports.default = module.exports;
  }
});

// node_modules/@radixdlt/radix-dapp-toolkit/dist/index.js
var import_buffer2 = __toESM(require_buffer());

// node_modules/tslib/tslib.es6.mjs
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f2, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f2) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f2 = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f2 = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
    if (ar || !(i in from2)) {
      if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
      ar[i] = from2[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f2) {
    return function(v) {
      return Promise.resolve(v).then(f2, reject);
    };
  }
  function verb(n, f2) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f2) i[n] = f2(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f2, v) {
    if (f2(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}

// node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

// node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors2) {
    _super(this);
    this.message = errors2 ? errors2.length + " errors occurred during unsubscription:\n" + errors2.map(function(err2, i) {
      return i + 1 + ") " + err2.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors2;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscription.js
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a2, e_2, _b;
    var errors2;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a2 = _parentage_1.return)) _a2.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors2 = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err2) {
              errors2 = errors2 !== null && errors2 !== void 0 ? errors2 : [];
              if (err2 instanceof UnsubscriptionError) {
                errors2 = __spreadArray(__spreadArray([], __read(errors2)), __read(err2.errors));
              } else {
                errors2.push(err2);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors2) {
        throw new UnsubscriptionError(errors2);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a2;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a2 = this._finalizers) !== null && _a2 !== void 0 ? _a2 : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty2 = new Subscription2();
    empty2.closed = true;
    return empty2;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}

// node_modules/rxjs/dist/esm5/internal/config.js
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};

// node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
var timeoutProvider = {
  setTimeout: function(handler, timeout2) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
      return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout2], __read(args)));
    }
    return setTimeout.apply(void 0, __spreadArray([handler, timeout2], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function reportUnhandledError(err2) {
  timeoutProvider.setTimeout(function() {
    var onUnhandledError = config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err2);
    } else {
      throw err2;
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/util/noop.js
function noop() {
}

// node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var COMPLETE_NOTIFICATION = function() {
  return createNotification("C", void 0, void 0);
}();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}

// node_modules/rxjs/dist/esm5/internal/util/errorContext.js
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a2 = context, errorThrown = _a2.errorThrown, error = _a2.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err2) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err2;
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscriber.js
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err2) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err2), this);
    } else {
      this.isStopped = true;
      this._error(err2);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err2) {
    try {
      this.destination.error(err2);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err2) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err2);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err2);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context_1),
          error: observerOrNext.error && bind(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
function handleUnhandledError(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err2) {
  throw err2;
}
function handleStoppedNotification(notification, subscriber) {
  var onStoppedNotification = config.onStoppedNotification;
  onStoppedNotification && timeoutProvider.setTimeout(function() {
    return onStoppedNotification(notification, subscriber);
  });
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};

// node_modules/rxjs/dist/esm5/internal/symbol/observable.js
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();

// node_modules/rxjs/dist/esm5/internal/util/identity.js
function identity(x) {
  return x;
}

// node_modules/rxjs/dist/esm5/internal/util/pipe.js
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}

// node_modules/rxjs/dist/esm5/internal/Observable.js
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a2 = _this, operator = _a2.operator, source = _a2.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err2) {
      sink.error(err2);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err2) {
            reject(err2);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a2;
    return (_a2 = this.source) === null || _a2 === void 0 ? void 0 : _a2.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err2) {
        return reject(err2);
      }, function() {
        return resolve(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
function getPromiseCtor(promiseCtor) {
  var _a2;
  return (_a2 = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a2 !== void 0 ? _a2 : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}

// node_modules/rxjs/dist/esm5/internal/util/lift.js
function hasLift(source) {
  return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
  return function(source) {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err2) {
          this.error(err2);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = function(_super) {
  __extends(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err2) {
        destination.error(err2);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err2) {
      try {
        onError(err2);
      } catch (err3) {
        destination.error(err3);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a2;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a2 = this.onFinalize) === null || _a2 === void 0 ? void 0 : _a2.call(this));
    }
  };
  return OperatorSubscriber2;
}(Subscriber);

// node_modules/rxjs/dist/esm5/internal/operators/refCount.js
function refCount() {
  return operate(function(source, subscriber) {
    var connection = null;
    source._refCount++;
    var refCounter = createOperatorSubscriber(subscriber, void 0, void 0, void 0, function() {
      if (!source || source._refCount <= 0 || 0 < --source._refCount) {
        connection = null;
        return;
      }
      var sharedConnection = source._connection;
      var conn = connection;
      connection = null;
      if (sharedConnection && (!conn || sharedConnection === conn)) {
        sharedConnection.unsubscribe();
      }
      subscriber.unsubscribe();
    });
    source.subscribe(refCounter);
    if (!refCounter.closed) {
      connection = source.connect();
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/observable/ConnectableObservable.js
var ConnectableObservable = function(_super) {
  __extends(ConnectableObservable2, _super);
  function ConnectableObservable2(source, subjectFactory) {
    var _this = _super.call(this) || this;
    _this.source = source;
    _this.subjectFactory = subjectFactory;
    _this._subject = null;
    _this._refCount = 0;
    _this._connection = null;
    if (hasLift(source)) {
      _this.lift = source.lift;
    }
    return _this;
  }
  ConnectableObservable2.prototype._subscribe = function(subscriber) {
    return this.getSubject().subscribe(subscriber);
  };
  ConnectableObservable2.prototype.getSubject = function() {
    var subject = this._subject;
    if (!subject || subject.isStopped) {
      this._subject = this.subjectFactory();
    }
    return this._subject;
  };
  ConnectableObservable2.prototype._teardown = function() {
    this._refCount = 0;
    var _connection = this._connection;
    this._subject = this._connection = null;
    _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
  };
  ConnectableObservable2.prototype.connect = function() {
    var _this = this;
    var connection = this._connection;
    if (!connection) {
      connection = this._connection = new Subscription();
      var subject_1 = this.getSubject();
      connection.add(this.source.subscribe(createOperatorSubscriber(subject_1, void 0, function() {
        _this._teardown();
        subject_1.complete();
      }, function(err2) {
        _this._teardown();
        subject_1.error(err2);
      }, function() {
        return _this._teardown();
      })));
      if (connection.closed) {
        this._connection = null;
        connection = Subscription.EMPTY;
      }
    }
    return connection;
  };
  ConnectableObservable2.prototype.refCount = function() {
    return refCount()(this);
  };
  return ConnectableObservable2;
}(Observable);

// node_modules/rxjs/dist/esm5/internal/scheduler/performanceTimestampProvider.js
var performanceTimestampProvider = {
  now: function() {
    return (performanceTimestampProvider.delegate || performance).now();
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/scheduler/animationFrameProvider.js
var animationFrameProvider = {
  schedule: function(callback) {
    var request = requestAnimationFrame;
    var cancel = cancelAnimationFrame;
    var delegate = animationFrameProvider.delegate;
    if (delegate) {
      request = delegate.requestAnimationFrame;
      cancel = delegate.cancelAnimationFrame;
    }
    var handle = request(function(timestamp2) {
      cancel = void 0;
      callback(timestamp2);
    });
    return new Subscription(function() {
      return cancel === null || cancel === void 0 ? void 0 : cancel(handle);
    });
  },
  requestAnimationFrame: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = animationFrameProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
  },
  cancelAnimationFrame: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = animationFrameProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/observable/dom/animationFrames.js
function animationFramesFactory(timestampProvider) {
  return new Observable(function(subscriber) {
    var provider = timestampProvider || performanceTimestampProvider;
    var start = provider.now();
    var id = 0;
    var run = function() {
      if (!subscriber.closed) {
        id = animationFrameProvider.requestAnimationFrame(function(timestamp2) {
          id = 0;
          var now = provider.now();
          subscriber.next({
            timestamp: timestampProvider ? now : timestamp2,
            elapsed: now - start
          });
          run();
        });
      }
    };
    run();
    return function() {
      if (id) {
        animationFrameProvider.cancelAnimationFrame(id);
      }
    };
  });
}
var DEFAULT_ANIMATION_FRAMES = animationFramesFactory();

// node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});

// node_modules/rxjs/dist/esm5/internal/Subject.js
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a2;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a2 = _b.return)) _a2.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err2) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err2;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err2);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a2;
      return ((_a2 = this.observers) === null || _a2 === void 0 ? void 0 : _a2.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a2 = this, hasError = _a2.hasError, isStopped = _a2.isStopped, observers = _a2.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a2 = this, hasError = _a2.hasError, thrownError = _a2.thrownError, isStopped = _a2.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a2, _b;
    (_b = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.next) === null || _b === void 0 ? void 0 : _b.call(_a2, value);
  };
  AnonymousSubject2.prototype.error = function(err2) {
    var _a2, _b;
    (_b = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.error) === null || _b === void 0 ? void 0 : _b.call(_a2, err2);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a2, _b;
    (_b = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.complete) === null || _b === void 0 ? void 0 : _b.call(_a2);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a2, _b;
    return (_b = (_a2 = this.source) === null || _a2 === void 0 ? void 0 : _a2.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
var BehaviorSubject = function(_super) {
  __extends(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    var _a2 = this, hasError = _a2.hasError, thrownError = _a2.thrownError, _value = _a2._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js
var dateTimestampProvider = {
  now: function() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/ReplaySubject.js
var ReplaySubject = function(_super) {
  __extends(ReplaySubject2, _super);
  function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
    if (_bufferSize === void 0) {
      _bufferSize = Infinity;
    }
    if (_windowTime === void 0) {
      _windowTime = Infinity;
    }
    if (_timestampProvider === void 0) {
      _timestampProvider = dateTimestampProvider;
    }
    var _this = _super.call(this) || this;
    _this._bufferSize = _bufferSize;
    _this._windowTime = _windowTime;
    _this._timestampProvider = _timestampProvider;
    _this._buffer = [];
    _this._infiniteTimeWindow = true;
    _this._infiniteTimeWindow = _windowTime === Infinity;
    _this._bufferSize = Math.max(1, _bufferSize);
    _this._windowTime = Math.max(1, _windowTime);
    return _this;
  }
  ReplaySubject2.prototype.next = function(value) {
    var _a2 = this, isStopped = _a2.isStopped, _buffer = _a2._buffer, _infiniteTimeWindow = _a2._infiniteTimeWindow, _timestampProvider = _a2._timestampProvider, _windowTime = _a2._windowTime;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    var subscription = this._innerSubscribe(subscriber);
    var _a2 = this, _infiniteTimeWindow = _a2._infiniteTimeWindow, _buffer = _a2._buffer;
    var copy = _buffer.slice();
    for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  };
  ReplaySubject2.prototype._trimBuffer = function() {
    var _a2 = this, _bufferSize = _a2._bufferSize, _timestampProvider = _a2._timestampProvider, _buffer = _a2._buffer, _infiniteTimeWindow = _a2._infiniteTimeWindow;
    var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      var now = _timestampProvider.now();
      var last3 = 0;
      for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
        last3 = i;
      }
      last3 && _buffer.splice(0, last3 + 1);
    }
  };
  return ReplaySubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/AsyncSubject.js
var AsyncSubject = function(_super) {
  __extends(AsyncSubject2, _super);
  function AsyncSubject2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this._value = null;
    _this._hasValue = false;
    _this._isComplete = false;
    return _this;
  }
  AsyncSubject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a2 = this, hasError = _a2.hasError, _hasValue = _a2._hasValue, _value = _a2._value, thrownError = _a2.thrownError, isStopped = _a2.isStopped, _isComplete = _a2._isComplete;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped || _isComplete) {
      _hasValue && subscriber.next(_value);
      subscriber.complete();
    }
  };
  AsyncSubject2.prototype.next = function(value) {
    if (!this.isStopped) {
      this._value = value;
      this._hasValue = true;
    }
  };
  AsyncSubject2.prototype.complete = function() {
    var _a2 = this, _hasValue = _a2._hasValue, _value = _a2._value, _isComplete = _a2._isComplete;
    if (!_isComplete) {
      this._isComplete = true;
      _hasValue && _super.prototype.next.call(this, _value);
      _super.prototype.complete.call(this);
    }
  };
  return AsyncSubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/scheduler/Action.js
var Action = function(_super) {
  __extends(Action2, _super);
  function Action2(scheduler, work) {
    return _super.call(this) || this;
  }
  Action2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return this;
  };
  return Action2;
}(Subscription);

// node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js
var intervalProvider = {
  setInterval: function(handler, timeout2) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = intervalProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
      return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout2], __read(args)));
    }
    return setInterval.apply(void 0, __spreadArray([handler, timeout2], __read(args)));
  },
  clearInterval: function(handle) {
    var delegate = intervalProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js
var AsyncAction = function(_super) {
  __extends(AsyncAction2, _super);
  function AsyncAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.pending = false;
    return _this;
  }
  AsyncAction2.prototype.schedule = function(state, delay2) {
    var _a2;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (this.closed) {
      return this;
    }
    this.state = state;
    var id = this.id;
    var scheduler = this.scheduler;
    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay2);
    }
    this.pending = true;
    this.delay = delay2;
    this.id = (_a2 = this.id) !== null && _a2 !== void 0 ? _a2 : this.requestAsyncId(scheduler, this.id, delay2);
    return this;
  };
  AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay2);
  };
  AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null && this.delay === delay2 && this.pending === false) {
      return id;
    }
    if (id != null) {
      intervalProvider.clearInterval(id);
    }
    return void 0;
  };
  AsyncAction2.prototype.execute = function(state, delay2) {
    if (this.closed) {
      return new Error("executing a cancelled action");
    }
    this.pending = false;
    var error = this._execute(state, delay2);
    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  };
  AsyncAction2.prototype._execute = function(state, _delay) {
    var errored = false;
    var errorValue;
    try {
      this.work(state);
    } catch (e) {
      errored = true;
      errorValue = e ? e : new Error("Scheduled action threw falsy error");
    }
    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  };
  AsyncAction2.prototype.unsubscribe = function() {
    if (!this.closed) {
      var _a2 = this, id = _a2.id, scheduler = _a2.scheduler;
      var actions = scheduler.actions;
      this.work = this.state = this.scheduler = null;
      this.pending = false;
      arrRemove(actions, this);
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }
      this.delay = null;
      _super.prototype.unsubscribe.call(this);
    }
  };
  return AsyncAction2;
}(Action);

// node_modules/rxjs/dist/esm5/internal/util/Immediate.js
var nextHandle = 1;
var resolved;
var activeHandles = {};
function findAndClearHandle(handle) {
  if (handle in activeHandles) {
    delete activeHandles[handle];
    return true;
  }
  return false;
}
var Immediate = {
  setImmediate: function(cb) {
    var handle = nextHandle++;
    activeHandles[handle] = true;
    if (!resolved) {
      resolved = Promise.resolve();
    }
    resolved.then(function() {
      return findAndClearHandle(handle) && cb();
    });
    return handle;
  },
  clearImmediate: function(handle) {
    findAndClearHandle(handle);
  }
};

// node_modules/rxjs/dist/esm5/internal/scheduler/immediateProvider.js
var setImmediate = Immediate.setImmediate;
var clearImmediate = Immediate.clearImmediate;
var immediateProvider = {
  setImmediate: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = immediateProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate).apply(void 0, __spreadArray([], __read(args)));
  },
  clearImmediate: function(handle) {
    var delegate = immediateProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/scheduler/AsapAction.js
var AsapAction = function(_super) {
  __extends(AsapAction2, _super);
  function AsapAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AsapAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.actions.push(this);
    return scheduler._scheduled || (scheduler._scheduled = immediateProvider.setImmediate(scheduler.flush.bind(scheduler, void 0)));
  };
  AsapAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    var _a2;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null ? delay2 > 0 : this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
    }
    var actions = scheduler.actions;
    if (id != null && ((_a2 = actions[actions.length - 1]) === null || _a2 === void 0 ? void 0 : _a2.id) !== id) {
      immediateProvider.clearImmediate(id);
      if (scheduler._scheduled === id) {
        scheduler._scheduled = void 0;
      }
    }
    return void 0;
  };
  return AsapAction2;
}(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/Scheduler.js
var Scheduler = function() {
  function Scheduler2(schedulerActionCtor, now) {
    if (now === void 0) {
      now = Scheduler2.now;
    }
    this.schedulerActionCtor = schedulerActionCtor;
    this.now = now;
  }
  Scheduler2.prototype.schedule = function(work, delay2, state) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return new this.schedulerActionCtor(this, work).schedule(state, delay2);
  };
  Scheduler2.now = dateTimestampProvider.now;
  return Scheduler2;
}();

// node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js
var AsyncScheduler = function(_super) {
  __extends(AsyncScheduler2, _super);
  function AsyncScheduler2(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler.now;
    }
    var _this = _super.call(this, SchedulerAction, now) || this;
    _this.actions = [];
    _this._active = false;
    return _this;
  }
  AsyncScheduler2.prototype.flush = function(action) {
    var actions = this.actions;
    if (this._active) {
      actions.push(action);
      return;
    }
    var error;
    this._active = true;
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (action = actions.shift());
    this._active = false;
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsyncScheduler2;
}(Scheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/AsapScheduler.js
var AsapScheduler = function(_super) {
  __extends(AsapScheduler2, _super);
  function AsapScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AsapScheduler2.prototype.flush = function(action) {
    this._active = true;
    var flushId = this._scheduled;
    this._scheduled = void 0;
    var actions = this.actions;
    var error;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while ((action = actions[0]) && action.id === flushId && actions.shift());
    this._active = false;
    if (error) {
      while ((action = actions[0]) && action.id === flushId && actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsapScheduler2;
}(AsyncScheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/asap.js
var asapScheduler = new AsapScheduler(AsapAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/async.js
var asyncScheduler = new AsyncScheduler(AsyncAction);
var async = asyncScheduler;

// node_modules/rxjs/dist/esm5/internal/scheduler/QueueAction.js
var QueueAction = function(_super) {
  __extends(QueueAction2, _super);
  function QueueAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  QueueAction2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 > 0) {
      return _super.prototype.schedule.call(this, state, delay2);
    }
    this.delay = delay2;
    this.state = state;
    this.scheduler.flush(this);
    return this;
  };
  QueueAction2.prototype.execute = function(state, delay2) {
    return delay2 > 0 || this.closed ? _super.prototype.execute.call(this, state, delay2) : this._execute(state, delay2);
  };
  QueueAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null && delay2 > 0 || delay2 == null && this.delay > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.flush(this);
    return 0;
  };
  return QueueAction2;
}(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/QueueScheduler.js
var QueueScheduler = function(_super) {
  __extends(QueueScheduler2, _super);
  function QueueScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return QueueScheduler2;
}(AsyncScheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/queue.js
var queueScheduler = new QueueScheduler(QueueAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameAction.js
var AnimationFrameAction = function(_super) {
  __extends(AnimationFrameAction2, _super);
  function AnimationFrameAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.actions.push(this);
    return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(function() {
      return scheduler.flush(void 0);
    }));
  };
  AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    var _a2;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null ? delay2 > 0 : this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
    }
    var actions = scheduler.actions;
    if (id != null && ((_a2 = actions[actions.length - 1]) === null || _a2 === void 0 ? void 0 : _a2.id) !== id) {
      animationFrameProvider.cancelAnimationFrame(id);
      scheduler._scheduled = void 0;
    }
    return void 0;
  };
  return AnimationFrameAction2;
}(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameScheduler.js
var AnimationFrameScheduler = function(_super) {
  __extends(AnimationFrameScheduler2, _super);
  function AnimationFrameScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AnimationFrameScheduler2.prototype.flush = function(action) {
    this._active = true;
    var flushId = this._scheduled;
    this._scheduled = void 0;
    var actions = this.actions;
    var error;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while ((action = actions[0]) && action.id === flushId && actions.shift());
    this._active = false;
    if (error) {
      while ((action = actions[0]) && action.id === flushId && actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AnimationFrameScheduler2;
}(AsyncScheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/animationFrame.js
var animationFrameScheduler = new AnimationFrameScheduler(AnimationFrameAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/VirtualTimeScheduler.js
var VirtualTimeScheduler = function(_super) {
  __extends(VirtualTimeScheduler2, _super);
  function VirtualTimeScheduler2(schedulerActionCtor, maxFrames) {
    if (schedulerActionCtor === void 0) {
      schedulerActionCtor = VirtualAction;
    }
    if (maxFrames === void 0) {
      maxFrames = Infinity;
    }
    var _this = _super.call(this, schedulerActionCtor, function() {
      return _this.frame;
    }) || this;
    _this.maxFrames = maxFrames;
    _this.frame = 0;
    _this.index = -1;
    return _this;
  }
  VirtualTimeScheduler2.prototype.flush = function() {
    var _a2 = this, actions = _a2.actions, maxFrames = _a2.maxFrames;
    var error;
    var action;
    while ((action = actions[0]) && action.delay <= maxFrames) {
      actions.shift();
      this.frame = action.delay;
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    }
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  VirtualTimeScheduler2.frameTimeFactor = 10;
  return VirtualTimeScheduler2;
}(AsyncScheduler);
var VirtualAction = function(_super) {
  __extends(VirtualAction2, _super);
  function VirtualAction2(scheduler, work, index) {
    if (index === void 0) {
      index = scheduler.index += 1;
    }
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.index = index;
    _this.active = true;
    _this.index = scheduler.index = index;
    return _this;
  }
  VirtualAction2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (Number.isFinite(delay2)) {
      if (!this.id) {
        return _super.prototype.schedule.call(this, state, delay2);
      }
      this.active = false;
      var action = new VirtualAction2(this.scheduler, this.work);
      this.add(action);
      return action.schedule(state, delay2);
    } else {
      return Subscription.EMPTY;
    }
  };
  VirtualAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    this.delay = scheduler.frame + delay2;
    var actions = scheduler.actions;
    actions.push(this);
    actions.sort(VirtualAction2.sortActions);
    return 1;
  };
  VirtualAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return void 0;
  };
  VirtualAction2.prototype._execute = function(state, delay2) {
    if (this.active === true) {
      return _super.prototype._execute.call(this, state, delay2);
    }
  };
  VirtualAction2.sortActions = function(a, b) {
    if (a.delay === b.delay) {
      if (a.index === b.index) {
        return 0;
      } else if (a.index > b.index) {
        return 1;
      } else {
        return -1;
      }
    } else if (a.delay > b.delay) {
      return 1;
    } else {
      return -1;
    }
  };
  return VirtualAction2;
}(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/observable/empty.js
var EMPTY = new Observable(function(subscriber) {
  return subscriber.complete();
});

// node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
function isScheduler(value) {
  return value && isFunction(value.schedule);
}

// node_modules/rxjs/dist/esm5/internal/util/args.js
function last(arr) {
  return arr[arr.length - 1];
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}

// node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
var isArrayLike = function(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};

// node_modules/rxjs/dist/esm5/internal/util/isPromise.js
function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

// node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
function isInteropObservable(input) {
  return isFunction(input[observable]);
}

// node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}

// node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();

// node_modules/rxjs/dist/esm5/internal/util/isIterable.js
function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a2, value, done;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          if (false) return [3, 8];
          return [4, __await(reader.read())];
        case 3:
          _a2 = _b.sent(), value = _a2.value, done = _a2.done;
          if (!done) return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

// node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function(subscriber) {
    var obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array2) {
  return new Observable(function(subscriber) {
    for (var i = 0; i < array2.length && !subscriber.closed; i++) {
      subscriber.next(array2[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err2) {
      return subscriber.error(err2);
    }).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function(subscriber) {
    var e_1, _a2;
    try {
      for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a2 = iterable_1.return)) _a2.call(iterable_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function(subscriber) {
    process2(asyncIterable, subscriber).catch(function(err2) {
      return subscriber.error(err2);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process2(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a2;
  return __awaiter(this, void 0, void 0, function() {
    var value, e_2_1;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a2 = asyncIterable_1.return))) return [3, 8];
          return [4, _a2.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2) throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
function executeSchedule(parentSubscription, scheduler, work, delay2, repeat2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  if (repeat2 === void 0) {
    repeat2 = false;
  }
  var scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat2) {
      parentSubscription.add(this.schedule(null, delay2));
    } else {
      this.unsubscribe();
    }
  }, delay2);
  parentSubscription.add(scheduleSubscription);
  if (!repeat2) {
    return scheduleSubscription;
  }
}

// node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
function observeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return operate(function(source, subscriber) {
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.next(value);
      }, delay2);
    }, function() {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.complete();
      }, delay2);
    }, function(err2) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.error(err2);
      }, delay2);
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
function subscribeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return operate(function(source, subscriber) {
    subscriber.add(scheduler.schedule(function() {
      return source.subscribe(subscriber);
    }, delay2));
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
function scheduleArray(input, scheduler) {
  return new Observable(function(subscriber) {
    var i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
function scheduleIterable(input, scheduler) {
  return new Observable(function(subscriber) {
    var iterator2;
    executeSchedule(subscriber, scheduler, function() {
      iterator2 = input[iterator]();
      executeSchedule(subscriber, scheduler, function() {
        var _a2;
        var value;
        var done;
        try {
          _a2 = iterator2.next(), value = _a2.value, done = _a2.done;
        } catch (err2) {
          subscriber.error(err2);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return function() {
      return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
    };
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function(subscriber) {
    executeSchedule(subscriber, scheduler, function() {
      var iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler, function() {
        iterator2.next().then(function(result) {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}

// node_modules/rxjs/dist/esm5/internal/observable/from.js
function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

// node_modules/rxjs/dist/esm5/internal/observable/of.js
function of() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  return from(args, scheduler);
}

// node_modules/rxjs/dist/esm5/internal/observable/throwError.js
function throwError(errorOrErrorFactory, scheduler) {
  var errorFactory = isFunction(errorOrErrorFactory) ? errorOrErrorFactory : function() {
    return errorOrErrorFactory;
  };
  var init = function(subscriber) {
    return subscriber.error(errorFactory());
  };
  return new Observable(scheduler ? function(subscriber) {
    return scheduler.schedule(init, 0, subscriber);
  } : init);
}

// node_modules/rxjs/dist/esm5/internal/Notification.js
var NotificationKind;
(function(NotificationKind2) {
  NotificationKind2["NEXT"] = "N";
  NotificationKind2["ERROR"] = "E";
  NotificationKind2["COMPLETE"] = "C";
})(NotificationKind || (NotificationKind = {}));
var Notification = function() {
  function Notification2(kind, value, error) {
    this.kind = kind;
    this.value = value;
    this.error = error;
    this.hasValue = kind === "N";
  }
  Notification2.prototype.observe = function(observer) {
    return observeNotification(this, observer);
  };
  Notification2.prototype.do = function(nextHandler, errorHandler, completeHandler) {
    var _a2 = this, kind = _a2.kind, value = _a2.value, error = _a2.error;
    return kind === "N" ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === "E" ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
  };
  Notification2.prototype.accept = function(nextOrObserver, error, complete) {
    var _a2;
    return isFunction((_a2 = nextOrObserver) === null || _a2 === void 0 ? void 0 : _a2.next) ? this.observe(nextOrObserver) : this.do(nextOrObserver, error, complete);
  };
  Notification2.prototype.toObservable = function() {
    var _a2 = this, kind = _a2.kind, value = _a2.value, error = _a2.error;
    var result = kind === "N" ? of(value) : kind === "E" ? throwError(function() {
      return error;
    }) : kind === "C" ? EMPTY : 0;
    if (!result) {
      throw new TypeError("Unexpected notification kind " + kind);
    }
    return result;
  };
  Notification2.createNext = function(value) {
    return new Notification2("N", value);
  };
  Notification2.createError = function(err2) {
    return new Notification2("E", void 0, err2);
  };
  Notification2.createComplete = function() {
    return Notification2.completeNotification;
  };
  Notification2.completeNotification = new Notification2("C");
  return Notification2;
}();
function observeNotification(notification, observer) {
  var _a2, _b, _c;
  var _d = notification, kind = _d.kind, value = _d.value, error = _d.error;
  if (typeof kind !== "string") {
    throw new TypeError('Invalid notification, missing "kind"');
  }
  kind === "N" ? (_a2 = observer.next) === null || _a2 === void 0 ? void 0 : _a2.call(observer, value) : kind === "E" ? (_b = observer.error) === null || _b === void 0 ? void 0 : _b.call(observer, error) : (_c = observer.complete) === null || _c === void 0 ? void 0 : _c.call(observer);
}

// node_modules/rxjs/dist/esm5/internal/util/EmptyError.js
var EmptyError = createErrorClass(function(_super) {
  return function EmptyErrorImpl() {
    _super(this);
    this.name = "EmptyError";
    this.message = "no elements in sequence";
  };
});

// node_modules/rxjs/dist/esm5/internal/firstValueFrom.js
function firstValueFrom(source, config3) {
  var hasConfig = typeof config3 === "object";
  return new Promise(function(resolve, reject) {
    var subscriber = new SafeSubscriber({
      next: function(value) {
        resolve(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: function() {
        if (hasConfig) {
          resolve(config3.defaultValue);
        } else {
          reject(new EmptyError());
        }
      }
    });
    source.subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm5/internal/util/ArgumentOutOfRangeError.js
var ArgumentOutOfRangeError = createErrorClass(function(_super) {
  return function ArgumentOutOfRangeErrorImpl() {
    _super(this);
    this.name = "ArgumentOutOfRangeError";
    this.message = "argument out of range";
  };
});

// node_modules/rxjs/dist/esm5/internal/util/NotFoundError.js
var NotFoundError = createErrorClass(function(_super) {
  return function NotFoundErrorImpl(message) {
    _super(this);
    this.name = "NotFoundError";
    this.message = message;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/SequenceError.js
var SequenceError = createErrorClass(function(_super) {
  return function SequenceErrorImpl(message) {
    _super(this);
    this.name = "SequenceError";
    this.message = message;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/isDate.js
function isValidDate(value) {
  return value instanceof Date && !isNaN(value);
}

// node_modules/rxjs/dist/esm5/internal/operators/timeout.js
var TimeoutError = createErrorClass(function(_super) {
  return function TimeoutErrorImpl(info) {
    if (info === void 0) {
      info = null;
    }
    _super(this);
    this.message = "Timeout has occurred";
    this.name = "TimeoutError";
    this.info = info;
  };
});

// node_modules/rxjs/dist/esm5/internal/operators/map.js
function map(project, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js
var isArray = Array.isArray;
function callOrApply(fn, args) {
  return isArray(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
}
function mapOneOrManyArgs(fn) {
  return map(function(args) {
    return callOrApply(fn, args);
  });
}

// node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js
var isArray2 = Array.isArray;
var objectProto = Object.prototype;

// node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand3, innerSubScheduler, additionalFinalizer) {
  var buffer2 = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function() {
    if (isComplete && !buffer2.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function(value) {
    return active < concurrent ? doInnerSub(value) : buffer2.push(value);
  };
  var doInnerSub = function(value) {
    expand3 && subscriber.next(value);
    active++;
    var innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
      onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
      if (expand3) {
        outerNext(innerValue);
      } else {
        subscriber.next(innerValue);
      }
    }, function() {
      innerComplete = true;
    }, void 0, function() {
      if (innerComplete) {
        try {
          active--;
          var _loop_1 = function() {
            var bufferedValue = buffer2.shift();
            if (innerSubScheduler) {
              executeSchedule(subscriber, innerSubScheduler, function() {
                return doInnerSub(bufferedValue);
              });
            } else {
              doInnerSub(bufferedValue);
            }
          };
          while (buffer2.length && active < concurrent) {
            _loop_1();
          }
          checkComplete();
        } catch (err2) {
          subscriber.error(err2);
        }
      }
    }));
  };
  source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
    isComplete = true;
    checkComplete();
  }));
  return function() {
    additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction(resultSelector)) {
    return mergeMap(function(a, i) {
      return map(function(b, ii) {
        return resultSelector(a, b, i, ii);
      })(innerFrom(project(a, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate(function(source, subscriber) {
    return mergeInternals(source, subscriber, project, concurrent);
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}

// node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js
var nodeEventEmitterMethods = ["addListener", "removeListener"];
var eventTargetMethods = ["addEventListener", "removeEventListener"];
var jqueryMethods = ["on", "off"];
function fromEvent(target, eventName, options, resultSelector) {
  if (isFunction(options)) {
    resultSelector = options;
    options = void 0;
  }
  if (resultSelector) {
    return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
  }
  var _a2 = __read(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler, options);
    };
  }) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add2 = _a2[0], remove = _a2[1];
  if (!add2) {
    if (isArrayLike(target)) {
      return mergeMap(function(subTarget) {
        return fromEvent(subTarget, eventName, options);
      })(innerFrom(target));
    }
  }
  if (!add2) {
    throw new TypeError("Invalid event target");
  }
  return new Observable(function(subscriber) {
    var handler = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return subscriber.next(1 < args.length ? args : args[0]);
    };
    add2(handler);
    return function() {
      return remove(handler);
    };
  });
}
function toCommonHandlerRegistry(target, eventName) {
  return function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler);
    };
  };
}
function isNodeStyleEventEmitter(target) {
  return isFunction(target.addListener) && isFunction(target.removeListener);
}
function isJQueryStyleEventEmitter(target) {
  return isFunction(target.on) && isFunction(target.off);
}
function isEventTarget(target) {
  return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
}

// node_modules/rxjs/dist/esm5/internal/observable/timer.js
function timer(dueTime, intervalOrScheduler, scheduler) {
  if (dueTime === void 0) {
    dueTime = 0;
  }
  if (scheduler === void 0) {
    scheduler = async;
  }
  var intervalDuration = -1;
  if (intervalOrScheduler != null) {
    if (isScheduler(intervalOrScheduler)) {
      scheduler = intervalOrScheduler;
    } else {
      intervalDuration = intervalOrScheduler;
    }
  }
  return new Observable(function(subscriber) {
    var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
    if (due < 0) {
      due = 0;
    }
    var n = 0;
    return scheduler.schedule(function() {
      if (!subscriber.closed) {
        subscriber.next(n++);
        if (0 <= intervalDuration) {
          this.schedule(void 0, intervalDuration);
        } else {
          subscriber.complete();
        }
      }
    }, due);
  });
}

// node_modules/rxjs/dist/esm5/internal/observable/merge.js
function merge() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  var sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}

// node_modules/rxjs/dist/esm5/internal/observable/never.js
var NEVER = new Observable(noop);

// node_modules/rxjs/dist/esm5/internal/util/argsOrArgArray.js
var isArray3 = Array.isArray;
function argsOrArgArray(args) {
  return args.length === 1 && isArray3(args[0]) ? args[0] : args;
}

// node_modules/rxjs/dist/esm5/internal/operators/filter.js
function filter(predicate, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/observable/race.js
function race() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  sources = argsOrArgArray(sources);
  return sources.length === 1 ? innerFrom(sources[0]) : new Observable(raceInit(sources));
}
function raceInit(sources) {
  return function(subscriber) {
    var subscriptions = [];
    var _loop_1 = function(i2) {
      subscriptions.push(innerFrom(sources[i2]).subscribe(createOperatorSubscriber(subscriber, function(value) {
        if (subscriptions) {
          for (var s = 0; s < subscriptions.length; s++) {
            s !== i2 && subscriptions[s].unsubscribe();
          }
          subscriptions = null;
        }
        subscriber.next(value);
      })));
    };
    for (var i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) {
      _loop_1(i);
    }
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/defaultIfEmpty.js
function defaultIfEmpty(defaultValue) {
  return operate(function(source, subscriber) {
    var hasValue = false;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      subscriber.next(value);
    }, function() {
      if (!hasValue) {
        subscriber.next(defaultValue);
      }
      subscriber.complete();
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/take.js
function take(count2) {
  return count2 <= 0 ? function() {
    return EMPTY;
  } : operate(function(source, subscriber) {
    var seen = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      if (++seen <= count2) {
        subscriber.next(value);
        if (count2 <= seen) {
          subscriber.complete();
        }
      }
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/throwIfEmpty.js
function throwIfEmpty(errorFactory) {
  if (errorFactory === void 0) {
    errorFactory = defaultErrorFactory;
  }
  return operate(function(source, subscriber) {
    var hasValue = false;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      subscriber.next(value);
    }, function() {
      return hasValue ? subscriber.complete() : subscriber.error(errorFactory());
    }));
  });
}
function defaultErrorFactory() {
  return new EmptyError();
}

// node_modules/rxjs/dist/esm5/internal/operators/finalize.js
function finalize(callback) {
  return operate(function(source, subscriber) {
    try {
      source.subscribe(subscriber);
    } finally {
      subscriber.add(callback);
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/first.js
function first(predicate, defaultValue) {
  var hasDefaultValue = arguments.length >= 2;
  return function(source) {
    return source.pipe(predicate ? filter(function(v, i) {
      return predicate(v, i, source);
    }) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function() {
      return new EmptyError();
    }));
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/share.js
function share(options) {
  if (options === void 0) {
    options = {};
  }
  var _a2 = options.connector, connector = _a2 === void 0 ? function() {
    return new Subject();
  } : _a2, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
  return function(wrapperSource) {
    var connection;
    var resetConnection;
    var subject;
    var refCount2 = 0;
    var hasCompleted = false;
    var hasErrored = false;
    var cancelReset = function() {
      resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
      resetConnection = void 0;
    };
    var reset = function() {
      cancelReset();
      connection = subject = void 0;
      hasCompleted = hasErrored = false;
    };
    var resetAndUnsubscribe = function() {
      var conn = connection;
      reset();
      conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
    };
    return operate(function(source, subscriber) {
      refCount2++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
      subscriber.add(function() {
        refCount2--;
        if (refCount2 === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection && refCount2 > 0) {
        connection = new SafeSubscriber({
          next: function(value) {
            return dest.next(value);
          },
          error: function(err2) {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err2);
            dest.error(err2);
          },
          complete: function() {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          }
        });
        innerFrom(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
function handleReset(reset, on) {
  var args = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  if (on === true) {
    reset();
    return;
  }
  if (on === false) {
    return;
  }
  var onSubscriber = new SafeSubscriber({
    next: function() {
      onSubscriber.unsubscribe();
      reset();
    }
  });
  return innerFrom(on.apply(void 0, __spreadArray([], __read(args)))).subscribe(onSubscriber);
}

// node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js
function shareReplay(configOrBufferSize, windowTime2, scheduler) {
  var _a2, _b, _c;
  var bufferSize;
  var refCount2 = false;
  if (configOrBufferSize && typeof configOrBufferSize === "object") {
    _a2 = configOrBufferSize.bufferSize, bufferSize = _a2 === void 0 ? Infinity : _a2, _b = configOrBufferSize.windowTime, windowTime2 = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount2 = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
  } else {
    bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
  }
  return share({
    connector: function() {
      return new ReplaySubject(bufferSize, windowTime2, scheduler);
    },
    resetOnError: true,
    resetOnComplete: false,
    resetOnRefCountZero: refCount2
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/switchMap.js
function switchMap(project, resultSelector) {
  return operate(function(source, subscriber) {
    var innerSubscriber = null;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      return isComplete && !innerSubscriber && subscriber.complete();
    };
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
      var innerIndex = 0;
      var outerIndex = index++;
      innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
        return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
      }, function() {
        innerSubscriber = null;
        checkComplete();
      }));
    }, function() {
      isComplete = true;
      checkComplete();
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js
function takeUntil(notifier) {
  return operate(function(source, subscriber) {
    innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, function() {
      return subscriber.complete();
    }, noop));
    !subscriber.closed && source.subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/tap.js
function tap(observerOrNext, error, complete) {
  var tapObserver = isFunction(observerOrNext) || error || complete ? { next: observerOrNext, error, complete } : observerOrNext;
  return tapObserver ? operate(function(source, subscriber) {
    var _a2;
    (_a2 = tapObserver.subscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
    var isUnsub = true;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var _a3;
      (_a3 = tapObserver.next) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver, value);
      subscriber.next(value);
    }, function() {
      var _a3;
      isUnsub = false;
      (_a3 = tapObserver.complete) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver);
      subscriber.complete();
    }, function(err2) {
      var _a3;
      isUnsub = false;
      (_a3 = tapObserver.error) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver, err2);
      subscriber.error(err2);
    }, function() {
      var _a3, _b;
      if (isUnsub) {
        (_a3 = tapObserver.unsubscribe) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver);
      }
      (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
    }));
  }) : identity;
}

// node_modules/neverthrow/dist/index.es.js
var defaultErrorConfig = {
  withStackTrace: false
};
var createNeverThrowError = (message, result, config3 = defaultErrorConfig) => {
  const data = result.isOk() ? { type: "Ok", value: result.value } : { type: "Err", value: result.error };
  const maybeStack = config3.withStackTrace ? new Error().stack : void 0;
  return {
    data,
    message,
    stack: maybeStack
  };
};
function __awaiter2(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __values2(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await2(v) {
  return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
}
function __asyncGenerator2(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n]) i[n] = function(v) {
      return new Promise(function(a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f2, v) {
    if (f2(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f2) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await2(o[n](v)), done: n === "return" } : f2 ? f2(v) : v;
    } : f2;
  }
}
function __asyncValues2(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values2 === "function" ? __values2(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
var ResultAsync = class _ResultAsync {
  constructor(res) {
    this._promise = res;
  }
  static fromSafePromise(promise) {
    const newPromise = promise.then((value) => new Ok(value));
    return new _ResultAsync(newPromise);
  }
  static fromPromise(promise, errorFn) {
    const newPromise = promise.then((value) => new Ok(value)).catch((e) => new Err(errorFn(e)));
    return new _ResultAsync(newPromise);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromThrowable(fn, errorFn) {
    return (...args) => {
      return new _ResultAsync((() => __awaiter2(this, void 0, void 0, function* () {
        try {
          return new Ok(yield fn(...args));
        } catch (error) {
          return new Err(errorFn ? errorFn(error) : error);
        }
      }))());
    };
  }
  static combine(asyncResultList) {
    return combineResultAsyncList(asyncResultList);
  }
  static combineWithAllErrors(asyncResultList) {
    return combineResultAsyncListWithAllErrors(asyncResultList);
  }
  map(f2) {
    return new _ResultAsync(this._promise.then((res) => __awaiter2(this, void 0, void 0, function* () {
      if (res.isErr()) {
        return new Err(res.error);
      }
      return new Ok(yield f2(res.value));
    })));
  }
  mapErr(f2) {
    return new _ResultAsync(this._promise.then((res) => __awaiter2(this, void 0, void 0, function* () {
      if (res.isOk()) {
        return new Ok(res.value);
      }
      return new Err(yield f2(res.error));
    })));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  andThen(f2) {
    return new _ResultAsync(this._promise.then((res) => {
      if (res.isErr()) {
        return new Err(res.error);
      }
      const newValue = f2(res.value);
      return newValue instanceof _ResultAsync ? newValue._promise : newValue;
    }));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  orElse(f2) {
    return new _ResultAsync(this._promise.then((res) => __awaiter2(this, void 0, void 0, function* () {
      if (res.isErr()) {
        return f2(res.error);
      }
      return new Ok(res.value);
    })));
  }
  match(ok2, _err) {
    return this._promise.then((res) => res.match(ok2, _err));
  }
  unwrapOr(t) {
    return this._promise.then((res) => res.unwrapOr(t));
  }
  /**
   * Emulates Rust's `?` operator in `safeTry`'s body. See also `safeTry`.
   */
  safeUnwrap() {
    return __asyncGenerator2(this, arguments, function* safeUnwrap_1() {
      return yield __await2(yield __await2(yield* __asyncDelegator(__asyncValues2(yield __await2(this._promise.then((res) => res.safeUnwrap()))))));
    });
  }
  // Makes ResultAsync implement PromiseLike<Result>
  then(successCallback, failureCallback) {
    return this._promise.then(successCallback, failureCallback);
  }
};
var okAsync = (value) => new ResultAsync(Promise.resolve(new Ok(value)));
var errAsync = (err2) => new ResultAsync(Promise.resolve(new Err(err2)));
var fromPromise2 = ResultAsync.fromPromise;
var fromSafePromise = ResultAsync.fromSafePromise;
var fromAsyncThrowable = ResultAsync.fromThrowable;
var combineResultList = (resultList) => {
  let acc = ok([]);
  for (const result of resultList) {
    if (result.isErr()) {
      acc = err(result.error);
      break;
    } else {
      acc.map((list) => list.push(result.value));
    }
  }
  return acc;
};
var combineResultAsyncList = (asyncResultList) => ResultAsync.fromSafePromise(Promise.all(asyncResultList)).andThen(combineResultList);
var combineResultListWithAllErrors = (resultList) => {
  let acc = ok([]);
  for (const result of resultList) {
    if (result.isErr() && acc.isErr()) {
      acc.error.push(result.error);
    } else if (result.isErr() && acc.isOk()) {
      acc = err([result.error]);
    } else if (result.isOk() && acc.isOk()) {
      acc.value.push(result.value);
    }
  }
  return acc;
};
var combineResultAsyncListWithAllErrors = (asyncResultList) => ResultAsync.fromSafePromise(Promise.all(asyncResultList)).andThen(combineResultListWithAllErrors);
var Result;
(function(Result2) {
  function fromThrowable2(fn, errorFn) {
    return (...args) => {
      try {
        const result = fn(...args);
        return ok(result);
      } catch (e) {
        return err(errorFn ? errorFn(e) : e);
      }
    };
  }
  Result2.fromThrowable = fromThrowable2;
  function combine(resultList) {
    return combineResultList(resultList);
  }
  Result2.combine = combine;
  function combineWithAllErrors(resultList) {
    return combineResultListWithAllErrors(resultList);
  }
  Result2.combineWithAllErrors = combineWithAllErrors;
})(Result || (Result = {}));
var ok = (value) => new Ok(value);
var err = (err2) => new Err(err2);
var Ok = class {
  constructor(value) {
    this.value = value;
  }
  isOk() {
    return true;
  }
  isErr() {
    return !this.isOk();
  }
  map(f2) {
    return ok(f2(this.value));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapErr(_f) {
    return ok(this.value);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  andThen(f2) {
    return f2(this.value);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  orElse(_f) {
    return ok(this.value);
  }
  asyncAndThen(f2) {
    return f2(this.value);
  }
  asyncMap(f2) {
    return ResultAsync.fromSafePromise(f2(this.value));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unwrapOr(_v) {
    return this.value;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  match(ok2, _err) {
    return ok2(this.value);
  }
  safeUnwrap() {
    const value = this.value;
    return function* () {
      return value;
    }();
  }
  _unsafeUnwrap(_) {
    return this.value;
  }
  _unsafeUnwrapErr(config3) {
    throw createNeverThrowError("Called `_unsafeUnwrapErr` on an Ok", this, config3);
  }
};
var Err = class {
  constructor(error) {
    this.error = error;
  }
  isOk() {
    return false;
  }
  isErr() {
    return !this.isOk();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(_f) {
    return err(this.error);
  }
  mapErr(f2) {
    return err(f2(this.error));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  andThen(_f) {
    return err(this.error);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  orElse(f2) {
    return f2(this.error);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asyncAndThen(_f) {
    return errAsync(this.error);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asyncMap(_f) {
    return errAsync(this.error);
  }
  unwrapOr(v) {
    return v;
  }
  match(_ok, err2) {
    return err2(this.error);
  }
  safeUnwrap() {
    const error = this.error;
    return function* () {
      yield err(error);
      throw new Error("Do not use this generator out of `safeTry`");
    }();
  }
  _unsafeUnwrap(config3) {
    throw createNeverThrowError("Called `_unsafeUnwrap` on an Err", this, config3);
  }
  _unsafeUnwrapErr(_) {
    return this.error;
  }
};
var fromThrowable = Result.fromThrowable;

// node_modules/bowser/src/constants.js
var BROWSER_ALIASES_MAP = {
  "Amazon Silk": "amazon_silk",
  "Android Browser": "android",
  Bada: "bada",
  BlackBerry: "blackberry",
  Chrome: "chrome",
  Chromium: "chromium",
  Electron: "electron",
  Epiphany: "epiphany",
  Firefox: "firefox",
  Focus: "focus",
  Generic: "generic",
  "Google Search": "google_search",
  Googlebot: "googlebot",
  "Internet Explorer": "ie",
  "K-Meleon": "k_meleon",
  Maxthon: "maxthon",
  "Microsoft Edge": "edge",
  "MZ Browser": "mz",
  "NAVER Whale Browser": "naver",
  Opera: "opera",
  "Opera Coast": "opera_coast",
  PhantomJS: "phantomjs",
  Puffin: "puffin",
  QupZilla: "qupzilla",
  QQ: "qq",
  QQLite: "qqlite",
  Safari: "safari",
  Sailfish: "sailfish",
  "Samsung Internet for Android": "samsung_internet",
  SeaMonkey: "seamonkey",
  Sleipnir: "sleipnir",
  Swing: "swing",
  Tizen: "tizen",
  "UC Browser": "uc",
  Vivaldi: "vivaldi",
  "WebOS Browser": "webos",
  WeChat: "wechat",
  "Yandex Browser": "yandex",
  Roku: "roku"
};
var BROWSER_MAP = {
  amazon_silk: "Amazon Silk",
  android: "Android Browser",
  bada: "Bada",
  blackberry: "BlackBerry",
  chrome: "Chrome",
  chromium: "Chromium",
  electron: "Electron",
  epiphany: "Epiphany",
  firefox: "Firefox",
  focus: "Focus",
  generic: "Generic",
  googlebot: "Googlebot",
  google_search: "Google Search",
  ie: "Internet Explorer",
  k_meleon: "K-Meleon",
  maxthon: "Maxthon",
  edge: "Microsoft Edge",
  mz: "MZ Browser",
  naver: "NAVER Whale Browser",
  opera: "Opera",
  opera_coast: "Opera Coast",
  phantomjs: "PhantomJS",
  puffin: "Puffin",
  qupzilla: "QupZilla",
  qq: "QQ Browser",
  qqlite: "QQ Browser Lite",
  safari: "Safari",
  sailfish: "Sailfish",
  samsung_internet: "Samsung Internet for Android",
  seamonkey: "SeaMonkey",
  sleipnir: "Sleipnir",
  swing: "Swing",
  tizen: "Tizen",
  uc: "UC Browser",
  vivaldi: "Vivaldi",
  webos: "WebOS Browser",
  wechat: "WeChat",
  yandex: "Yandex Browser"
};
var PLATFORMS_MAP = {
  tablet: "tablet",
  mobile: "mobile",
  desktop: "desktop",
  tv: "tv"
};
var OS_MAP = {
  WindowsPhone: "Windows Phone",
  Windows: "Windows",
  MacOS: "macOS",
  iOS: "iOS",
  Android: "Android",
  WebOS: "WebOS",
  BlackBerry: "BlackBerry",
  Bada: "Bada",
  Tizen: "Tizen",
  Linux: "Linux",
  ChromeOS: "Chrome OS",
  PlayStation4: "PlayStation 4",
  Roku: "Roku"
};
var ENGINE_MAP = {
  EdgeHTML: "EdgeHTML",
  Blink: "Blink",
  Trident: "Trident",
  Presto: "Presto",
  Gecko: "Gecko",
  WebKit: "WebKit"
};

// node_modules/bowser/src/utils.js
var Utils = class _Utils {
  /**
   * Get first matched item for a string
   * @param {RegExp} regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getFirstMatch(regexp, ua) {
    const match = ua.match(regexp);
    return match && match.length > 0 && match[1] || "";
  }
  /**
   * Get second matched item for a string
   * @param regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getSecondMatch(regexp, ua) {
    const match = ua.match(regexp);
    return match && match.length > 1 && match[2] || "";
  }
  /**
   * Match a regexp and return a constant or undefined
   * @param {RegExp} regexp
   * @param {String} ua
   * @param {*} _const Any const that will be returned if regexp matches the string
   * @return {*}
   */
  static matchAndReturnConst(regexp, ua, _const) {
    if (regexp.test(ua)) {
      return _const;
    }
    return void 0;
  }
  static getWindowsVersionName(version) {
    switch (version) {
      case "NT":
        return "NT";
      case "XP":
        return "XP";
      case "NT 5.0":
        return "2000";
      case "NT 5.1":
        return "XP";
      case "NT 5.2":
        return "2003";
      case "NT 6.0":
        return "Vista";
      case "NT 6.1":
        return "7";
      case "NT 6.2":
        return "8";
      case "NT 6.3":
        return "8.1";
      case "NT 10.0":
        return "10";
      default:
        return void 0;
    }
  }
  /**
   * Get macOS version name
   *    10.5 - Leopard
   *    10.6 - Snow Leopard
   *    10.7 - Lion
   *    10.8 - Mountain Lion
   *    10.9 - Mavericks
   *    10.10 - Yosemite
   *    10.11 - El Capitan
   *    10.12 - Sierra
   *    10.13 - High Sierra
   *    10.14 - Mojave
   *    10.15 - Catalina
   *
   * @example
   *   getMacOSVersionName("10.14") // 'Mojave'
   *
   * @param  {string} version
   * @return {string} versionName
   */
  static getMacOSVersionName(version) {
    const v = version.split(".").splice(0, 2).map((s) => parseInt(s, 10) || 0);
    v.push(0);
    if (v[0] !== 10) return void 0;
    switch (v[1]) {
      case 5:
        return "Leopard";
      case 6:
        return "Snow Leopard";
      case 7:
        return "Lion";
      case 8:
        return "Mountain Lion";
      case 9:
        return "Mavericks";
      case 10:
        return "Yosemite";
      case 11:
        return "El Capitan";
      case 12:
        return "Sierra";
      case 13:
        return "High Sierra";
      case 14:
        return "Mojave";
      case 15:
        return "Catalina";
      default:
        return void 0;
    }
  }
  /**
   * Get Android version name
   *    1.5 - Cupcake
   *    1.6 - Donut
   *    2.0 - Eclair
   *    2.1 - Eclair
   *    2.2 - Froyo
   *    2.x - Gingerbread
   *    3.x - Honeycomb
   *    4.0 - Ice Cream Sandwich
   *    4.1 - Jelly Bean
   *    4.4 - KitKat
   *    5.x - Lollipop
   *    6.x - Marshmallow
   *    7.x - Nougat
   *    8.x - Oreo
   *    9.x - Pie
   *
   * @example
   *   getAndroidVersionName("7.0") // 'Nougat'
   *
   * @param  {string} version
   * @return {string} versionName
   */
  static getAndroidVersionName(version) {
    const v = version.split(".").splice(0, 2).map((s) => parseInt(s, 10) || 0);
    v.push(0);
    if (v[0] === 1 && v[1] < 5) return void 0;
    if (v[0] === 1 && v[1] < 6) return "Cupcake";
    if (v[0] === 1 && v[1] >= 6) return "Donut";
    if (v[0] === 2 && v[1] < 2) return "Eclair";
    if (v[0] === 2 && v[1] === 2) return "Froyo";
    if (v[0] === 2 && v[1] > 2) return "Gingerbread";
    if (v[0] === 3) return "Honeycomb";
    if (v[0] === 4 && v[1] < 1) return "Ice Cream Sandwich";
    if (v[0] === 4 && v[1] < 4) return "Jelly Bean";
    if (v[0] === 4 && v[1] >= 4) return "KitKat";
    if (v[0] === 5) return "Lollipop";
    if (v[0] === 6) return "Marshmallow";
    if (v[0] === 7) return "Nougat";
    if (v[0] === 8) return "Oreo";
    if (v[0] === 9) return "Pie";
    return void 0;
  }
  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  static getVersionPrecision(version) {
    return version.split(".").length;
  }
  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
   *   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
   *   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
   *   compareVersions('1.10.2.1',  '1.0800.2');     // -1
   *   compareVersions('1.10.2.1',  '1.10',  true);  // 0
   *
   * @param {String} versionA versions versions to compare
   * @param {String} versionB versions versions to compare
   * @param {boolean} [isLoose] enable loose comparison
   * @return {Number} comparison result: -1 when versionA is lower,
   * 1 when versionA is bigger, 0 when both equal
   */
  /* eslint consistent-return: 1 */
  static compareVersions(versionA, versionB, isLoose = false) {
    const versionAPrecision = _Utils.getVersionPrecision(versionA);
    const versionBPrecision = _Utils.getVersionPrecision(versionB);
    let precision = Math.max(versionAPrecision, versionBPrecision);
    let lastPrecision = 0;
    const chunks = _Utils.map([versionA, versionB], (version) => {
      const delta = precision - _Utils.getVersionPrecision(version);
      const _version = version + new Array(delta + 1).join(".0");
      return _Utils.map(_version.split("."), (chunk) => new Array(20 - chunk.length).join("0") + chunk).reverse();
    });
    if (isLoose) {
      lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
    }
    precision -= 1;
    while (precision >= lastPrecision) {
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === lastPrecision) {
          return 0;
        }
        precision -= 1;
      } else if (chunks[0][precision] < chunks[1][precision]) {
        return -1;
      }
    }
    return void 0;
  }
  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  static map(arr, iterator2) {
    const result = [];
    let i;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator2);
    }
    for (i = 0; i < arr.length; i += 1) {
      result.push(iterator2(arr[i]));
    }
    return result;
  }
  /**
   * Array::find polyfill
   *
   * @param  {Array} arr
   * @param  {Function} predicate
   * @return {Array}
   */
  static find(arr, predicate) {
    let i;
    let l;
    if (Array.prototype.find) {
      return Array.prototype.find.call(arr, predicate);
    }
    for (i = 0, l = arr.length; i < l; i += 1) {
      const value = arr[i];
      if (predicate(value, i)) {
        return value;
      }
    }
    return void 0;
  }
  /**
   * Object::assign polyfill
   *
   * @param  {Object} obj
   * @param  {Object} ...objs
   * @return {Object}
   */
  static assign(obj, ...assigners) {
    const result = obj;
    let i;
    let l;
    if (Object.assign) {
      return Object.assign(obj, ...assigners);
    }
    for (i = 0, l = assigners.length; i < l; i += 1) {
      const assigner = assigners[i];
      if (typeof assigner === "object" && assigner !== null) {
        const keys = Object.keys(assigner);
        keys.forEach((key) => {
          result[key] = assigner[key];
        });
      }
    }
    return obj;
  }
  /**
   * Get short version/alias for a browser name
   *
   * @example
   *   getBrowserAlias('Microsoft Edge') // edge
   *
   * @param  {string} browserName
   * @return {string}
   */
  static getBrowserAlias(browserName) {
    return BROWSER_ALIASES_MAP[browserName];
  }
  /**
   * Get short version/alias for a browser name
   *
   * @example
   *   getBrowserAlias('edge') // Microsoft Edge
   *
   * @param  {string} browserAlias
   * @return {string}
   */
  static getBrowserTypeByAlias(browserAlias) {
    return BROWSER_MAP[browserAlias] || "";
  }
};

// node_modules/bowser/src/parser-browsers.js
var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
var browsersList = [
  /* Googlebot */
  {
    test: [/googlebot/i],
    describe(ua) {
      const browser = {
        name: "Googlebot"
      };
      const version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Opera < 13.0 */
  {
    test: [/opera/i],
    describe(ua) {
      const browser = {
        name: "Opera"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Opera > 13.0 */
  {
    test: [/opr\/|opios/i],
    describe(ua) {
      const browser = {
        name: "Opera"
      };
      const version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/SamsungBrowser/i],
    describe(ua) {
      const browser = {
        name: "Samsung Internet for Android"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/Whale/i],
    describe(ua) {
      const browser = {
        name: "NAVER Whale Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/MZBrowser/i],
    describe(ua) {
      const browser = {
        name: "MZ Browser"
      };
      const version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/focus/i],
    describe(ua) {
      const browser = {
        name: "Focus"
      };
      const version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/swing/i],
    describe(ua) {
      const browser = {
        name: "Swing"
      };
      const version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/coast/i],
    describe(ua) {
      const browser = {
        name: "Opera Coast"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/opt\/\d+(?:.?_?\d+)+/i],
    describe(ua) {
      const browser = {
        name: "Opera Touch"
      };
      const version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/yabrowser/i],
    describe(ua) {
      const browser = {
        name: "Yandex Browser"
      };
      const version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/ucbrowser/i],
    describe(ua) {
      const browser = {
        name: "UC Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/Maxthon|mxios/i],
    describe(ua) {
      const browser = {
        name: "Maxthon"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/epiphany/i],
    describe(ua) {
      const browser = {
        name: "Epiphany"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/puffin/i],
    describe(ua) {
      const browser = {
        name: "Puffin"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/sleipnir/i],
    describe(ua) {
      const browser = {
        name: "Sleipnir"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/k-meleon/i],
    describe(ua) {
      const browser = {
        name: "K-Meleon"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/micromessenger/i],
    describe(ua) {
      const browser = {
        name: "WeChat"
      };
      const version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/qqbrowser/i],
    describe(ua) {
      const browser = {
        name: /qqbrowserlite/i.test(ua) ? "QQ Browser Lite" : "QQ Browser"
      };
      const version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/msie|trident/i],
    describe(ua) {
      const browser = {
        name: "Internet Explorer"
      };
      const version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/\sedg\//i],
    describe(ua) {
      const browser = {
        name: "Microsoft Edge"
      };
      const version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/edg([ea]|ios)/i],
    describe(ua) {
      const browser = {
        name: "Microsoft Edge"
      };
      const version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/vivaldi/i],
    describe(ua) {
      const browser = {
        name: "Vivaldi"
      };
      const version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/seamonkey/i],
    describe(ua) {
      const browser = {
        name: "SeaMonkey"
      };
      const version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/sailfish/i],
    describe(ua) {
      const browser = {
        name: "Sailfish"
      };
      const version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/silk/i],
    describe(ua) {
      const browser = {
        name: "Amazon Silk"
      };
      const version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/phantom/i],
    describe(ua) {
      const browser = {
        name: "PhantomJS"
      };
      const version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/slimerjs/i],
    describe(ua) {
      const browser = {
        name: "SlimerJS"
      };
      const version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(ua) {
      const browser = {
        name: "BlackBerry"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/(web|hpw)[o0]s/i],
    describe(ua) {
      const browser = {
        name: "WebOS Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/bada/i],
    describe(ua) {
      const browser = {
        name: "Bada"
      };
      const version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/tizen/i],
    describe(ua) {
      const browser = {
        name: "Tizen"
      };
      const version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/qupzilla/i],
    describe(ua) {
      const browser = {
        name: "QupZilla"
      };
      const version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/firefox|iceweasel|fxios/i],
    describe(ua) {
      const browser = {
        name: "Firefox"
      };
      const version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/electron/i],
    describe(ua) {
      const browser = {
        name: "Electron"
      };
      const version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/MiuiBrowser/i],
    describe(ua) {
      const browser = {
        name: "Miui"
      };
      const version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/chromium/i],
    describe(ua) {
      const browser = {
        name: "Chromium"
      };
      const version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/chrome|crios|crmo/i],
    describe(ua) {
      const browser = {
        name: "Chrome"
      };
      const version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/GSA/i],
    describe(ua) {
      const browser = {
        name: "Google Search"
      };
      const version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Android Browser */
  {
    test(parser) {
      const notLikeAndroid = !parser.test(/like android/i);
      const butAndroid = parser.test(/android/i);
      return notLikeAndroid && butAndroid;
    },
    describe(ua) {
      const browser = {
        name: "Android Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* PlayStation 4 */
  {
    test: [/playstation 4/i],
    describe(ua) {
      const browser = {
        name: "PlayStation 4"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Safari */
  {
    test: [/safari|applewebkit/i],
    describe(ua) {
      const browser = {
        name: "Safari"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Something else */
  {
    test: [/.*/i],
    describe(ua) {
      const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
      const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
      const hasDeviceSpec = ua.search("\\(") !== -1;
      const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
      return {
        name: Utils.getFirstMatch(regexp, ua),
        version: Utils.getSecondMatch(regexp, ua)
      };
    }
  }
];
var parser_browsers_default = browsersList;

// node_modules/bowser/src/parser-os.js
var parser_os_default = [
  /* Roku */
  {
    test: [/Roku\/DVP/],
    describe(ua) {
      const version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
      return {
        name: OS_MAP.Roku,
        version
      };
    }
  },
  /* Windows Phone */
  {
    test: [/windows phone/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.WindowsPhone,
        version
      };
    }
  },
  /* Windows */
  {
    test: [/windows /i],
    describe(ua) {
      const version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
      const versionName = Utils.getWindowsVersionName(version);
      return {
        name: OS_MAP.Windows,
        version,
        versionName
      };
    }
  },
  /* Firefox on iPad */
  {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe(ua) {
      const result = {
        name: OS_MAP.iOS
      };
      const version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
      if (version) {
        result.version = version;
      }
      return result;
    }
  },
  /* macOS */
  {
    test: [/macintosh/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, ".");
      const versionName = Utils.getMacOSVersionName(version);
      const os = {
        name: OS_MAP.MacOS,
        version
      };
      if (versionName) {
        os.versionName = versionName;
      }
      return os;
    }
  },
  /* iOS */
  {
    test: [/(ipod|iphone|ipad)/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, ".");
      return {
        name: OS_MAP.iOS,
        version
      };
    }
  },
  /* Android */
  {
    test(parser) {
      const notLikeAndroid = !parser.test(/like android/i);
      const butAndroid = parser.test(/android/i);
      return notLikeAndroid && butAndroid;
    },
    describe(ua) {
      const version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
      const versionName = Utils.getAndroidVersionName(version);
      const os = {
        name: OS_MAP.Android,
        version
      };
      if (versionName) {
        os.versionName = versionName;
      }
      return os;
    }
  },
  /* WebOS */
  {
    test: [/(web|hpw)[o0]s/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
      const os = {
        name: OS_MAP.WebOS
      };
      if (version && version.length) {
        os.version = version;
      }
      return os;
    }
  },
  /* BlackBerry */
  {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua) || Utils.getFirstMatch(/\bbb(\d+)/i, ua);
      return {
        name: OS_MAP.BlackBerry,
        version
      };
    }
  },
  /* Bada */
  {
    test: [/bada/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.Bada,
        version
      };
    }
  },
  /* Tizen */
  {
    test: [/tizen/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.Tizen,
        version
      };
    }
  },
  /* Linux */
  {
    test: [/linux/i],
    describe() {
      return {
        name: OS_MAP.Linux
      };
    }
  },
  /* Chrome OS */
  {
    test: [/CrOS/],
    describe() {
      return {
        name: OS_MAP.ChromeOS
      };
    }
  },
  /* Playstation 4 */
  {
    test: [/PlayStation 4/],
    describe(ua) {
      const version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.PlayStation4,
        version
      };
    }
  }
];

// node_modules/bowser/src/parser-platforms.js
var parser_platforms_default = [
  /* Googlebot */
  {
    test: [/googlebot/i],
    describe() {
      return {
        type: "bot",
        vendor: "Google"
      };
    }
  },
  /* Huawei */
  {
    test: [/huawei/i],
    describe(ua) {
      const model = Utils.getFirstMatch(/(can-l01)/i, ua) && "Nova";
      const platform = {
        type: PLATFORMS_MAP.mobile,
        vendor: "Huawei"
      };
      if (model) {
        platform.model = model;
      }
      return platform;
    }
  },
  /* Nexus Tablet */
  {
    test: [/nexus\s*(?:7|8|9|10).*/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Nexus"
      };
    }
  },
  /* iPad */
  {
    test: [/ipad/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  },
  /* Firefox on iPad */
  {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  },
  /* Amazon Kindle Fire */
  {
    test: [/kftt build/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Amazon",
        model: "Kindle Fire HD 7"
      };
    }
  },
  /* Another Amazon Tablet with Silk */
  {
    test: [/silk/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Amazon"
      };
    }
  },
  /* Tablet */
  {
    test: [/tablet(?! pc)/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet
      };
    }
  },
  /* iPod/iPhone */
  {
    test(parser) {
      const iDevice = parser.test(/ipod|iphone/i);
      const likeIDevice = parser.test(/like (ipod|iphone)/i);
      return iDevice && !likeIDevice;
    },
    describe(ua) {
      const model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Apple",
        model
      };
    }
  },
  /* Nexus Mobile */
  {
    test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Nexus"
      };
    }
  },
  /* Mobile */
  {
    test: [/[^-]mobi/i],
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* BlackBerry */
  {
    test(parser) {
      return parser.getBrowserName(true) === "blackberry";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "BlackBerry"
      };
    }
  },
  /* Bada */
  {
    test(parser) {
      return parser.getBrowserName(true) === "bada";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* Windows Phone */
  {
    test(parser) {
      return parser.getBrowserName() === "windows phone";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Microsoft"
      };
    }
  },
  /* Android Tablet */
  {
    test(parser) {
      const osMajorVersion = Number(String(parser.getOSVersion()).split(".")[0]);
      return parser.getOSName(true) === "android" && osMajorVersion >= 3;
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tablet
      };
    }
  },
  /* Android Mobile */
  {
    test(parser) {
      return parser.getOSName(true) === "android";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* desktop */
  {
    test(parser) {
      return parser.getOSName(true) === "macos";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop,
        vendor: "Apple"
      };
    }
  },
  /* Windows */
  {
    test(parser) {
      return parser.getOSName(true) === "windows";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop
      };
    }
  },
  /* Linux */
  {
    test(parser) {
      return parser.getOSName(true) === "linux";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop
      };
    }
  },
  /* PlayStation 4 */
  {
    test(parser) {
      return parser.getOSName(true) === "playstation 4";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  },
  /* Roku */
  {
    test(parser) {
      return parser.getOSName(true) === "roku";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  }
];

// node_modules/bowser/src/parser-engines.js
var parser_engines_default = [
  /* EdgeHTML */
  {
    test(parser) {
      return parser.getBrowserName(true) === "microsoft edge";
    },
    describe(ua) {
      const isBlinkBased = /\sedg\//i.test(ua);
      if (isBlinkBased) {
        return {
          name: ENGINE_MAP.Blink
        };
      }
      const version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);
      return {
        name: ENGINE_MAP.EdgeHTML,
        version
      };
    }
  },
  /* Trident */
  {
    test: [/trident/i],
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Trident
      };
      const version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Presto */
  {
    test(parser) {
      return parser.test(/presto/i);
    },
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Presto
      };
      const version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Gecko */
  {
    test(parser) {
      const isGecko = parser.test(/gecko/i);
      const likeGecko = parser.test(/like gecko/i);
      return isGecko && !likeGecko;
    },
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Gecko
      };
      const version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Blink */
  {
    test: [/(apple)?webkit\/537\.36/i],
    describe() {
      return {
        name: ENGINE_MAP.Blink
      };
    }
  },
  /* WebKit */
  {
    test: [/(apple)?webkit/i],
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.WebKit
      };
      const version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  }
];

// node_modules/bowser/src/parser.js
var Parser = class {
  /**
   * Create instance of Parser
   *
   * @param {String} UA User-Agent string
   * @param {Boolean} [skipParsing=false] parser can skip parsing in purpose of performance
   * improvements if you need to make a more particular parsing
   * like {@link Parser#parseBrowser} or {@link Parser#parsePlatform}
   *
   * @throw {Error} in case of empty UA String
   *
   * @constructor
   */
  constructor(UA, skipParsing = false) {
    if (UA === void 0 || UA === null || UA === "") {
      throw new Error("UserAgent parameter can't be empty");
    }
    this._ua = UA;
    this.parsedResult = {};
    if (skipParsing !== true) {
      this.parse();
    }
  }
  /**
   * Get UserAgent string of current Parser instance
   * @return {String} User-Agent String of the current <Parser> object
   *
   * @public
   */
  getUA() {
    return this._ua;
  }
  /**
   * Test a UA string for a regexp
   * @param {RegExp} regex
   * @return {Boolean}
   */
  test(regex) {
    return regex.test(this._ua);
  }
  /**
   * Get parsed browser object
   * @return {Object}
   */
  parseBrowser() {
    this.parsedResult.browser = {};
    const browserDescriptor = Utils.find(parser_browsers_default, (_browser) => {
      if (typeof _browser.test === "function") {
        return _browser.test(this);
      }
      if (_browser.test instanceof Array) {
        return _browser.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (browserDescriptor) {
      this.parsedResult.browser = browserDescriptor.describe(this.getUA());
    }
    return this.parsedResult.browser;
  }
  /**
   * Get parsed browser object
   * @return {Object}
   *
   * @public
   */
  getBrowser() {
    if (this.parsedResult.browser) {
      return this.parsedResult.browser;
    }
    return this.parseBrowser();
  }
  /**
   * Get browser's name
   * @return {String} Browser's name or an empty string
   *
   * @public
   */
  getBrowserName(toLowerCase) {
    if (toLowerCase) {
      return String(this.getBrowser().name).toLowerCase() || "";
    }
    return this.getBrowser().name || "";
  }
  /**
   * Get browser's version
   * @return {String} version of browser
   *
   * @public
   */
  getBrowserVersion() {
    return this.getBrowser().version;
  }
  /**
   * Get OS
   * @return {Object}
   *
   * @example
   * this.getOS();
   * {
   *   name: 'macOS',
   *   version: '10.11.12'
   * }
   */
  getOS() {
    if (this.parsedResult.os) {
      return this.parsedResult.os;
    }
    return this.parseOS();
  }
  /**
   * Parse OS and save it to this.parsedResult.os
   * @return {*|{}}
   */
  parseOS() {
    this.parsedResult.os = {};
    const os = Utils.find(parser_os_default, (_os) => {
      if (typeof _os.test === "function") {
        return _os.test(this);
      }
      if (_os.test instanceof Array) {
        return _os.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (os) {
      this.parsedResult.os = os.describe(this.getUA());
    }
    return this.parsedResult.os;
  }
  /**
   * Get OS name
   * @param {Boolean} [toLowerCase] return lower-cased value
   * @return {String} name of the OS — macOS, Windows, Linux, etc.
   */
  getOSName(toLowerCase) {
    const { name } = this.getOS();
    if (toLowerCase) {
      return String(name).toLowerCase() || "";
    }
    return name || "";
  }
  /**
   * Get OS version
   * @return {String} full version with dots ('10.11.12', '5.6', etc)
   */
  getOSVersion() {
    return this.getOS().version;
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  getPlatform() {
    if (this.parsedResult.platform) {
      return this.parsedResult.platform;
    }
    return this.parsePlatform();
  }
  /**
   * Get platform name
   * @param {Boolean} [toLowerCase=false]
   * @return {*}
   */
  getPlatformType(toLowerCase = false) {
    const { type } = this.getPlatform();
    if (toLowerCase) {
      return String(type).toLowerCase() || "";
    }
    return type || "";
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  parsePlatform() {
    this.parsedResult.platform = {};
    const platform = Utils.find(parser_platforms_default, (_platform) => {
      if (typeof _platform.test === "function") {
        return _platform.test(this);
      }
      if (_platform.test instanceof Array) {
        return _platform.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (platform) {
      this.parsedResult.platform = platform.describe(this.getUA());
    }
    return this.parsedResult.platform;
  }
  /**
   * Get parsed engine
   * @return {{}}
   */
  getEngine() {
    if (this.parsedResult.engine) {
      return this.parsedResult.engine;
    }
    return this.parseEngine();
  }
  /**
   * Get engines's name
   * @return {String} Engines's name or an empty string
   *
   * @public
   */
  getEngineName(toLowerCase) {
    if (toLowerCase) {
      return String(this.getEngine().name).toLowerCase() || "";
    }
    return this.getEngine().name || "";
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  parseEngine() {
    this.parsedResult.engine = {};
    const engine = Utils.find(parser_engines_default, (_engine) => {
      if (typeof _engine.test === "function") {
        return _engine.test(this);
      }
      if (_engine.test instanceof Array) {
        return _engine.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (engine) {
      this.parsedResult.engine = engine.describe(this.getUA());
    }
    return this.parsedResult.engine;
  }
  /**
   * Parse full information about the browser
   * @returns {Parser}
   */
  parse() {
    this.parseBrowser();
    this.parseOS();
    this.parsePlatform();
    this.parseEngine();
    return this;
  }
  /**
   * Get parsed result
   * @return {ParsedResult}
   */
  getResult() {
    return Utils.assign({}, this.parsedResult);
  }
  /**
   * Check if parsed browser matches certain conditions
   *
   * @param {Object} checkTree It's one or two layered object,
   * which can include a platform or an OS on the first layer
   * and should have browsers specs on the bottom-laying layer
   *
   * @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
   * Returns `undefined` when the browser is no described in the checkTree object.
   *
   * @example
   * const browser = Bowser.getParser(window.navigator.userAgent);
   * if (browser.satisfies({chrome: '>118.01.1322' }))
   * // or with os
   * if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
   * // or with platforms
   * if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
   */
  satisfies(checkTree) {
    const platformsAndOSes = {};
    let platformsAndOSCounter = 0;
    const browsers = {};
    let browsersCounter = 0;
    const allDefinitions = Object.keys(checkTree);
    allDefinitions.forEach((key) => {
      const currentDefinition = checkTree[key];
      if (typeof currentDefinition === "string") {
        browsers[key] = currentDefinition;
        browsersCounter += 1;
      } else if (typeof currentDefinition === "object") {
        platformsAndOSes[key] = currentDefinition;
        platformsAndOSCounter += 1;
      }
    });
    if (platformsAndOSCounter > 0) {
      const platformsAndOSNames = Object.keys(platformsAndOSes);
      const OSMatchingDefinition = Utils.find(platformsAndOSNames, (name) => this.isOS(name));
      if (OSMatchingDefinition) {
        const osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);
        if (osResult !== void 0) {
          return osResult;
        }
      }
      const platformMatchingDefinition = Utils.find(
        platformsAndOSNames,
        (name) => this.isPlatform(name)
      );
      if (platformMatchingDefinition) {
        const platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);
        if (platformResult !== void 0) {
          return platformResult;
        }
      }
    }
    if (browsersCounter > 0) {
      const browserNames = Object.keys(browsers);
      const matchingDefinition = Utils.find(browserNames, (name) => this.isBrowser(name, true));
      if (matchingDefinition !== void 0) {
        return this.compareVersion(browsers[matchingDefinition]);
      }
    }
    return void 0;
  }
  /**
   * Check if the browser name equals the passed string
   * @param browserName The string to compare with the browser name
   * @param [includingAlias=false] The flag showing whether alias will be included into comparison
   * @returns {boolean}
   */
  isBrowser(browserName, includingAlias = false) {
    const defaultBrowserName = this.getBrowserName().toLowerCase();
    let browserNameLower = browserName.toLowerCase();
    const alias = Utils.getBrowserTypeByAlias(browserNameLower);
    if (includingAlias && alias) {
      browserNameLower = alias.toLowerCase();
    }
    return browserNameLower === defaultBrowserName;
  }
  compareVersion(version) {
    let expectedResults = [0];
    let comparableVersion = version;
    let isLoose = false;
    const currentBrowserVersion = this.getBrowserVersion();
    if (typeof currentBrowserVersion !== "string") {
      return void 0;
    }
    if (version[0] === ">" || version[0] === "<") {
      comparableVersion = version.substr(1);
      if (version[1] === "=") {
        isLoose = true;
        comparableVersion = version.substr(2);
      } else {
        expectedResults = [];
      }
      if (version[0] === ">") {
        expectedResults.push(1);
      } else {
        expectedResults.push(-1);
      }
    } else if (version[0] === "=") {
      comparableVersion = version.substr(1);
    } else if (version[0] === "~") {
      isLoose = true;
      comparableVersion = version.substr(1);
    }
    return expectedResults.indexOf(
      Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose)
    ) > -1;
  }
  isOS(osName) {
    return this.getOSName(true) === String(osName).toLowerCase();
  }
  isPlatform(platformType) {
    return this.getPlatformType(true) === String(platformType).toLowerCase();
  }
  isEngine(engineName) {
    return this.getEngineName(true) === String(engineName).toLowerCase();
  }
  /**
   * Is anything? Check if the browser is called "anything",
   * the OS called "anything" or the platform called "anything"
   * @param {String} anything
   * @param [includingAlias=false] The flag showing whether alias will be included into comparison
   * @returns {Boolean}
   */
  is(anything, includingAlias = false) {
    return this.isBrowser(anything, includingAlias) || this.isOS(anything) || this.isPlatform(anything);
  }
  /**
   * Check if any of the given values satisfies this.is(anything)
   * @param {String[]} anythings
   * @returns {Boolean}
   */
  some(anythings = []) {
    return anythings.some((anything) => this.is(anything));
  }
};
var parser_default = Parser;

// node_modules/bowser/src/bowser.js
var Bowser = class {
  /**
   * Creates a {@link Parser} instance
   *
   * @param {String} UA UserAgent string
   * @param {Boolean} [skipParsing=false] Will make the Parser postpone parsing until you ask it
   * explicitly. Same as `skipParsing` for {@link Parser}.
   * @returns {Parser}
   * @throws {Error} when UA is not a String
   *
   * @example
   * const parser = Bowser.getParser(window.navigator.userAgent);
   * const result = parser.getResult();
   */
  static getParser(UA, skipParsing = false) {
    if (typeof UA !== "string") {
      throw new Error("UserAgent should be a string");
    }
    return new parser_default(UA, skipParsing);
  }
  /**
   * Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
   *
   * @param UA
   * @return {ParsedResult}
   *
   * @example
   * const result = Bowser.parse(window.navigator.userAgent);
   */
  static parse(UA) {
    return new parser_default(UA).getResult();
  }
  static get BROWSER_MAP() {
    return BROWSER_MAP;
  }
  static get ENGINE_MAP() {
    return ENGINE_MAP;
  }
  static get OS_MAP() {
    return OS_MAP;
  }
  static get PLATFORMS_MAP() {
    return PLATFORMS_MAP;
  }
};
var bowser_default = Bowser;

// node_modules/tslog/dist/esm/prettyLogStyles.js
var prettyLogStyles = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  overline: [53, 55],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  blackBright: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgBlackBright: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49]
};

// node_modules/tslog/dist/esm/formatTemplate.js
function formatTemplate(settings, template, values, hideUnsetPlaceholder = false) {
  const templateString = String(template);
  const ansiColorWrap = (placeholderValue, code) => `\x1B[${code[0]}m${placeholderValue}\x1B[${code[1]}m`;
  const styleWrap = (value, style) => {
    if (style != null && typeof style === "string") {
      return ansiColorWrap(value, prettyLogStyles[style]);
    } else if (style != null && Array.isArray(style)) {
      return style.reduce((prevValue, thisStyle) => styleWrap(prevValue, thisStyle), value);
    } else {
      if (style != null && style[value.trim()] != null) {
        return styleWrap(value, style[value.trim()]);
      } else if (style != null && style["*"] != null) {
        return styleWrap(value, style["*"]);
      } else {
        return value;
      }
    }
  };
  const defaultStyle = null;
  return templateString.replace(/{{(.+?)}}/g, (_, placeholder) => {
    var _a2;
    const value = values[placeholder] != null ? String(values[placeholder]) : hideUnsetPlaceholder ? "" : _;
    return settings.stylePrettyLogs ? styleWrap(value, ((_a2 = settings == null ? void 0 : settings.prettyLogStyles) == null ? void 0 : _a2[placeholder]) ?? defaultStyle) + ansiColorWrap("", prettyLogStyles.reset) : value;
  });
}

// node_modules/tslog/dist/esm/formatNumberAddZeros.js
function formatNumberAddZeros(value, digits = 2, addNumber = 0) {
  if (value != null && isNaN(value)) {
    return "";
  }
  value = value != null ? value + addNumber : value;
  return digits === 2 ? value == null ? "--" : value < 10 ? "0" + value : value.toString() : value == null ? "---" : value < 10 ? "00" + value : value < 100 ? "0" + value : value.toString();
}

// node_modules/tslog/dist/esm/urlToObj.js
function urlToObject(url) {
  return {
    href: url.href,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    searchParams: [...url.searchParams].map(([key, value]) => ({ key, value })),
    hash: url.hash,
    origin: url.origin
  };
}

// node_modules/tslog/dist/esm/runtime/browser/helper.jsonStringifyRecursive.js
function jsonStringifyRecursive(obj) {
  const cache = /* @__PURE__ */ new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return "[Circular]";
      }
      cache.add(value);
    }
    if (typeof value === "bigint") {
      return `${value}`;
    }
    return value;
  });
}

// node_modules/tslog/dist/esm/runtime/browser/util.inspect.polyfil.js
function inspect(obj, opts) {
  const ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  if (opts != null) {
    _extend(ctx, opts);
  }
  if (isUndefined(ctx.showHidden))
    ctx.showHidden = false;
  if (isUndefined(ctx.depth))
    ctx.depth = 2;
  if (isUndefined(ctx.colors))
    ctx.colors = true;
  if (isUndefined(ctx.customInspect))
    ctx.customInspect = true;
  if (ctx.colors)
    ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
inspect.colors = prettyLogStyles;
inspect.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red"
};
function isBoolean(arg) {
  return typeof arg === "boolean";
}
function isUndefined(arg) {
  return arg === void 0;
}
function stylizeNoColor(str) {
  return str;
}
function stylizeWithColor(str, styleType) {
  var _a2, _b, _c, _d;
  const style = inspect.styles[styleType];
  if (style != null && ((_b = (_a2 = inspect == null ? void 0 : inspect.colors) == null ? void 0 : _a2[style]) == null ? void 0 : _b[0]) != null && ((_d = (_c = inspect == null ? void 0 : inspect.colors) == null ? void 0 : _c[style]) == null ? void 0 : _d[1]) != null) {
    return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
  } else {
    return str;
  }
}
function isFunction2(arg) {
  return typeof arg === "function";
}
function isString(arg) {
  return typeof arg === "string";
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isNull(arg) {
  return arg === null;
}
function hasOwn(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function isRegExp(re) {
  return isObject(re) && objectToString(re) === "[object RegExp]";
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isError(e) {
  return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
}
function isDate(d) {
  return isObject(d) && objectToString(d) === "[object Date]";
}
function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function arrayToHash(array2) {
  const hash2 = {};
  array2.forEach((val) => {
    hash2[val] = true;
  });
  return hash2;
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  const output3 = [];
  for (let i = 0, l = value.length; i < l; ++i) {
    if (hasOwn(value, String(i))) {
      output3.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output3.push("");
    }
  }
  keys.forEach((key) => {
    if (!key.match(/^\d+$/)) {
      output3.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output3;
}
function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}
function formatValue(ctx, value, recurseTimes = 0) {
  if (ctx.customInspect && value != null && isFunction2(value) && (value == null ? void 0 : value.inspect) !== inspect && !((value == null ? void 0 : value.constructor) && (value == null ? void 0 : value.constructor.prototype) === value)) {
    if (typeof value.inspect !== "function" && value.toString != null) {
      return value.toString();
    }
    let ret = value == null ? void 0 : value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }
  const primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }
  let keys = Object.keys(value);
  const visibleKeys = arrayToHash(keys);
  try {
    if (ctx.showHidden && Object.getOwnPropertyNames) {
      keys = Object.getOwnPropertyNames(value);
    }
  } catch (e) {
  }
  if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
    return formatError(value);
  }
  if (keys.length === 0) {
    if (isFunction2(ctx.stylize)) {
      if (isFunction2(value)) {
        const name = value.name ? ": " + value.name : "";
        return ctx.stylize("[Function" + name + "]", "special");
      }
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
      }
      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toISOString.call(value), "date");
      }
      if (isError(value)) {
        return formatError(value);
      }
    } else {
      return value;
    }
  }
  let base = "";
  let array2 = false;
  let braces = ["{\n", "\n}"];
  if (Array.isArray(value)) {
    array2 = true;
    braces = ["[\n", "\n]"];
  }
  if (isFunction2(value)) {
    const n = value.name ? ": " + value.name : "";
    base = " [Function" + n + "]";
  }
  if (isRegExp(value)) {
    base = " " + RegExp.prototype.toString.call(value);
  }
  if (isDate(value)) {
    base = " " + Date.prototype.toUTCString.call(value);
  }
  if (isError(value)) {
    base = " " + formatError(value);
  }
  if (keys.length === 0 && (!array2 || value.length == 0)) {
    return braces[0] + base + braces[1];
  }
  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    } else {
      return ctx.stylize("[Object]", "special");
    }
  }
  ctx.seen.push(value);
  let output3;
  if (array2) {
    output3 = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output3 = keys.map((key) => {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array2);
    });
  }
  ctx.seen.pop();
  return reduceToSingleString(output3, base, braces);
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array2) {
  let name, str;
  let desc = { value: void 0 };
  try {
    desc.value = value[key];
  } catch (e) {
  }
  try {
    if (Object.getOwnPropertyDescriptor) {
      desc = Object.getOwnPropertyDescriptor(value, key) || desc;
    }
  } catch (e) {
  }
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize("[Getter/Setter]", "special");
    } else {
      str = ctx.stylize("[Getter]", "special");
    }
  } else {
    if (desc.set) {
      str = ctx.stylize("[Setter]", "special");
    }
  }
  if (!hasOwn(visibleKeys, key)) {
    name = "[" + key + "]";
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, void 0);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf("\n") > -1) {
        if (array2) {
          str = str.split("\n").map((line) => {
            return "  " + line;
          }).join("\n").substr(2);
        } else {
          str = "\n" + str.split("\n").map((line) => {
            return "   " + line;
          }).join("\n");
        }
      }
    } else {
      str = ctx.stylize("[Circular]", "special");
    }
  }
  if (isUndefined(name)) {
    if (array2 && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify("" + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, "name");
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, "\\'").replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, "string");
    }
  }
  return name + ": " + str;
}
function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize("undefined", "undefined");
  if (isString(value)) {
    const simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, "\\'") + "'";
    return ctx.stylize(simple, "string");
  }
  if (isNumber(value))
    return ctx.stylize("" + value, "number");
  if (isBoolean(value))
    return ctx.stylize("" + value, "boolean");
  if (isNull(value))
    return ctx.stylize("null", "null");
}
function reduceToSingleString(output3, base, braces) {
  return braces[0] + (base === "" ? "" : base + "\n") + "  " + output3.join(",\n  ") + " " + braces[1];
}
function _extend(origin, add2) {
  const typedOrigin = { ...origin };
  if (!add2 || !isObject(add2))
    return origin;
  const clonedAdd = { ...add2 };
  const keys = Object.keys(add2);
  let i = keys.length;
  while (i--) {
    typedOrigin[keys[i]] = clonedAdd[keys[i]];
  }
  return typedOrigin;
}
function formatWithOptions(inspectOptions, ...args) {
  const ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  if (inspectOptions != null) {
    _extend(ctx, inspectOptions);
  }
  const first2 = args[0];
  let a = 0;
  let str = "";
  let join = "";
  if (typeof first2 === "string") {
    if (args.length === 1) {
      return first2;
    }
    let tempStr;
    let lastPos = 0;
    for (let i = 0; i < first2.length - 1; i++) {
      if (first2.charCodeAt(i) === 37) {
        const nextChar = first2.charCodeAt(++i);
        if (a + 1 !== args.length) {
          switch (nextChar) {
            case 115: {
              const tempArg = args[++a];
              if (typeof tempArg === "number") {
                tempStr = formatPrimitive(ctx, tempArg);
              } else if (typeof tempArg === "bigint") {
                tempStr = formatPrimitive(ctx, tempArg);
              } else if (typeof tempArg !== "object" || tempArg === null) {
                tempStr = String(tempArg);
              } else {
                tempStr = inspect(tempArg, {
                  ...inspectOptions,
                  compact: 3,
                  colors: false,
                  depth: 0
                });
              }
              break;
            }
            case 106:
              tempStr = jsonStringifyRecursive(args[++a]);
              break;
            case 100: {
              const tempNum = args[++a];
              if (typeof tempNum === "bigint") {
                tempStr = formatPrimitive(ctx, tempNum);
              } else if (typeof tempNum === "symbol") {
                tempStr = "NaN";
              } else {
                tempStr = formatPrimitive(ctx, tempNum);
              }
              break;
            }
            case 79:
              tempStr = inspect(args[++a], inspectOptions);
              break;
            case 111:
              tempStr = inspect(args[++a], {
                ...inspectOptions,
                showHidden: true,
                showProxy: true,
                depth: 4
              });
              break;
            case 105: {
              const tempInteger = args[++a];
              if (typeof tempInteger === "bigint") {
                tempStr = formatPrimitive(ctx, tempInteger);
              } else if (typeof tempInteger === "symbol") {
                tempStr = "NaN";
              } else {
                tempStr = formatPrimitive(ctx, parseInt(tempStr));
              }
              break;
            }
            case 102: {
              const tempFloat = args[++a];
              if (typeof tempFloat === "symbol") {
                tempStr = "NaN";
              } else {
                tempStr = formatPrimitive(ctx, parseInt(tempFloat));
              }
              break;
            }
            case 99:
              a += 1;
              tempStr = "";
              break;
            case 37:
              str += first2.slice(lastPos, i);
              lastPos = i + 1;
              continue;
            default:
              continue;
          }
          if (lastPos !== i - 1) {
            str += first2.slice(lastPos, i - 1);
          }
          str += tempStr;
          lastPos = i + 1;
        } else if (nextChar === 37) {
          str += first2.slice(lastPos, i);
          lastPos = i + 1;
        }
      }
    }
    if (lastPos !== 0) {
      a++;
      join = " ";
      if (lastPos < first2.length) {
        str += first2.slice(lastPos);
      }
    }
  }
  while (a < args.length) {
    const value = args[a];
    str += join;
    str += typeof value !== "string" ? inspect(value, inspectOptions) : value;
    join = " ";
    a++;
  }
  return str;
}

// node_modules/tslog/dist/esm/runtime/browser/index.js
var browser_default = {
  getCallerStackFrame,
  getErrorTrace,
  getMeta,
  transportJSON,
  transportFormatted,
  isBuffer,
  isError: isError2,
  prettyFormatLogObj,
  prettyFormatErrorObj
};
var _a;
var meta = {
  runtime: ![typeof window, typeof document].includes("undefined") ? "Browser" : "Generic",
  browser: (_a = globalThis == null ? void 0 : globalThis["navigator"]) == null ? void 0 : _a.userAgent
};
var pathRegex = /(?:(?:file|https?|global code|[^@]+)@)?(?:file:)?((?:\/[^:/]+){2,})(?::(\d+))?(?::(\d+))?/;
function getMeta(logLevelId, logLevelName, stackDepthLevel, hideLogPositionForPerformance, name, parentNames) {
  return Object.assign({}, meta, {
    name,
    parentNames,
    date: /* @__PURE__ */ new Date(),
    logLevelId,
    logLevelName,
    path: !hideLogPositionForPerformance ? getCallerStackFrame(stackDepthLevel) : void 0
  });
}
function getCallerStackFrame(stackDepthLevel, error = Error()) {
  var _a2, _b, _c;
  return stackLineToStackFrame((_c = (_b = (_a2 = error == null ? void 0 : error.stack) == null ? void 0 : _a2.split("\n")) == null ? void 0 : _b.filter((line) => !line.includes("Error: "))) == null ? void 0 : _c[stackDepthLevel]);
}
function getErrorTrace(error) {
  var _a2, _b, _c;
  return (_c = (_b = ((_a2 = error == null ? void 0 : error.stack) == null ? void 0 : _a2.split("\n")) ?? []) == null ? void 0 : _b.filter((line) => !line.includes("Error: "))) == null ? void 0 : _c.reduce((result, line) => {
    result.push(stackLineToStackFrame(line));
    return result;
  }, []);
}
function stackLineToStackFrame(line) {
  var _a2;
  const href = (_a2 = globalThis == null ? void 0 : globalThis.location) == null ? void 0 : _a2.origin;
  const pathResult = {
    fullFilePath: void 0,
    fileName: void 0,
    fileNameWithLine: void 0,
    fileColumn: void 0,
    fileLine: void 0,
    filePath: void 0,
    filePathWithLine: void 0,
    method: void 0
  };
  if (line != null) {
    const match = line.match(pathRegex);
    if (match) {
      pathResult.filePath = match[1].replace(/\?.*$/, "");
      pathResult.fullFilePath = `${href}${pathResult.filePath}`;
      const pathParts = pathResult.filePath.split("/");
      pathResult.fileName = pathParts[pathParts.length - 1];
      pathResult.fileLine = match[2];
      pathResult.fileColumn = match[3];
      pathResult.filePathWithLine = `${pathResult.filePath}:${pathResult.fileLine}`;
      pathResult.fileNameWithLine = `${pathResult.fileName}:${pathResult.fileLine}`;
    }
  }
  return pathResult;
}
function isError2(e) {
  return e instanceof Error;
}
function prettyFormatLogObj(maskedArgs, settings) {
  return maskedArgs.reduce((result, arg) => {
    isError2(arg) ? result.errors.push(prettyFormatErrorObj(arg, settings)) : result.args.push(arg);
    return result;
  }, { args: [], errors: [] });
}
function prettyFormatErrorObj(error, settings) {
  const errorStackStr = getErrorTrace(error).map((stackFrame) => {
    return formatTemplate(settings, settings.prettyErrorStackTemplate, { ...stackFrame }, true);
  });
  const placeholderValuesError = {
    errorName: ` ${error.name} `,
    errorMessage: Object.getOwnPropertyNames(error).reduce((result, key) => {
      if (key !== "stack") {
        result.push(error[key]);
      }
      return result;
    }, []).join(", "),
    errorStack: errorStackStr.join("\n")
  };
  return formatTemplate(settings, settings.prettyErrorTemplate, placeholderValuesError);
}
function transportFormatted(logMetaMarkup, logArgs, logErrors, settings) {
  const logErrorsStr = (logErrors.length > 0 && logArgs.length > 0 ? "\n" : "") + logErrors.join("\n");
  settings.prettyInspectOptions.colors = settings.stylePrettyLogs;
  console.log(logMetaMarkup + formatWithOptions(settings.prettyInspectOptions, ...logArgs) + logErrorsStr);
}
function transportJSON(json) {
  console.log(jsonStringifyRecursive(json));
}
function isBuffer(arg) {
  return arg ? false : false;
}

// node_modules/tslog/dist/esm/BaseLogger.js
var BaseLogger = class {
  constructor(settings, logObj, stackDepthLevel = 4) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    this.logObj = logObj;
    this.stackDepthLevel = stackDepthLevel;
    this.runtime = browser_default;
    this.settings = {
      type: (settings == null ? void 0 : settings.type) ?? "pretty",
      name: settings == null ? void 0 : settings.name,
      parentNames: settings == null ? void 0 : settings.parentNames,
      minLevel: (settings == null ? void 0 : settings.minLevel) ?? 0,
      argumentsArrayName: settings == null ? void 0 : settings.argumentsArrayName,
      hideLogPositionForProduction: (settings == null ? void 0 : settings.hideLogPositionForProduction) ?? false,
      prettyLogTemplate: (settings == null ? void 0 : settings.prettyLogTemplate) ?? "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}	{{logLevelName}}	{{filePathWithLine}}{{nameWithDelimiterPrefix}}	",
      prettyErrorTemplate: (settings == null ? void 0 : settings.prettyErrorTemplate) ?? "\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}",
      prettyErrorStackTemplate: (settings == null ? void 0 : settings.prettyErrorStackTemplate) ?? "  • {{fileName}}	{{method}}\n	{{filePathWithLine}}",
      prettyErrorParentNamesSeparator: (settings == null ? void 0 : settings.prettyErrorParentNamesSeparator) ?? ":",
      prettyErrorLoggerNameDelimiter: (settings == null ? void 0 : settings.prettyErrorLoggerNameDelimiter) ?? "	",
      stylePrettyLogs: (settings == null ? void 0 : settings.stylePrettyLogs) ?? true,
      prettyLogTimeZone: (settings == null ? void 0 : settings.prettyLogTimeZone) ?? "UTC",
      prettyLogStyles: (settings == null ? void 0 : settings.prettyLogStyles) ?? {
        logLevelName: {
          "*": ["bold", "black", "bgWhiteBright", "dim"],
          SILLY: ["bold", "white"],
          TRACE: ["bold", "whiteBright"],
          DEBUG: ["bold", "green"],
          INFO: ["bold", "blue"],
          WARN: ["bold", "yellow"],
          ERROR: ["bold", "red"],
          FATAL: ["bold", "redBright"]
        },
        dateIsoStr: "white",
        filePathWithLine: "white",
        name: ["white", "bold"],
        nameWithDelimiterPrefix: ["white", "bold"],
        nameWithDelimiterSuffix: ["white", "bold"],
        errorName: ["bold", "bgRedBright", "whiteBright"],
        fileName: ["yellow"],
        fileNameWithLine: "white"
      },
      prettyInspectOptions: (settings == null ? void 0 : settings.prettyInspectOptions) ?? {
        colors: true,
        compact: false,
        depth: Infinity
      },
      metaProperty: (settings == null ? void 0 : settings.metaProperty) ?? "_meta",
      maskPlaceholder: (settings == null ? void 0 : settings.maskPlaceholder) ?? "[***]",
      maskValuesOfKeys: (settings == null ? void 0 : settings.maskValuesOfKeys) ?? ["password"],
      maskValuesOfKeysCaseInsensitive: (settings == null ? void 0 : settings.maskValuesOfKeysCaseInsensitive) ?? false,
      maskValuesRegEx: settings == null ? void 0 : settings.maskValuesRegEx,
      prefix: [...(settings == null ? void 0 : settings.prefix) ?? []],
      attachedTransports: [...(settings == null ? void 0 : settings.attachedTransports) ?? []],
      overwrite: {
        mask: (_a2 = settings == null ? void 0 : settings.overwrite) == null ? void 0 : _a2.mask,
        toLogObj: (_b = settings == null ? void 0 : settings.overwrite) == null ? void 0 : _b.toLogObj,
        addMeta: (_c = settings == null ? void 0 : settings.overwrite) == null ? void 0 : _c.addMeta,
        addPlaceholders: (_d = settings == null ? void 0 : settings.overwrite) == null ? void 0 : _d.addPlaceholders,
        formatMeta: (_e = settings == null ? void 0 : settings.overwrite) == null ? void 0 : _e.formatMeta,
        formatLogObj: (_f = settings == null ? void 0 : settings.overwrite) == null ? void 0 : _f.formatLogObj,
        transportFormatted: (_g = settings == null ? void 0 : settings.overwrite) == null ? void 0 : _g.transportFormatted,
        transportJSON: (_h = settings == null ? void 0 : settings.overwrite) == null ? void 0 : _h.transportJSON
      }
    };
  }
  log(logLevelId, logLevelName, ...args) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    if (logLevelId < this.settings.minLevel) {
      return;
    }
    const logArgs = [...this.settings.prefix, ...args];
    const maskedArgs = ((_a2 = this.settings.overwrite) == null ? void 0 : _a2.mask) != null ? (_b = this.settings.overwrite) == null ? void 0 : _b.mask(logArgs) : this.settings.maskValuesOfKeys != null && this.settings.maskValuesOfKeys.length > 0 ? this._mask(logArgs) : logArgs;
    const thisLogObj = this.logObj != null ? this._recursiveCloneAndExecuteFunctions(this.logObj) : void 0;
    const logObj = ((_c = this.settings.overwrite) == null ? void 0 : _c.toLogObj) != null ? (_d = this.settings.overwrite) == null ? void 0 : _d.toLogObj(maskedArgs, thisLogObj) : this._toLogObj(maskedArgs, thisLogObj);
    const logObjWithMeta = ((_e = this.settings.overwrite) == null ? void 0 : _e.addMeta) != null ? (_f = this.settings.overwrite) == null ? void 0 : _f.addMeta(logObj, logLevelId, logLevelName) : this._addMetaToLogObj(logObj, logLevelId, logLevelName);
    let logMetaMarkup;
    let logArgsAndErrorsMarkup = void 0;
    if (((_g = this.settings.overwrite) == null ? void 0 : _g.formatMeta) != null) {
      logMetaMarkup = (_h = this.settings.overwrite) == null ? void 0 : _h.formatMeta(logObjWithMeta == null ? void 0 : logObjWithMeta[this.settings.metaProperty]);
    }
    if (((_i = this.settings.overwrite) == null ? void 0 : _i.formatLogObj) != null) {
      logArgsAndErrorsMarkup = (_j = this.settings.overwrite) == null ? void 0 : _j.formatLogObj(maskedArgs, this.settings);
    }
    if (this.settings.type === "pretty") {
      logMetaMarkup = logMetaMarkup ?? this._prettyFormatLogObjMeta(logObjWithMeta == null ? void 0 : logObjWithMeta[this.settings.metaProperty]);
      logArgsAndErrorsMarkup = logArgsAndErrorsMarkup ?? this.runtime.prettyFormatLogObj(maskedArgs, this.settings);
    }
    if (logMetaMarkup != null && logArgsAndErrorsMarkup != null) {
      ((_k = this.settings.overwrite) == null ? void 0 : _k.transportFormatted) != null ? (_l = this.settings.overwrite) == null ? void 0 : _l.transportFormatted(logMetaMarkup, logArgsAndErrorsMarkup.args, logArgsAndErrorsMarkup.errors, this.settings) : this.runtime.transportFormatted(logMetaMarkup, logArgsAndErrorsMarkup.args, logArgsAndErrorsMarkup.errors, this.settings);
    } else {
      ((_m = this.settings.overwrite) == null ? void 0 : _m.transportJSON) != null ? (_n = this.settings.overwrite) == null ? void 0 : _n.transportJSON(logObjWithMeta) : this.settings.type !== "hidden" ? this.runtime.transportJSON(logObjWithMeta) : void 0;
    }
    if (this.settings.attachedTransports != null && this.settings.attachedTransports.length > 0) {
      this.settings.attachedTransports.forEach((transportLogger) => {
        transportLogger(logObjWithMeta);
      });
    }
    return logObjWithMeta;
  }
  attachTransport(transportLogger) {
    this.settings.attachedTransports.push(transportLogger);
  }
  getSubLogger(settings, logObj) {
    var _a2, _b, _c;
    const subLoggerSettings = {
      ...this.settings,
      ...settings,
      parentNames: ((_a2 = this.settings) == null ? void 0 : _a2.parentNames) != null && ((_b = this.settings) == null ? void 0 : _b.name) != null ? [...this.settings.parentNames, this.settings.name] : ((_c = this.settings) == null ? void 0 : _c.name) != null ? [this.settings.name] : void 0,
      prefix: [...this.settings.prefix, ...(settings == null ? void 0 : settings.prefix) ?? []]
    };
    const subLogger = new this.constructor(subLoggerSettings, logObj ?? this.logObj, this.stackDepthLevel);
    return subLogger;
  }
  _mask(args) {
    const maskValuesOfKeys = this.settings.maskValuesOfKeysCaseInsensitive !== true ? this.settings.maskValuesOfKeys : this.settings.maskValuesOfKeys.map((key) => key.toLowerCase());
    return args == null ? void 0 : args.map((arg) => {
      return this._recursiveCloneAndMaskValuesOfKeys(arg, maskValuesOfKeys);
    });
  }
  _recursiveCloneAndMaskValuesOfKeys(source, keys, seen = []) {
    var _a2, _b;
    if (seen.includes(source)) {
      return { ...source };
    }
    if (typeof source === "object" && source !== null) {
      seen.push(source);
    }
    if (this.runtime.isError(source) || this.runtime.isBuffer(source)) {
      return source;
    } else if (source instanceof Map) {
      return new Map(source);
    } else if (source instanceof Set) {
      return new Set(source);
    } else if (Array.isArray(source)) {
      return source.map((item) => this._recursiveCloneAndMaskValuesOfKeys(item, keys, seen));
    } else if (source instanceof Date) {
      return new Date(source.getTime());
    } else if (source instanceof URL) {
      return urlToObject(source);
    } else if (source !== null && typeof source === "object") {
      const baseObject = this.runtime.isError(source) ? this._cloneError(source) : Object.create(Object.getPrototypeOf(source));
      return Object.getOwnPropertyNames(source).reduce((o, prop) => {
        var _a3;
        o[prop] = keys.includes(((_a3 = this.settings) == null ? void 0 : _a3.maskValuesOfKeysCaseInsensitive) !== true ? prop : prop.toLowerCase()) ? this.settings.maskPlaceholder : (() => {
          try {
            return this._recursiveCloneAndMaskValuesOfKeys(source[prop], keys, seen);
          } catch (e) {
            return null;
          }
        })();
        return o;
      }, baseObject);
    } else {
      if (typeof source === "string") {
        let modifiedSource = source;
        for (const regEx of ((_a2 = this.settings) == null ? void 0 : _a2.maskValuesRegEx) || []) {
          modifiedSource = modifiedSource.replace(regEx, ((_b = this.settings) == null ? void 0 : _b.maskPlaceholder) || "");
        }
        return modifiedSource;
      }
      return source;
    }
  }
  _recursiveCloneAndExecuteFunctions(source, seen = []) {
    if (this.isObjectOrArray(source) && seen.includes(source)) {
      return this.shallowCopy(source);
    }
    if (this.isObjectOrArray(source)) {
      seen.push(source);
    }
    if (Array.isArray(source)) {
      return source.map((item) => this._recursiveCloneAndExecuteFunctions(item, seen));
    } else if (source instanceof Date) {
      return new Date(source.getTime());
    } else if (this.isObject(source)) {
      return Object.getOwnPropertyNames(source).reduce((o, prop) => {
        const descriptor = Object.getOwnPropertyDescriptor(source, prop);
        if (descriptor) {
          Object.defineProperty(o, prop, descriptor);
          const value = source[prop];
          o[prop] = typeof value === "function" ? value() : this._recursiveCloneAndExecuteFunctions(value, seen);
        }
        return o;
      }, Object.create(Object.getPrototypeOf(source)));
    } else {
      return source;
    }
  }
  isObjectOrArray(value) {
    return typeof value === "object" && value !== null;
  }
  isObject(value) {
    return typeof value === "object" && !Array.isArray(value) && value !== null;
  }
  shallowCopy(source) {
    if (Array.isArray(source)) {
      return [...source];
    } else {
      return { ...source };
    }
  }
  _toLogObj(args, clonedLogObj = {}) {
    args = args == null ? void 0 : args.map((arg) => this.runtime.isError(arg) ? this._toErrorObject(arg) : arg);
    if (this.settings.argumentsArrayName == null) {
      if (args.length === 1 && !Array.isArray(args[0]) && this.runtime.isBuffer(args[0]) !== true && !(args[0] instanceof Date)) {
        clonedLogObj = typeof args[0] === "object" && args[0] != null ? { ...args[0], ...clonedLogObj } : { 0: args[0], ...clonedLogObj };
      } else {
        clonedLogObj = { ...clonedLogObj, ...args };
      }
    } else {
      clonedLogObj = {
        ...clonedLogObj,
        [this.settings.argumentsArrayName]: args
      };
    }
    return clonedLogObj;
  }
  _cloneError(error) {
    const cloned = new error.constructor();
    Object.getOwnPropertyNames(error).forEach((key) => {
      cloned[key] = error[key];
    });
    return cloned;
  }
  _toErrorObject(error) {
    return {
      nativeError: error,
      name: error.name ?? "Error",
      message: error.message,
      stack: this.runtime.getErrorTrace(error)
    };
  }
  _addMetaToLogObj(logObj, logLevelId, logLevelName) {
    return {
      ...logObj,
      [this.settings.metaProperty]: this.runtime.getMeta(logLevelId, logLevelName, this.stackDepthLevel, this.settings.hideLogPositionForProduction, this.settings.name, this.settings.parentNames)
    };
  }
  _prettyFormatLogObjMeta(logObjMeta) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
    if (logObjMeta == null) {
      return "";
    }
    let template = this.settings.prettyLogTemplate;
    const placeholderValues = {};
    if (template.includes("{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}")) {
      template = template.replace("{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}", "{{dateIsoStr}}");
    } else {
      if (this.settings.prettyLogTimeZone === "UTC") {
        placeholderValues["yyyy"] = ((_a2 = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _a2.getUTCFullYear()) ?? "----";
        placeholderValues["mm"] = formatNumberAddZeros((_b = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _b.getUTCMonth(), 2, 1);
        placeholderValues["dd"] = formatNumberAddZeros((_c = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _c.getUTCDate(), 2);
        placeholderValues["hh"] = formatNumberAddZeros((_d = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _d.getUTCHours(), 2);
        placeholderValues["MM"] = formatNumberAddZeros((_e = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _e.getUTCMinutes(), 2);
        placeholderValues["ss"] = formatNumberAddZeros((_f = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _f.getUTCSeconds(), 2);
        placeholderValues["ms"] = formatNumberAddZeros((_g = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _g.getUTCMilliseconds(), 3);
      } else {
        placeholderValues["yyyy"] = ((_h = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _h.getFullYear()) ?? "----";
        placeholderValues["mm"] = formatNumberAddZeros((_i = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _i.getMonth(), 2, 1);
        placeholderValues["dd"] = formatNumberAddZeros((_j = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _j.getDate(), 2);
        placeholderValues["hh"] = formatNumberAddZeros((_k = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _k.getHours(), 2);
        placeholderValues["MM"] = formatNumberAddZeros((_l = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _l.getMinutes(), 2);
        placeholderValues["ss"] = formatNumberAddZeros((_m = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _m.getSeconds(), 2);
        placeholderValues["ms"] = formatNumberAddZeros((_n = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _n.getMilliseconds(), 3);
      }
    }
    const dateInSettingsTimeZone = this.settings.prettyLogTimeZone === "UTC" ? logObjMeta == null ? void 0 : logObjMeta.date : new Date(((_o = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _o.getTime()) - ((_p = logObjMeta == null ? void 0 : logObjMeta.date) == null ? void 0 : _p.getTimezoneOffset()) * 6e4);
    placeholderValues["rawIsoStr"] = dateInSettingsTimeZone == null ? void 0 : dateInSettingsTimeZone.toISOString();
    placeholderValues["dateIsoStr"] = dateInSettingsTimeZone == null ? void 0 : dateInSettingsTimeZone.toISOString().replace("T", " ").replace("Z", "");
    placeholderValues["logLevelName"] = logObjMeta == null ? void 0 : logObjMeta.logLevelName;
    placeholderValues["fileNameWithLine"] = ((_q = logObjMeta == null ? void 0 : logObjMeta.path) == null ? void 0 : _q.fileNameWithLine) ?? "";
    placeholderValues["filePathWithLine"] = ((_r = logObjMeta == null ? void 0 : logObjMeta.path) == null ? void 0 : _r.filePathWithLine) ?? "";
    placeholderValues["fullFilePath"] = ((_s = logObjMeta == null ? void 0 : logObjMeta.path) == null ? void 0 : _s.fullFilePath) ?? "";
    let parentNamesString = (_t = this.settings.parentNames) == null ? void 0 : _t.join(this.settings.prettyErrorParentNamesSeparator);
    parentNamesString = parentNamesString != null && (logObjMeta == null ? void 0 : logObjMeta.name) != null ? parentNamesString + this.settings.prettyErrorParentNamesSeparator : void 0;
    placeholderValues["name"] = (logObjMeta == null ? void 0 : logObjMeta.name) != null || parentNamesString != null ? (parentNamesString ?? "") + (logObjMeta == null ? void 0 : logObjMeta.name) : "";
    placeholderValues["nameWithDelimiterPrefix"] = placeholderValues["name"].length > 0 ? this.settings.prettyErrorLoggerNameDelimiter + placeholderValues["name"] : "";
    placeholderValues["nameWithDelimiterSuffix"] = placeholderValues["name"].length > 0 ? placeholderValues["name"] + this.settings.prettyErrorLoggerNameDelimiter : "";
    if (((_u = this.settings.overwrite) == null ? void 0 : _u.addPlaceholders) != null) {
      (_v = this.settings.overwrite) == null ? void 0 : _v.addPlaceholders(logObjMeta, placeholderValues);
    }
    return formatTemplate(this.settings, template, placeholderValues);
  }
};

// node_modules/tslog/dist/esm/index.js
var Logger = class extends BaseLogger {
  constructor(settings, logObj) {
    const isBrowser2 = typeof window !== "undefined" && typeof document !== "undefined";
    const isBrowserBlinkEngine = isBrowser2 ? window.chrome !== void 0 && window.CSS !== void 0 && window.CSS.supports("color", "green") : false;
    const isSafari = isBrowser2 ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false;
    settings = settings || {};
    settings.stylePrettyLogs = settings.stylePrettyLogs && isBrowser2 && !isBrowserBlinkEngine ? false : settings.stylePrettyLogs;
    super(settings, logObj, isSafari ? 4 : 5);
  }
  log(logLevelId, logLevelName, ...args) {
    return super.log(logLevelId, logLevelName, ...args);
  }
  silly(...args) {
    return super.log(0, "SILLY", ...args);
  }
  trace(...args) {
    return super.log(1, "TRACE", ...args);
  }
  debug(...args) {
    return super.log(2, "DEBUG", ...args);
  }
  info(...args) {
    return super.log(3, "INFO", ...args);
  }
  warn(...args) {
    return super.log(4, "WARN", ...args);
  }
  error(...args) {
    return super.log(5, "ERROR", ...args);
  }
  fatal(...args) {
    return super.log(6, "FATAL", ...args);
  }
  getSubLogger(settings, logObj) {
    return super.getSubLogger(settings, logObj);
  }
};

// node_modules/valibot/dist/index.js
var ValiError = class extends Error {
  /**
   * Creates a Valibot error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(issues) {
    super(issues[0].message);
    __publicField(this, "issues");
    this.name = "ValiError";
    this.issues = issues;
  }
};
var BrandSymbol = Symbol("brand");
function actionIssue(context2, reference, input, label, received) {
  return {
    issues: [{ context: context2, reference, input, label, received }]
  };
}
function actionOutput(output3) {
  return { output: output3 };
}
function defaultArgs(arg1, arg2) {
  return Array.isArray(arg1) ? [void 0, arg1] : [arg1, arg2];
}
var store;
function getGlobalConfig(config3) {
  return {
    lang: (config3 == null ? void 0 : config3.lang) ?? (store == null ? void 0 : store.lang),
    message: config3 == null ? void 0 : config3.message,
    abortEarly: (config3 == null ? void 0 : config3.abortEarly) ?? (store == null ? void 0 : store.abortEarly),
    abortPipeEarly: (config3 == null ? void 0 : config3.abortPipeEarly) ?? (store == null ? void 0 : store.abortPipeEarly),
    skipPipe: (config3 == null ? void 0 : config3.skipPipe) ?? (store == null ? void 0 : store.skipPipe)
  };
}
var store2;
function getGlobalMessage(lang) {
  return store2 == null ? void 0 : store2.get(lang);
}
var store3;
function getSchemaMessage(lang) {
  return store3 == null ? void 0 : store3.get(lang);
}
var store4;
function getSpecificMessage(reference, lang) {
  var _a2;
  return (_a2 = store4 == null ? void 0 : store4.get(reference)) == null ? void 0 : _a2.get(lang);
}
function i18n(schema2, context2, reference, config3, issue) {
  const message = context2.message ?? getSpecificMessage(reference, issue.lang) ?? (schema2 ? getSchemaMessage(issue.lang) : null) ?? (config3 == null ? void 0 : config3.message) ?? getGlobalMessage(issue.lang) ?? issue.message;
  return typeof message === "function" ? message(issue) : message;
}
function schemaResult(typed, output3, issues) {
  return { typed, output: output3, issues };
}
function stringify(input) {
  let type = typeof input;
  if (type === "object") {
    type = input ? Object.getPrototypeOf(input).constructor.name : "null";
  }
  return type === "string" ? `"${input}"` : type === "number" || type === "bigint" || type === "boolean" ? `${input}` : type;
}
function pipeIssue(context2, config3, issue) {
  const received = issue.received ?? stringify(issue.input);
  const schemaIssue2 = {
    reason: context2.type,
    context: issue.context.type,
    expected: issue.context.expects,
    received,
    message: `Invalid ${issue.label}: ${issue.context.expects ? `Expected ${issue.context.expects} but r` : "R"}eceived ${received}`,
    input: issue.input,
    requirement: issue.context.requirement,
    path: issue.path,
    lang: config3 == null ? void 0 : config3.lang,
    abortEarly: config3 == null ? void 0 : config3.abortEarly,
    abortPipeEarly: config3 == null ? void 0 : config3.abortPipeEarly,
    skipPipe: config3 == null ? void 0 : config3.skipPipe
  };
  schemaIssue2.message = i18n(
    false,
    issue.context,
    issue.reference,
    config3,
    schemaIssue2
  );
  return schemaIssue2;
}
function pipeResult(context2, input, config3, issues) {
  if (context2.pipe && !(config3 == null ? void 0 : config3.skipPipe)) {
    for (const action of context2.pipe) {
      const result = action._parse(input);
      if (result.issues) {
        for (const actionIssue2 of result.issues) {
          const schemaIssue2 = pipeIssue(context2, config3, actionIssue2);
          issues ? issues.push(schemaIssue2) : issues = [schemaIssue2];
        }
        if ((config3 == null ? void 0 : config3.abortEarly) || (config3 == null ? void 0 : config3.abortPipeEarly)) {
          break;
        }
      } else {
        input = result.output;
      }
    }
  }
  return schemaResult(true, input, issues);
}
function restAndDefaultArgs(arg1, arg2, arg3) {
  if (!arg1 || typeof arg1 === "object" && !Array.isArray(arg1)) {
    const [error2, pipe22] = defaultArgs(arg2, arg3);
    return [arg1, error2, pipe22];
  }
  const [error, pipe2] = defaultArgs(
    arg1,
    arg2
  );
  return [void 0, error, pipe2];
}
function schemaIssue(context2, reference, input, config3, other) {
  const received = stringify(input);
  const expected = (other == null ? void 0 : other.expected) ?? context2.expects;
  const issue = {
    reason: (other == null ? void 0 : other.reason) ?? "type",
    context: context2.type,
    expected,
    received,
    message: `Invalid type: Expected ${expected} but received ${received}`,
    input,
    path: other == null ? void 0 : other.path,
    issues: other == null ? void 0 : other.issues,
    lang: config3 == null ? void 0 : config3.lang,
    abortEarly: config3 == null ? void 0 : config3.abortEarly,
    abortPipeEarly: config3 == null ? void 0 : config3.abortPipeEarly,
    skipPipe: config3 == null ? void 0 : config3.skipPipe
  };
  issue.message = i18n(true, context2, reference, config3, issue);
  return { typed: false, output: input, issues: [issue] };
}
function getDefault(schema2) {
  return typeof schema2.default === "function" ? schema2.default() : schema2.default;
}
function array(item, arg2, arg3) {
  const [message, pipe2] = defaultArgs(arg2, arg3);
  return {
    type: "array",
    expects: "Array",
    async: false,
    item,
    message,
    pipe: pipe2,
    _parse(input, config3) {
      if (Array.isArray(input)) {
        let typed = true;
        let issues;
        const output3 = [];
        for (let key = 0; key < input.length; key++) {
          const value2 = input[key];
          const result = this.item._parse(value2, config3);
          if (result.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of result.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              issues == null ? void 0 : issues.push(issue);
            }
            if (!issues) {
              issues = result.issues;
            }
            if (config3 == null ? void 0 : config3.abortEarly) {
              typed = false;
              break;
            }
          }
          if (!result.typed) {
            typed = false;
          }
          output3.push(result.output);
        }
        if (typed) {
          return pipeResult(this, output3, config3, issues);
        }
        return schemaResult(false, output3, issues);
      }
      return schemaIssue(this, array, input, config3);
    }
  };
}
function boolean(arg1, arg2) {
  const [message, pipe2] = defaultArgs(arg1, arg2);
  return {
    type: "boolean",
    expects: "boolean",
    async: false,
    message,
    pipe: pipe2,
    _parse(input, config3) {
      if (typeof input === "boolean") {
        return pipeResult(this, input, config3);
      }
      return schemaIssue(this, boolean, input, config3);
    }
  };
}
function literal(literal_, message) {
  return {
    type: "literal",
    expects: stringify(literal_),
    async: false,
    literal: literal_,
    message,
    _parse(input, config3) {
      if (input === this.literal) {
        return schemaResult(true, input);
      }
      return schemaIssue(this, literal, input, config3);
    }
  };
}
function number(arg1, arg2) {
  const [message, pipe2] = defaultArgs(arg1, arg2);
  return {
    type: "number",
    expects: "number",
    async: false,
    message,
    pipe: pipe2,
    _parse(input, config3) {
      if (typeof input === "number" && !isNaN(input)) {
        return pipeResult(this, input, config3);
      }
      return schemaIssue(this, number, input, config3);
    }
  };
}
function object(entries, arg2, arg3, arg4) {
  const [rest, message, pipe2] = restAndDefaultArgs(arg2, arg3, arg4);
  let cachedEntries;
  return {
    type: "object",
    expects: "Object",
    async: false,
    entries,
    rest,
    message,
    pipe: pipe2,
    _parse(input, config3) {
      if (input && typeof input === "object") {
        cachedEntries = cachedEntries ?? Object.entries(this.entries);
        let typed = true;
        let issues;
        const output3 = {};
        for (const [key, schema2] of cachedEntries) {
          const value2 = input[key];
          const result = schema2._parse(value2, config3);
          if (result.issues) {
            const pathItem = {
              type: "object",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of result.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              issues == null ? void 0 : issues.push(issue);
            }
            if (!issues) {
              issues = result.issues;
            }
            if (config3 == null ? void 0 : config3.abortEarly) {
              typed = false;
              break;
            }
          }
          if (!result.typed) {
            typed = false;
          }
          if (result.output !== void 0 || key in input) {
            output3[key] = result.output;
          }
        }
        if (this.rest && !((config3 == null ? void 0 : config3.abortEarly) && issues)) {
          for (const key in input) {
            if (!(key in this.entries)) {
              const value2 = input[key];
              const result = this.rest._parse(value2, config3);
              if (result.issues) {
                const pathItem = {
                  type: "object",
                  origin: "value",
                  input,
                  key,
                  value: value2
                };
                for (const issue of result.issues) {
                  if (issue.path) {
                    issue.path.unshift(pathItem);
                  } else {
                    issue.path = [pathItem];
                  }
                  issues == null ? void 0 : issues.push(issue);
                }
                if (!issues) {
                  issues = result.issues;
                }
                if (config3 == null ? void 0 : config3.abortEarly) {
                  typed = false;
                  break;
                }
              }
              if (!result.typed) {
                typed = false;
              }
              output3[key] = result.output;
            }
          }
        }
        if (typed) {
          return pipeResult(
            this,
            output3,
            config3,
            issues
          );
        }
        return schemaResult(false, output3, issues);
      }
      return schemaIssue(this, object, input, config3);
    }
  };
}
function optional(wrapped, default_) {
  return {
    type: "optional",
    expects: `${wrapped.expects} | undefined`,
    async: false,
    wrapped,
    default: default_,
    _parse(input, config3) {
      if (input === void 0) {
        const override = getDefault(this);
        if (override === void 0) {
          return schemaResult(true, input);
        }
        input = override;
      }
      return this.wrapped._parse(input, config3);
    }
  };
}
function string(arg1, arg2) {
  const [message, pipe2] = defaultArgs(arg1, arg2);
  return {
    type: "string",
    expects: "string",
    async: false,
    message,
    pipe: pipe2,
    _parse(input, config3) {
      if (typeof input === "string") {
        return pipeResult(this, input, config3);
      }
      return schemaIssue(this, string, input, config3);
    }
  };
}
function subissues(results) {
  let issues;
  if (results) {
    for (const result of results) {
      if (issues) {
        for (const issue of result.issues) {
          issues.push(issue);
        }
      } else {
        issues = result.issues;
      }
    }
  }
  return issues;
}
function union(options, arg2, arg3) {
  const [message, pipe2] = defaultArgs(arg2, arg3);
  return {
    type: "union",
    expects: [...new Set(options.map((option) => option.expects))].join(" | "),
    async: false,
    options,
    message,
    pipe: pipe2,
    _parse(input, config3) {
      let validResult;
      let untypedResults;
      let typedResults;
      for (const schema2 of this.options) {
        const result = schema2._parse(input, config3);
        if (result.typed) {
          if (!result.issues) {
            validResult = result;
            break;
          } else {
            typedResults ? typedResults.push(result) : typedResults = [result];
          }
        } else {
          untypedResults ? untypedResults.push(result) : untypedResults = [result];
        }
      }
      if (validResult) {
        return pipeResult(this, validResult.output, config3);
      }
      if (typedResults == null ? void 0 : typedResults.length) {
        const firstResult = typedResults[0];
        return pipeResult(
          this,
          firstResult.output,
          config3,
          // Hint: If there is more than one typed result, we use a general
          // union issue with subissues because the issues could contradict
          // each other.
          typedResults.length === 1 ? firstResult.issues : schemaIssue(this, union, input, config3, {
            reason: "union",
            issues: subissues(typedResults)
          }).issues
        );
      }
      if ((untypedResults == null ? void 0 : untypedResults.length) === 1) {
        return untypedResults[0];
      }
      return schemaIssue(this, union, input, config3, {
        issues: subissues(untypedResults)
      });
    }
  };
}
function variant(key, options, arg3, arg4) {
  const [message, pipe2] = defaultArgs(arg3, arg4);
  let cachedExpectedKey;
  return {
    type: "variant",
    expects: "Object",
    async: false,
    key,
    options,
    message,
    pipe: pipe2,
    _parse(input, config3) {
      if (input && typeof input === "object") {
        if (this.key in input || !cachedExpectedKey) {
          let expectedKey;
          let variantResult;
          const parseOptions = (options2) => {
            for (const schema2 of options2) {
              if (schema2.type === "object") {
                const keySchema = schema2.entries[this.key];
                const keyResult = keySchema._parse(
                  input[this.key],
                  config3
                );
                if (!cachedExpectedKey) {
                  expectedKey ? expectedKey.push(keySchema.expects) : expectedKey = [keySchema.expects];
                }
                if (!keyResult.issues) {
                  const dataResult = schema2._parse(input, config3);
                  if (!dataResult.issues) {
                    variantResult = dataResult;
                    break;
                  }
                  if (!variantResult || !variantResult.typed && dataResult.typed) {
                    variantResult = dataResult;
                  }
                }
              } else if (schema2.type === "variant") {
                parseOptions(schema2.options);
                if (variantResult && !variantResult.issues) {
                  break;
                }
              }
            }
          };
          parseOptions(this.options);
          cachedExpectedKey = cachedExpectedKey || [...new Set(expectedKey)].join(" | ");
          if (variantResult) {
            if (variantResult.typed) {
              return pipeResult(
                this,
                variantResult.output,
                config3,
                variantResult.issues
              );
            }
            return variantResult;
          }
        }
        const value2 = input[this.key];
        return schemaIssue(this, variant, value2, config3, {
          expected: cachedExpectedKey,
          path: [
            {
              type: "object",
              origin: "value",
              input,
              key: this.key,
              value: value2
            }
          ]
        });
      }
      return schemaIssue(this, variant, input, config3);
    }
  };
}
function merge3(schemas, arg2, arg3, arg4) {
  const [rest, message, pipe2] = restAndDefaultArgs(arg2, arg3, arg4);
  return object(
    schemas.reduce(
      (entries, schema2) => ({ ...entries, ...schema2.entries }),
      {}
    ),
    rest,
    message,
    pipe2
  );
}
function parse(schema2, input, config3) {
  const result = schema2._parse(input, getGlobalConfig(config3));
  if (result.issues) {
    throw new ValiError(result.issues);
  }
  return result.output;
}
function partial(schema2, arg2, arg3, arg4) {
  const [rest, message, pipe2] = restAndDefaultArgs(arg2, arg3, arg4);
  return object(
    Object.entries(schema2.entries).reduce(
      (entries, [key, schema22]) => ({
        ...entries,
        [key]: optional(schema22)
      }),
      {}
    ),
    rest,
    message,
    pipe2
  );
}
function safeParse(schema2, input, config3) {
  const result = schema2._parse(input, getGlobalConfig(config3));
  return {
    typed: result.typed,
    success: !result.issues,
    output: result.output,
    issues: result.issues
  };
}
function custom(requirement, message) {
  return {
    type: "custom",
    expects: null,
    async: false,
    message,
    requirement,
    _parse(input) {
      if (this.requirement(input)) {
        return actionOutput(input);
      }
      return actionIssue(this, custom, input, "input");
    }
  };
}
function minValue(requirement, message) {
  return {
    type: "min_value",
    expects: `>=${requirement instanceof Date ? requirement.toJSON() : stringify(requirement)}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      if (input >= this.requirement) {
        return actionOutput(input);
      }
      return actionIssue(
        this,
        minValue,
        input,
        "value",
        input instanceof Date ? input.toJSON() : stringify(input)
      );
    }
  };
}

// node_modules/@noble/hashes/esm/_assert.js
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
  bytes(out);
  const min2 = instance.outputLen;
  if (out.length < min2) {
    throw new Error(`digestInto() expects output buffer of length at least ${min2}`);
  }
}

// node_modules/@noble/hashes/esm/crypto.js
var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// node_modules/@noble/hashes/esm/utils.js
var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  bytes(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    bytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
var Hash = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
var toStr = {}.toString;
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto2 && typeof crypto2.randomBytes === "function") {
    return crypto2.randomBytes(bytesLength);
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE3) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE3);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE3 ? 4 : 0;
  const l = isLE3 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE3);
  view.setUint32(byteOffset + l, wl, isLE3);
}
var HashMD = class extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE3) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE3;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    exists(this);
    const { view, buffer: buffer2, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take2 = Math.min(blockLen - this.pos, len - pos);
      if (take2 === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer2.set(data.subarray(pos, pos + take2), this.pos);
      this.pos += take2;
      pos += take2;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists(this);
    output(out, this);
    this.finished = true;
    const { buffer: buffer2, view, blockLen, isLE: isLE3 } = this;
    let { pos } = this;
    buffer2[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer2[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE3);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE3);
  }
  digest() {
    const { buffer: buffer2, outputLen } = this;
    this.digestInto(buffer2);
    const res = buffer2.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer2);
    return to;
  }
};

// node_modules/@noble/hashes/esm/_u64.js
var U32_MASK64 = BigInt(2 ** 32 - 1);
var _32n = BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (_h, l) => l;
var rotr32L = (h, _l) => h;
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
var u64 = {
  fromBig,
  split,
  toBig,
  shrSH,
  shrSL,
  rotrSH,
  rotrSL,
  rotrBH,
  rotrBL,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add,
  add3L,
  add3H,
  add4L,
  add4H,
  add5H,
  add5L
};
var u64_default = u64;

// node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh, SHA512_Kl] = (() => u64_default.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_W_H = new Uint32Array(80);
var SHA512_W_L = new Uint32Array(80);
var SHA512 = class extends HashMD {
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = u64_default.rotrSH(W15h, W15l, 1) ^ u64_default.rotrSH(W15h, W15l, 8) ^ u64_default.shrSH(W15h, W15l, 7);
      const s0l = u64_default.rotrSL(W15h, W15l, 1) ^ u64_default.rotrSL(W15h, W15l, 8) ^ u64_default.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = u64_default.rotrSH(W2h, W2l, 19) ^ u64_default.rotrBH(W2h, W2l, 61) ^ u64_default.shrSH(W2h, W2l, 6);
      const s1l = u64_default.rotrSL(W2h, W2l, 19) ^ u64_default.rotrBL(W2h, W2l, 61) ^ u64_default.shrSL(W2h, W2l, 6);
      const SUMl = u64_default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = u64_default.rotrSH(Eh, El, 14) ^ u64_default.rotrSH(Eh, El, 18) ^ u64_default.rotrBH(Eh, El, 41);
      const sigma1l = u64_default.rotrSL(Eh, El, 14) ^ u64_default.rotrSL(Eh, El, 18) ^ u64_default.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = u64_default.rotrSH(Ah, Al, 28) ^ u64_default.rotrBH(Ah, Al, 34) ^ u64_default.rotrBH(Ah, Al, 39);
      const sigma0l = u64_default.rotrSL(Ah, Al, 28) ^ u64_default.rotrBL(Ah, Al, 34) ^ u64_default.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64_default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64_default.add3L(T1l, sigma0l, MAJl);
      Ah = u64_default.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64_default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64_default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64_default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64_default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64_default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64_default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64_default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64_default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var SHA512_224 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 2352822216 | 0;
    this.Al = 424955298 | 0;
    this.Bh = 1944164710 | 0;
    this.Bl = 2312950998 | 0;
    this.Ch = 502970286 | 0;
    this.Cl = 855612546 | 0;
    this.Dh = 1738396948 | 0;
    this.Dl = 1479516111 | 0;
    this.Eh = 258812777 | 0;
    this.El = 2077511080 | 0;
    this.Fh = 2011393907 | 0;
    this.Fl = 79989058 | 0;
    this.Gh = 1067287976 | 0;
    this.Gl = 1780299464 | 0;
    this.Hh = 286451373 | 0;
    this.Hl = 2446758561 | 0;
    this.outputLen = 28;
  }
};
var SHA512_256 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 573645204 | 0;
    this.Al = 4230739756 | 0;
    this.Bh = 2673172387 | 0;
    this.Bl = 3360449730 | 0;
    this.Ch = 596883563 | 0;
    this.Cl = 1867755857 | 0;
    this.Dh = 2520282905 | 0;
    this.Dl = 1497426621 | 0;
    this.Eh = 2519219938 | 0;
    this.El = 2827943907 | 0;
    this.Fh = 3193839141 | 0;
    this.Fl = 1401305490 | 0;
    this.Gh = 721525244 | 0;
    this.Gl = 746961066 | 0;
    this.Hh = 246885852 | 0;
    this.Hl = 2177182882 | 0;
    this.outputLen = 32;
  }
};
var SHA384 = class extends SHA512 {
  constructor() {
    super();
    this.Ah = 3418070365 | 0;
    this.Al = 3238371032 | 0;
    this.Bh = 1654270250 | 0;
    this.Bl = 914150663 | 0;
    this.Ch = 2438529370 | 0;
    this.Cl = 812702999 | 0;
    this.Dh = 355462360 | 0;
    this.Dl = 4144912697 | 0;
    this.Eh = 1731405415 | 0;
    this.El = 4290775857 | 0;
    this.Fh = 2394180231 | 0;
    this.Fl = 1750603025 | 0;
    this.Gh = 3675008525 | 0;
    this.Gl = 1694076839 | 0;
    this.Hh = 1203062813 | 0;
    this.Hl = 3204075428 | 0;
    this.outputLen = 48;
  }
};
var sha512 = wrapConstructor(() => new SHA512());
var sha512_224 = wrapConstructor(() => new SHA512_224());
var sha512_256 = wrapConstructor(() => new SHA512_256());
var sha384 = wrapConstructor(() => new SHA384());

// node_modules/@noble/curves/esm/abstract/utils.js
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
function isBytes2(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function abytes(item) {
  if (!isBytes2(item))
    throw new Error("Uint8Array expected");
}
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(`${title} must be valid boolean, got "${value}".`);
}
var hexes2 = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes3) {
  abytes(bytes3);
  let hex = "";
  for (let i = 0; i < bytes3.length; i++) {
    hex += hexes2[bytes3[i]];
  }
  return hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return BigInt(hex === "" ? "0" : `0x${hex}`);
}
var asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
function asciiToBase16(char) {
  if (char >= asciis._0 && char <= asciis._9)
    return char - asciis._0;
  if (char >= asciis._A && char <= asciis._F)
    return char - (asciis._A - 10);
  if (char >= asciis._a && char <= asciis._f)
    return char - (asciis._a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + hl);
  const array2 = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array2[ai] = n1 * 16 + n2;
  }
  return array2;
}
function bytesToNumberBE(bytes3) {
  return hexToNumber(bytesToHex(bytes3));
}
function bytesToNumberLE(bytes3) {
  abytes(bytes3);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes3).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
    }
  } else if (isBytes2(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
function concatBytes2(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
function inRange(n, min2, max2) {
  return isPosBig(n) && isPosBig(min2) && isPosBig(max2) && min2 <= n && n < max2;
}
function aInRange(title, n, min2, max2) {
  if (!inRange(n, min2, max2))
    throw new Error(`expected valid ${title}: ${min2} <= n < ${max2}, got ${typeof n} ${n}`);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
var bitMask = (n) => (_2n << BigInt(n - 1)) - _1n;
var validatorFns = {
  bigint: (val) => typeof val === "bigint",
  function: (val) => typeof val === "function",
  boolean: (val) => typeof val === "boolean",
  string: (val) => typeof val === "string",
  stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
  isSafeInteger: (val) => Number.isSafeInteger(val),
  array: (val) => Array.isArray(val),
  field: (val, object2) => object2.Fp.isValid(val),
  hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
};
function validateObject(object2, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error(`Invalid validator "${type}", expected function`);
    const val = object2[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object2)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object2;
}
function memoized(fn) {
  const map2 = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map2.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map2.set(arg, computed);
    return computed;
  };
}

// node_modules/@noble/curves/esm/abstract/modular.js
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n2 = BigInt(2);
var _3n = BigInt(3);
var _4n = BigInt(4);
var _5n = BigInt(5);
var _8n = BigInt(8);
var _9n = BigInt(9);
var _16n = BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow(num, power, modulo) {
  if (modulo <= _0n2 || power < _0n2)
    throw new Error("Expected power/modulo > 0");
  if (modulo === _1n2)
    return _0n2;
  let res = _1n2;
  while (power > _0n2) {
    if (power & _1n2)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n2;
  }
  return res;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number3, modulo) {
  if (number3 === _0n2 || modulo <= _0n2) {
    throw new Error(`invert: expected positive integers, got n=${number3} mod=${modulo}`);
  }
  let a = mod(number3, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function tonelliShanks(P) {
  const legendreC = (P - _1n2) / _2n2;
  let Q, S, Z;
  for (Q = P - _1n2, S = 0; Q % _2n2 === _0n2; Q /= _2n2, S++)
    ;
  for (Z = _2n2; Z < P && pow(Z, legendreC, P) !== P - _1n2; Z++)
    ;
  if (S === 1) {
    const p1div4 = (P + _1n2) / _4n;
    return function tonelliFast(Fp2, n) {
      const root = Fp2.pow(n, p1div4);
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  const Q1div2 = (Q + _1n2) / _2n2;
  return function tonelliSlow(Fp2, n) {
    if (Fp2.pow(n, legendreC) === Fp2.neg(Fp2.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp2.pow(Fp2.mul(Fp2.ONE, Z), Q);
    let x = Fp2.pow(n, Q1div2);
    let b = Fp2.pow(n, Q);
    while (!Fp2.eql(b, Fp2.ONE)) {
      if (Fp2.eql(b, Fp2.ZERO))
        return Fp2.ZERO;
      let m = 1;
      for (let t2 = Fp2.sqr(b); m < r; m++) {
        if (Fp2.eql(t2, Fp2.ONE))
          break;
        t2 = Fp2.sqr(t2);
      }
      const ge = Fp2.pow(g, _1n2 << BigInt(r - m - 1));
      g = Fp2.sqr(ge);
      x = Fp2.mul(x, ge);
      b = Fp2.mul(b, g);
      r = m;
    }
    return x;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n) {
    const p1div4 = (P + _1n2) / _4n;
    return function sqrt3mod4(Fp2, n) {
      const root = Fp2.pow(n, p1div4);
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _8n === _5n) {
    const c1 = (P - _5n) / _8n;
    return function sqrt5mod8(Fp2, n) {
      const n2 = Fp2.mul(n, _2n2);
      const v = Fp2.pow(n2, c1);
      const nv = Fp2.mul(n, v);
      const i = Fp2.mul(Fp2.mul(nv, _2n2), v);
      const root = Fp2.mul(nv, Fp2.sub(i, Fp2.ONE));
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _16n === _9n) {
  }
  return tonelliShanks(P);
}
var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n2) === _1n2;
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map2, val) => {
    map2[val] = "function";
    return map2;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(f2, num, power) {
  if (power < _0n2)
    throw new Error("Expected power > 0");
  if (power === _0n2)
    return f2.ONE;
  if (power === _1n2)
    return num;
  let p = f2.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = f2.mul(p, d);
    d = f2.sqr(d);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(f2, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f2.is0(num))
      return acc;
    tmp[i] = acc;
    return f2.mul(acc, num);
  }, f2.ONE);
  const inverted = f2.inv(lastMultiplied);
  nums.reduceRight((acc, num, i) => {
    if (f2.is0(num))
      return acc;
    tmp[i] = f2.mul(acc, tmp[i]);
    return f2.mul(acc, num);
  }, inverted);
  return tmp;
}
function nLength(n, nBitLength) {
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE3 = false, redef = {}) {
  if (ORDER <= _0n2)
    throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("Field lengths over 2048 bytes are not supported");
  const sqrtP = FpSqrt(ORDER);
  const f2 = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n2 <= num && num < ORDER;
    },
    is0: (num) => num === _0n2,
    isOdd: (num) => (num & _1n2) === _1n2,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f2, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => sqrtP(f2, n)),
    invertBatch: (lst) => FpInvertBatch(f2, lst),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: (a, b, c) => c ? b : a,
    toBytes: (num) => isLE3 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes3) => {
      if (bytes3.length !== BYTES)
        throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes3.length}`);
      return isLE3 ? bytesToNumberLE(bytes3) : bytesToNumberBE(bytes3);
    }
  });
  return Object.freeze(f2);
}
function FpSqrtEven(Fp2, elm) {
  if (!Fp2.isOdd)
    throw new Error(`Field doesn't have isOdd`);
  const root = Fp2.sqrt(elm);
  return Fp2.isOdd(root) ? Fp2.neg(root) : root;
}

// node_modules/@noble/curves/esm/abstract/curve.js
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function wNAF(c, bits) {
  const constTimeNegate = (condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  };
  const validateW = (W) => {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error(`Wrong window size=${W}, should be [1..${bits}]`);
  };
  const opts = (W) => {
    validateW(W);
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  };
  return {
    constTimeNegate,
    // non-const time multiplication ladder
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d);
        d = d.double();
        n >>= _1n3;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = opts(W);
      const points = [];
      let p = elm;
      let base = p;
      for (let window3 = 0; window3 < windows; window3++) {
        base = p;
        points.push(base);
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = opts(W);
      let p = c.ZERO;
      let f2 = c.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window3 = 0; window3 < windows; window3++) {
        const offset = window3 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n3;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window3 % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f2 = f2.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f: f2 };
    },
    wNAFCached(P, n, transform) {
      const W = pointWindowSizes.get(P) || 1;
      let comp = pointPrecomputes.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1)
          pointPrecomputes.set(P, transform(comp));
      }
      return this.wNAF(W, comp, n);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P, W) {
      validateW(W);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
  };
}
function pippenger(c, field, points, scalars) {
  if (!Array.isArray(points) || !Array.isArray(scalars) || scalars.length !== points.length)
    throw new Error("arrays of points and scalars must have equal length");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error(`wrong scalar at index ${i}`);
  });
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error(`wrong point at index ${i}`);
  });
  const wbits = bitLen(BigInt(points.length));
  const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
  const MASK = (1 << windowSize) - 1;
  const buckets = new Array(MASK + 1).fill(c.ZERO);
  const lastBits = Math.floor((field.BITS - 1) / windowSize) * windowSize;
  let sum = c.ZERO;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(c.ZERO);
    for (let j = 0; j < scalars.length; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = c.ZERO;
    for (let j = buckets.length - 1, sumI = c.ZERO; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}

// node_modules/@noble/curves/esm/abstract/edwards.js
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n3 = BigInt(2);
var _8n2 = BigInt(8);
var VERIFY_DEFAULT = { zip215: true };
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(curve, {
    hash: "function",
    a: "bigint",
    d: "bigint",
    randomBytes: "function"
  }, {
    adjustScalarBytes: "function",
    domain: "function",
    uvRatio: "function",
    mapToCurve: "function"
  });
  return Object.freeze({ ...opts });
}
function twistedEdwards(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp: Fp2, n: CURVE_ORDER, prehash, hash: cHash, randomBytes: randomBytes2, nByteLength, h: cofactor } = CURVE;
  const MASK = _2n3 << BigInt(nByteLength * 8) - _1n4;
  const modP = Fp2.create;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const uvRatio2 = CURVE.uvRatio || ((u, v) => {
    try {
      return { isValid: true, value: Fp2.sqrt(u * Fp2.inv(v)) };
    } catch (e) {
      return { isValid: false, value: _0n4 };
    }
  });
  const adjustScalarBytes2 = CURVE.adjustScalarBytes || ((bytes3) => bytes3);
  const domain = CURVE.domain || ((data, ctx, phflag) => {
    abool("phflag", phflag);
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  });
  function aCoordinate(title, n) {
    aInRange("coordinate " + title, n, _0n4, MASK);
  }
  function assertPoint(other) {
    if (!(other instanceof Point))
      throw new Error("ExtendedPoint expected");
  }
  const toAffineMemo = memoized((p, iz) => {
    const { ex: x, ey: y, ez: z } = p;
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? _8n2 : Fp2.inv(z);
    const ax = modP(x * iz);
    const ay = modP(y * iz);
    const zz = modP(z * iz);
    if (is0)
      return { x: _0n4, y: _1n4 };
    if (zz !== _1n4)
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    const { a, d } = CURVE;
    if (p.is0())
      throw new Error("bad point: ZERO");
    const { ex: X, ey: Y, ez: Z, et: T } = p;
    const X2 = modP(X * X);
    const Y2 = modP(Y * Y);
    const Z2 = modP(Z * Z);
    const Z4 = modP(Z2 * Z2);
    const aX2 = modP(X2 * a);
    const left = modP(Z2 * modP(aX2 + Y2));
    const right = modP(Z4 + modP(d * modP(X2 * Y2)));
    if (left !== right)
      throw new Error("bad point: equation left != right (1)");
    const XY = modP(X * Y);
    const ZT = modP(Z * T);
    if (XY !== ZT)
      throw new Error("bad point: equation left != right (2)");
    return true;
  });
  class Point {
    constructor(ex, ey, ez, et) {
      this.ex = ex;
      this.ey = ey;
      this.ez = ez;
      this.et = et;
      aCoordinate("x", ex);
      aCoordinate("y", ey);
      aCoordinate("z", ez);
      aCoordinate("t", et);
      Object.freeze(this);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static fromAffine(p) {
      if (p instanceof Point)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      aCoordinate("x", x);
      aCoordinate("y", y);
      return new Point(x, y, _1n4, modP(x * y));
    }
    static normalizeZ(points) {
      const toInv = Fp2.invertBatch(points.map((p) => p.ez));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // Not required for fromHex(), which always creates valid points.
    // Could be useful for fromAffine().
    assertValidity() {
      assertValidMemo(this);
    }
    // Compare one point to another.
    equals(other) {
      assertPoint(other);
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const { ex: X2, ey: Y2, ez: Z2 } = other;
      const X1Z2 = modP(X1 * Z2);
      const X2Z1 = modP(X2 * Z1);
      const Y1Z2 = modP(Y1 * Z2);
      const Y2Z1 = modP(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(modP(-this.ex), this.ey, this.ez, modP(-this.et));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const A = modP(X1 * X1);
      const B = modP(Y1 * Y1);
      const C = modP(_2n3 * modP(Z1 * Z1));
      const D = modP(a * A);
      const x1y1 = X1 + Y1;
      const E = modP(modP(x1y1 * x1y1) - A - B);
      const G2 = D + B;
      const F = G2 - C;
      const H = D - B;
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      assertPoint(other);
      const { a, d } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
      const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
      if (a === BigInt(-1)) {
        const A2 = modP((Y1 - X1) * (Y2 + X2));
        const B2 = modP((Y1 + X1) * (Y2 - X2));
        const F2 = modP(B2 - A2);
        if (F2 === _0n4)
          return this.double();
        const C2 = modP(Z1 * _2n3 * T2);
        const D2 = modP(T1 * _2n3 * Z2);
        const E2 = D2 + C2;
        const G3 = B2 + A2;
        const H2 = D2 - C2;
        const X32 = modP(E2 * F2);
        const Y32 = modP(G3 * H2);
        const T32 = modP(E2 * H2);
        const Z32 = modP(F2 * G3);
        return new Point(X32, Y32, Z32, T32);
      }
      const A = modP(X1 * X2);
      const B = modP(Y1 * Y2);
      const C = modP(T1 * d * T2);
      const D = modP(Z1 * Z2);
      const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
      const F = D - C;
      const G2 = D + C;
      const H = modP(B - a * A);
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point.normalizeZ);
    }
    // Constant-time multiplication.
    multiply(scalar) {
      const n = scalar;
      aInRange("scalar", n, _1n4, CURVE_ORDER);
      const { p, f: f2 } = this.wNAF(n);
      return Point.normalizeZ([p, f2])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Does NOT allow scalars higher than CURVE.n.
    multiplyUnsafe(scalar) {
      const n = scalar;
      aInRange("scalar", n, _0n4, CURVE_ORDER);
      if (n === _0n4)
        return I;
      if (this.equals(I) || n === _1n4)
        return this;
      if (this.equals(G))
        return this.wNAF(n).p;
      return wnaf.unsafeLadder(this, n);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Multiplies point by cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return wnaf.unsafeLadder(this, CURVE_ORDER).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    clearCofactor() {
      const { h: cofactor2 } = CURVE;
      if (cofactor2 === _1n4)
        return this;
      return this.multiplyUnsafe(cofactor2);
    }
    // Converts hash string or Uint8Array to Point.
    // Uses algo from RFC8032 5.1.3.
    static fromHex(hex, zip215 = false) {
      const { d, a } = CURVE;
      const len = Fp2.BYTES;
      hex = ensureBytes("pointHex", hex, len);
      abool("zip215", zip215);
      const normed = hex.slice();
      const lastByte = hex[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      const max2 = zip215 ? MASK : Fp2.ORDER;
      aInRange("pointHex.y", y, _0n4, max2);
      const y2 = modP(y * y);
      const u = modP(y2 - _1n4);
      const v = modP(d * y2 - a);
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
        throw new Error("Point.fromHex: invalid y coordinate");
      const isXOdd = (x & _1n4) === _1n4;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === _0n4 && isLastByteOdd)
        throw new Error("Point.fromHex: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = modP(-x);
      return Point.fromAffine({ x, y });
    }
    static fromPrivateKey(privKey) {
      return getExtendedPublicKey(privKey).point;
    }
    toRawBytes() {
      const { x, y } = this.toAffine();
      const bytes3 = numberToBytesLE(y, Fp2.BYTES);
      bytes3[bytes3.length - 1] |= x & _1n4 ? 128 : 0;
      return bytes3;
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n4, modP(CURVE.Gx * CURVE.Gy));
  Point.ZERO = new Point(_0n4, _1n4, _1n4, _0n4);
  const { BASE: G, ZERO: I } = Point;
  const wnaf = wNAF(Point, nByteLength * 8);
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function modN_LE(hash2) {
    return modN(bytesToNumberLE(hash2));
  }
  function getExtendedPublicKey(key) {
    const len = nByteLength;
    key = ensureBytes("private key", key, len);
    const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
    const head = adjustScalarBytes2(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    const point = G.multiply(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  function getPublicKey(privKey) {
    return getExtendedPublicKey(privKey).pointBytes;
  }
  function hashDomainToScalar(context2 = new Uint8Array(), ...msgs) {
    const msg = concatBytes2(...msgs);
    return modN_LE(cHash(domain(msg, ensureBytes("context", context2), !!prehash)));
  }
  function sign(msg, privKey, options = {}) {
    msg = ensureBytes("message", msg);
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
    const r = hashDomainToScalar(options.context, prefix, msg);
    const R = G.multiply(r).toRawBytes();
    const k = hashDomainToScalar(options.context, R, pointBytes, msg);
    const s = modN(r + k * scalar);
    aInRange("signature.s", s, _0n4, CURVE_ORDER);
    const res = concatBytes2(R, numberToBytesLE(s, Fp2.BYTES));
    return ensureBytes("result", res, nByteLength * 2);
  }
  const verifyOpts = VERIFY_DEFAULT;
  function verify(sig, msg, publicKey, options = verifyOpts) {
    const { context: context2, zip215 } = options;
    const len = Fp2.BYTES;
    sig = ensureBytes("signature", sig, 2 * len);
    msg = ensureBytes("message", msg);
    if (zip215 !== void 0)
      abool("zip215", zip215);
    if (prehash)
      msg = prehash(msg);
    const s = bytesToNumberLE(sig.slice(len, 2 * len));
    let A, R, SB;
    try {
      A = Point.fromHex(publicKey, zip215);
      R = Point.fromHex(sig.slice(0, len), zip215);
      SB = G.multiplyUnsafe(s);
    } catch (error) {
      return false;
    }
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = hashDomainToScalar(context2, R.toRawBytes(), A.toRawBytes(), msg);
    const RkA = R.add(A.multiplyUnsafe(k));
    return RkA.subtract(SB).clearCofactor().equals(Point.ZERO);
  }
  G._setWindowSize(8);
  const utils = {
    getExtendedPublicKey,
    // ed25519 private keys are uniform 32b. No need to check for modulo bias, like in secp256k1.
    randomPrivateKey: () => randomBytes2(Fp2.BYTES),
    /**
     * We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
     * values. This slows down first getPublicKey() by milliseconds (see Speed section),
     * but allows to speed-up subsequent getPublicKey() calls up to 20x.
     * @param windowSize 2, 4, 8, 16
     */
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  return {
    CURVE,
    getPublicKey,
    sign,
    verify,
    ExtendedPoint: Point,
    utils
  };
}

// node_modules/@noble/curves/esm/abstract/hash-to-curve.js
var os2ip = bytesToNumberBE;
function i2osp(value, length) {
  anum(value);
  anum(length);
  if (value < 0 || value >= 1 << 8 * length) {
    throw new Error(`bad I2OSP call: value=${value} length=${length}`);
  }
  const res = Array.from({ length }).fill(0);
  for (let i = length - 1; i >= 0; i--) {
    res[i] = value & 255;
    value >>>= 8;
  }
  return new Uint8Array(res);
}
function strxor(a, b) {
  const arr = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    arr[i] = a[i] ^ b[i];
  }
  return arr;
}
function anum(item) {
  if (!Number.isSafeInteger(item))
    throw new Error("number expected");
}
function expand_message_xmd(msg, DST, lenInBytes, H) {
  abytes(msg);
  abytes(DST);
  anum(lenInBytes);
  if (DST.length > 255)
    DST = H(concatBytes2(utf8ToBytes2("H2C-OVERSIZE-DST-"), DST));
  const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
  const ell = Math.ceil(lenInBytes / b_in_bytes);
  if (lenInBytes > 65535 || ell > 255)
    throw new Error("expand_message_xmd: invalid lenInBytes");
  const DST_prime = concatBytes2(DST, i2osp(DST.length, 1));
  const Z_pad = i2osp(0, r_in_bytes);
  const l_i_b_str = i2osp(lenInBytes, 2);
  const b = new Array(ell);
  const b_0 = H(concatBytes2(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
  b[0] = H(concatBytes2(b_0, i2osp(1, 1), DST_prime));
  for (let i = 1; i <= ell; i++) {
    const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
    b[i] = H(concatBytes2(...args));
  }
  const pseudo_random_bytes = concatBytes2(...b);
  return pseudo_random_bytes.slice(0, lenInBytes);
}
function expand_message_xof(msg, DST, lenInBytes, k, H) {
  abytes(msg);
  abytes(DST);
  anum(lenInBytes);
  if (DST.length > 255) {
    const dkLen = Math.ceil(2 * k / 8);
    DST = H.create({ dkLen }).update(utf8ToBytes2("H2C-OVERSIZE-DST-")).update(DST).digest();
  }
  if (lenInBytes > 65535 || DST.length > 255)
    throw new Error("expand_message_xof: invalid lenInBytes");
  return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
function hash_to_field(msg, count2, options) {
  validateObject(options, {
    DST: "stringOrUint8Array",
    p: "bigint",
    m: "isSafeInteger",
    k: "isSafeInteger",
    hash: "hash"
  });
  const { p, k, m, hash: hash2, expand: expand3, DST: _DST } = options;
  abytes(msg);
  anum(count2);
  const DST = typeof _DST === "string" ? utf8ToBytes2(_DST) : _DST;
  const log2p = p.toString(2).length;
  const L = Math.ceil((log2p + k) / 8);
  const len_in_bytes = count2 * m * L;
  let prb;
  if (expand3 === "xmd") {
    prb = expand_message_xmd(msg, DST, len_in_bytes, hash2);
  } else if (expand3 === "xof") {
    prb = expand_message_xof(msg, DST, len_in_bytes, k, hash2);
  } else if (expand3 === "_internal_pass") {
    prb = msg;
  } else {
    throw new Error('expand must be "xmd" or "xof"');
  }
  const u = new Array(count2);
  for (let i = 0; i < count2; i++) {
    const e = new Array(m);
    for (let j = 0; j < m; j++) {
      const elm_offset = L * (j + i * m);
      const tv = prb.subarray(elm_offset, elm_offset + L);
      e[j] = mod(os2ip(tv), p);
    }
    u[i] = e;
  }
  return u;
}
function createHasher(Point, mapToCurve, def) {
  if (typeof mapToCurve !== "function")
    throw new Error("mapToCurve() must be defined");
  return {
    // Encodes byte string to elliptic curve.
    // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
    hashToCurve(msg, options) {
      const u = hash_to_field(msg, 2, { ...def, DST: def.DST, ...options });
      const u0 = Point.fromAffine(mapToCurve(u[0]));
      const u1 = Point.fromAffine(mapToCurve(u[1]));
      const P = u0.add(u1).clearCofactor();
      P.assertValidity();
      return P;
    },
    // Encodes byte string to elliptic curve.
    // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
    encodeToCurve(msg, options) {
      const u = hash_to_field(msg, 1, { ...def, DST: def.encodeDST, ...options });
      const P = Point.fromAffine(mapToCurve(u[0])).clearCofactor();
      P.assertValidity();
      return P;
    },
    // Same as encodeToCurve, but without hash
    mapToCurve(scalars) {
      if (!Array.isArray(scalars))
        throw new Error("mapToCurve: expected array of bigints");
      for (const i of scalars)
        if (typeof i !== "bigint")
          throw new Error(`mapToCurve: expected array of bigints, got ${i} in array`);
      const P = Point.fromAffine(mapToCurve(scalars)).clearCofactor();
      P.assertValidity();
      return P;
    }
  };
}

// node_modules/@noble/curves/esm/abstract/montgomery.js
var _0n5 = BigInt(0);
var _1n5 = BigInt(1);
function validateOpts2(curve) {
  validateObject(curve, {
    a: "bigint"
  }, {
    montgomeryBits: "isSafeInteger",
    nByteLength: "isSafeInteger",
    adjustScalarBytes: "function",
    domain: "function",
    powPminus2: "function",
    Gu: "bigint"
  });
  return Object.freeze({ ...curve });
}
function montgomery(curveDef) {
  const CURVE = validateOpts2(curveDef);
  const { P } = CURVE;
  const modP = (n) => mod(n, P);
  const montgomeryBits = CURVE.montgomeryBits;
  const montgomeryBytes = Math.ceil(montgomeryBits / 8);
  const fieldLen = CURVE.nByteLength;
  const adjustScalarBytes2 = CURVE.adjustScalarBytes || ((bytes3) => bytes3);
  const powPminus2 = CURVE.powPminus2 || ((x) => pow(x, P - BigInt(2), P));
  function cswap(swap, x_2, x_3) {
    const dummy = modP(swap * (x_2 - x_3));
    x_2 = modP(x_2 - dummy);
    x_3 = modP(x_3 + dummy);
    return [x_2, x_3];
  }
  const a24 = (CURVE.a - BigInt(2)) / BigInt(4);
  function montgomeryLadder(u, scalar) {
    aInRange("u", u, _0n5, P);
    aInRange("scalar", scalar, _0n5, P);
    const k = scalar;
    const x_1 = u;
    let x_2 = _1n5;
    let z_2 = _0n5;
    let x_3 = u;
    let z_3 = _1n5;
    let swap = _0n5;
    let sw;
    for (let t = BigInt(montgomeryBits - 1); t >= _0n5; t--) {
      const k_t = k >> t & _1n5;
      swap ^= k_t;
      sw = cswap(swap, x_2, x_3);
      x_2 = sw[0];
      x_3 = sw[1];
      sw = cswap(swap, z_2, z_3);
      z_2 = sw[0];
      z_3 = sw[1];
      swap = k_t;
      const A = x_2 + z_2;
      const AA = modP(A * A);
      const B = x_2 - z_2;
      const BB = modP(B * B);
      const E = AA - BB;
      const C = x_3 + z_3;
      const D = x_3 - z_3;
      const DA = modP(D * A);
      const CB = modP(C * B);
      const dacb = DA + CB;
      const da_cb = DA - CB;
      x_3 = modP(dacb * dacb);
      z_3 = modP(x_1 * modP(da_cb * da_cb));
      x_2 = modP(AA * BB);
      z_2 = modP(E * (AA + modP(a24 * E)));
    }
    sw = cswap(swap, x_2, x_3);
    x_2 = sw[0];
    x_3 = sw[1];
    sw = cswap(swap, z_2, z_3);
    z_2 = sw[0];
    z_3 = sw[1];
    const z2 = powPminus2(z_2);
    return modP(x_2 * z2);
  }
  function encodeUCoordinate(u) {
    return numberToBytesLE(modP(u), montgomeryBytes);
  }
  function decodeUCoordinate(uEnc) {
    const u = ensureBytes("u coordinate", uEnc, montgomeryBytes);
    if (fieldLen === 32)
      u[31] &= 127;
    return bytesToNumberLE(u);
  }
  function decodeScalar(n) {
    const bytes3 = ensureBytes("scalar", n);
    const len = bytes3.length;
    if (len !== montgomeryBytes && len !== fieldLen)
      throw new Error(`Expected ${montgomeryBytes} or ${fieldLen} bytes, got ${len}`);
    return bytesToNumberLE(adjustScalarBytes2(bytes3));
  }
  function scalarMult(scalar, u) {
    const pointU = decodeUCoordinate(u);
    const _scalar = decodeScalar(scalar);
    const pu = montgomeryLadder(pointU, _scalar);
    if (pu === _0n5)
      throw new Error("Invalid private or public key received");
    return encodeUCoordinate(pu);
  }
  const GuBytes = encodeUCoordinate(CURVE.Gu);
  function scalarMultBase(scalar) {
    return scalarMult(scalar, GuBytes);
  }
  return {
    scalarMult,
    scalarMultBase,
    getSharedSecret: (privateKey, publicKey) => scalarMult(privateKey, publicKey),
    getPublicKey: (privateKey) => scalarMultBase(privateKey),
    utils: { randomPrivateKey: () => CURVE.randomBytes(CURVE.nByteLength) },
    GuBytes
  };
}

// node_modules/@noble/curves/esm/ed25519.js
var ED25519_P = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
var ED25519_SQRT_M1 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
var _0n6 = BigInt(0);
var _1n6 = BigInt(1);
var _2n4 = BigInt(2);
var _3n2 = BigInt(3);
var _5n2 = BigInt(5);
var _8n3 = BigInt(8);
function ed25519_pow_2_252_3(x) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P = ED25519_P;
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n4, P) * b2 % P;
  const b5 = pow2(b4, _1n6, P) * x % P;
  const b10 = pow2(b5, _5n2, P) * b5 % P;
  const b20 = pow2(b10, _10n, P) * b10 % P;
  const b40 = pow2(b20, _20n, P) * b20 % P;
  const b80 = pow2(b40, _40n, P) * b40 % P;
  const b160 = pow2(b80, _80n, P) * b80 % P;
  const b240 = pow2(b160, _80n, P) * b80 % P;
  const b250 = pow2(b240, _10n, P) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n4, P) * x % P;
  return { pow_p_5_8, b2 };
}
function adjustScalarBytes(bytes3) {
  bytes3[0] &= 248;
  bytes3[31] &= 127;
  bytes3[31] |= 64;
  return bytes3;
}
function uvRatio(u, v) {
  const P = ED25519_P;
  const v32 = mod(v * v * v, P);
  const v7 = mod(v32 * v32 * v, P);
  const pow3 = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v32 * pow3, P);
  const vx2 = mod(v * x * x, P);
  const root1 = x;
  const root2 = mod(x * ED25519_SQRT_M1, P);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (isNegativeLE(x, P))
    x = mod(-x, P);
  return { isValid: useRoot1 || useRoot2, value: x };
}
var Fp = (() => Field(ED25519_P, void 0, true))();
var ed25519Defaults = (() => ({
  // Param: a
  a: BigInt(-1),
  // Fp.create(-1) is proper; our way still works and is faster
  // d is equal to -121665/121666 over finite field.
  // Negative number is P - number, and division is invert(number, P)
  d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
  // Finite field 𝔽p over which we'll do calculations; 2n**255n - 19n
  Fp,
  // Subgroup order: how many points curve has
  // 2n**252n + 27742317777372353535851937790883648493n;
  n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
  // Cofactor
  h: _8n3,
  // Base point (x, y) aka generator point
  Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
  Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
  hash: sha512,
  randomBytes,
  adjustScalarBytes,
  // dom2
  // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
  // Constant-time, u/√v
  uvRatio
}))();
var ed25519 = (() => twistedEdwards(ed25519Defaults))();
function ed25519_domain(data, ctx, phflag) {
  if (ctx.length > 255)
    throw new Error("Context is too big");
  return concatBytes(utf8ToBytes("SigEd25519 no Ed25519 collisions"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
}
var ed25519ctx = (() => twistedEdwards({
  ...ed25519Defaults,
  domain: ed25519_domain
}))();
var ed25519ph = (() => twistedEdwards(Object.assign({}, ed25519Defaults, {
  domain: ed25519_domain,
  prehash: sha512
})))();
var x25519 = (() => montgomery({
  P: ED25519_P,
  a: BigInt(486662),
  montgomeryBits: 255,
  // n is 253 bits
  nByteLength: 32,
  Gu: BigInt(9),
  powPminus2: (x) => {
    const P = ED25519_P;
    const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
    return mod(pow2(pow_p_5_8, _3n2, P) * b2, P);
  },
  adjustScalarBytes,
  randomBytes
}))();
var ELL2_C1 = (() => (Fp.ORDER + _3n2) / _8n3)();
var ELL2_C2 = (() => Fp.pow(_2n4, ELL2_C1))();
var ELL2_C3 = (() => Fp.sqrt(Fp.neg(Fp.ONE)))();
function map_to_curve_elligator2_curve25519(u) {
  const ELL2_C4 = (Fp.ORDER - _5n2) / _8n3;
  const ELL2_J = BigInt(486662);
  let tv1 = Fp.sqr(u);
  tv1 = Fp.mul(tv1, _2n4);
  let xd = Fp.add(tv1, Fp.ONE);
  let x1n = Fp.neg(ELL2_J);
  let tv2 = Fp.sqr(xd);
  let gxd = Fp.mul(tv2, xd);
  let gx1 = Fp.mul(tv1, ELL2_J);
  gx1 = Fp.mul(gx1, x1n);
  gx1 = Fp.add(gx1, tv2);
  gx1 = Fp.mul(gx1, x1n);
  let tv3 = Fp.sqr(gxd);
  tv2 = Fp.sqr(tv3);
  tv3 = Fp.mul(tv3, gxd);
  tv3 = Fp.mul(tv3, gx1);
  tv2 = Fp.mul(tv2, tv3);
  let y11 = Fp.pow(tv2, ELL2_C4);
  y11 = Fp.mul(y11, tv3);
  let y12 = Fp.mul(y11, ELL2_C3);
  tv2 = Fp.sqr(y11);
  tv2 = Fp.mul(tv2, gxd);
  let e1 = Fp.eql(tv2, gx1);
  let y1 = Fp.cmov(y12, y11, e1);
  let x2n = Fp.mul(x1n, tv1);
  let y21 = Fp.mul(y11, u);
  y21 = Fp.mul(y21, ELL2_C2);
  let y22 = Fp.mul(y21, ELL2_C3);
  let gx2 = Fp.mul(gx1, tv1);
  tv2 = Fp.sqr(y21);
  tv2 = Fp.mul(tv2, gxd);
  let e2 = Fp.eql(tv2, gx2);
  let y2 = Fp.cmov(y22, y21, e2);
  tv2 = Fp.sqr(y1);
  tv2 = Fp.mul(tv2, gxd);
  let e3 = Fp.eql(tv2, gx1);
  let xn = Fp.cmov(x2n, x1n, e3);
  let y = Fp.cmov(y2, y1, e3);
  let e4 = Fp.isOdd(y);
  y = Fp.cmov(y, Fp.neg(y), e3 !== e4);
  return { xMn: xn, xMd: xd, yMn: y, yMd: _1n6 };
}
var ELL2_C1_EDWARDS = (() => FpSqrtEven(Fp, Fp.neg(BigInt(486664))))();
function map_to_curve_elligator2_edwards25519(u) {
  const { xMn, xMd, yMn, yMd } = map_to_curve_elligator2_curve25519(u);
  let xn = Fp.mul(xMn, yMd);
  xn = Fp.mul(xn, ELL2_C1_EDWARDS);
  let xd = Fp.mul(xMd, yMn);
  let yn = Fp.sub(xMn, xMd);
  let yd = Fp.add(xMn, xMd);
  let tv1 = Fp.mul(xd, yd);
  let e = Fp.eql(tv1, Fp.ZERO);
  xn = Fp.cmov(xn, Fp.ZERO, e);
  xd = Fp.cmov(xd, Fp.ONE, e);
  yn = Fp.cmov(yn, Fp.ONE, e);
  yd = Fp.cmov(yd, Fp.ONE, e);
  const inv = Fp.invertBatch([xd, yd]);
  return { x: Fp.mul(xn, inv[0]), y: Fp.mul(yn, inv[1]) };
}
var htf = (() => createHasher(ed25519.ExtendedPoint, (scalars) => map_to_curve_elligator2_edwards25519(scalars[0]), {
  DST: "edwards25519_XMD:SHA-512_ELL2_RO_",
  encodeDST: "edwards25519_XMD:SHA-512_ELL2_NU_",
  p: Fp.ORDER,
  m: 1,
  k: 128,
  expand: "xmd",
  hash: sha512
}))();
var hashToCurve = (() => htf.hashToCurve)();
var encodeToCurve = (() => htf.encodeToCurve)();
function assertRstPoint(other) {
  if (!(other instanceof RistPoint))
    throw new Error("RistrettoPoint expected");
}
var SQRT_M1 = ED25519_SQRT_M1;
var SQRT_AD_MINUS_ONE = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
var INVSQRT_A_MINUS_D = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
var ONE_MINUS_D_SQ = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
var D_MINUS_ONE_SQ = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
var invertSqrt = (number3) => uvRatio(_1n6, number3);
var MAX_255B = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
var bytes255ToNumberLE = (bytes3) => ed25519.CURVE.Fp.create(bytesToNumberLE(bytes3) & MAX_255B);
function calcElligatorRistrettoMap(r0) {
  const { d } = ed25519.CURVE;
  const P = ed25519.CURVE.Fp.ORDER;
  const mod2 = ed25519.CURVE.Fp.create;
  const r = mod2(SQRT_M1 * r0 * r0);
  const Ns = mod2((r + _1n6) * ONE_MINUS_D_SQ);
  let c = BigInt(-1);
  const D = mod2((c - d * r) * mod2(r + d));
  let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
  let s_ = mod2(s * r0);
  if (!isNegativeLE(s_, P))
    s_ = mod2(-s_);
  if (!Ns_D_is_sq)
    s = s_;
  if (!Ns_D_is_sq)
    c = r;
  const Nt = mod2(c * (r - _1n6) * D_MINUS_ONE_SQ - D);
  const s2 = s * s;
  const W0 = mod2((s + s) * D);
  const W1 = mod2(Nt * SQRT_AD_MINUS_ONE);
  const W2 = mod2(_1n6 - s2);
  const W3 = mod2(_1n6 + s2);
  return new ed25519.ExtendedPoint(mod2(W0 * W3), mod2(W2 * W1), mod2(W1 * W3), mod2(W0 * W2));
}
var RistPoint = class _RistPoint {
  // Private property to discourage combining ExtendedPoint + RistrettoPoint
  // Always use Ristretto encoding/decoding instead.
  constructor(ep) {
    this.ep = ep;
  }
  static fromAffine(ap) {
    return new _RistPoint(ed25519.ExtendedPoint.fromAffine(ap));
  }
  /**
   * Takes uniform output of 64-byte hash function like sha512 and converts it to `RistrettoPoint`.
   * The hash-to-group operation applies Elligator twice and adds the results.
   * **Note:** this is one-way map, there is no conversion from point to hash.
   * https://ristretto.group/formulas/elligator.html
   * @param hex 64-byte output of a hash function
   */
  static hashToCurve(hex) {
    hex = ensureBytes("ristrettoHash", hex, 64);
    const r1 = bytes255ToNumberLE(hex.slice(0, 32));
    const R1 = calcElligatorRistrettoMap(r1);
    const r2 = bytes255ToNumberLE(hex.slice(32, 64));
    const R2 = calcElligatorRistrettoMap(r2);
    return new _RistPoint(R1.add(R2));
  }
  /**
   * Converts ristretto-encoded string to ristretto point.
   * https://ristretto.group/formulas/decoding.html
   * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
   */
  static fromHex(hex) {
    hex = ensureBytes("ristrettoHex", hex, 32);
    const { a, d } = ed25519.CURVE;
    const P = ed25519.CURVE.Fp.ORDER;
    const mod2 = ed25519.CURVE.Fp.create;
    const emsg = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint";
    const s = bytes255ToNumberLE(hex);
    if (!equalBytes(numberToBytesLE(s, 32), hex) || isNegativeLE(s, P))
      throw new Error(emsg);
    const s2 = mod2(s * s);
    const u1 = mod2(_1n6 + a * s2);
    const u2 = mod2(_1n6 - a * s2);
    const u1_2 = mod2(u1 * u1);
    const u2_2 = mod2(u2 * u2);
    const v = mod2(a * d * u1_2 - u2_2);
    const { isValid, value: I } = invertSqrt(mod2(v * u2_2));
    const Dx = mod2(I * u2);
    const Dy = mod2(I * Dx * v);
    let x = mod2((s + s) * Dx);
    if (isNegativeLE(x, P))
      x = mod2(-x);
    const y = mod2(u1 * Dy);
    const t = mod2(x * y);
    if (!isValid || isNegativeLE(t, P) || y === _0n6)
      throw new Error(emsg);
    return new _RistPoint(new ed25519.ExtendedPoint(x, y, _1n6, t));
  }
  /**
   * Encodes ristretto point to Uint8Array.
   * https://ristretto.group/formulas/encoding.html
   */
  toRawBytes() {
    let { ex: x, ey: y, ez: z, et: t } = this.ep;
    const P = ed25519.CURVE.Fp.ORDER;
    const mod2 = ed25519.CURVE.Fp.create;
    const u1 = mod2(mod2(z + y) * mod2(z - y));
    const u2 = mod2(x * y);
    const u2sq = mod2(u2 * u2);
    const { value: invsqrt } = invertSqrt(mod2(u1 * u2sq));
    const D1 = mod2(invsqrt * u1);
    const D2 = mod2(invsqrt * u2);
    const zInv = mod2(D1 * D2 * t);
    let D;
    if (isNegativeLE(t * zInv, P)) {
      let _x = mod2(y * SQRT_M1);
      let _y = mod2(x * SQRT_M1);
      x = _x;
      y = _y;
      D = mod2(D1 * INVSQRT_A_MINUS_D);
    } else {
      D = D2;
    }
    if (isNegativeLE(x * zInv, P))
      y = mod2(-y);
    let s = mod2((z - y) * D);
    if (isNegativeLE(s, P))
      s = mod2(-s);
    return numberToBytesLE(s, 32);
  }
  toHex() {
    return bytesToHex(this.toRawBytes());
  }
  toString() {
    return this.toHex();
  }
  // Compare one point to another.
  equals(other) {
    assertRstPoint(other);
    const { ex: X1, ey: Y1 } = this.ep;
    const { ex: X2, ey: Y2 } = other.ep;
    const mod2 = ed25519.CURVE.Fp.create;
    const one = mod2(X1 * Y2) === mod2(Y1 * X2);
    const two = mod2(Y1 * Y2) === mod2(X1 * X2);
    return one || two;
  }
  add(other) {
    assertRstPoint(other);
    return new _RistPoint(this.ep.add(other.ep));
  }
  subtract(other) {
    assertRstPoint(other);
    return new _RistPoint(this.ep.subtract(other.ep));
  }
  multiply(scalar) {
    return new _RistPoint(this.ep.multiply(scalar));
  }
  multiplyUnsafe(scalar) {
    return new _RistPoint(this.ep.multiplyUnsafe(scalar));
  }
  double() {
    return new _RistPoint(this.ep.double());
  }
  negate() {
    return new _RistPoint(this.ep.negate());
  }
};
var RistrettoPoint = (() => {
  if (!RistPoint.BASE)
    RistPoint.BASE = new RistPoint(ed25519.ExtendedPoint.BASE);
  if (!RistPoint.ZERO)
    RistPoint.ZERO = new RistPoint(ed25519.ExtendedPoint.ZERO);
  return RistPoint;
})();

// node_modules/@radixdlt/radix-dapp-toolkit/dist/index.js
var import_buffer3 = __toESM(require_buffer());
var import_blakejs = __toESM(require_blakejs());
var import_buffer4 = __toESM(require_buffer());

// node_modules/immer/dist/immer.mjs
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
var errors = true ? [
  // All error codes, starting by 0:
  function(plugin) {
    return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
  },
  function(thing) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
  },
  "This object has been frozen and should not be mutated",
  function(data) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(thing) {
    return `'current' expects a draft, got: ${thing}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(thing) {
    return `'original' expects a draft, got: ${thing}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function die(error, ...args) {
  if (true) {
    const e = errors[error];
    const msg = typeof e === "function" ? e.apply(null, args) : e;
    throw new Error(`[Immer] ${msg}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
  var _a2;
  if (!value)
    return false;
  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a2 = value.constructor) == null ? void 0 : _a2[DRAFTABLE]) || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
function isPlainObject(value) {
  if (!value || typeof value !== "object")
    return false;
  const proto = getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  if (Ctor === Object)
    return true;
  return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
}
function each(obj, iter) {
  if (getArchtype(obj) === 0) {
    Reflect.ownKeys(obj).forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
function has(thing, prop) {
  return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}
function set(thing, propOrOldValue, value) {
  const t = getArchtype(thing);
  if (t === 2)
    thing.set(propOrOldValue, value);
  else if (t === 3) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
}
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
function isMap(target) {
  return target instanceof Map;
}
function isSet(target) {
  return target instanceof Set;
}
function latest(state) {
  return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (Array.isArray(base))
    return Array.prototype.slice.call(base);
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = Object.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc.writable === false) {
        desc.writable = true;
        desc.configurable = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          configurable: true,
          writable: true,
          // could live with !!desc.set as well here...
          enumerable: desc.enumerable,
          value: base[key]
        };
    }
    return Object.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return { ...base };
    }
    const obj = Object.create(proto);
    return Object.assign(obj, base);
  }
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
  }
  Object.freeze(obj);
  if (deep)
    Object.entries(obj).forEach(([key, value]) => freeze(value, true));
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
function isFrozen(obj) {
  return Object.isFrozen(obj);
}
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
var currentScope;
function getCurrentScope() {
  return currentScope;
}
function createScope(parent_, immer_) {
  return {
    drafts_: [],
    parent_,
    immer_,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: true,
    unfinalizedDrafts_: 0
  };
}
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    getPlugin("Patches");
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
function enterScope(immer2) {
  return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 || state.type_ === 1)
    state.revoke_();
  else
    state.revoked_ = true;
}
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize2(scope, result);
      if (!scope.parent_)
        maybeFreeze(scope, result);
    }
    if (scope.patches_) {
      getPlugin("Patches").generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope.patches_,
        scope.inversePatches_
      );
    }
  } else {
    result = finalize2(scope, baseDraft, []);
  }
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize2(rootScope, value, path) {
  if (isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  if (!state) {
    each(
      value,
      (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path)
    );
    return value;
  }
  if (state.scope_ !== rootScope)
    return value;
  if (!state.modified_) {
    maybeFreeze(rootScope, state.base_, true);
    return state.base_;
  }
  if (!state.finalized_) {
    state.finalized_ = true;
    state.scope_.unfinalizedDrafts_--;
    const result = state.copy_;
    let resultEach = result;
    let isSet2 = false;
    if (state.type_ === 3) {
      resultEach = new Set(result);
      result.clear();
      isSet2 = true;
    }
    each(
      resultEach,
      (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2)
    );
    maybeFreeze(rootScope, result, false);
    if (path && rootScope.patches_) {
      getPlugin("Patches").generatePatches_(
        state,
        path,
        rootScope.patches_,
        rootScope.inversePatches_
      );
    }
  }
  return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
  if (childValue === targetObject)
    die(5);
  if (isDraft(childValue)) {
    const path = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
    const res = finalize2(rootScope, childValue, path);
    set(targetObject, prop, res);
    if (isDraft(res)) {
      rootScope.canAutoFreeze_ = false;
    } else
      return;
  } else if (targetIsSet) {
    targetObject.add(childValue);
  }
  if (isDraftable(childValue) && !isFrozen(childValue)) {
    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
      return;
    }
    finalize2(rootScope, childValue);
    if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && Object.prototype.propertyIsEnumerable.call(targetObject, prop))
      maybeFreeze(rootScope, childValue);
  }
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}
function createProxyProxy(base, parent) {
  const isArray4 = Array.isArray(base);
  const state = {
    type_: isArray4 ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false
  };
  let target = state;
  let traps = objectTraps;
  if (isArray4) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return proxy;
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    const source = latest(state);
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      return state.copy_[prop] = createProxy(value, state);
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc == null ? void 0 : desc.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2 == null ? void 0 : current2[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_[prop] = false;
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_[prop] = true;
    return true;
  },
  deleteProperty(state, prop) {
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_[prop] = false;
      prepareCopy(state);
      markChanged(state);
    } else {
      delete state.assigned_[prop];
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      writable: true,
      configurable: state.type_ !== 1 || prop !== "length",
      enumerable: desc.enumerable,
      value: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
each(objectTraps, (key, fn) => {
  arrayTraps[key] = function() {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});
arrayTraps.deleteProperty = function(state, prop) {
  if (isNaN(parseInt(prop)))
    die(13);
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  if (prop !== "length" && isNaN(parseInt(prop)))
    die(14);
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  var _a2;
  const desc = getDescriptorFromProto(source, prop);
  return desc ? `value` in desc ? desc.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (_a2 = desc.get) == null ? void 0 : _a2.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}
var Immer2 = class {
  constructor(config3) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    this.produce = (base, recipe, patchListener) => {
      if (typeof base === "function" && typeof recipe !== "function") {
        const defaultBase = recipe;
        recipe = base;
        const self = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (typeof recipe !== "function")
        die(6);
      if (patchListener !== void 0 && typeof patchListener !== "function")
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || typeof base !== "object") {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p = [];
          const ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
          patchListener(p, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (typeof base === "function") {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p, ip) => {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (typeof (config3 == null ? void 0 : config3.autoFreeze) === "boolean")
      this.setAutoFreeze(config3.autoFreeze);
    if (typeof (config3 == null ? void 0 : config3.useStrictShallowCopy) === "boolean")
      this.setUseStrictShallowCopy(config3.useStrictShallowCopy);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin("Patches").applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(value, parent) {
  const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = parent ? parent.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
  } else {
    copy = shallowCopy(value, true);
  }
  each(copy, (key, childValue) => {
    set(copy, key, currentImpl(childValue));
  });
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}
var immer = new Immer2();
var produce = immer.produce;
var produceWithPatches = immer.produceWithPatches.bind(
  immer
);
var setAutoFreeze = immer.setAutoFreeze.bind(immer);
var setUseStrictShallowCopy = immer.setUseStrictShallowCopy.bind(immer);
var applyPatches = immer.applyPatches.bind(immer);
var createDraft = immer.createDraft.bind(immer);
var finishDraft = immer.finishDraft.bind(immer);

// node_modules/@radixdlt/radix-dapp-toolkit/dist/index.js
var import_buffer5 = __toESM(require_buffer());

// node_modules/uuid/dist/esm-browser/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

// node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/uuid/dist/esm-browser/parse.js
function parse2(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  var v;
  var arr = new Uint8Array(16);
  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 255;
  arr[2] = v >>> 8 & 255;
  arr[3] = v & 255;
  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 255;
  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 255;
  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 255;
  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
  arr[11] = v / 4294967296 & 255;
  arr[12] = v >>> 24 & 255;
  arr[13] = v >>> 16 & 255;
  arr[14] = v >>> 8 & 255;
  arr[15] = v & 255;
  return arr;
}
var parse_default = parse2;

// node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
var i;
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/uuid/dist/esm-browser/v35.js
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  var bytes3 = [];
  for (var i = 0; i < str.length; ++i) {
    bytes3.push(str.charCodeAt(i));
  }
  return bytes3;
}
var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;
    if (typeof value === "string") {
      value = stringToBytes(value);
    }
    if (typeof namespace === "string") {
      namespace = parse_default(namespace);
    }
    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    }
    var bytes3 = new Uint8Array(16 + value.length);
    bytes3.set(namespace);
    bytes3.set(value, namespace.length);
    bytes3 = hashfunc(bytes3);
    bytes3[6] = bytes3[6] & 15 | version;
    bytes3[8] = bytes3[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes3[i];
      }
      return buf;
    }
    return unsafeStringify(bytes3);
  }
  try {
    generateUUID.name = name;
  } catch (err2) {
  }
  generateUUID.DNS = DNS;
  generateUUID.URL = URL2;
  return generateUUID;
}

// node_modules/uuid/dist/esm-browser/md5.js
function md5(bytes3) {
  if (typeof bytes3 === "string") {
    var msg = unescape(encodeURIComponent(bytes3));
    bytes3 = new Uint8Array(msg.length);
    for (var i = 0; i < msg.length; ++i) {
      bytes3[i] = msg.charCodeAt(i);
    }
  }
  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes3), bytes3.length * 8));
}
function md5ToHexEncodedArray(input) {
  var output3 = [];
  var length32 = input.length * 32;
  var hexTab = "0123456789abcdef";
  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 255;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15), 16);
    output3.push(hex);
  }
  return output3;
}
function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
function wordsToMd5(x, len) {
  x[len >> 5] |= 128 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c, d];
}
function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }
  var length8 = input.length * 8;
  var output3 = new Uint32Array(getOutputLength(length8));
  for (var i = 0; i < length8; i += 8) {
    output3[i >> 5] |= (input[i / 8] & 255) << i % 32;
  }
  return output3;
}
function safeAdd(x, y) {
  var lsw = (x & 65535) + (y & 65535);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}
var md5_default = md5;

// node_modules/uuid/dist/esm-browser/v3.js
var v3 = v35("v3", 48, md5_default);

// node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// node_modules/uuid/dist/esm-browser/sha1.js
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;
    case 1:
      return x ^ y ^ z;
    case 2:
      return x & y ^ x & z ^ y & z;
    case 3:
      return x ^ y ^ z;
  }
}
function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}
function sha1(bytes3) {
  var K = [1518500249, 1859775393, 2400959708, 3395469782];
  var H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  if (typeof bytes3 === "string") {
    var msg = unescape(encodeURIComponent(bytes3));
    bytes3 = [];
    for (var i = 0; i < msg.length; ++i) {
      bytes3.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes3)) {
    bytes3 = Array.prototype.slice.call(bytes3);
  }
  bytes3.push(128);
  var l = bytes3.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);
  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);
    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes3[_i * 64 + j * 4] << 24 | bytes3[_i * 64 + j * 4 + 1] << 16 | bytes3[_i * 64 + j * 4 + 2] << 8 | bytes3[_i * 64 + j * 4 + 3];
    }
    M[_i] = arr;
  }
  M[N - 1][14] = (bytes3.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes3.length - 1) * 8 & 4294967295;
  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);
    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }
    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }
    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];
    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }
    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }
  return [H[0] >> 24 & 255, H[0] >> 16 & 255, H[0] >> 8 & 255, H[0] & 255, H[1] >> 24 & 255, H[1] >> 16 & 255, H[1] >> 8 & 255, H[1] & 255, H[2] >> 24 & 255, H[2] >> 16 & 255, H[2] >> 8 & 255, H[2] & 255, H[3] >> 24 & 255, H[3] >> 16 & 255, H[3] >> 8 & 255, H[3] & 255, H[4] >> 24 & 255, H[4] >> 16 & 255, H[4] >> 8 & 255, H[4] & 255];
}
var sha1_default = sha1;

// node_modules/uuid/dist/esm-browser/v5.js
var v5 = v35("v5", 80, sha1_default);

// node_modules/@radixdlt/radix-dapp-toolkit/dist/index.js
var import_buffer6 = __toESM(require_buffer());
var import_buffer7 = __toESM(require_buffer());
var import_buffer8 = __toESM(require_buffer());
var import_base64url = __toESM(require_base64url2());
var polyfills_default = () => {
  if (!globalThis.Buffer)
    globalThis.Buffer = import_buffer2.Buffer;
};
var ExponentialBackoff = ({
  maxDelayTime = 1e4,
  multiplier = 2,
  timeout: timeout2,
  interval: interval2 = 2e3
} = {}) => {
  const trigger = new Subject();
  let numberOfRetries = 0;
  const backoff$ = merge(
    of(0),
    trigger.pipe(
      map(() => {
        numberOfRetries = numberOfRetries + 1;
        return numberOfRetries;
      })
    )
  ).pipe(
    switchMap((numberOfRetries2) => {
      const delayTime = numberOfRetries2 * interval2 * multiplier;
      const delay2 = delayTime > maxDelayTime ? maxDelayTime : delayTime;
      return timer(delay2).pipe(map(() => ok(numberOfRetries2)));
    })
  );
  const withBackoffAndTimeout$ = timeout2 ? merge(
    backoff$,
    timer(timeout2).pipe(map(() => err({ error: "timeout" })))
  ) : backoff$;
  return { trigger, withBackoff$: withBackoffAndTimeout$ };
};
var typedError = (error) => error;
var parseJSON = (text) => {
  try {
    return ok(JSON.parse(text));
  } catch (error) {
    return err(typedError(error));
  }
};
var typedError2 = (error) => error;
var resolveFetch = (fetchable) => ResultAsync.fromPromise(fetchable, typedError2).mapErr((error) => ({
  reason: "FailedToFetch",
  error,
  status: 0
}));
var fetchWrapper = (fetchable) => resolveFetch(fetchable).andThen(
  (response) => ResultAsync.fromPromise(response.text(), typedError2).andThen((text) => text ? parseJSON(text) : okAsync(text)).mapErr((error) => ({
    status: response.status,
    reason: "FailedToParseResponseToJson",
    error
  })).andThen(
    (data) => response.ok ? okAsync({
      status: response.status,
      data
    }) : errAsync({
      status: response.status,
      reason: "RequestStatusNotOk",
      data
    })
  )
);
var isMobile = (userAgent = window.navigator.userAgent) => {
  const parsed = bowser_default.parse(userAgent);
  return parsed.platform.type === "mobile" || parsed.platform.type === "tablet";
};
var Logger2 = (minLevel) => new Logger({
  minLevel: minLevel ?? 2,
  prettyLogTemplate: "{{hh}}:{{MM}}:{{ss}}:{{ms}}	{{name}}	{{logLevelName}}	"
});
var stringify2 = (input) => {
  try {
    return ok(JSON.stringify(input));
  } catch (error) {
    return err(error);
  }
};
var removeUndefined = (input) => stringify2(input).andThen(parseJSON);
var unwrapObservable = (input) => ResultAsync.fromPromise(
  firstValueFrom(input),
  (error) => error
).andThen((result) => result);
var Account = object({
  address: string(),
  label: string(),
  appearanceId: number()
});
var Proof = object({
  publicKey: string(),
  signature: string(),
  curve: union([literal("curve25519"), literal("secp256k1")])
});
var AccountProof = object({
  accountAddress: string(),
  proof: Proof
});
var Persona = object({ identityAddress: string(), label: string() });
var personaDataFullNameVariant = {
  western: "western",
  eastern: "eastern"
};
var PersonaDataNameVariant = union([
  literal(personaDataFullNameVariant.eastern),
  literal(personaDataFullNameVariant.western)
]);
var PersonaDataName = object({
  variant: PersonaDataNameVariant,
  familyName: string(),
  nickname: string(),
  givenNames: string()
});
var NumberOfValues = object({
  quantifier: union([literal("exactly"), literal("atLeast")]),
  quantity: number([minValue(0, "The number must be at least 0.")])
});
var AccountsRequestItem = object({
  challenge: optional(string()),
  numberOfAccounts: NumberOfValues
});
var AccountsRequestResponseItem = object(
  {
    accounts: array(Account),
    challenge: optional(string()),
    proofs: optional(array(AccountProof))
  },
  [
    custom((data) => {
      var _a2;
      if (data.challenge || (data == null ? void 0 : data.proofs)) {
        return !!(data.challenge && ((_a2 = data == null ? void 0 : data.proofs) == null ? void 0 : _a2.length));
      }
      return true;
    }, "missing challenge or proofs")
  ]
);
var PersonaDataRequestItem = object({
  isRequestingName: optional(boolean()),
  numberOfRequestedEmailAddresses: optional(NumberOfValues),
  numberOfRequestedPhoneNumbers: optional(NumberOfValues)
});
var PersonaDataRequestResponseItem = object({
  name: optional(PersonaDataName),
  emailAddresses: optional(array(string())),
  phoneNumbers: optional(array(string()))
});
var ResetRequestItem = object({
  accounts: boolean(),
  personaData: boolean()
});
var LoginRequestResponseItem = object(
  {
    persona: Persona,
    challenge: optional(string()),
    proof: optional(Proof)
  },
  [
    custom((data) => {
      if (data.challenge || data.proof) {
        return !!(data.challenge && data.proof);
      }
      return true;
    }, "missing challenge or proof")
  ]
);
var WalletUnauthorizedRequestItems = object({
  discriminator: literal("unauthorizedRequest"),
  oneTimeAccounts: optional(AccountsRequestItem),
  oneTimePersonaData: optional(PersonaDataRequestItem)
});
var AuthUsePersonaRequestItem = object({
  discriminator: literal("usePersona"),
  identityAddress: string()
});
var AuthLoginWithoutChallengeRequestItem = object({
  discriminator: literal("loginWithoutChallenge")
});
var AuthLoginWithChallengeRequestItem = object({
  discriminator: literal("loginWithChallenge"),
  challenge: string()
});
var AuthLoginRequestItem = union([
  AuthLoginWithoutChallengeRequestItem,
  AuthLoginWithChallengeRequestItem
]);
var AuthRequestItem = union([
  AuthUsePersonaRequestItem,
  AuthLoginRequestItem
]);
var WalletAuthorizedRequestItems = object({
  discriminator: literal("authorizedRequest"),
  auth: AuthRequestItem,
  reset: optional(ResetRequestItem),
  oneTimeAccounts: optional(AccountsRequestItem),
  ongoingAccounts: optional(AccountsRequestItem),
  oneTimePersonaData: optional(PersonaDataRequestItem),
  ongoingPersonaData: optional(PersonaDataRequestItem)
});
var WalletRequestItems = union([
  WalletUnauthorizedRequestItems,
  WalletAuthorizedRequestItems
]);
var SendTransactionItem = object({
  transactionManifest: string(),
  version: number(),
  blobs: optional(array(string())),
  message: optional(string())
});
var WalletTransactionItems = object({
  discriminator: literal("transaction"),
  send: SendTransactionItem
});
var SendTransactionResponseItem = object({
  transactionIntentHash: string()
});
var WalletTransactionResponseItems = object({
  discriminator: literal("transaction"),
  send: SendTransactionResponseItem
});
var CancelRequest = object({
  discriminator: literal("cancelRequest")
});
var WalletInteractionItems = union([
  WalletRequestItems,
  WalletTransactionItems,
  CancelRequest
]);
var Metadata = object({
  version: literal(2),
  networkId: number(),
  dAppDefinitionAddress: string(),
  origin: string()
});
var WalletInteraction = object({
  interactionId: string(),
  metadata: Metadata,
  items: WalletInteractionItems
});
var WalletUnauthorizedRequestResponseItems = object({
  discriminator: literal("unauthorizedRequest"),
  oneTimeAccounts: optional(AccountsRequestResponseItem),
  oneTimePersonaData: optional(PersonaDataRequestResponseItem)
});
var AuthLoginWithoutChallengeRequestResponseItem = object({
  discriminator: literal("loginWithoutChallenge"),
  persona: Persona
});
var AuthLoginWithChallengeRequestResponseItem = object({
  discriminator: literal("loginWithChallenge"),
  persona: Persona,
  challenge: string(),
  proof: Proof
});
var AuthLoginRequestResponseItem = union([
  AuthLoginWithoutChallengeRequestResponseItem,
  AuthLoginWithChallengeRequestResponseItem
]);
var AuthUsePersonaRequestResponseItem = object({
  discriminator: literal("usePersona"),
  persona: Persona
});
var AuthRequestResponseItem = union([
  AuthUsePersonaRequestResponseItem,
  AuthLoginRequestResponseItem
]);
var WalletAuthorizedRequestResponseItems = object({
  discriminator: literal("authorizedRequest"),
  auth: AuthRequestResponseItem,
  oneTimeAccounts: optional(AccountsRequestResponseItem),
  ongoingAccounts: optional(AccountsRequestResponseItem),
  oneTimePersonaData: optional(PersonaDataRequestResponseItem),
  ongoingPersonaData: optional(PersonaDataRequestResponseItem)
});
var WalletRequestResponseItems = union([
  WalletUnauthorizedRequestResponseItems,
  WalletAuthorizedRequestResponseItems
]);
var WalletInteractionResponseItems = union([
  WalletRequestResponseItems,
  WalletTransactionResponseItems
]);
var WalletInteractionSuccessResponse = object({
  discriminator: literal("success"),
  interactionId: string(),
  items: WalletInteractionResponseItems
});
var WalletInteractionFailureResponse = object({
  discriminator: literal("failure"),
  interactionId: string(),
  error: string(),
  message: optional(string())
});
var WalletInteractionResponse = union([
  WalletInteractionSuccessResponse,
  WalletInteractionFailureResponse
]);
var extensionInteractionDiscriminator = {
  extensionStatus: "extensionStatus",
  openPopup: "openPopup",
  cancelWalletInteraction: "cancelWalletInteraction",
  walletInteraction: "walletInteraction"
};
var StatusExtensionInteraction = object({
  interactionId: string(),
  discriminator: literal(extensionInteractionDiscriminator.extensionStatus)
});
var OpenPopupExtensionInteraction = object({
  interactionId: string(),
  discriminator: literal(extensionInteractionDiscriminator.openPopup)
});
var WalletInteractionExtensionInteraction = object({
  interactionId: string(),
  discriminator: literal(extensionInteractionDiscriminator.walletInteraction),
  interaction: WalletInteraction,
  sessionId: optional(string())
});
var CancelWalletInteractionExtensionInteraction = object({
  interactionId: string(),
  discriminator: literal(
    extensionInteractionDiscriminator.cancelWalletInteraction
  ),
  metadata: Metadata
});
var ExtensionInteraction = union([
  StatusExtensionInteraction,
  OpenPopupExtensionInteraction,
  WalletInteractionExtensionInteraction,
  CancelWalletInteractionExtensionInteraction
]);
var messageLifeCycleEventType = {
  extensionStatus: "extensionStatus",
  receivedByExtension: "receivedByExtension",
  receivedByWallet: "receivedByWallet",
  requestCancelSuccess: "requestCancelSuccess",
  requestCancelFail: "requestCancelFail"
};
var MessageLifeCycleExtensionStatusEvent = object({
  eventType: literal(messageLifeCycleEventType.extensionStatus),
  interactionId: string(),
  isWalletLinked: boolean(),
  isExtensionAvailable: boolean(),
  canHandleSessions: optional(boolean())
});
var MessageLifeCycleEvent = object({
  eventType: union([
    literal(messageLifeCycleEventType.extensionStatus),
    literal(messageLifeCycleEventType.receivedByExtension),
    literal(messageLifeCycleEventType.receivedByWallet),
    literal(messageLifeCycleEventType.requestCancelSuccess),
    literal(messageLifeCycleEventType.requestCancelFail)
  ]),
  interactionId: string()
});
var IncomingMessage = union([
  MessageLifeCycleEvent,
  WalletInteractionResponse
]);
var eventType = {
  outgoingMessage: "radix#chromeExtension#send",
  incomingMessage: "radix#chromeExtension#receive"
};
var Offer = literal("offer");
var Answer = literal("answer");
var IceCandidate = literal("iceCandidate");
var IceCandidates = literal("iceCandidates");
var Types = union([Offer, Answer, IceCandidate, IceCandidates]);
var Sources = union([literal("wallet"), literal("extension")]);
var SignalingServerMessage = object({
  requestId: string(),
  targetClientId: string(),
  encryptedPayload: string(),
  source: optional(Sources),
  // redundant, to be removed
  connectionId: optional(string())
  // redundant, to be removed
});
var AnswerIO = merge3([
  SignalingServerMessage,
  object({
    method: Answer,
    payload: object({
      sdp: string()
    })
  })
]);
var OfferIO = merge3([
  SignalingServerMessage,
  object({
    method: Offer,
    payload: object({
      sdp: string()
    })
  })
]);
var IceCandidatePayloadIO = object({
  candidate: string(),
  sdpMid: string(),
  sdpMLineIndex: number()
});
var IceCandidateIO = merge3([
  SignalingServerMessage,
  object({
    method: IceCandidate,
    payload: IceCandidatePayloadIO
  })
]);
var IceCandidatesIO = merge3([
  SignalingServerMessage,
  object({
    method: IceCandidates,
    payload: array(IceCandidatePayloadIO)
  })
]);
var ErrorType = {
  rejectedByUser: "rejectedByUser",
  missingExtension: "missingExtension",
  canceledByUser: "canceledByUser",
  walletRequestValidation: "walletRequestValidation",
  walletResponseValidation: "walletResponseValidation",
  wrongNetwork: "wrongNetwork",
  failedToPrepareTransaction: "failedToPrepareTransaction",
  failedToCompileTransaction: "failedToCompileTransaction",
  failedToSignTransaction: "failedToSignTransaction",
  failedToSubmitTransaction: "failedToSubmitTransaction",
  failedToPollSubmittedTransaction: "failedToPollSubmittedTransaction",
  submittedTransactionWasDuplicate: "submittedTransactionWasDuplicate",
  submittedTransactionHasFailedTransactionStatus: "submittedTransactionHasFailedTransactionStatus",
  submittedTransactionHasRejectedTransactionStatus: "submittedTransactionHasRejectedTransactionStatus",
  failedToFindAccountWithEnoughFundsToLockFee: "failedToFindAccountWithEnoughFundsToLockFee",
  wrongAccountType: "wrongAccountType",
  unknownWebsite: "unknownWebsite",
  radixJsonNotFound: "radixJsonNotFound",
  unknownDappDefinitionAddress: "unknownDappDefinitionAddress",
  invalidPersona: "invalidPersona"
};
var defaultErrorMessage = (/* @__PURE__ */ new Map()).set(ErrorType.missingExtension, "extension could not be found").set(ErrorType.rejectedByUser, "user rejected request").set(ErrorType.canceledByUser, "user has canceled the request");
var SdkError = (error, interactionId, message, jsError) => ({
  error,
  interactionId,
  message: message || defaultErrorMessage.get(error) || "",
  jsError
});
var validateWalletResponse = (walletResponse) => {
  const fn = Result.fromThrowable(
    (_) => parse(WalletInteractionResponse, _),
    (error) => error
  );
  const result = fn(walletResponse);
  if (result.isErr()) {
    return errAsync(SdkError("walletResponseValidation", "", "Invalid input"));
  } else if (result.isOk()) {
    return result.value.discriminator === "success" ? okAsync(result.value) : errAsync(result.value);
  }
  return errAsync(SdkError("walletResponseValidation", ""));
};
var generateRolaChallenge = () => [...globalThis.crypto.getRandomValues(new Uint8Array(32))].map((x) => x.toString(16).padStart(2, "0")).join("");
var validateRolaChallenge = (challenge) => typeof challenge === "string" && /^[0-9a-f]{64}$/i.test(challenge);
var parseSignedChallenge = (value) => safeParse(SignedChallenge, value);
var ConnectButtonSubjects = () => ({
  onConnect: new Subject(),
  onDisconnect: new Subject(),
  onUpdateSharedAccounts: new Subject(),
  connected: new ReplaySubject(1),
  requestItems: new BehaviorSubject([]),
  onCancelRequestItem: new Subject(),
  onIgnoreTransactionItem: new Subject(),
  accounts: new BehaviorSubject([]),
  onShowPopover: new Subject(),
  status: new BehaviorSubject("default"),
  loggedInTimestamp: new BehaviorSubject(""),
  isMobile: new BehaviorSubject(isMobile()),
  isWalletLinked: new BehaviorSubject(false),
  showPopoverMenu: new BehaviorSubject(false),
  isExtensionAvailable: new BehaviorSubject(false),
  fullWidth: new BehaviorSubject(false),
  activeTab: new BehaviorSubject("sharing"),
  mode: new BehaviorSubject("light"),
  theme: new BehaviorSubject("radix-blue"),
  avatarUrl: new BehaviorSubject(""),
  personaLabel: new BehaviorSubject(""),
  personaData: new BehaviorSubject([]),
  dAppName: new BehaviorSubject(""),
  onLinkClick: new Subject()
});
function number2(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`positive integer expected, not ${n}`);
}
function isBytes3(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytes2(b, ...lengths) {
  if (!isBytes3(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function hash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number2(h.outputLen);
  number2(h.blockLen);
}
function exists2(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output2(out, instance) {
  bytes2(out);
  const min2 = instance.outputLen;
  if (out.length < min2) {
    throw new Error(`digestInto() expects output buffer of length at least ${min2}`);
  }
}
var createView2 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr = (word, shift) => word << 32 - shift | word >>> shift;
var isLE2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function utf8ToBytes3(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes3(data);
  bytes2(data);
  return data;
}
var Hash2 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
var toStr2 = {}.toString;
function wrapConstructor2(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
var HMAC = class extends Hash2 {
  constructor(hash2, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash(hash2);
    const key = toBytes2(_key);
    this.iHash = hash2.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash2.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    exists2(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists2(this);
    bytes2(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
hmac.create = (hash2, key) => new HMAC(hash2, key);
function extract(hash2, ikm, salt) {
  hash(hash2);
  if (salt === void 0)
    salt = new Uint8Array(hash2.outputLen);
  return hmac(hash2, toBytes2(salt), toBytes2(ikm));
}
var HKDF_COUNTER = new Uint8Array([0]);
var EMPTY_BUFFER = new Uint8Array();
function expand2(hash2, prk, info, length = 32) {
  hash(hash2);
  number2(length);
  if (length > 255 * hash2.outputLen)
    throw new Error("Length should be <= 255*HashLen");
  const blocks = Math.ceil(length / hash2.outputLen);
  if (info === void 0)
    info = EMPTY_BUFFER;
  const okm = new Uint8Array(blocks * hash2.outputLen);
  const HMAC2 = hmac.create(hash2, prk);
  const HMACTmp = HMAC2._cloneInto();
  const T = new Uint8Array(HMAC2.outputLen);
  for (let counter = 0; counter < blocks; counter++) {
    HKDF_COUNTER[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
    okm.set(T, hash2.outputLen * counter);
    HMAC2._cloneInto(HMACTmp);
  }
  HMAC2.destroy();
  HMACTmp.destroy();
  T.fill(0);
  HKDF_COUNTER.fill(0);
  return okm.slice(0, length);
}
var hkdf = (hash2, ikm, salt, info, length) => expand2(hash2, extract(hash2, ikm, salt), info, length);
function setBigUint642(view, byteOffset, value, isLE22) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE22);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE22 ? 4 : 0;
  const l = isLE22 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE22);
  view.setUint32(byteOffset + l, wl, isLE22);
}
var Chi = (a, b, c) => a & b ^ ~a & c;
var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
var HashMD2 = class extends Hash2 {
  constructor(blockLen, outputLen, padOffset, isLE22) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE22;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView2(this.buffer);
  }
  update(data) {
    exists2(this);
    const { view, buffer: buffer2, blockLen } = this;
    data = toBytes2(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take2 = Math.min(blockLen - this.pos, len - pos);
      if (take2 === blockLen) {
        const dataView = createView2(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer2.set(data.subarray(pos, pos + take2), this.pos);
      this.pos += take2;
      pos += take2;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists2(this);
    output2(out, this);
    this.finished = true;
    const { buffer: buffer2, view, blockLen, isLE: isLE22 } = this;
    let { pos } = this;
    buffer2[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer2[i] = 0;
    setBigUint642(view, blockLen - 8, BigInt(this.length * 8), isLE22);
    this.process(view, 0);
    const oview = createView2(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE22);
  }
  digest() {
    const { buffer: buffer2, outputLen } = this;
    this.digestInto(buffer2);
    const res = buffer2.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer2);
    return to;
  }
};
var SHA256_K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_IV = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W = new Uint32Array(64);
var SHA256 = class extends HashMD2 {
  constructor() {
    super(64, 32, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var sha256 = wrapConstructor2(() => new SHA256());
var toHex = (input) => import_buffer3.Buffer.from(input).toString("hex");
var Curve25519 = (privateKeyHex = toHex(x25519.utils.randomPrivateKey())) => {
  const getPrivateKey = () => privateKeyHex;
  const x25519Api = {
    getPublicKey: () => toHex(x25519.getPublicKey(privateKeyHex)),
    calculateSharedSecret: (publicKeyHex, dAppDefinitionAddress) => {
      try {
        const sharedSecret = x25519.getSharedSecret(privateKeyHex, publicKeyHex);
        const derived = hkdf(
          sha256,
          sharedSecret,
          import_buffer3.Buffer.from(dAppDefinitionAddress, "utf-8"),
          "RCfM",
          32
        );
        return ok(toHex(derived));
      } catch (error) {
        return err(error);
      }
    }
  };
  const ed25519Api = {
    getPublicKey: () => toHex(ed25519.getPublicKey(privateKeyHex)),
    sign: (messageHex) => {
      try {
        return ok(toHex(ed25519.sign(messageHex, privateKeyHex)));
      } catch (error) {
        return err(error);
      }
    }
  };
  return {
    getPrivateKey,
    x25519: x25519Api,
    ed25519: ed25519Api
  };
};
var bufferToArrayBuffer = (buffer2) => {
  const arrayBuffer = new ArrayBuffer(buffer2.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer2.length; ++i) {
    view[i] = buffer2[i];
  }
  return arrayBuffer;
};
var bufferToUnit8Array = (buffer2) => new Uint8Array(bufferToArrayBuffer(buffer2));
var blake2b = (input) => {
  try {
    return ok(import_blakejs.default.blake2bHex(bufferToUnit8Array(input), void 0, 32)).map(
      (hex) => import_buffer4.Buffer.from(hex, "hex")
    );
  } catch (error) {
    return err(error);
  }
};
var AccountsDataRequestSchema = object({
  numberOfAccounts: NumberOfValues,
  withProof: optional(boolean()),
  reset: optional(boolean())
});
var accounts = () => {
  const defaultValue = {
    numberOfAccounts: { quantifier: "atLeast", quantity: 1 }
  };
  let data = produce(defaultValue, () => {
  });
  const atLeast = (n) => {
    data = produce(data, (draft) => {
      draft.numberOfAccounts.quantifier = "atLeast";
      draft.numberOfAccounts.quantity = n;
    });
    return methods;
  };
  const exactly = (n) => {
    data = produce(data, (draft) => {
      draft.numberOfAccounts.quantifier = "exactly";
      draft.numberOfAccounts.quantity = n;
    });
    return methods;
  };
  const reset = (value = true) => {
    data = produce(data, (draft) => {
      draft.reset = value;
    });
    return methods;
  };
  const withProof = (value = true) => {
    data = produce(data, (draft) => {
      draft.withProof = value;
    });
    return methods;
  };
  const _toObject = () => ({
    accounts: data
  });
  const methods = {
    atLeast,
    exactly,
    withProof,
    reset,
    _toObject
  };
  return methods;
};
var schema = object({
  withProof: optional(boolean())
});
var persona = (initialData = {
  withProof: false
}) => {
  let data = produce(initialData, () => {
  });
  const withProof = (value = true) => {
    data = produce(data, (draft) => {
      draft.withProof = value;
    });
    return methods;
  };
  const _toObject = () => ({
    persona: data
  });
  const methods = {
    withProof,
    _toObject
  };
  return methods;
};
var PersonaDataRequestSchema = partial(
  object({
    fullName: boolean(),
    emailAddresses: NumberOfValues,
    phoneNumbers: NumberOfValues,
    reset: boolean()
  })
);
var personaData = (initialData = {}) => {
  let data = produce(initialData, () => {
  });
  const fullName = (value = true) => {
    data = produce(data, (draft) => {
      draft.fullName = value;
    });
    return methods;
  };
  const createNumberOfValuesOptions = (key) => ({
    atLeast: (n) => {
      data = produce(data, (draft) => {
        draft[key] = { quantifier: "atLeast", quantity: n };
      });
      return methods;
    },
    exactly: (n) => {
      data = produce(data, (draft) => {
        draft[key] = { quantifier: "exactly", quantity: n };
      });
      return methods;
    }
  });
  const emailAddresses = (value = true) => {
    const options = createNumberOfValuesOptions("emailAddresses");
    options.exactly(value ? 1 : 0);
    return methods;
  };
  const phoneNumbers = (value = true) => {
    const options = createNumberOfValuesOptions("phoneNumbers");
    options.exactly(value ? 1 : 0);
    return methods;
  };
  const reset = (value = true) => {
    data = produce(data, (draft) => {
      draft.reset = value;
    });
    return methods;
  };
  const _toObject = () => ({
    personaData: data
  });
  const methods = {
    fullName,
    emailAddresses,
    phoneNumbers,
    reset,
    _toObject
  };
  return methods;
};
var config2 = (data) => {
  const _toObject = () => ({ ...data });
  const methods = {
    _toObject
  };
  return methods;
};
var DataRequestBuilder = {
  accounts,
  personaData,
  persona,
  config: config2
};
var OneTimeDataRequestBuilder = {
  accounts,
  personaData
};
var isDeepEqual = (a, b) => {
  const values = [null, void 0, false, true];
  if (values.includes(a) || values.includes(b) || typeof a === "number" || typeof b === "number") {
    return Object.is(a, b);
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length)
    return false;
  for (const key of aKeys) {
    const value1 = a[key];
    const value2 = b[key];
    const isObjects = isObject2(value1) && isObject2(value2);
    if (isObjects && !isDeepEqual(value1, value2) || !isObjects && value1 !== value2) {
      return false;
    }
  }
  return true;
};
var isObject2 = (x) => {
  return x != null && typeof x === "object";
};
var canDataRequestBeResolvedByRdtState = (dataRequest, state) => {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  if (dataRequest.discriminator === "authorizedRequest") {
    const isReset = ((_a2 = dataRequest.reset) == null ? void 0 : _a2.accounts) || ((_b = dataRequest.reset) == null ? void 0 : _b.personaData);
    const isOneTimeRequest = !!(dataRequest.oneTimeAccounts || dataRequest.oneTimePersonaData);
    const isChallengeRequest = dataRequest.auth.discriminator === "loginWithChallenge" || !!((_c = dataRequest.oneTimeAccounts) == null ? void 0 : _c.challenge) || !!((_d = dataRequest.ongoingAccounts) == null ? void 0 : _d.challenge);
    if (isReset || isOneTimeRequest || isChallengeRequest)
      return false;
    let rdtStateSatisfiesRequest = false;
    if (dataRequest.ongoingAccounts) {
      const { quantifier, quantity } = dataRequest.ongoingAccounts.numberOfAccounts;
      rdtStateSatisfiesRequest = ((_g = (_f = (_e = state.sharedData) == null ? void 0 : _e.ongoingAccounts) == null ? void 0 : _f.numberOfAccounts) == null ? void 0 : _g.quantifier) === quantifier && ((_j = (_i = (_h = state.sharedData) == null ? void 0 : _h.ongoingAccounts) == null ? void 0 : _i.numberOfAccounts) == null ? void 0 : _j.quantity) === quantity;
    }
    if (dataRequest.ongoingPersonaData) {
      rdtStateSatisfiesRequest = isDeepEqual(
        dataRequest.ongoingPersonaData,
        (_k = state.sharedData) == null ? void 0 : _k.ongoingPersonaData
      );
    }
    return rdtStateSatisfiesRequest;
  }
  return false;
};
var TransformRdtDataRequestToWalletRequestInput = object({
  accounts: optional(
    object({
      numberOfAccounts: NumberOfValues,
      reset: boolean(),
      oneTime: boolean(),
      challenge: optional(string())
    })
  ),
  personaData: optional(
    object({
      fullName: optional(boolean()),
      phoneNumbers: optional(NumberOfValues),
      emailAddresses: optional(NumberOfValues),
      reset: boolean(),
      oneTime: optional(boolean())
    })
  ),
  persona: optional(
    object({
      identityAddress: optional(string()),
      label: optional(string()),
      challenge: optional(string())
    })
  )
});
var isAuthorized = (input) => {
  const { persona: persona2, accounts: accounts2, personaData: personaData2 } = input;
  const isPersonaLogin = !!persona2;
  const shouldResetData = (accounts2 == null ? void 0 : accounts2.reset) || (personaData2 == null ? void 0 : personaData2.reset);
  const isOngoingAccountsRequest = accounts2 && !(accounts2 == null ? void 0 : accounts2.oneTime);
  const isOngoingPersonaDataRequest = personaData2 && !(personaData2 == null ? void 0 : personaData2.oneTime);
  const isAuthorizedRequest = !!(shouldResetData || isOngoingAccountsRequest || isOngoingPersonaDataRequest || isPersonaLogin);
  return isAuthorizedRequest;
};
var createLoginRequestItem = (input) => {
  var _a2, _b, _c;
  if ((_a2 = input.persona) == null ? void 0 : _a2.challenge) {
    return {
      discriminator: "loginWithChallenge",
      challenge: input.persona.challenge
    };
  }
  if ((_b = input.persona) == null ? void 0 : _b.identityAddress) {
    return {
      discriminator: "usePersona",
      identityAddress: (_c = input.persona) == null ? void 0 : _c.identityAddress
    };
  }
  return {
    discriminator: "loginWithoutChallenge"
  };
};
var withAccountRequestItem = (input) => (requestItems) => {
  var _a2, _b;
  const updatedRequestItems = { ...requestItems };
  const { accounts: accounts2 } = input;
  if (accounts2) {
    const data = {
      challenge: accounts2.challenge,
      numberOfAccounts: accounts2.numberOfAccounts
    };
    const isOngoingRequest = updatedRequestItems.discriminator === "authorizedRequest" && !((_a2 = input.accounts) == null ? void 0 : _a2.oneTime);
    const isConnectOngoingRequest = updatedRequestItems.discriminator === "authorizedRequest";
    if ((_b = input.accounts) == null ? void 0 : _b.oneTime) {
      updatedRequestItems["oneTimeAccounts"] = data;
    } else if (isOngoingRequest || isConnectOngoingRequest) {
      updatedRequestItems["ongoingAccounts"] = data;
    }
  }
  return updatedRequestItems;
};
var withPersonaDataRequestItem = (input) => (requestItems) => {
  var _a2, _b;
  const updatedRequestItems = { ...requestItems };
  if (input.personaData) {
    const {
      fullName: isRequestingName,
      phoneNumbers: numberOfRequestedPhoneNumbers,
      emailAddresses: numberOfRequestedEmailAddresses
    } = input.personaData;
    if ((_a2 = input.personaData) == null ? void 0 : _a2.oneTime) {
      updatedRequestItems["oneTimePersonaData"] = {
        isRequestingName,
        numberOfRequestedPhoneNumbers,
        numberOfRequestedEmailAddresses
      };
    }
    const isOngoingRequest = updatedRequestItems.discriminator === "authorizedRequest" && !((_b = input.personaData) == null ? void 0 : _b.oneTime);
    const isConnectOngoingRequest = updatedRequestItems.discriminator === "authorizedRequest";
    if (isOngoingRequest || isConnectOngoingRequest) {
      updatedRequestItems["ongoingPersonaData"] = {
        isRequestingName,
        numberOfRequestedPhoneNumbers,
        numberOfRequestedEmailAddresses
      };
    }
  }
  return updatedRequestItems;
};
var withResetRequestItem = (input) => (requestItems) => {
  const { accounts: accounts2, personaData: personaData2 } = input;
  return {
    ...requestItems,
    reset: { accounts: !!(accounts2 == null ? void 0 : accounts2.reset), personaData: !!(personaData2 == null ? void 0 : personaData2.reset) }
  };
};
var createUnauthorizedRequestItems = (input) => ok({
  discriminator: "unauthorizedRequest"
}).map(withAccountRequestItem(input)).map(withPersonaDataRequestItem(input));
var createAuthorizedRequestItems = (input) => ok({
  discriminator: "authorizedRequest",
  auth: createLoginRequestItem(input)
}).map(withAccountRequestItem(input)).map(withPersonaDataRequestItem(input)).map(withResetRequestItem(input));
var transformConnectRequest = (isConnect, input) => ok(
  isConnect ? produce(input, (draft) => {
    if (draft.accounts) {
      draft.accounts.oneTime = false;
      draft.accounts.reset = false;
    }
    if (draft.personaData) {
      draft.personaData.oneTime = false;
      draft.personaData.reset = false;
    }
  }) : input
);
var transformRdtDataRequestToWalletRequest = (isConnect, input) => transformConnectRequest(isConnect, input).andThen(
  (transformed) => isAuthorized(transformed) ? createAuthorizedRequestItems(transformed) : createUnauthorizedRequestItems(transformed)
);
var toWalletRequest = ({
  dataRequestState,
  isConnect,
  challenge,
  oneTime,
  walletData
}) => transformRdtDataRequestToWalletRequest(
  isConnect,
  produce({}, (draft) => {
    var _a2;
    if (dataRequestState.accounts) {
      draft.accounts = {
        numberOfAccounts: dataRequestState.accounts.numberOfAccounts || {
          quantifier: "atLeast",
          quantity: 1
        },
        oneTime,
        reset: !!dataRequestState.accounts.reset,
        challenge: dataRequestState.accounts.withProof ? challenge : void 0
      };
    }
    if (dataRequestState.personaData)
      draft.personaData = {
        ...dataRequestState.personaData,
        reset: !!dataRequestState.personaData.reset,
        oneTime
      };
    if (!oneTime) {
      const persona2 = walletData.persona;
      if (walletData.persona)
        draft.persona = persona2;
      if ((_a2 = dataRequestState.persona) == null ? void 0 : _a2.withProof)
        draft.persona = { ...draft.persona ?? {}, challenge };
      if (Object.values(dataRequestState).length === 0)
        draft.persona = { challenge: void 0 };
    }
  })
);
var transformWalletRequestToSharedData = (walletInteraction, sharedData) => {
  const { items: walletDataRequest } = walletInteraction;
  if (walletDataRequest.discriminator === "authorizedRequest")
    return produce({}, (draft) => {
      draft.persona = { proof: false };
      if (walletDataRequest.auth.discriminator === "loginWithChallenge")
        draft.persona.proof = !!walletDataRequest.auth.challenge;
      if (walletDataRequest.ongoingAccounts) {
        draft.ongoingAccounts = {
          proof: !!walletDataRequest.ongoingAccounts.challenge,
          numberOfAccounts: walletDataRequest.ongoingAccounts.numberOfAccounts
        };
      }
      if (walletDataRequest.ongoingPersonaData) {
        draft.ongoingPersonaData = walletDataRequest.ongoingPersonaData;
      }
    });
  return sharedData;
};
var transformSharedDataToDataRequestState = (sharedData) => produce({}, (draft) => {
  if (sharedData.ongoingAccounts) {
    draft.accounts = {
      numberOfAccounts: sharedData.ongoingAccounts.numberOfAccounts,
      withProof: sharedData.ongoingAccounts.proof,
      reset: true
    };
  }
  if (sharedData.ongoingPersonaData) {
    draft.personaData = {
      fullName: sharedData.ongoingPersonaData.isRequestingName,
      phoneNumbers: sharedData.ongoingPersonaData.numberOfRequestedPhoneNumbers,
      emailAddresses: sharedData.ongoingPersonaData.numberOfRequestedEmailAddresses,
      reset: false
    };
  }
  if (sharedData.persona) {
    draft.persona = {
      withProof: false
    };
  }
});
var proofType = {
  persona: "persona",
  account: "account"
};
var SignedChallengePersona = object({
  challenge: string(),
  proof: Proof,
  address: string(),
  type: literal(proofType.persona)
});
var SignedChallengeAccount = object({
  challenge: string(),
  proof: Proof,
  address: string(),
  type: literal(proofType.account)
});
var SignedChallenge = variant("type", [
  SignedChallengePersona,
  SignedChallengeAccount
]);
var WalletDataPersonaDataFullName = object({
  entry: literal("fullName"),
  fields: PersonaDataName
});
var WalletDataPersonaDataEmailAddresses = object({
  entry: literal("emailAddresses"),
  fields: array(string())
});
var WalletDataPersonaDataPhoneNumbersAddresses = object({
  entry: literal("phoneNumbers"),
  fields: array(string())
});
var WalletDataPersonaData = variant("entry", [
  WalletDataPersonaDataFullName,
  WalletDataPersonaDataEmailAddresses,
  WalletDataPersonaDataPhoneNumbersAddresses
]);
var WalletData = object({
  accounts: array(Account),
  personaData: array(WalletDataPersonaData),
  persona: optional(Persona),
  proofs: array(SignedChallenge)
});
var SharedData = object({
  persona: optional(object({ proof: boolean() })),
  ongoingAccounts: optional(
    object({
      numberOfAccounts: optional(NumberOfValues),
      proof: boolean()
    })
  ),
  ongoingPersonaData: optional(PersonaDataRequestItem)
});
var RdtState = object({
  loggedInTimestamp: string(),
  walletData: WalletData,
  sharedData: SharedData
});
var walletDataDefault = {
  accounts: [],
  personaData: [],
  proofs: [],
  persona: void 0
};
var StateModule = (input) => {
  var _a2;
  const logger = (_a2 = input == null ? void 0 : input.logger) == null ? void 0 : _a2.getSubLogger({ name: "StateModule" });
  const storageModule = input.providers.storageModule;
  const subscriptions = new Subscription();
  const setState = (state) => storageModule.setState(state);
  const getState = () => storageModule.getState().orElse(() => okAsync(defaultState)).andThen((state) => state ? ok(state) : ok(defaultState));
  const patchState = (state) => getState().andThen((oldState) => setState({ ...oldState, ...state }));
  const defaultState = {
    walletData: walletDataDefault,
    loggedInTimestamp: "",
    sharedData: {}
  };
  const resetState = () => storageModule.setState(defaultState).map(() => {
    emitWalletData();
  });
  const initializeState = () => getState().map(() => emitWalletData()).orElse(() => resetState());
  initializeState();
  const walletDataSubject = new BehaviorSubject(
    void 0
  );
  const emitWalletData = () => {
    storageModule.getState().map((state) => {
      walletDataSubject.next(state == null ? void 0 : state.walletData);
    });
  };
  const walletData$ = walletDataSubject.asObservable().pipe(filter((walletData) => !!walletData));
  return {
    setState,
    patchState,
    getState,
    walletData$,
    emitWalletData,
    getWalletData: () => walletDataSubject.value,
    reset: resetState,
    storage$: storageModule.storage$,
    destroy: () => {
      subscriptions.unsubscribe();
    }
  };
};
var withAccounts = (input) => (walletData) => {
  var _a2, _b, _c;
  let accounts2 = [];
  if (input.discriminator === "authorizedRequest") {
    const oneTimeAccounts = ((_a2 = input.oneTimeAccounts) == null ? void 0 : _a2.accounts) ?? [];
    const ongoingAccounts = ((_b = input.ongoingAccounts) == null ? void 0 : _b.accounts) ?? [];
    accounts2 = [...oneTimeAccounts, ...ongoingAccounts];
  } else if (input.discriminator === "unauthorizedRequest") {
    const oneTimeAccounts = ((_c = input.oneTimeAccounts) == null ? void 0 : _c.accounts) ?? [];
    accounts2 = oneTimeAccounts;
  }
  return produce(walletData, (draft) => {
    draft.accounts = accounts2;
  });
};
var withPersonaDataEntries = (input) => {
  const entries = [];
  if (input.name) {
    entries.push({
      entry: "fullName",
      fields: input.name
    });
  }
  if (input.emailAddresses)
    entries.push({
      entry: "emailAddresses",
      fields: input.emailAddresses
    });
  if (input.phoneNumbers)
    entries.push({
      entry: "phoneNumbers",
      fields: input.phoneNumbers
    });
  return entries;
};
var withPersonaData = (input) => (walletData) => produce(walletData, (draft) => {
  if (input.discriminator === "authorizedRequest") {
    if (input.oneTimePersonaData)
      draft.personaData = withPersonaDataEntries(input.oneTimePersonaData);
    if (input.ongoingPersonaData)
      draft.personaData = withPersonaDataEntries(input.ongoingPersonaData);
  } else if (input.discriminator === "unauthorizedRequest" && input.oneTimePersonaData)
    draft.personaData = withPersonaDataEntries(input.oneTimePersonaData);
});
var withPersona = (input) => (walletData) => produce(walletData, (draft) => {
  var _a2;
  if (input.discriminator === "authorizedRequest")
    draft.persona = (_a2 = input.auth) == null ? void 0 : _a2.persona;
});
var withProofs = (input) => (walletData) => produce(walletData, (draft) => {
  var _a2, _b, _c, _d, _e, _f;
  draft.proofs = [];
  if (input.discriminator === "authorizedRequest") {
    if (input.auth.discriminator === "loginWithChallenge")
      draft.proofs.push({
        challenge: input.auth.challenge,
        proof: input.auth.proof,
        address: input.auth.persona.identityAddress,
        type: proofType.persona
      });
    if (((_a2 = input.ongoingAccounts) == null ? void 0 : _a2.challenge) && ((_b = input.ongoingAccounts.proofs) == null ? void 0 : _b.length)) {
      const challenge = input.ongoingAccounts.challenge;
      const accountProofs = input.ongoingAccounts.proofs.map(
        ({ accountAddress, proof }) => ({
          proof,
          address: accountAddress,
          challenge,
          type: proofType.account
        })
      );
      draft.proofs.push(...accountProofs);
    }
    if (((_c = input.oneTimeAccounts) == null ? void 0 : _c.challenge) && ((_d = input.oneTimeAccounts.proofs) == null ? void 0 : _d.length)) {
      const challenge = input.oneTimeAccounts.challenge;
      const accountProofs = input.oneTimeAccounts.proofs.map(
        ({ accountAddress, proof }) => ({
          proof,
          address: accountAddress,
          challenge,
          type: proofType.account
        })
      );
      draft.proofs.push(...accountProofs);
    }
  }
  if (input.discriminator === "unauthorizedRequest") {
    if (((_e = input.oneTimeAccounts) == null ? void 0 : _e.challenge) && ((_f = input.oneTimeAccounts.proofs) == null ? void 0 : _f.length)) {
      const challenge = input.oneTimeAccounts.challenge;
      const accountProofs = input.oneTimeAccounts.proofs.map(
        ({ accountAddress, proof }) => ({
          proof,
          address: accountAddress,
          challenge,
          type: proofType.account
        })
      );
      draft.proofs.push(...accountProofs);
    }
  }
});
var transformWalletResponseToRdtWalletData = (response) => okAsync({
  accounts: [],
  personaData: [],
  proofs: [],
  persona: void 0
}).map(withAccounts(response)).map(withPersonaData(response)).map(withPersona(response)).map(withProofs(response));
var transformWalletDataToConnectButton = (walletData) => {
  var _a2, _b;
  const accounts2 = walletData.accounts ?? [];
  const personaLabel = ((_a2 = walletData == null ? void 0 : walletData.persona) == null ? void 0 : _a2.label) ?? "";
  const connected = !!(walletData == null ? void 0 : walletData.persona);
  const personaData2 = (_b = walletData == null ? void 0 : walletData.personaData) == null ? void 0 : _b.map((item) => {
    if (item.entry === "fullName") {
      const { variant: variant2, givenNames, familyName, nickname } = item.fields;
      const value = variant2 === "western" ? `${givenNames}${nickname ? ` "${nickname}" ` : " "}${familyName}` : `${familyName}${nickname ? ` "${nickname}" ` : " "}${givenNames}`;
      return {
        value,
        field: "fullName"
      };
    } else if (item.entry === "emailAddresses") {
      return {
        // currently only one email address is supported
        value: item.fields[0],
        field: "emailAddress"
      };
    } else if (item.entry === "phoneNumbers") {
      return {
        // currently only one phone number is supported
        value: item.fields[0],
        field: "phoneNumber"
      };
    }
    return;
  }).filter(
    (item) => {
      var _a3;
      return !!item && !!((_a3 = item.value) == null ? void 0 : _a3.trim());
    }
  );
  return { accounts: accounts2, personaLabel, connected, personaData: personaData2 };
};
var DataRequestStateModule = (initialState) => {
  const state = new BehaviorSubject(initialState);
  const reset = () => state.next(initialState);
  const update = (input) => state.next(input);
  const getState = () => state.getValue();
  const toDataRequestState = (...items) => items.filter((item) => typeof item._toObject === "function").reduce(
    (acc, item) => ({
      ...acc,
      ...item._toObject()
    }),
    {}
  );
  const setState = (...items) => {
    if (items.length === 0)
      reset();
    else {
      update(toDataRequestState(...items));
    }
  };
  const patchState = (...items) => {
    if (items.length === 0)
      return;
    update({ ...getState(), ...toDataRequestState(...items) });
  };
  const removeState = (...keys) => {
    update(
      produce(getState(), (draft) => {
        keys.forEach((key) => {
          delete draft[key];
        });
      })
    );
  };
  return {
    reset,
    setState,
    getState,
    patchState,
    removeState,
    toDataRequestState,
    state$: state.asObservable()
  };
};
var createSignatureMessage = ({
  interactionId,
  dAppDefinitionAddress,
  origin,
  logger
}) => {
  const prefix = "C";
  const prefixBuffer = import_buffer5.Buffer.from("C", "ascii");
  const lengthOfDappDefAddress = dAppDefinitionAddress.length;
  const lengthOfDappDefAddressBuffer = import_buffer5.Buffer.from(
    lengthOfDappDefAddress.toString(16),
    "hex"
  );
  const dappDefAddressBuffer = import_buffer5.Buffer.from(dAppDefinitionAddress, "utf-8");
  const originBuffer = import_buffer5.Buffer.from(origin, "utf-8");
  const interactionIdBuffer = import_buffer5.Buffer.from(interactionId, "utf-8");
  const messageBuffer = import_buffer5.Buffer.concat([
    prefixBuffer,
    interactionIdBuffer,
    lengthOfDappDefAddressBuffer,
    dappDefAddressBuffer,
    originBuffer
  ]);
  const blake2bHash = blake2b(messageBuffer).map((hash2) => {
    logger == null ? void 0 : logger.debug({
      method: "createSignatureMessage",
      messagePartsRaw: [
        prefix,
        interactionId,
        lengthOfDappDefAddress,
        dAppDefinitionAddress,
        origin
      ],
      messageParts: [
        prefixBuffer.toString("hex"),
        interactionIdBuffer.toString("hex"),
        lengthOfDappDefAddressBuffer.toString("hex"),
        dappDefAddressBuffer.toString("hex"),
        originBuffer.toString("hex")
      ],
      message: messageBuffer.toString("hex"),
      blake2bHash: hash2.toString("hex")
    });
    return import_buffer5.Buffer.from(hash2).toString("hex");
  }).mapErr((jsError) => ({ reason: "couldNotHashMessage", jsError }));
  return blake2bHash;
};
var IdentityKind = {
  dApp: "dApp"
};
var IdentityModule = (input) => {
  const { storageModule, KeyPairModule } = input.providers;
  const keyPairFromSecret = (input2) => ok(KeyPairModule(input2));
  const getIdentity = (kind) => storageModule.getItemById(kind).andThen(
    (identity2) => identity2 ? keyPairFromSecret(identity2.secret) : okAsync(void 0)
  );
  const createIdentity = (kind) => ok(KeyPairModule()).asyncAndThen(
    (keyPair) => storageModule.setItems({
      [kind]: {
        secret: keyPair.getPrivateKey(),
        createdAt: Date.now()
      }
    }).map(() => keyPair)
  );
  const getOrCreateIdentity = (kind) => getIdentity(kind).andThen((keyPair) => keyPair ? okAsync(keyPair) : createIdentity(kind)).mapErr((error) => ({
    reason: "couldNotGetOrCreateIdentity",
    jsError: error
  }));
  const deriveSharedSecret = (kind, publicKey) => getIdentity(kind).mapErr(() => ({ reason: "couldNotDeriveSharedSecret" })).andThen(
    (identity2) => identity2 ? identity2.x25519.calculateSharedSecret(publicKey, input.dAppDefinitionAddress).mapErr(() => ({
      reason: "FailedToDeriveSharedSecret"
    })) : err({ reason: "DappIdentityNotFound" })
  );
  const createSignature = ({
    kind,
    interactionId,
    dAppDefinitionAddress,
    origin
  }) => getOrCreateIdentity(kind).andThen(
    (identity2) => createSignatureMessage({
      interactionId,
      dAppDefinitionAddress,
      origin,
      logger: input.logger
    }).andThen(
      (message) => identity2.ed25519.sign(message).map((signature) => ({
        signature,
        publicKey: identity2.x25519.getPublicKey(),
        identity: identity2.ed25519.getPublicKey()
      })).mapErr((error) => ({
        reason: "couldNotSignMessage",
        jsError: error
      }))
    )
  );
  return {
    get: (kind) => getOrCreateIdentity(kind),
    deriveSharedSecret,
    createSignature
  };
};
var RequestStatus = {
  pending: "pending",
  success: "success",
  fail: "fail",
  cancelled: "cancelled",
  ignored: "ignored"
};
var RequestItemModule = (input) => {
  var _a2;
  const logger = (_a2 = input == null ? void 0 : input.logger) == null ? void 0 : _a2.getSubLogger({ name: "RequestItemModule" });
  const subscriptions = new Subscription();
  const storageModule = input.providers.storageModule;
  const createItem = ({
    type,
    walletInteraction,
    isOneTimeRequest
  }) => ({
    type,
    status: "pending",
    createdAt: Date.now(),
    interactionId: walletInteraction.interactionId,
    showCancel: true,
    walletInteraction,
    isOneTimeRequest
  });
  const add2 = (value) => {
    const item = createItem(value);
    logger == null ? void 0 : logger.debug({
      method: "addRequestItem",
      item
    });
    return storageModule.setItems({ [item.interactionId]: item }).map(() => item);
  };
  const patch = (id, partialValue) => {
    logger == null ? void 0 : logger.debug({
      method: "patchRequestItemStatus",
      item: { id, ...partialValue }
    });
    return storageModule.patchItem(id, partialValue);
  };
  const cancel = (id) => {
    logger == null ? void 0 : logger.debug({ method: "cancelRequestItem", id });
    return patch(id, { status: "fail", error: ErrorType.canceledByUser });
  };
  const updateStatus = ({
    id,
    status,
    error,
    transactionIntentHash
  }) => {
    return storageModule.getItemById(id).mapErr(() => ({ reason: "couldNotReadFromStore" })).andThen((item) => {
      if (item) {
        const updated = {
          ...item,
          status: item.status === RequestStatus.ignored ? item.status : status
        };
        if (updated.status === "fail") {
          updated.error = error;
        }
        if (updated.status === "success" && updated.type === "sendTransaction") {
          updated.transactionIntentHash = transactionIntentHash;
        }
        if (["success", "fail", "ignored", "cancelled"].includes(updated.status)) {
          delete updated.walletInteraction;
          delete updated.walletResponse;
        }
        logger == null ? void 0 : logger.debug({ method: "updateRequestItemStatus", updated });
        return storageModule.setItems({ [id]: updated }).mapErr(() => ({ reason: "couldNotWriteToStore" }));
      }
      return errAsync({ reason: "itemNotFound" });
    });
  };
  const getPending = () => storageModule.getItemList().map((items) => items.filter((item) => item.status === "pending"));
  const requests$ = storageModule.storage$.pipe(
    switchMap(() => storageModule.getItemList()),
    map((result) => {
      if (result.isOk())
        return result.value;
    }),
    filter((items) => !!items)
  );
  return {
    add: add2,
    cancel,
    updateStatus,
    patch,
    getById: (id) => storageModule.getItemById(id),
    getPending,
    requests$,
    clear: storageModule.clear,
    destroy: () => {
      subscriptions.unsubscribe();
    }
  };
};
var SessionModule = (input) => {
  const storageModule = input.providers.storageModule;
  const getSession = () => storageModule.getItemList().mapErr((error) => ({
    reason: "couldNotReadSessionFromStore",
    jsError: error
  })).map((sessions) => sessions[0]);
  const getSessionById = (sessionId) => storageModule.getItemById(sessionId).mapErr((error) => ({ reason: "couldNotGetSessionById", jsError: error }));
  const createSession = () => {
    const sessionId = v4_default();
    const newSession = {
      sessionId,
      createdAt: Date.now()
    };
    return storageModule.setItems({ [sessionId]: newSession }).map(() => newSession).mapErr((error) => ({ reason: "couldNotCreateSession", jsError: error }));
  };
  const patchSession = (sessionId, value) => storageModule.patchItem(sessionId, value).mapErr((error) => ({ reason: "couldNotPatchSession", jsError: error }));
  const getCurrentSession = () => getSession().andThen(
    (session) => session ? okAsync(session) : createSession()
  );
  return {
    getCurrentSession,
    getSession,
    store: storageModule,
    getSessionById,
    patchSession
  };
};
var ConnectorExtensionSubjects = () => ({
  outgoingMessageSubject: new Subject(),
  incomingMessageSubject: new Subject(),
  responseSubject: new Subject(),
  messageLifeCycleEventSubject: new Subject()
});
var ConnectorExtensionModule = (input) => {
  var _a2;
  let isExtensionHandlingSessions = false;
  const logger = (_a2 = input == null ? void 0 : input.logger) == null ? void 0 : _a2.getSubLogger({
    name: "ConnectorExtensionModule"
  });
  const subjects = (input == null ? void 0 : input.subjects) ?? ConnectorExtensionSubjects();
  const subscription = new Subscription();
  const extensionDetectionTime = (input == null ? void 0 : input.extensionDetectionTime) ?? 200;
  const requestItemModule = input.providers.requestItemModule;
  const storage = input.providers.storageModule.getPartition("connectorExtension");
  subscription.add(
    subjects.incomingMessageSubject.pipe(
      tap((message) => {
        logger == null ? void 0 : logger.debug({
          method: "incomingMessageSubject",
          message
        });
        if ("eventType" in message) {
          subjects.messageLifeCycleEventSubject.next(message);
        } else {
          subjects.responseSubject.next(message);
        }
      })
    ).subscribe()
  );
  subscription.add(
    subjects.outgoingMessageSubject.pipe(
      tap((payload) => {
        logger == null ? void 0 : logger.debug({
          method: "outgoingMessageSubject",
          payload
        });
        window.dispatchEvent(
          new CustomEvent(eventType.outgoingMessage, {
            detail: payload
          })
        );
      })
    ).subscribe()
  );
  const wrapOutgoingInteraction = (interaction) => {
    if (!isExtensionHandlingSessions) {
      return okAsync(interaction);
    }
    return storage.getState().andThen((state) => {
      const isAuthorizedRequest = interaction.items.discriminator === "authorizedRequest";
      const sessionId = isAuthorizedRequest ? (state == null ? void 0 : state.sessionId) || v4_default() : state == null ? void 0 : state.sessionId;
      const wrappedRequest = {
        interactionId: interaction.interactionId,
        interaction,
        sessionId,
        discriminator: "walletInteraction"
      };
      return isAuthorizedRequest ? storage.setState({ sessionId }).map(() => wrappedRequest) : okAsync(wrappedRequest);
    });
  };
  const handleIncomingMessage = (event) => {
    const message = event.detail;
    subjects.incomingMessageSubject.next(message);
  };
  addEventListener(eventType.incomingMessage, handleIncomingMessage);
  const sendWalletInteraction = (walletInteraction, callbackFns) => {
    const cancelRequestSubject = new Subject();
    const walletResponse$ = subjects.responseSubject.pipe(
      filter(
        (response) => response.interactionId === walletInteraction.interactionId
      ),
      mergeMap(
        (walletResponse) => requestItemModule.patch(walletResponse.interactionId, {
          walletResponse
        }).mapErr(
          () => SdkError("requestItemPatchError", walletResponse.interactionId)
        ).map(() => walletResponse)
      )
    );
    const cancelResponse$ = subjects.messageLifeCycleEventSubject.pipe(
      filter(
        ({ interactionId, eventType: eventType2 }) => walletInteraction.interactionId === interactionId && ["requestCancelSuccess", "requestCancelFail"].includes(eventType2)
      ),
      map((message) => {
        const error = SdkError("canceledByUser", message.interactionId);
        logger == null ? void 0 : logger.debug(`🔵⬆️❌ walletRequestCanceled`, error);
        return message;
      })
    );
    const sendCancelRequest = () => {
      subjects.outgoingMessageSubject.next({
        interactionId: walletInteraction.interactionId,
        metadata: walletInteraction.metadata,
        ...isExtensionHandlingSessions ? { discriminator: "cancelWalletInteraction" } : { items: { discriminator: "cancelRequest" } }
      });
      setTimeout(() => {
        cancelRequestSubject.next(
          err(SdkError("canceledByUser", walletInteraction.interactionId))
        );
      });
      return ResultAsync.fromSafePromise(
        firstValueFrom(
          merge(
            walletResponse$.pipe(map(() => "requestCancelFail")),
            cancelResponse$.pipe(map(({ eventType: eventType2 }) => eventType2))
          )
        )
      );
    };
    if (callbackFns.requestControl)
      callbackFns.requestControl({
        cancelRequest: () => sendCancelRequest().andThen(
          (eventType2) => eventType2 === "requestCancelSuccess" ? ok("requestCancelSuccess") : err("requestCancelFail")
        ),
        getRequest: () => walletInteraction
      });
    const walletResponseOrCancelRequest$ = merge(
      walletResponse$,
      cancelRequestSubject
    ).pipe(first());
    const messageLifeCycleEvent$ = subjects.messageLifeCycleEventSubject.pipe(
      filter(
        ({ interactionId }) => walletInteraction.interactionId === interactionId
      ),
      tap((event) => {
        if (callbackFns.eventCallback)
          callbackFns.eventCallback(event.eventType);
      }),
      takeUntil(walletResponse$),
      share()
    );
    const messageEventSubscription = messageLifeCycleEvent$.subscribe();
    const missingExtensionError$ = timer(extensionDetectionTime).pipe(
      map(
        () => err(SdkError("missingExtension", walletInteraction.interactionId))
      )
    );
    const extensionMissingError$ = merge(
      missingExtensionError$,
      messageLifeCycleEvent$
    ).pipe(
      first(),
      filter((value) => !("eventType" in value))
    );
    const sendWalletRequest$ = extensionStatus$.pipe(
      filter((status) => status.isExtensionAvailable),
      switchMap(() => of(wrapOutgoingInteraction(walletInteraction))),
      tap((result) => {
        result.map((message) => {
          subjects.outgoingMessageSubject.next(message);
        });
      }),
      filter((_) => false)
    );
    return unwrapObservable(
      merge(
        walletResponseOrCancelRequest$,
        extensionMissingError$,
        sendWalletRequest$
      ).pipe(
        tap(() => {
          messageEventSubscription.unsubscribe();
        })
      )
    );
  };
  const extensionStatusEvent$ = subjects.messageLifeCycleEventSubject.pipe(
    filter(
      (event) => event.eventType === "extensionStatus"
    )
  );
  const extensionStatus$ = of(true).pipe(
    tap(() => {
      subjects.outgoingMessageSubject.next({
        interactionId: v4_default(),
        discriminator: "extensionStatus"
      });
    }),
    switchMap(
      () => race(
        extensionStatusEvent$,
        merge(
          extensionStatusEvent$,
          timer(extensionDetectionTime).pipe(
            map(
              () => ({
                eventType: "extensionStatus",
                isWalletLinked: false,
                isExtensionAvailable: false,
                canHandleSessions: false
              })
            )
          )
        )
      )
    ),
    tap((event) => {
      isExtensionHandlingSessions = event.canHandleSessions || false;
    }),
    shareReplay(1)
  );
  return {
    id: "connector-extension",
    isSupported: () => !isMobile(),
    send: sendWalletInteraction,
    isAvailable$: extensionStatus$.pipe(
      map(({ isExtensionAvailable }) => isExtensionAvailable)
    ),
    isLinked$: extensionStatus$.pipe(
      map(({ isWalletLinked }) => isWalletLinked)
    ),
    showQrCode: () => {
      window.dispatchEvent(
        new CustomEvent(eventType.outgoingMessage, {
          detail: { discriminator: "openPopup" }
        })
      );
    },
    disconnect: () => {
      storage.clear();
    },
    destroy: () => {
      subscription.unsubscribe();
      removeEventListener(eventType.incomingMessage, handleIncomingMessage);
    }
  };
};
var DeepLinkModule = (input) => {
  var _a2;
  const { walletUrl } = input;
  const userAgent = bowser_default.parse(window.navigator.userAgent);
  const { platform } = userAgent;
  const logger = (_a2 = input == null ? void 0 : input.logger) == null ? void 0 : _a2.getSubLogger({ name: "DeepLinkModule" });
  logger == null ? void 0 : logger.debug({
    platform,
    userAgent: window.navigator.userAgent,
    userAgentParsed: userAgent
  });
  const deepLinkToWallet = (values) => {
    var _a3;
    const outboundUrl = new URL(walletUrl);
    Object.entries(values).forEach(([key, value]) => {
      outboundUrl.searchParams.append(key, value);
    });
    logger == null ? void 0 : logger.debug({
      method: "deepLinkToWallet",
      data: { ...values }
    });
    if (isMobile() && ((_a3 = globalThis.location) == null ? void 0 : _a3.href)) {
      globalThis.location.href = outboundUrl.toString();
      return okAsync(void 0);
    }
    return errAsync(SdkError("UnhandledEnvironment", ""));
  };
  return {
    deepLinkToWallet
  };
};
var createBufferReader = (buffer2) => {
  let offset = 0;
  let bytesLeftToRead = buffer2.length;
  const readNextBuffer = (byteCount) => {
    if (byteCount < 0)
      return err(Error(`'byteCount' must not be negative`));
    if (byteCount === 0) {
      return ok(import_buffer6.Buffer.alloc(0));
    }
    if (offset + byteCount > buffer2.length)
      return err(Error(`Out of buffer's boundary`));
    const bufToReturn = import_buffer6.Buffer.alloc(byteCount);
    buffer2.copy(bufToReturn, 0, offset, offset + byteCount);
    if (bufToReturn.length !== byteCount) {
      return err(Error(`Incorrect length of newly read buffer...`));
    }
    offset += byteCount;
    bytesLeftToRead -= byteCount;
    return ok(bufToReturn);
  };
  const finishedParsing = () => {
    if (bytesLeftToRead < 0) {
      return err(Error(`Incorrect implementation, read too many bytes.`));
    }
    return ok(bytesLeftToRead === 0);
  };
  return {
    readNextBuffer,
    finishedParsing,
    remainingBytes: () => finishedParsing().andThen((finished) => {
      if (finished)
        return ok(import_buffer6.Buffer.alloc(0));
      const leftBuf = import_buffer6.Buffer.alloc(bytesLeftToRead);
      buffer2.copy(leftBuf, 0, offset);
      return ok(leftBuf);
    })
  };
};
var readBuffer = (buffer2) => createBufferReader(buffer2).readNextBuffer;
var combineSealboxToBuffer = ({
  iv,
  ciphertext,
  authTag
}) => import_buffer7.Buffer.concat([iv, ciphertext, authTag]);
var combineCiphertextAndAuthtag = ({
  ciphertext,
  authTag
}) => import_buffer7.Buffer.concat([ciphertext, authTag]);
var transformBufferToSealbox = (buffer2) => {
  const readNextBuffer = readBuffer(buffer2);
  const nonceLength = 12;
  const authTagLength = 16;
  return Result.combine([
    readNextBuffer(nonceLength),
    readNextBuffer(buffer2.length - nonceLength - authTagLength),
    readNextBuffer(authTagLength)
  ]).map(([iv, ciphertext, authTag]) => ({
    iv,
    ciphertext,
    authTag,
    combined: combineSealboxToBuffer({ iv, ciphertext, authTag }),
    ciphertextAndAuthTag: combineCiphertextAndAuthtag({
      ciphertext,
      authTag
    })
  }));
};
var EncryptionModule = () => {
  const cryptoDecrypt = (data, encryptionKey, iv) => ResultAsync.fromPromise(
    crypto.subtle.decrypt({ name: "AES-GCM", iv }, encryptionKey, data),
    typedError
  ).map(import_buffer8.Buffer.from);
  const cryptoEncrypt = (data, encryptionKey, iv) => ResultAsync.fromPromise(
    crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      encryptionKey,
      data
    ),
    typedError
  ).map(import_buffer8.Buffer.from);
  const getKey = (encryptionKey) => ResultAsync.fromPromise(
    crypto.subtle.importKey(
      "raw",
      encryptionKey,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["encrypt", "decrypt"]
    ),
    typedError
  );
  const combineIVandCipherText = (iv, ciphertext) => import_buffer8.Buffer.concat([iv, ciphertext]);
  const decrypt = (data, encryptionKey, iv) => getKey(encryptionKey).andThen(
    (cryptoKey) => cryptoDecrypt(data, cryptoKey, iv)
  );
  const encrypt = (data, encryptionKey, iv = createIV()) => getKey(encryptionKey).andThen((cryptoKey) => cryptoEncrypt(data, cryptoKey, iv)).map((ciphertext) => ({
    combined: combineIVandCipherText(iv, ciphertext),
    iv,
    ciphertext
  }));
  const createIV = () => import_buffer8.Buffer.from(crypto.getRandomValues(new Uint8Array(12)));
  return { encrypt, decrypt, createIV };
};
var RadixConnectRelayApiService = (input) => {
  var _a2;
  const baseUrl = input.baseUrl;
  const logger = (_a2 = input.logger) == null ? void 0 : _a2.getSubLogger({ name: "RadixConnectRelayApi" });
  const callApi = (body) => {
    logger == null ? void 0 : logger.debug({ method: `callApi.${body.method}`, body });
    return fetchWrapper(
      fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(body)
      })
    ).map((response) => {
      logger == null ? void 0 : logger.debug({
        method: `callApi.${body.method}.success`,
        response
      });
      return response;
    }).mapErr((error) => {
      logger == null ? void 0 : logger.debug({
        method: `callApi.${body.method}.error`,
        error
      });
      return SdkError(
        "RadixConnectRelayRequestFailed",
        body.interactionId ?? ""
      );
    });
  };
  const getResponses = (sessionId) => callApi({
    method: "getResponses",
    sessionId
  }).map((value) => value.data);
  return {
    getResponses
  };
};
var base64urlEncode = (value) => import_base64url.default.encode(Buffer.from(JSON.stringify(value)));
var RadixConnectRelayModule = (input) => {
  var _a2;
  const logger = (_a2 = input.logger) == null ? void 0 : _a2.getSubLogger({ name: "RadixConnectRelayModule" });
  const { baseUrl, providers, walletUrl } = input;
  const { requestItemModule, storageModule } = providers;
  const walletResponses = storageModule.getPartition("walletResponses");
  const encryptionModule = (providers == null ? void 0 : providers.encryptionModule) ?? EncryptionModule();
  const deepLinkModule = (providers == null ? void 0 : providers.deepLinkModule) ?? DeepLinkModule({
    logger,
    walletUrl
  });
  const identityModule = (providers == null ? void 0 : providers.identityModule) ?? IdentityModule({
    logger,
    dAppDefinitionAddress: input.dAppDefinitionAddress,
    providers: {
      storageModule: storageModule.getPartition("identities"),
      KeyPairModule: Curve25519
    }
  });
  const sessionModule = (providers == null ? void 0 : providers.sessionModule) ?? SessionModule({
    providers: {
      storageModule: storageModule.getPartition("sessions")
    }
  });
  const radixConnectRelayApiService = RadixConnectRelayApiService({
    baseUrl: `${baseUrl}/api/v1`,
    logger
  });
  const subscriptions = new Subscription();
  const wait = (timer4 = 1500) => new Promise((resolve) => setTimeout(resolve, timer4));
  const decryptWalletResponse = (walletResponse) => {
    if ("error" in walletResponse) {
      return errAsync({ reason: walletResponse.error });
    }
    return identityModule.get("dApp").andThen(
      (dAppIdentity) => dAppIdentity.x25519.calculateSharedSecret(
        walletResponse.publicKey,
        input.dAppDefinitionAddress
      ).mapErr(() => ({ reason: "FailedToDeriveSharedSecret" })).asyncAndThen(
        (sharedSecret) => decryptWalletResponseData(sharedSecret, walletResponse.data)
      )
    );
  };
  const checkRelayLoop = async () => {
    await requestItemModule.getPending().andThen((pendingItems) => {
      if (pendingItems.length === 0) {
        return okAsync(void 0);
      }
      return sessionModule.getCurrentSession().andThen(
        (session) => radixConnectRelayApiService.getResponses(session.sessionId)
      ).andThen(
        (responses) => ResultAsync.combine(
          responses.map((response) => decryptWalletResponse(response))
        ).andThen((decryptedResponses) => {
          return walletResponses.setItems(
            decryptedResponses.reduce(
              (acc, response) => {
                acc[response.interactionId] = response;
                return acc;
              },
              {}
            )
          );
        })
      );
    });
    await wait();
    checkRelayLoop();
  };
  if (isMobile()) {
    checkRelayLoop();
  }
  const sendWalletInteractionRequest = ({
    session,
    walletInteraction,
    signature,
    publicKey,
    identity: identity2
  }) => requestItemModule.getById(walletInteraction.interactionId).mapErr(
    () => SdkError("FailedToGetPendingItems", walletInteraction.interactionId)
  ).andThen(
    (pendingItem) => pendingItem ? ok(pendingItem) : err(
      SdkError("PendingItemNotFound", walletInteraction.interactionId)
    )
  ).andThen(
    () => requestItemModule.patch(walletInteraction.interactionId, { sentToWallet: true }).andThen(
      () => deepLinkModule.deepLinkToWallet({
        sessionId: session.sessionId,
        request: base64urlEncode(walletInteraction),
        signature,
        publicKey,
        identity: identity2,
        origin: walletInteraction.metadata.origin,
        dAppDefinitionAddress: walletInteraction.metadata.dAppDefinitionAddress
      })
    )
  ).mapErr(
    () => SdkError("FailedToSendDappRequest", walletInteraction.interactionId)
  );
  const sendToWallet = (walletInteraction, callbackFns) => ResultAsync.combine([
    sessionModule.getCurrentSession().mapErr(
      (error) => SdkError(error.reason, walletInteraction.interactionId)
    ),
    identityModule.get("dApp").mapErr(
      (error) => SdkError(error.reason, walletInteraction.interactionId)
    )
  ]).andThen(
    ([session, dAppIdentity]) => identityModule.createSignature({
      dAppDefinitionAddress: walletInteraction.metadata.dAppDefinitionAddress,
      interactionId: walletInteraction.interactionId,
      origin: walletInteraction.metadata.origin,
      kind: "dApp"
    }).mapErr(
      (error) => SdkError(error.reason, walletInteraction.interactionId)
    ).andThen(
      ({ signature }) => sendWalletInteractionRequest({
        session,
        walletInteraction,
        signature,
        identity: dAppIdentity.ed25519.getPublicKey(),
        publicKey: dAppIdentity.x25519.getPublicKey()
      })
    ).andThen(() => waitForWalletResponse(walletInteraction.interactionId))
  );
  const decryptWalletResponseData = (sharedSecretHex, value) => transformBufferToSealbox(Buffer.from(value, "hex")).asyncAndThen(
    ({ ciphertextAndAuthTag, iv }) => encryptionModule.decrypt(
      ciphertextAndAuthTag,
      Buffer.from(sharedSecretHex, "hex"),
      iv
    )
  ).andThen(
    (decrypted) => parseJSON(decrypted.toString("utf-8"))
  ).mapErr((error) => ({
    reason: "FailedToDecryptWalletResponseData",
    jsError: error
  }));
  const waitForWalletResponse = (interactionId) => ResultAsync.fromPromise(
    new Promise(async (resolve, reject) => {
      var _a3;
      let response;
      let error;
      logger == null ? void 0 : logger.debug({
        method: "waitForWalletResponse",
        interactionId
      });
      while (!response) {
        const requestItemResult = await requestItemModule.getById(interactionId);
        if (requestItemResult.isOk()) {
          logger == null ? void 0 : logger.trace({
            method: "waitForWalletResponse.requestItemResult",
            requestItemResult: requestItemResult.value
          });
          if (((_a3 = requestItemResult.value) == null ? void 0 : _a3.status) !== "pending") {
            error = SdkError(
              "RequestItemNotPending",
              interactionId,
              "request not in pending state"
            );
            break;
          }
        }
        const walletResponse = await walletResponses.getItemById(interactionId);
        if (walletResponse.isOk()) {
          if (walletResponse.value) {
            response = walletResponse.value;
            await walletResponses.removeItemById(interactionId);
            await requestItemModule.patch(interactionId, {
              walletResponse: walletResponse.value
            });
          }
        }
        if (!response) {
          await wait();
        }
      }
      return response ? resolve(response) : reject(error);
    }),
    (err14) => err14
  );
  return {
    id: "radix-connect-relay",
    isSupported: () => isMobile(),
    send: sendToWallet,
    disconnect: () => {
    },
    destroy: () => {
      subscriptions.unsubscribe();
    }
  };
};
var WalletRequestSdk = (input) => {
  var _a2;
  const metadata = {
    version: 2,
    dAppDefinitionAddress: input.dAppDefinitionAddress,
    networkId: input.networkId,
    origin: input.origin || window.location.origin
  };
  parse(Metadata, metadata);
  const logger = (_a2 = input == null ? void 0 : input.logger) == null ? void 0 : _a2.getSubLogger({ name: "WalletSdk" });
  const availableTransports = input.providers.transports;
  const requestInterceptorDefault = async (walletInteraction) => walletInteraction;
  const requestInterceptor = input.requestInterceptor ?? requestInterceptorDefault;
  logger == null ? void 0 : logger.debug({ metadata });
  const createWalletInteraction = (items, interactionId = v4_default()) => ({
    items,
    interactionId,
    metadata
  });
  const withInterceptor = (payload) => ResultAsync.fromPromise(
    requestInterceptor(payload),
    (error) => SdkError("requestInterceptorError", payload.interactionId, error.message)
  );
  const getTransport = (interactionId) => {
    const transport = availableTransports.find(
      (transport2) => transport2.isSupported()
    );
    return transport ? ok(transport) : err({
      error: "SupportedTransportNotFound",
      interactionId,
      message: "No supported transport found"
    });
  };
  const request = ({
    interactionId = v4_default(),
    items
  }, callbackFns = {}) => withInterceptor({
    items,
    interactionId,
    metadata
  }).andThen(
    (walletInteraction) => getTransport(walletInteraction.interactionId).asyncAndThen(
      (transport) => transport.send(walletInteraction, callbackFns).andThen(validateWalletResponse)
    )
  );
  const sendTransaction = ({
    interactionId = v4_default(),
    items
  }, callbackFns = {}) => withInterceptor({
    interactionId,
    items,
    metadata
  }).andThen(
    (walletInteraction) => getTransport(interactionId).asyncAndThen(
      (transport) => transport.send(walletInteraction, callbackFns).andThen(validateWalletResponse)
    )
  );
  return {
    request,
    sendTransaction,
    createWalletInteraction,
    getTransport
  };
};
var TransactionStatus = {
  Unknown: "Unknown",
  CommittedSuccess: "CommittedSuccess",
  CommittedFailure: "CommittedFailure",
  Pending: "Pending",
  Rejected: "Rejected"
};
var RadixNetwork = {
  Mainnet: 1,
  Stokenet: 2,
  Gilganet: 32,
  Enkinet: 33,
  Hammunet: 34,
  Nergalnet: 35,
  Mardunet: 36,
  Dumunet: 37
};
var RadixNetworkConfig = {
  Mainnet: {
    networkName: "Mainnet",
    networkId: RadixNetwork.Mainnet,
    gatewayUrl: "https://mainnet.radixdlt.com",
    dashboardUrl: "https://dashboard.radixdlt.com"
  },
  Stokenet: {
    networkName: "Stokenet",
    networkId: RadixNetwork.Stokenet,
    gatewayUrl: "https://babylon-stokenet-gateway.radixdlt.com",
    dashboardUrl: "https://stokenet-dashboard.radixdlt.com"
  },
  Mardunet: {
    networkName: "Mardunet",
    networkId: RadixNetwork.Mardunet,
    gatewayUrl: "https://mardunet-gateway.radixdlt.com",
    dashboardUrl: "https://mardunet-dashboard.rdx-works-main.extratools.works"
  },
  Gilganet: {
    networkName: "Gilganet",
    networkId: RadixNetwork.Gilganet,
    gatewayUrl: "https://gilganet-gateway.radixdlt.com",
    dashboardUrl: "https://gilganet-dashboard.rdx-works-main.extratools.works"
  },
  Enkinet: {
    networkName: "Enkinet",
    networkId: RadixNetwork.Enkinet,
    gatewayUrl: "https://enkinet-gateway.radixdlt.com",
    dashboardUrl: "https://enkinet-dashboard.rdx-works-main.extratools.works"
  },
  Hammunet: {
    networkName: "Hammunet",
    networkId: RadixNetwork.Hammunet,
    gatewayUrl: "https://hammunet-gateway.radixdlt.com",
    dashboardUrl: "https://hammunet-dashboard.rdx-works-main.extratools.works"
  },
  Dumunet: {
    networkName: "Dumunet",
    networkId: RadixNetwork.Dumunet,
    gatewayUrl: "https://dumunet-gateway.radixdlt.com",
    dashboardUrl: "https://dumunet-dashboard.rdx-works-main.extratools.works"
  }
};
var RadixNetworkConfigById = Object.values(RadixNetworkConfig).reduce(
  (prev, config22) => {
    prev[config22.networkId] = config22;
    return prev;
  },
  {}
);
var generateGatewayApiConfig = ({
  networkId,
  dAppDefinitionAddress,
  gatewayBaseUrl,
  applicationName,
  applicationVersion
}) => ({
  basePath: gatewayBaseUrl ?? RadixNetworkConfigById[networkId].gatewayUrl,
  applicationName: applicationName ?? "Unknown",
  applicationVersion: applicationVersion ?? "Unknown",
  applicationDappDefinitionAddress: dAppDefinitionAddress
});
var __VERSION__ = "2.1.1";
var GatewayApiService = ({
  basePath,
  applicationName,
  applicationVersion,
  applicationDappDefinitionAddress
}) => {
  const fetchWithHeaders = (url, body) => fetchWrapper(
    fetch(`${basePath}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "RDX-Client-Name": "@radixdlt/radix-dapp-toolkit",
        "RDX-Client-Version": __VERSION__,
        "RDX-App-Name": applicationName,
        "RDX-App-Version": applicationVersion,
        "RDX-App-Dapp-Definition": applicationDappDefinitionAddress
      }
    })
  ).map((response) => response.data);
  const getTransactionStatus = (transactionIntentHash) => fetchWithHeaders("/transaction/status", {
    intent_hash: transactionIntentHash
  });
  const getEntityMetadataPage = (address) => fetchWithHeaders("/state/entity/page/metadata", { address });
  return {
    getTransactionStatus,
    getEntityMetadataPage
  };
};
var GatewayModule = (input) => {
  var _a2, _b;
  const logger = (_a2 = input.logger) == null ? void 0 : _a2.getSubLogger({ name: "GatewayModule" });
  const gatewayApi = ((_b = input == null ? void 0 : input.providers) == null ? void 0 : _b.gatewayApiService) ?? GatewayApiService(input.clientConfig);
  const pollTransactionStatus = (transactionIntentHash) => {
    const retry2 = ExponentialBackoff(input.retryConfig);
    const completedTransactionStatus = /* @__PURE__ */ new Set([
      "CommittedSuccess",
      "CommittedFailure",
      "Rejected"
    ]);
    return ResultAsync.fromPromise(
      firstValueFrom(
        retry2.withBackoff$.pipe(
          switchMap((result) => {
            if (result.isErr())
              return [
                err(
                  SdkError("failedToPollSubmittedTransaction", "", void 0, {
                    error: result.error,
                    context: "GatewayModule.pollTransactionStatus.retry.withBackoff$",
                    transactionIntentHash
                  })
                )
              ];
            logger == null ? void 0 : logger.debug(`pollingTxStatus retry #${result.value + 1}`);
            return gatewayApi.getTransactionStatus(transactionIntentHash).map((response) => {
              if (completedTransactionStatus.has(response.status))
                return response;
              retry2.trigger.next();
              return;
            }).orElse((response) => {
              if (response.reason === "FailedToFetch") {
                logger == null ? void 0 : logger.debug({
                  error: response,
                  context: "unexpected error, retrying"
                });
                retry2.trigger.next();
                return ok(void 0);
              }
              logger == null ? void 0 : logger.debug(response);
              return err(
                SdkError("failedToPollSubmittedTransaction", "", void 0, {
                  error: response,
                  transactionIntentHash,
                  context: "GatewayModule.pollTransactionStatus.getTransactionStatus"
                })
              );
            });
          }),
          filter(
            (result) => result.isOk() && !!result.value || result.isErr()
          ),
          first()
        )
      ),
      (error) => error
    ).andThen((result) => result);
  };
  return {
    pollTransactionStatus,
    gatewayApi,
    configuration: input.clientConfig
  };
};
var WalletRequestModule = (input) => {
  var _a2;
  const logger = (_a2 = input.logger) == null ? void 0 : _a2.getSubLogger({ name: "WalletRequestModule" });
  const useCache = input.useCache;
  const networkId = input.networkId;
  const cancelRequestSubject = new Subject();
  const ignoreTransactionSubject = new Subject();
  const interactionStatusChangeSubject = new Subject();
  const gatewayModule = input.providers.gatewayModule;
  const dAppDefinitionAddress = input.dAppDefinitionAddress;
  const stateModule = input.providers.stateModule;
  const storageModule = input.providers.storageModule;
  const dataRequestStateModule = input.providers.dataRequestStateModule ?? DataRequestStateModule({});
  const requestItemModule = input.providers.requestItemModule ?? RequestItemModule({
    logger,
    providers: {
      storageModule: storageModule.getPartition("requests")
    }
  });
  const transports = input.providers.transports ?? [
    ConnectorExtensionModule({
      logger,
      providers: { requestItemModule, storageModule }
    }),
    RadixConnectRelayModule({
      logger,
      walletUrl: "radixWallet://connect",
      baseUrl: "https://radix-connect-relay.radixdlt.com",
      dAppDefinitionAddress: input.dAppDefinitionAddress,
      providers: {
        requestItemModule,
        storageModule
      }
    })
  ];
  const walletRequestSdk = input.providers.walletRequestSdk ?? WalletRequestSdk({
    logger,
    networkId,
    origin: input.origin,
    dAppDefinitionAddress,
    requestInterceptor: input.requestInterceptor,
    providers: { transports }
  });
  const cancelRequestControl = (id) => {
    const messageLifeCycleEvent = new Subject();
    return {
      eventCallback: (event) => {
        messageLifeCycleEvent.next(event);
      },
      requestControl: ({ cancelRequest: cancelRequest2, getRequest }) => {
        firstValueFrom(
          messageLifeCycleEvent.pipe(
            filter((event) => event === "receivedByWallet"),
            map(() => getRequest()),
            tap((request) => {
              if (request.items.discriminator === "transaction")
                requestItemModule.patch(id, { showCancel: false });
            })
          )
        );
        firstValueFrom(
          cancelRequestSubject.pipe(
            filter((requestItemId) => requestItemId === id),
            switchMap(
              () => requestItemModule.cancel(id).andThen(() => cancelRequest2())
            )
          )
        );
        firstValueFrom(
          ignoreTransactionSubject.pipe(
            filter((requestItemId) => requestItemId === id),
            switchMap(
              () => requestItemModule.updateStatus({
                id,
                status: "ignored"
              }).andThen(() => cancelRequest2())
            )
          )
        );
      }
    };
  };
  let challengeGeneratorFn = () => Promise.resolve("");
  let connectResponseCallback;
  let dataRequestControl;
  const isChallengeNeeded = (dataRequestState) => {
    var _a3, _b;
    return ((_a3 = dataRequestState.accounts) == null ? void 0 : _a3.withProof) || ((_b = dataRequestState.persona) == null ? void 0 : _b.withProof);
  };
  const getChallenge = (dataRequestState) => {
    if (!isChallengeNeeded(dataRequestState))
      return okAsync(void 0);
    return ResultAsync.fromPromise(
      challengeGeneratorFn(),
      () => SdkError("ChallengeGeneratorError", "", "failed to generate challenge")
    ).andThen(
      (challenge) => validateRolaChallenge(challenge) ? ok(challenge) : err(SdkError("ChallengeValidationError", "", "challenge is invalid"))
    );
  };
  const provideConnectResponseCallback = (fn) => {
    connectResponseCallback = (result) => fn(result);
  };
  const provideDataRequestControl = (fn) => {
    dataRequestControl = (walletData) => ResultAsync.fromPromise(fn(walletData), () => ({
      error: "LoginRejectedByDapp",
      message: "Login rejected by dApp"
    }));
  };
  const sendOneTimeRequest = (...items) => sendRequest({
    dataRequestState: dataRequestStateModule.toDataRequestState(...items),
    isConnect: false,
    oneTime: true
  });
  const resolveWalletResponse = (walletInteraction, walletInteractionResponse) => {
    if (walletInteractionResponse.discriminator === "success" && walletInteractionResponse.items.discriminator === "authorizedRequest") {
      return ResultAsync.combine([
        transformWalletResponseToRdtWalletData(walletInteractionResponse.items),
        stateModule.getState()
      ]).andThen(([walletData, state]) => {
        return stateModule.setState({
          loggedInTimestamp: Date.now().toString(),
          walletData,
          sharedData: transformWalletRequestToSharedData(
            walletInteraction,
            state.sharedData
          )
        }).andThen(
          () => requestItemModule.updateStatus({
            id: walletInteractionResponse.interactionId,
            status: "success"
          })
        );
      });
    }
    return okAsync(void 0);
  };
  const sendDataRequest = (walletInteraction) => {
    return walletRequestSdk.request(
      walletInteraction,
      cancelRequestControl(walletInteraction.interactionId)
    ).map((response) => {
      logger == null ? void 0 : logger.debug({ method: "sendDataRequest.successResponse", response });
      return response;
    }).mapErr((error) => {
      logger == null ? void 0 : logger.debug({ method: "sendDataRequest.errorResponse", error });
      requestItemModule.updateStatus({
        id: walletInteraction.interactionId,
        status: "fail",
        error: error.error
      });
      return error;
    });
  };
  const sendRequest = ({
    isConnect,
    oneTime,
    dataRequestState
  }) => {
    return ResultAsync.combine([
      getChallenge(dataRequestState),
      stateModule.getState().mapErr(() => SdkError("FailedToReadRdtState", ""))
    ]).andThen(
      ([challenge, state]) => toWalletRequest({
        dataRequestState,
        isConnect,
        oneTime,
        challenge,
        walletData: state.walletData
      }).mapErr(() => SdkError("FailedToTransformWalletRequest", "")).asyncAndThen((walletDataRequest) => {
        const walletInteraction = walletRequestSdk.createWalletInteraction(walletDataRequest);
        if (canDataRequestBeResolvedByRdtState(walletDataRequest, state) && useCache)
          return okAsync(state.walletData);
        const isLoginRequest = !state.walletData.persona && walletDataRequest.discriminator === "authorizedRequest";
        return requestItemModule.add({
          type: isLoginRequest ? "loginRequest" : "dataRequest",
          walletInteraction,
          isOneTimeRequest: oneTime
        }).mapErr(
          ({ message }) => SdkError(
            "FailedToCreateRequestItem",
            walletInteraction.interactionId,
            message
          )
        ).andThen(
          () => sendDataRequest(walletInteraction).andThen((walletInteractionResponse) => {
            if (walletInteractionResponse.discriminator === "success" && walletInteractionResponse.items.discriminator !== "transaction")
              return ok(walletInteractionResponse.items);
            return err(
              SdkError(
                "WalletResponseFailure",
                walletInteractionResponse.interactionId,
                "expected data response"
              )
            );
          }).andThen(transformWalletResponseToRdtWalletData).andThen((transformedWalletResponse) => {
            if (dataRequestControl)
              return dataRequestControl(transformedWalletResponse).andThen(
                () => requestItemModule.updateStatus({
                  id: walletInteraction.interactionId,
                  status: "success"
                }).mapErr(
                  (error) => SdkError(
                    error.reason,
                    walletInteraction.interactionId
                  )
                ).map(() => transformedWalletResponse)
              ).mapErr((error) => {
                requestItemModule.updateStatus({
                  id: walletInteraction.interactionId,
                  status: "fail",
                  error: error.error
                });
                return SdkError(
                  error.error,
                  walletInteraction.interactionId
                );
              });
            return requestItemModule.updateStatus({
              id: walletInteraction.interactionId,
              status: "success"
            }).map(() => transformedWalletResponse).mapErr(
              (error) => SdkError(error.reason, walletInteraction.interactionId)
            );
          }).map((transformedWalletResponse) => {
            interactionStatusChangeSubject.next("success");
            if (!oneTime) {
              stateModule.setState({
                loggedInTimestamp: Date.now().toString(),
                walletData: transformedWalletResponse,
                sharedData: transformWalletRequestToSharedData(
                  walletInteraction,
                  state.sharedData
                )
              }).map(() => {
                stateModule.emitWalletData();
              });
            }
            return transformedWalletResponse;
          }).mapErr((err14) => {
            interactionStatusChangeSubject.next("fail");
            return err14;
          })
        );
      })
    ).mapErr((error) => {
      logger == null ? void 0 : logger.error(error);
      return error;
    });
  };
  const setRequestDataState = (...items) => {
    dataRequestStateModule.setState(...items);
    return {
      sendRequest: () => sendRequest({
        dataRequestState: dataRequestStateModule.getState(),
        isConnect: false,
        oneTime: false
      })
    };
  };
  const updateSharedAccounts = () => stateModule.getState().mapErr((err14) => {
    logger == null ? void 0 : logger.error(err14);
    return {
      error: "FailedToReadRdtState",
      message: "failed to read rdt state",
      jsError: err14
    };
  }).andThen(
    (state) => sendRequest({
      dataRequestState: transformSharedDataToDataRequestState(
        state.sharedData
      ),
      isConnect: false,
      oneTime: false
    })
  );
  const subscriptions = new Subscription();
  subscriptions.add(
    requestItemModule.requests$.pipe(
      mergeMap((items) => {
        const unresolvedItems = items.filter((item) => item.status === "pending" && item.walletResponse).map(
          (item) => resolveWalletResponse(
            item.walletInteraction,
            item.walletResponse
          )
        );
        return ResultAsync.combineWithAllErrors(unresolvedItems);
      })
    ).subscribe()
  );
  const sendTransaction = (value) => {
    const walletInteraction = walletRequestSdk.createWalletInteraction({
      discriminator: "transaction",
      send: {
        blobs: value.blobs,
        transactionManifest: value.transactionManifest,
        message: value.message,
        version: value.version ?? 1
      }
    });
    requestItemModule.add({
      type: "sendTransaction",
      walletInteraction,
      isOneTimeRequest: false
    });
    return walletRequestSdk.sendTransaction(
      walletInteraction,
      cancelRequestControl(walletInteraction.interactionId)
    ).mapErr((response) => {
      requestItemModule.updateStatus({
        id: walletInteraction.interactionId,
        status: "fail",
        error: response.error
      });
      interactionStatusChangeSubject.next("fail");
      logger == null ? void 0 : logger.debug({ method: "sendTransaction.errorResponse", response });
      return response;
    }).andThen(
      (response) => {
        logger == null ? void 0 : logger.debug({ method: "sendTransaction.successResponse", response });
        if (response.discriminator === "success" && response.items.discriminator === "transaction")
          return ok(response.items.send);
        if (response.discriminator === "failure")
          return err(
            SdkError(
              response.error,
              response.interactionId,
              response.message
            )
          );
        return err(SdkError("WalletResponseFailure", response.interactionId));
      }
    ).andThen(({ transactionIntentHash }) => {
      if (value.onTransactionId)
        value.onTransactionId(transactionIntentHash);
      return gatewayModule.pollTransactionStatus(transactionIntentHash).map((transactionStatusResponse) => ({
        transactionIntentHash,
        status: transactionStatusResponse.status
      }));
    }).andThen((response) => {
      const failedTransactionStatus = [
        TransactionStatus.Rejected,
        TransactionStatus.CommittedFailure
      ];
      const isFailedTransaction = failedTransactionStatus.includes(
        response.status
      );
      logger == null ? void 0 : logger.debug({
        method: "sendTransaction.pollTransactionStatus.completed",
        response
      });
      const status = isFailedTransaction ? "fail" : "success";
      return requestItemModule.updateStatus({
        id: walletInteraction.interactionId,
        status,
        transactionIntentHash: response.transactionIntentHash
      }).mapErr(
        () => SdkError(
          "FailedToUpdateRequestItem",
          walletInteraction.interactionId
        )
      ).andThen(() => {
        interactionStatusChangeSubject.next(status);
        return isFailedTransaction ? err(
          SdkError(
            "TransactionNotSuccessful",
            walletInteraction.interactionId
          )
        ) : ok(response);
      });
    });
  };
  const getTransport = () => transports.find((transport) => transport.isSupported());
  const getPendingRequests = () => requestItemModule.getPending();
  const cancelRequest = (id) => {
    cancelRequestSubject.next(id);
    requestItemModule.cancel(id);
    interactionStatusChangeSubject.next("fail");
  };
  const ignoreTransaction = (id) => {
    ignoreTransactionSubject.next(id);
    requestItemModule.updateStatus({
      id,
      status: "ignored"
    });
    interactionStatusChangeSubject.next("fail");
  };
  const provideChallengeGenerator = (fn) => {
    challengeGeneratorFn = fn;
  };
  const disconnect = () => {
    requestItemModule.getPending().map((items) => {
      items.forEach((item) => {
        if (item.showCancel)
          cancelRequestSubject.next(item.interactionId);
      });
    });
    stateModule.reset();
    requestItemModule.clear();
    transports.forEach((transport) => transport == null ? void 0 : transport.disconnect());
  };
  const destroy = () => {
    var _a3;
    stateModule.destroy();
    requestItemModule.destroy();
    (_a3 = input.providers.transports) == null ? void 0 : _a3.forEach((transport) => transport.destroy());
    subscriptions.unsubscribe();
  };
  return {
    sendRequest: (input2) => {
      const result = sendRequest({
        isConnect: input2.isConnect,
        oneTime: input2.oneTime,
        dataRequestState: dataRequestStateModule.getState()
      });
      if (connectResponseCallback)
        result.map((result2) => {
          connectResponseCallback(ok(result2));
        }).mapErr((error) => {
          connectResponseCallback(err(error));
        });
      return result;
    },
    sendTransaction,
    cancelRequest,
    ignoreTransaction,
    requestItemModule,
    provideChallengeGenerator,
    provideDataRequestControl,
    provideConnectResponseCallback,
    sendOneTimeRequest,
    setRequestDataState,
    getPendingRequests,
    getTransport,
    updateSharedAccounts,
    dataRequestStateModule,
    interactionStatusChange$: interactionStatusChangeSubject.asObservable(),
    requestItems$: requestItemModule.requests$,
    disconnect,
    destroy
  };
};
var isBrowser = () => ![typeof window, typeof document].includes("undefined");
var ConnectButtonNoopModule = () => {
  return {
    status$: NEVER,
    onConnect$: NEVER,
    onDisconnect$: NEVER,
    onUpdateSharedAccounts$: NEVER,
    onShowPopover$: NEVER,
    onCancelRequestItem$: NEVER,
    onLinkClick$: NEVER,
    setStatus: () => {
    },
    setMode: () => {
    },
    setTheme: () => {
    },
    setActiveTab: () => {
    },
    setIsMobile: () => {
    },
    setIsWalletLinked: () => {
    },
    setIsExtensionAvailable: () => {
    },
    setConnected: () => {
    },
    setLoggedInTimestamp: () => {
    },
    setRequestItems: () => {
    },
    setAccounts: () => {
    },
    setPersonaData: () => {
    },
    setPersonaLabel: () => {
    },
    setDappName: () => {
    },
    destroy: () => {
    },
    disconnect: () => {
    }
  };
};
var ConnectButtonModule = (input) => {
  var _a2;
  if (!isBrowser()) {
    return ConnectButtonNoopModule();
  }
  import("./connect-button-LXZ2YJET-GM2KMADY.js");
  const logger = (_a2 = input == null ? void 0 : input.logger) == null ? void 0 : _a2.getSubLogger({ name: "ConnectButtonModule" });
  const subjects = input.subjects || ConnectButtonSubjects();
  const dAppDefinitionAddress = input.dAppDefinitionAddress;
  const { baseUrl, accountsPath, transactionPath } = input.explorer ?? {
    baseUrl: RadixNetworkConfigById[input.networkId].dashboardUrl,
    transactionPath: "/transaction/",
    accountsPath: "/account/"
  };
  const statusStorage = input.providers.storageModule;
  const stateModule = input.providers.stateModule;
  const gatewayModule = input.providers.gatewayModule;
  const walletRequestModule = input.providers.walletRequestModule;
  const onConnectDefault = (done) => {
    done();
  };
  const onConnect = input.onConnect || onConnectDefault;
  const transport = walletRequestModule.getTransport();
  const getConnectButtonElement = () => document.querySelector("radix-connect-button");
  const subscriptions = new Subscription();
  const onConnectButtonRender$ = fromEvent(window, "onConnectButtonRender");
  subscriptions.add(
    onConnectButtonRender$.pipe(
      map(() => getConnectButtonElement()),
      filter((element) => !!element),
      switchMap((connectButtonElement) => {
        logger == null ? void 0 : logger.debug({ observable: `onConnectButtonRender$` });
        const onConnect$ = fromEvent(connectButtonElement, "onConnect").pipe(
          tap(() => {
            onConnect((value) => subjects.onConnect.next(value));
          })
        );
        const onDisconnect$ = fromEvent(
          connectButtonElement,
          "onDisconnect"
        ).pipe(tap(() => subjects.onDisconnect.next()));
        const onLinkClick$ = fromEvent(connectButtonElement, "onLinkClick").pipe(
          tap((ev) => {
            subjects.onLinkClick.next(ev.detail);
          })
        );
        const onDestroy$ = fromEvent(connectButtonElement, "onDestroy").pipe(
          map(() => {
            logger == null ? void 0 : logger.debug({ observable: `onDestroy$` });
            return true;
          })
        );
        const onCancelRequestItem$ = fromEvent(
          connectButtonElement,
          "onCancelRequestItem"
        ).pipe(
          tap((event) => {
            const id = event.detail.id;
            logger == null ? void 0 : logger.debug({ method: "onCancelRequestItem", id });
            subjects.onCancelRequestItem.next(id);
          })
        );
        const onIgnoreTransactionItem$ = fromEvent(
          connectButtonElement,
          "onIgnoreTransactionItem"
        ).pipe(
          tap((event) => {
            const id = event.detail.id;
            logger == null ? void 0 : logger.debug({
              method: "onIgnoreTransactionItem",
              id
            });
            subjects.onIgnoreTransactionItem.next(id);
          })
        );
        const onUpdateSharedAccounts$ = fromEvent(
          connectButtonElement,
          "onUpdateSharedAccounts"
        ).pipe(
          tap(() => {
            logger == null ? void 0 : logger.debug(`onUpdateSharedAccounts`);
            subjects.onUpdateSharedAccounts.next();
          })
        );
        const onShowPopover$ = fromEvent(
          connectButtonElement,
          "onShowPopover"
        ).pipe(tap(() => subjects.onShowPopover.next()));
        const isWalletLinked$ = subjects.isWalletLinked.pipe(
          tap((value) => connectButtonElement.isWalletLinked = value)
        );
        const isExtensionAvailable$ = subjects.isExtensionAvailable.pipe(
          tap((value) => connectButtonElement.isExtensionAvailable = value)
        );
        const status$ = subjects.status.pipe(
          tap((value) => connectButtonElement.status = value)
        );
        const mode$ = subjects.mode.pipe(
          tap((value) => connectButtonElement.mode = value)
        );
        const connected$ = subjects.connected.pipe(
          tap((value) => connectButtonElement.connected = value)
        );
        const isMobile$ = subjects.isMobile.pipe(
          tap((value) => connectButtonElement.isMobile = value)
        );
        const loggedInTimestamp$ = subjects.loggedInTimestamp.pipe(
          tap((value) => connectButtonElement.loggedInTimestamp = value)
        );
        const activeTab$ = subjects.activeTab.pipe(
          tap((value) => connectButtonElement.activeTab = value)
        );
        const requestItems$ = subjects.requestItems.pipe(
          tap((items) => connectButtonElement.requestItems = items)
        );
        const showPopoverMenu$ = subjects.showPopoverMenu.pipe(
          tap((value) => {
            value ? connectButtonElement.setAttribute("showPopoverMenu", "true") : connectButtonElement.removeAttribute("showPopoverMenu");
          })
        );
        const accounts$ = subjects.accounts.pipe(
          tap((items) => connectButtonElement.accounts = items)
        );
        const personaData$ = subjects.personaData.pipe(
          tap((items) => connectButtonElement.personaData = items)
        );
        const personaLabel$ = subjects.personaLabel.pipe(
          tap((items) => connectButtonElement.personaLabel = items)
        );
        const dAppName$ = subjects.dAppName.pipe(
          tap((value) => connectButtonElement.dAppName = value)
        );
        const theme$ = subjects.theme.pipe(
          tap((value) => connectButtonElement.theme = value)
        );
        const connectButtonEvents$ = merge(
          onConnect$,
          status$,
          theme$,
          mode$,
          connected$,
          showPopoverMenu$,
          requestItems$,
          loggedInTimestamp$,
          isMobile$,
          activeTab$,
          isWalletLinked$,
          isExtensionAvailable$,
          onDisconnect$,
          onCancelRequestItem$,
          onIgnoreTransactionItem$,
          accounts$,
          personaData$,
          personaLabel$,
          onUpdateSharedAccounts$,
          onShowPopover$,
          dAppName$,
          onLinkClick$
        ).pipe(map(() => false));
        return merge(connectButtonEvents$, onDestroy$).pipe(
          filter((shouldDestroy) => !!shouldDestroy),
          first(),
          finalize(() => {
            logger == null ? void 0 : logger.debug({ observable: `onConnectButtonRender$.finalize` });
          })
        );
      })
    ).subscribe()
  );
  subscriptions.add(
    (transport && transport.isAvailable$ || of(true)).pipe(tap((value) => subjects.isExtensionAvailable.next(value))).subscribe()
  );
  subscriptions.add(
    (transport && transport.isLinked$ || of(true)).pipe(tap((value) => subjects.isWalletLinked.next(value))).subscribe()
  );
  subscriptions.add(
    subjects.onLinkClick.pipe(
      tap(({ type, data }) => {
        if (["account", "transaction"].includes(type)) {
          if (!baseUrl || !window)
            return;
          const url = `${baseUrl}${type === "transaction" ? transactionPath : accountsPath}${data}`;
          window.open(url);
        } else if (type === "setupGuide")
          window.open("https://wallet.radixdlt.com");
        else if (type === "getWallet") {
          window.open("https://app.radixdlt.com/qr-code");
        } else if (type === "showQrCode" && (transport == null ? void 0 : transport.showQrCode))
          transport.showQrCode();
      })
    ).subscribe()
  );
  const connectButtonApi = {
    status$: subjects.status.asObservable(),
    onConnect$: subjects.onConnect.asObservable(),
    onDisconnect$: subjects.onDisconnect.asObservable(),
    onShowPopover$: subjects.onShowPopover.asObservable(),
    onUpdateSharedAccounts$: subjects.onUpdateSharedAccounts.asObservable(),
    onCancelRequestItem$: subjects.onCancelRequestItem.asObservable(),
    onIgnoreTransactionItem$: subjects.onIgnoreTransactionItem.asObservable(),
    onLinkClick$: subjects.onLinkClick.asObservable(),
    setStatus: (value) => subjects.status.next(value),
    setTheme: (value) => subjects.theme.next(value),
    setMode: (value) => subjects.mode.next(value),
    setActiveTab: (value) => subjects.activeTab.next(value),
    setIsMobile: (value) => subjects.isMobile.next(value),
    setIsWalletLinked: (value) => subjects.isWalletLinked.next(value),
    setIsExtensionAvailable: (value) => subjects.isExtensionAvailable.next(value),
    setLoggedInTimestamp: (value) => subjects.loggedInTimestamp.next(value),
    setConnected: (value) => subjects.connected.next(value),
    setShowPopoverMenu: (value) => subjects.showPopoverMenu.next(value),
    setRequestItems: (items) => subjects.requestItems.next(items),
    setAccounts: (accounts2) => subjects.accounts.next(accounts2),
    setPersonaData: (personaData2) => subjects.personaData.next(personaData2),
    setPersonaLabel: (personaLabel) => subjects.personaLabel.next(personaLabel),
    setDappName: (dAppName) => subjects.dAppName.next(dAppName),
    disconnect: () => {
      subjects.connected.next(false);
      subjects.status.next("default");
    },
    destroy: () => {
      subscriptions.unsubscribe();
    }
  };
  const setPropsFromState = () => stateModule.getState().map((state) => {
    const { personaData: personaData2, accounts: accounts2, personaLabel, connected } = transformWalletDataToConnectButton(state.walletData);
    connectButtonApi.setLoggedInTimestamp(state.loggedInTimestamp);
    connectButtonApi.setAccounts(accounts2);
    connectButtonApi.setPersonaData(personaData2);
    connectButtonApi.setPersonaLabel(personaLabel);
    connectButtonApi.setConnected(connected);
  });
  subscriptions.add(
    stateModule.storage$.pipe(switchMap(() => setPropsFromState())).subscribe()
  );
  subscriptions.add(
    subjects.onCancelRequestItem.pipe(
      tap((value) => {
        walletRequestModule.cancelRequest(value);
      })
    ).subscribe()
  );
  subscriptions.add(
    subjects.onIgnoreTransactionItem.pipe(
      tap((value) => {
        walletRequestModule.ignoreTransaction(value);
      })
    ).subscribe()
  );
  subscriptions.add(
    walletRequestModule.requestItems$.pipe(
      tap((items) => {
        const hasPendingItem = items.find((item) => item.status === "pending");
        if (hasPendingItem) {
          connectButtonApi.setStatus("pending");
        }
        connectButtonApi.setRequestItems([...items].reverse());
      })
    ).subscribe()
  );
  subscriptions.add(
    subjects.onShowPopover.pipe(
      tap(() => {
        walletRequestModule.getPendingRequests().map((pendingRequests) => {
          if (pendingRequests.length > 0) {
            subjects.activeTab.next("requests");
          }
        });
      })
    ).subscribe()
  );
  subscriptions.add(
    subjects.onConnect.pipe(
      switchMap(
        () => stateModule.reset().andThen(
          () => walletRequestModule.sendRequest({
            isConnect: true,
            oneTime: false
          })
        ).map(() => isMobile() && subjects.showPopoverMenu.next(false))
      )
    ).subscribe()
  );
  subscriptions.add(
    subjects.onUpdateSharedAccounts.pipe(switchMap(() => walletRequestModule.updateSharedAccounts())).subscribe()
  );
  subscriptions.add(
    subjects.onDisconnect.pipe(
      tap(() => {
        subjects.connected.next(false);
        subjects.status.next("default");
        walletRequestModule.disconnect();
        if (input.onDisconnect)
          input.onDisconnect();
      })
    ).subscribe()
  );
  subscriptions.add(
    statusStorage.storage$.pipe(
      switchMap(
        () => statusStorage.getState().map((state) => {
          if (state == null ? void 0 : state.status) {
            subjects.status.next(state.status);
          }
        })
      )
    ).subscribe()
  );
  subscriptions.add(
    walletRequestModule.interactionStatusChange$.pipe(
      mergeMap((newStatus) => {
        statusStorage.setState({
          status: newStatus === "success" ? "success" : "error"
        });
        return timer(2e3).pipe(
          tap(() => {
            const result = walletRequestModule.getPendingRequests();
            result.map((pendingItems) => {
              statusStorage.setState({
                status: pendingItems.length ? "pending" : "default"
              });
            });
          })
        );
      })
    ).subscribe()
  );
  if (dAppDefinitionAddress) {
    gatewayModule.gatewayApi.getEntityMetadataPage(dAppDefinitionAddress).map(
      (details) => {
        var _a3, _b, _c;
        return (_c = (_b = (_a3 = details == null ? void 0 : details.items.find((item) => item.key === "name")) == null ? void 0 : _a3.value) == null ? void 0 : _b.typed) == null ? void 0 : _c.value;
      }
    ).map((dAppName) => {
      subjects.dAppName.next(dAppName ?? "Unnamed dApp");
    });
  }
  return connectButtonApi;
};
var ConnectButtonStatus = {
  pending: "pending",
  success: "success",
  default: "default",
  error: "error"
};
var LocalStorageModule = (key, partitionKey) => {
  const storageKey = partitionKey ? `${key}:${partitionKey}` : key;
  const getDataAsync = () => new Promise((resolve, reject) => {
    try {
      resolve(localStorage.getItem(storageKey));
    } catch (error) {
      reject(error);
    }
  });
  const setDataAsync = (value) => new Promise((resolve, reject) => {
    try {
      localStorage.setItem(storageKey, value);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
  const getItems = () => ResultAsync.fromPromise(getDataAsync(), typedError).andThen(
    (data) => data ? parseJSON(data) : ok({})
  );
  const getState = () => ResultAsync.fromPromise(getDataAsync(), typedError).andThen(
    (data) => data ? parseJSON(data) : ok(void 0)
  );
  const getItemById = (id) => ResultAsync.fromPromise(getDataAsync(), typedError).andThen((data) => data ? parseJSON(data) : ok(void 0)).map((items) => items ? items[id] : void 0);
  const removeItemById = (id) => getItems().andThen((items) => {
    const { [id]: _, ...newItems } = items;
    return stringify2(newItems).asyncAndThen((serialized) => {
      const result = ResultAsync.fromPromise(
        setDataAsync(serialized),
        typedError
      ).map(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: storageKey,
            oldValue: JSON.stringify(items),
            newValue: serialized
          })
        );
      });
      return result;
    });
  });
  const patchItem = (id, patch) => getItemById(id).andThen((item) => {
    return item ? setItems({ [id]: { ...item, ...patch } }) : err(new Error("Item not found"));
  });
  const setItems = (item) => getItems().andThen(
    (data) => stringify2({ ...data, ...item }).asyncAndThen((serialized) => {
      const result = ResultAsync.fromPromise(
        setDataAsync(serialized),
        typedError
      ).map(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: storageKey,
            oldValue: JSON.stringify(data),
            newValue: serialized
          })
        );
      });
      return result;
    })
  );
  const getItemList = () => getItems().map(Object.values);
  const setState = (newValue) => getState().andThen(
    (oldValue) => stringify2({ ...oldValue ?? {}, ...newValue }).asyncAndThen(
      (serialized) => {
        const result = ResultAsync.fromPromise(
          setDataAsync(serialized),
          typedError
        ).map(() => {
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: storageKey,
              oldValue: JSON.stringify(oldValue),
              newValue: serialized
            })
          );
        });
        return result;
      }
    )
  );
  const patchState = (newValue) => getState().mapErr(() => ({ reason: "FailedToReadFromLocalStorage" })).andThen(
    (oldState) => oldState ? setState({ ...oldState, ...newValue }).mapErr(() => ({
      reason: "FailedToWriteToLocalStorage"
    })) : err({ reason: "PatchingStateFailed" })
  );
  const getPartition = (partitionKey2) => LocalStorageModule(key, partitionKey2);
  const storage$ = merge(
    fromEvent(window, "storage"),
    of({ key: storageKey, newValue: null, oldValue: null })
  ).pipe(
    filter((item) => item.key === storageKey),
    mergeMap((event) => {
      const { key: key2, newValue, oldValue } = event;
      if (!key2)
        return [];
      const [rdt, accountDefinition, networkId, partition2] = key2.split(":");
      if (rdt === "rdt" && accountDefinition && networkId) {
        const oldValueResult = oldValue ? parseJSON(oldValue) : ok(void 0);
        const newValueResult = newValue ? parseJSON(newValue) : ok(void 0);
        return [
          Result.combine([oldValueResult, newValueResult]).map(
            ([oldValue2, newValue2]) => ({
              key: key2,
              partition: partition2,
              newValue: newValue2,
              oldValue: oldValue2
            })
          )
        ];
      }
      return [];
    }),
    filter((result) => result.isOk()),
    map(({ value }) => value)
  );
  const clear = () => ResultAsync.fromPromise(
    new Promise((resolve) => resolve(localStorage.removeItem(storageKey))),
    typedError
  );
  return {
    getItems,
    getItemById,
    removeItemById,
    patchItem,
    setItems,
    getItemList,
    getPartition,
    setState,
    getState,
    patchState,
    clear,
    storage$
  };
};
polyfills_default();
var RadixDappToolkit = (options) => {
  const dAppDefinitionAddress = options.dAppDefinitionAddress ?? options.applicationDappDefinitionAddress;
  const {
    networkId,
    providers,
    logger,
    onDisconnect,
    gatewayBaseUrl,
    applicationName,
    applicationVersion,
    useCache = true
  } = options || {};
  const storageModule = (providers == null ? void 0 : providers.storageModule) ?? LocalStorageModule(`rdt:${dAppDefinitionAddress}:${networkId}`);
  const stateModule = (providers == null ? void 0 : providers.stateModule) ?? StateModule({
    logger,
    providers: {
      storageModule: storageModule.getPartition("state")
    }
  });
  const gatewayModule = (providers == null ? void 0 : providers.gatewayModule) ?? GatewayModule({
    logger,
    clientConfig: generateGatewayApiConfig({
      networkId,
      dAppDefinitionAddress,
      gatewayBaseUrl,
      applicationName,
      applicationVersion
    })
  });
  const walletRequestModule = (providers == null ? void 0 : providers.walletRequestModule) ?? WalletRequestModule({
    logger,
    useCache,
    networkId,
    dAppDefinitionAddress,
    requestInterceptor: options.requestInterceptor,
    providers: {
      stateModule,
      storageModule,
      gatewayModule
    }
  });
  const connectButtonModule = (providers == null ? void 0 : providers.connectButtonModule) ?? ConnectButtonModule({
    logger,
    networkId,
    explorer: options.explorer,
    onDisconnect,
    dAppDefinitionAddress,
    providers: {
      stateModule,
      walletRequestModule,
      gatewayModule,
      storageModule: storageModule.getPartition("connectButton")
    }
  });
  return {
    walletApi: {
      setRequestData: walletRequestModule.setRequestDataState,
      sendRequest: () => walletRequestModule.sendRequest({
        isConnect: false,
        oneTime: false
      }),
      provideChallengeGenerator: (fn) => walletRequestModule.provideChallengeGenerator(fn),
      dataRequestControl: (fn) => {
        walletRequestModule.provideDataRequestControl(fn);
      },
      provideConnectResponseCallback: walletRequestModule.provideConnectResponseCallback,
      updateSharedAccounts: () => walletRequestModule.updateSharedAccounts(),
      sendOneTimeRequest: walletRequestModule.sendOneTimeRequest,
      sendTransaction: (input) => walletRequestModule.sendTransaction(input),
      walletData$: stateModule.walletData$,
      getWalletData: stateModule.getWalletData
    },
    buttonApi: {
      setTheme: connectButtonModule.setTheme,
      setMode: connectButtonModule.setMode,
      status$: connectButtonModule.status$
    },
    gatewayApi: {
      clientConfig: gatewayModule.configuration
    },
    disconnect: () => {
      walletRequestModule.disconnect();
      connectButtonModule.disconnect();
      if (onDisconnect)
        onDisconnect();
    },
    destroy: () => {
      stateModule.destroy();
      walletRequestModule.destroy();
      connectButtonModule.destroy();
    }
  };
};
export {
  Account,
  AccountProof,
  AccountsRequestItem,
  AccountsRequestResponseItem,
  AnswerIO,
  AuthLoginRequestItem,
  AuthLoginRequestResponseItem,
  AuthLoginWithChallengeRequestItem,
  AuthLoginWithChallengeRequestResponseItem,
  AuthLoginWithoutChallengeRequestItem,
  AuthLoginWithoutChallengeRequestResponseItem,
  AuthRequestItem,
  AuthRequestResponseItem,
  AuthUsePersonaRequestItem,
  CancelRequest,
  CancelWalletInteractionExtensionInteraction,
  ConnectButtonModule,
  ConnectButtonStatus,
  ConnectButtonSubjects,
  ConnectorExtensionModule,
  ConnectorExtensionSubjects,
  Curve25519,
  DataRequestBuilder,
  DataRequestStateModule,
  DeepLinkModule,
  ExponentialBackoff,
  ExtensionInteraction,
  GatewayApiService,
  GatewayModule,
  IceCandidateIO,
  IceCandidatePayloadIO,
  IceCandidatesIO,
  IdentityKind,
  IdentityModule,
  LocalStorageModule,
  Logger2 as Logger,
  LoginRequestResponseItem,
  MessageLifeCycleEvent,
  MessageLifeCycleExtensionStatusEvent,
  Metadata,
  NumberOfValues,
  OfferIO,
  OneTimeDataRequestBuilder,
  OpenPopupExtensionInteraction,
  Persona,
  PersonaDataName,
  PersonaDataNameVariant,
  PersonaDataRequestItem,
  PersonaDataRequestResponseItem,
  Proof,
  RadixConnectRelayModule,
  RadixDappToolkit,
  RadixNetwork,
  RadixNetworkConfig,
  RadixNetworkConfigById,
  RdtState,
  RequestItemModule,
  ResetRequestItem,
  SendTransactionItem,
  SendTransactionResponseItem,
  SessionModule,
  SharedData,
  SignalingServerMessage,
  SignedChallenge,
  SignedChallengeAccount,
  SignedChallengePersona,
  Sources,
  StateModule,
  StatusExtensionInteraction,
  TransactionStatus,
  TransformRdtDataRequestToWalletRequestInput,
  WalletAuthorizedRequestItems,
  WalletAuthorizedRequestResponseItems,
  WalletData,
  WalletDataPersonaData,
  WalletDataPersonaDataEmailAddresses,
  WalletDataPersonaDataFullName,
  WalletDataPersonaDataPhoneNumbersAddresses,
  WalletInteraction,
  WalletInteractionExtensionInteraction,
  WalletInteractionFailureResponse,
  WalletInteractionItems,
  WalletInteractionResponse,
  WalletInteractionSuccessResponse,
  WalletRequestItems,
  WalletRequestModule,
  WalletRequestResponseItems,
  WalletRequestSdk,
  WalletTransactionItems,
  WalletUnauthorizedRequestItems,
  blake2b,
  canDataRequestBeResolvedByRdtState,
  config2 as config,
  eventType,
  extensionInteractionDiscriminator,
  fetchWrapper,
  generateGatewayApiConfig,
  generateRolaChallenge,
  isMobile,
  messageLifeCycleEventType,
  parseJSON,
  parseSignedChallenge,
  personaDataFullNameVariant,
  proofType,
  removeUndefined,
  stringify2 as stringify,
  toWalletRequest,
  transformRdtDataRequestToWalletRequest,
  transformSharedDataToDataRequestState,
  transformWalletDataToConnectButton,
  transformWalletRequestToSharedData,
  transformWalletResponseToRdtWalletData,
  typedError,
  unwrapObservable,
  validateRolaChallenge,
  validateWalletResponse,
  walletDataDefault
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

bowser/src/bowser.js:
  (*!
   * Bowser - a browser detector
   * https://github.com/lancedikson/bowser
   * MIT License | (c) Dustin Diaz 2012-2015
   * MIT License | (c) Denis Demchenko 2015-2019
   *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/edwards.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/montgomery.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@radixdlt/radix-dapp-toolkit/dist/index.js:
  (*! Bundled license information:
  
  @noble/hashes/esm/utils.js:
    (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
  *)
*/
//# sourceMappingURL=@radixdlt_radix-dapp-toolkit.js.map