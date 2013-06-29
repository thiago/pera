(function () {

	var root = this;

	var rootPathFrom = function(path, domain, relative){
    var rtn = [],
			current_path = path || '',
	    relative = relative || true,
	    level = 0;

		if(type(current_path) != 'string'){
			return null;
		}

		//removendo barras duplicadas
		while(current_path.indexOf('//') != 0 && !current_path.indexOf('://')){
      current_path = current_path.replace('//', '/');
		}

		if (relative){
			//remove barra do início se existir
	    if (current_path.charAt(0) == '/') current_path = current_path.slice(1, current_path.length);

			//remove barra do final se existir
	    if (current_path.charAt(current_path.length - 1) == '/') current_path = current_path.slice(0, -1);

			if (current_path.split('/').length > 1 || current_path) level = current_path.split('/').length;

			if (current_path.split('..').length > 1) level = level - (current_path.split('..').length);

	    for (var n = 1; n < level; n++) rtn.push('../');

	    return rtn.join('');
		}
	};

	var relativePathList = function(path, list){
      var rtn = list || [];
      for(var i in rtn){
          var current = rtn[i];
          if(current.charAt(0) != '/' && current.charAt(0) != '.'){
              rtn[i] = rootPathFrom(path) + current;
          }
      }
  };

	var pathList = function(path, list, domain){
      var rtn = list || [];
      for(var i in rtn){
          var current = rtn[i];
          if(current.charAt(0) != '/' && current.charAt(0) != '.'){
              rtn[i] = rootPathFrom(path, domain, false) + current;
          }
      }
  };

	var class2type = {};
	var core_toString = class2type.toString;
	var core_hasOwn = class2type.hasOwnProperty;
	var isWindow = function (obj) {
		return obj != null && obj == obj.window;
	};

	var has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };
	var type = function (obj) {
		if (obj == null) {
			return String(obj);
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	};
	var isFunction = function (obj) {
		return type(obj) === "function";
	};

	var isArray = Array.isArray || function (obj) {
		return type(obj) === "array";
	};

	var isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

	var isPlainObject = function (obj) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
				return false;
			}
		} catch (e) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for (key in obj) {
		}

		return key === undefined || core_hasOwn.call(obj, key);
	};

	var extend = function () {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !isFunction(target)) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if (length === i) {
			target = this;
			--i;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[ i ]) != null) {
				// Extend the base object
				for (name in options) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) )) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];

						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	var pera = {
		extend: extend,
		rootPathFrom: rootPathFrom,
		pathList: pathList,
		relativePathList: relativePathList,
		type: type,
		isArray: isArray,
		isFunction: isFunction,
		isPlainObject: isPlainObject,
		isWindow: isWindow
	};

	if (typeof exports === 'object') {
		module.exports = pera;
	} else if (typeof define === 'function' && define.amd) {
	} else {
		root.pera = pera;
	}
}).call(this);
