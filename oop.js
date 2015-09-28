define('lib/score/oop', [], function() {

    var oop = {};

    var superRe = /xyz/.test(function(){xyz;}) ? /\b__super__\b/ : /.*/;
    var argumentsRe = /xyz/.test(function(){xyz;}) ? /\barguments\b/ : /.*/;

    var extractParameterNames = function(func) {
        var i = 0;
        var funcStr = func.toString();
        var skipTo = function(chr) {
            while (funcStr[i] !== chr) {
                i++;
                if (funcStr[i] !== '/') {
                    continue;
                }
                i++;
                if (funcStr[i] === '/') {
                    i++;
                    while (funcStr[i] !== '\n') {
                        i++;
                    }
                } else if (funcStr[i] === '*') {
                    i++;
                    while (funcStr[i] !== '*' && funcStr[i + 1] !== '/') {
                        i++;
                    }
                }
            }
            return i;
        }
        var startIdx = skipTo('(') + 1;
        var stopIdx = skipTo(')');
        return funcStr
            .substring(startIdx, stopIdx)
            .replace(/\/\*.*?\*\//, '')
            .replace(/\/\/.*?\n/, '')
            .trim()
            .split(/\s*,\s*/);
    };

    var createSubFunc = function(__super__, func, name) {
        if (!argumentsRe.test(func) && func.length === 0 && (!__super__ || !superRe.test(func))) {
            // none of the features below are required,
            // just return the function
            return func;
        }
        var args = extractParameterNames(func).slice(1);
        var declaration = 'function ' + name + '(' + args.join(', ') + ') {\n';
        var body;
        if (argumentsRe.test(func)) {
            // function body contains `arguments`, so we wil pass the received
            // arguments to the function.  this is a bad scenario
            // performance-wise, as usage of `arguments` causes the browser to
            // handle the function differently.
            body = '    var args = new Array(arguments.length + 1);\n' +
                   '    args[0] = this;\n' +
                   '    for (var i = 0; i < arguments.length; i++) {\n' +
                   '        args[i + 1] = arguments[i];\n' +
                   '    }\n' +
                   '    var result = func.apply(this, args);\n';
        } else if (func.length > 1) {
            body = '    var result = func.call(this, this, ' + args.join(', ') + ');\n';
        } else if (func.length == 1) {
            body = '    var result = func.call(this, this);\n';
        } else {
            body = '    var result = func.call(this);\n';
        }
        if (__super__ && superRe.test(func)) {
            // store the current value of this.__super__ so we may restore it
            // after the function call.  every function will have a correct
            // __super__ value this way, even when calling one such function
            // from another.
            body = '    var __previous_super__ = this.__super__;\n' +
                   '    this.__super__ = __super__.bind(this);\n' +
                   body +
                   '    this.__super__ = __previous_super__;\n';
        } else {
            body = '    delete this.__super__;\n' +
                   body;
        }
        body += '    return result;\n}';
        // console.log('[' + declaration + body + ']');
        return eval('[' + declaration + body + ']')[0];
    };

    var createConstructor = function(name, conf, parents, members, methods) {
        var __init__, __parent_init__;
        if (conf.__init__) {
            __init__ = conf.__init__;
        }
        for (var i = 0; i < parents.length; i++) {
            if (parents[i].__conf__.__init__) {
                if (!__init__) {
                    __init__ = parents[i].__conf__.__init__;
                } else {
                    __parent_init__ = parents[i].__conf__.__wrapped_init__;
                    break;
                }
            }
        }
        var args;
        if (!__init__) {
            args = [];
        } else {
            args = extractParameterNames(__init__).slice(1);
        }
        var declaration = 'function ' + name + '(' + args.join(', ') + ') {\n';
        var call, body;
        if (__init__ && argumentsRe.test(__init__)) {
            call = '        var args = [];\n' +
                   '        for (var i = 0; i < arguments.length; i++) {\n' +
                   '            args.push("arguments[" + i + "]");\n' +
                   '        }\n' +
                   '        return eval("new ' + name + '(" + args.join(", ") + ")")\n';
        } else {
            call = '        return new ' + name + '(' + args.join(', ') + ')\n';
        }
        body = '    if (!(this instanceof ' + name + ')) {\n' +
                    call +
               '    }\n';
        for (var attr in members) {
            if (members[attr] instanceof Array) {
                body += '    this.' + attr + ' = [\n';
                var lines = [];
                for (var i = 0; i < members[attr].length; i++) {
                    lines.push('        members.' + attr + '[' + i + ']');
                }
                body += lines.join(',\n') + '\n';
                body += '    ];\n';
            } else if (members[attr] instanceof Object) {
                body += '    this.' + attr + ' = {\n';
                var lines = [];
                for (var key in members[attr]) {
                    lines.push('        "' + key + '": members.' + attr + '["'+ key + '"]');
                }
                body += lines.join(',\n') + '\n';
                body += '    };\n';
            } else {
                body += '    this.' + attr + ' = members.' + attr + ';\n';
            }
        }
        for (attr in methods) {
            body += '    this.' + attr + ' = methods.' + attr + '.bind(this);\n';
        }
        if (__init__) {
            conf.__wrapped_init__ = createSubFunc(__parent_init__, __init__, name + '__init__');
            var initCall;
            if (argumentsRe.test(__init__)) {
                initCall = '    var args = new Array(arguments.length + 1);\n' +
                           '    args[0] = this;\n' +
                           '    for (var i = 0; i < arguments.length; i++) {\n' +
                           '        args[i + 1] = arguments[i];\n' +
                           '    }\n' +
                           '    __init__.apply(this, args);\n';
            } else if (__init__.length > 1) {
                initCall = '    __init__.call(this, this, ' + args.join(', ') + ');\n';
            } else if (__init__.length == 1) {
                initCall = '    __init__.call(this, this);\n';
            } else {
                initCall = '    __init__.call(this);\n';
            }
            if (__parent_init__) {
                initCall = '    var __previous_super__ = this.__super__;\n' +
                           '    this.__super__ = __parent_init__.bind(this);\n' +
                           initCall +
                           '    this.__super__ = __previous_super__;\n';
            }
            body += initCall;
        }
        body += '}';
        // console.log('[' + declaration + body + ']');
        return eval('[' + declaration + body + ']')[0];
    };

    var makeEventListener = function(cls) {
        // XXX: Almost an exact copy of makeStaticEventListener(),
        //      update accordingly.
        var validEvents = {};
        var acceptAll = false;
        for (var c = cls; c; c = c.__parent__) {
            if (typeof c.__conf__.__events__ === 'undefined') {
                continue;
            }
            if (c.__conf__.__events__ instanceof Array) {
                for (var i = 0; i < c.__conf__.__events__.length; i++) {
                    empty = false;
                    validEvents[c.__conf__.__events__[i]] = true;
                }
            } else if (c.__conf__.__events__) {
                acceptAll = true;
                break;
            }
        }
        cls.prototype.on = function(eventList, callback) {
            if (typeof this.__event_listeners__ === 'undefined') {
                this.__event_listeners__ = {};
            }
            var events = eventList.split(/\s+/);
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                if (!event.length) {
                    continue;
                }
                if (!acceptAll && !validEvents[event]) {
                    throw new Error('Invalid event "' + event + '"');
                }
                if (typeof this.__event_listeners__[event] === 'undefined') {
                    this.__event_listeners__[event] = [];
                }
                this.__event_listeners__[event].push(callback);
            }
            return this;
        };
        cls.prototype.off = function(eventList, callback) {
            if (typeof this.__event_listeners__ === 'undefined') {
                return this;
            }
            var events = eventList.split(/\s+/);
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                if (!event.length) {
                    continue;
                }
                if (!acceptAll && !validEvents[event]) {
                    throw new Error('Invalid event "' + event + '"');
                }
                if (typeof this.__event_listeners__[event] === 'undefined') {
                    continue;
                }
                if (typeof callback === 'undefined') {
                    delete this.__event_listeners__[event];
                } else {
                    var idx = this.__event_listeners__[event].indexOf(callback);
                    if (idx < 0) {
                        continue;
                    }
                    this.__event_listeners__[event].splice(idx, 1);
                    if (!this.__event_listeners__[event].length) {
                        delete this.__event_listeners__[event];
                    }
                }
            }
            return this;
        };
        cls.prototype.trigger = function(event) {
            if (!acceptAll && !validEvents[event]) {
                throw new Error('Invalid event "' + event + '"');
            }
            if (typeof this.__event_listeners__ === 'undefined' || typeof this.__event_listeners__[event] === 'undefined') {
                return true;
            }
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var listeners = [];
            for (var i = 0; i < this.__event_listeners__[event].length; i++) {
                listeners.push(this.__event_listeners__[event][i]);
            }
            var result = true;
            for (var i = 0; i < listeners.length; i++) {
                if (typeof this.__event_listeners__ === 'undefined' || typeof this.__event_listeners__[event] === 'undefined') {
                    break;
                }
                if (this.__event_listeners__[event].indexOf(listeners[i]) < 0) {
                    continue;
                }
                var tmp = listeners[i].apply(this, args);
                if (typeof tmp !== 'undefined' && !tmp) {
                    result = false;
                }
            }
            return result;
        };
    };

    var makeStaticEventListener = function(cls) {
        // XXX: Almost an exact copy of makeEventListener(),
        //      update accordingly.
        var validEvents = {};
        var acceptAll = false;
        for (var c = cls; c; c = c.__parent__) {
            if (typeof c.__conf__.__static__ === 'undefined' || typeof c.__conf__.__static__.__events__ === 'undefined') {
                continue;
            }
            if (c.__conf__.__static__.__events__ instanceof Array) {
                for (var i = 0; i < c.__conf__.__static__.__events__.length; i++) {
                    empty = false;
                    validEvents[c.__conf__.__static__.__events__[i]] = true;
                }
            } else if (c.__conf__.__static__.__events__) {
                acceptAll = true;
                break;
            }
        }
        cls.on = function(eventList, callback) {
            if (typeof cls.__event_listeners__ === 'undefined') {
                cls.__event_listeners__ = {};
            }
            var events = eventList.split(/\s+/);
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                if (!event.length) {
                    continue;
                }
                if (!acceptAll && !validEvents[event]) {
                    throw new Error('Invalid event "' + event + '"');
                }
                if (typeof cls.__event_listeners__[event] === 'undefined') {
                    cls.__event_listeners__[event] = [];
                }
                cls.__event_listeners__[event].push(callback);
            }
            return cls;
        };
        cls.off = function(eventList, callback) {
            if (typeof cls.__event_listeners__ === 'undefined') {
                return cls;
            }
            var events = eventList.split(/\s+/);
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                if (!event.length) {
                    continue;
                }
                if (!acceptAll && !validEvents[event]) {
                    throw new Error('Invalid event "' + event + '"');
                }
                if (typeof cls.__event_listeners__[event] === 'undefined') {
                    continue;
                }
                if (typeof callback === 'undefined') {
                    delete cls.__event_listeners__[event];
                } else {
                    var idx = cls.__event_listeners__[event].indexOf(callback);
                    if (idx < 0) {
                        continue;
                    }
                    cls.__event_listeners__[event].splice(idx, 1);
                    if (!cls.__event_listeners__[event].length) {
                        delete cls.__event_listeners__[event];
                    }
                }
            }
            return cls;
        };
        cls.trigger = function(event) {
            if (!acceptAll && !validEvents[event]) {
                throw new Error('Invalid event "' + event + '"');
            }
            if (typeof cls.__event_listeners__ === 'undefined' || typeof cls.__event_listeners__[event] === 'undefined') {
                return true;
            }
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var listeners = [];
            for (var i = 0; i < cls.__event_listeners__[event].length; i++) {
                listeners.push(cls.__event_listeners__[event][i]);
            }
            var result = true;
            for (var i = 0; i < listeners.length; i++) {
                if (typeof cls.__event_listeners__ === 'undefined' || typeof cls.__event_listeners__[event] === 'undefined') {
                    break;
                }
                if (cls.__event_listeners__[event].indexOf(listeners[i]) < 0) {
                    continue;
                }
                var tmp = listeners[i].apply(cls, args);
                if (typeof tmp !== 'undefined' && !tmp) {
                    result = false;
                }
            }
            return result;
        };
    };

    var checkConf = function(conf) {
        if (typeof conf !== 'object') {
            throw new Error('Class configuration not an object');
        }
        // make sure we have a sane class name
        if (!conf.__name__) {
            throw new Error('No class __name__ defined');
        }
        if (!/^_*[A-Z]/.test(conf.__name__)) {
            console.warn('Class names should start with a capital letter', conf.__name__);
        }
        if (!/^_*[a-zA-Z][a-zA-Z0-9_]*$/.test(conf.__name__)) {
            throw new Error('Invalid class name "' + conf.__name__ + '"');
        }
        // ensure __init__ is a function
        if (typeof conf.__init__ !== 'undefined') {
            if (typeof conf.__init__ !== 'function') {
                throw new Error(conf.__name__ + '.__init__ must be a function');
            }
        }
        // check conf.__parent__
        if (conf.__parent__ && !(conf.__parent__.__conf__ && conf.__parent__.__conf__.__name__)) {
            throw new Error(conf.__name__ + '.__parent__ is not an oop.Class type');
        }
    };

    var gatherParents = function(conf) {
        var parents = [oop.Class];
        if (!conf.__parent__) {
            return parents;
        }
        for (var parent = conf.__parent__; parent; parent = parent.__conf__.__parent__) {
            parents.push(parent);
        }
        parents = parents.reverse();
        return parents;
    };

    oop.Class = function(conf) {
        checkConf(conf);
        conf.__static_unbound__ = {};
        var clsName = conf.__name__;
        var parents = gatherParents(conf);
        // gather members
        var staticMembers = {};
        var staticMethods = {};
        var members = {};
        var methods = {};
        var static2cls = {};
        // gather inherited members
        parents.forEach(function(cls) {
            if (cls.__conf__.__static__) {
                for (var attr in cls.__conf__.__static__) {
                    var thing = cls.__conf__.__static__[attr];
                    if (typeof thing === 'function') {
                        staticMethods[attr] = cls.__conf__.__static_unbound__[attr];
                    } else {
                        staticMembers[attr] = thing;
                    }
                    static2cls[attr] = cls;
                }
            }
            for (var attr in cls.__conf__) {
                if (attr[0] === '_' && attr[1] === '_') {
                    continue;
                }
                var thing = cls.__conf__[attr];
                if (typeof thing === 'function') {
                    methods[attr] = cls.prototype[attr];
                } else {
                    members[attr] = thing;
                }
            }
        });
        // init prototype
        var prototype = conf.__parent__ ? Object.create(conf.__parent__.prototype) : oop.Class.prototype;
        // gather static members
        if (conf.__static__) {
            for (var attr in conf.__static__) {
                var thing = conf.__static__[attr];
                if (typeof thing === 'function') {
                    if (typeof staticMembers[attr] !== 'undefined') {
                        throw new Error('Static member ' + clsName + '.' + attr + ' was not a function in a parent class');
                    }
                    conf.__static_unbound__[attr] = prototype[attr] = staticMethods[attr] = createSubFunc(staticMethods[attr], thing, clsName + '__' + attr);
                } else {
                    if (typeof staticMethods[attr] === 'function') {
                        throw new Error('Static member ' + clsName + '.' + attr + ' was a function in a parent class');
                    }
                    prototype[attr] = staticMembers[attr] = thing;
                }
            }
        }
        // gather non-static members
        for (var attr in conf) {
            if (attr[0] === '_' && attr[1] === '_') {
                continue;
            }
            var thing = conf[attr];
            if (typeof thing === 'function') {
                if (attr !== 'toString' && typeof members[attr] !== 'undefined') {
                    throw new Error('Member ' + clsName + '.' + attr + ' was not a function in a parent class');
                }
                prototype[attr] = methods[attr] = createSubFunc(methods[attr], thing, clsName + '__' + attr);
            } else {
                if (typeof methods[attr] !== 'undefined') {
                    throw new Error('Member ' + clsName + '.' + attr + ' was a function in a parent class');
                }
                prototype[attr] = members[attr] = thing;
            }
        }
        // create class
        var cls = createConstructor(clsName, conf, parents, members, methods);
        for (var attr in staticMembers) {
            if (conf.__static__[attr]) {
                cls[attr] = staticMembers[attr];
            } else {
                (function(parent) {
                    Object.defineProperty(cls, attr, {
                        get: function() { return parent[attr]; },
                        set: function(value) { parent[attr] = value; },
                        enumerable: true,
                    });
                })(static2cls[attr]);
            }
        }
        for (var attr in staticMethods) {
            cls[attr] = staticMethods[attr].bind(cls);
        }
        cls.__conf__ = conf;
        cls.__name__ = conf.__name__;
        cls.prototype = prototype;
        cls.prototype.__class__ = cls;
        cls.toString = function() {
            return cls.__name__;
        };
        // make event listener
        // FIXME: the next few function calls should occur much earlier, before
        // the call to createConstructor().  otherwise the resulting methods
        // (on, off, etc.) cannot be bound to the instance by the constructor.
        if (conf.__events__) {
            makeEventListener(cls);
        }
        if (conf.__static__ && conf.__static__.__events__) {
            makeStaticEventListener(cls);
        }
        return cls;
    };

    oop.Class.__conf__ = {

        __name__: 'Class',

        __bind__: function(self, funcName) {
            console.warn('obj.__bind__("' + funcName + '") is deprecated, use obj.' + funcName + ' instead');
            if (typeof self[funcName] !== 'function') {
                throw new Error('Cannot __bind__() ' + self.__class__.__name__ + '.' + funcName + ': not a function');
            }
            return self[funcName];
        },

        toString: function(self) {
            return '<' + self.__class__.__name__ + ' object>';
        }

    };

    oop.Class.__name__ = 'Class';

    oop.Class.prototype.toString = function() {
        return oop.Class.__conf__.toString.call(this, this);
    };

    oop.Class.prototype.__bind__ = function(funcName) {
        return oop.Class.__conf__.__bind__.call(this, this, funcName);
    };

    oop.Exception = function(message) {
        Error.call(this);
        this.name = this.__class__.name;
        this.message = message;
        this.stack = (new Error()).stack;
    };

    oop.Exception.prototype = Error.prototype;

    oop.Exception.__conf__ = {
        __name__: "Exception"
    };

    return oop;

});
