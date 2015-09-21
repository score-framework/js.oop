define('lib/score/oop', [], function() {

    var oop = {};

    var superRe = /xyz/.test(function(){xyz;}) ? /\b__super__\b/ : /.*/;
    var argumentsRe = /xyz/.test(function(){xyz;}) ? /\barguments\b/ : /.*/;

    var createSubFunc = function(__super__, func, name) {
        if (!name) {
            name = 'UnnamedClass';
        }
        var numargs = func.length;
        if (!argumentsRe.test(func)) {
            if (numargs === 0) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '() {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return func;
                }
            } else if (numargs === 1) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '() {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this, this);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return eval('[function ' + name + '() {\n' +
                    '    return func.call(this, this);\n' +
                    '}]')[0];
                }
            } else if (numargs === 2) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '(arg1) {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this, this, arg1);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return eval('[function ' + name + '(arg1) {\n' +
                    '    return func.call(this, this, arg1);\n' +
                    '}]')[0];
                }
            } else if (numargs === 3) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '(arg1, arg2) {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this, this, arg1, arg2);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return eval('[function ' + name + '(arg1, arg2) {\n' +
                    '    return func.call(this, this, arg1, arg2);\n' +
                    '}]')[0];
                }
            } else if (numargs === 4) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '(arg1, arg2, arg3) {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this, this, arg1, arg2, arg3);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return eval('[function ' + name + '(arg1, arg2, arg3) {\n' +
                    '    return func.call(this, this, arg1, arg2, arg3);\n' +
                    '}]')[0];
                }
            } else if (numargs === 5) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '(arg1, arg2, arg3, arg4) {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this, this, arg1, arg2, arg3, arg4);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return eval('[function ' + name + '(arg1, arg2, arg3, arg4) {\n' +
                    '    return func.call(this, this, arg1, arg2, arg3, arg4);\n' +
                    '}]')[0];
                }
            } else if (numargs === 6) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '(arg1, arg2, arg3, arg4, arg5) {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this, this, arg1, arg2, arg3, arg4, arg5);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return eval('[function ' + name + '(arg1, arg2, arg3, arg4, arg5) {\n' +
                    '    return func.call(this, this, arg1, arg2, arg3, arg4, arg5);\n' +
                    '}]')[0];
                }
            } else if (numargs === 7) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '(arg1, arg2, arg3, arg4, arg5, arg6) {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this, this, arg1, arg2, arg3, arg4, arg5, arg6);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return eval('[function ' + name + '(arg1, arg2, arg3, arg4, arg5, arg6) {\n' +
                    '    return func.call(this, this, arg1, arg2, arg3, arg4, arg5, arg6);\n' +
                    '}]')[0];
                }
            } else if (numargs === 8) {
                if (__super__ && superRe.test(func)) {
                    return eval('[function ' + name + '(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {\n' +
                    '    var tmp = this.__super__;\n' +
                    '    this.__super__ = __super__;\n' +
                    '    var result = func.call(this, this, arg1, arg2, arg3, arg4, arg5, arg6, arg7);\n' +
                    '    this.__super__ = tmp;\n' +
                    '    return result;\n' +
                    '}]')[0];
                } else {
                    return eval('[function ' + name + '(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {\n' +
                    '    return func.call(this, this, arg1, arg2, arg3, arg4, arg5, arg6, arg7);\n' +
                    '}]')[0];
                }
            }
        }
        if (!argumentsRe.test(func)) {
            var args = Array(numargs + 1);
            if (__super__ && superRe.test(func)) {
                return eval('[function ' + name + '() {\n' +
                '    args[0] = this;\n' +
                '    for (var i = numargs - 1; i >= 0; i--) {\n' +
                '        args[i + 1] = arguments[i];\n' +
                '    }\n' +
                '    var tmp = this.__super__;\n' +
                '    this.__super__ = __super__;\n' +
                '    var result = func.apply(this, args);\n' +
                '    this.__super__ = tmp;\n' +
                '    return result;\n' +
                '}]')[0];
            } else {
                return eval('[function ' + name + '() {\n' +
                '    args[0] = this;\n' +
                '    for (var i = numargs - 1; i >= 0; i--) {\n' +
                '        args[i + 1] = arguments[i];\n' +
                '    }\n' +
                '    return func.apply(this, args);\n' +
                '}]')[0];
            }
        }
        if (__super__ && superRe.test(func)) {
            return eval('[function ' + name + '() {\n' +
            '    var args = Array(arguments.length + 1);\n' +
            '    args[0] = this;\n' +
            '    for (var i = arguments.length - 1; i >= 0; i--) {\n' +
            '        args[i + 1] = arguments[i];\n' +
            '    }\n' +
            '    var tmp = this.__super__;\n' +
            '    this.__super__ = __super__;\n' +
            '    var result = func.apply(this, args);\n' +
            '    this.__super__ = tmp;\n' +
            '    return result;\n' +
            '}]')[0];
        } else {
            return eval('[function ' + name + '() {\n' +
            '    var args = Array(arguments.length + 1);\n' +
            '    args[0] = this;\n' +
            '    for (var i = arguments.length - 1; i >= 0; i--) {\n' +
            '        args[i + 1] = arguments[i];\n' +
            '    }\n' +
            '    return func.apply(this, args);\n' +
            '}]')[0];
        }
    };

    oop.Class = function(conf) {
        if (typeof conf === 'undefined') {
            conf = {};
        }
        var clsName = conf.__name__ ? conf.__name__ : 'UnnamedClass';
        var cls;
        if (typeof conf.__init__ !== 'undefined') {
            cls = createSubFunc(conf.__parent__, conf.__init__, clsName);
        } else if (conf.__parent__) {
            cls = createSubFunc(conf.__parent__, function(self) {
                var args = [];
                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                conf.__parent__.apply(self, args);
            }, clsName);
        } else {
            cls = createSubFunc(null, function() {}, clsName);
        }
        if (conf.__parent__) {
            cls.__parent__ = conf.__parent__;
            if (typeof Object.create === 'function') {
                cls.prototype = Object.create(conf.__parent__.prototype);
            } else {
                cls.prototype = {};
                for (var i in conf.__parent__.prototype) {
                    cls.prototype[i] = conf.__parent__.prototype[i];
                }
            }
            cls.prototype.constructor = cls;
        } else {
            cls.prototype = {};
            cls.prototype.__bind__ = function(funcname /* args */) {
                var self = this;
                if (typeof self[funcname] !== 'function') {
                    throw new Error(cls.__name__ + ' has no function ' + funcname);
                }
                if (arguments.length == 1) {
                    if (typeof self.__bound_methods__ === 'undefined') {
                        self.__bound_methods__ = {};
                    }
                    if (typeof self.__bound_methods__[funcname] === 'undefined') {
                        self.__bound_methods__[funcname] = function() {
                            return self[funcname].apply(self, arguments);
                        };
                    }
                    return self.__bound_methods__[funcname];
                }
                var args = [];
                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                return function() {
                    var newArgs = args;
                    if (arguments.length) {
                        newArgs = [];
                        for (var i = 0; i < args.length; i++) {
                            newArgs.push(args[i]);
                        }
                        for (var i = 0; i < arguments.length; i++) {
                            newArgs.push(arguments[i]);
                        }
                    }
                    return self[funcname].apply(self, newArgs);
                };
            };
        }
        cls.__conf__ = conf;
        if (conf.__name__) {
            cls.__name__ = conf.__name__;
            cls.toString = function() {
                return cls.__name__;
            };
            cls.prototype.toString = function() {
                return cls.__name__;
            };
        }
        cls.prototype.__class__ = cls;
        for (var parent = conf.__parent__; parent; parent = parent.__conf__.__parent__) {
            if (!parent.__conf__.__static__) {
                continue;
            }
            for (var attr in parent.__conf__.__static__) {
                if (attr[0] === '_' && attr[1] === '_') {
                    continue;
                }
                var value = parent.__conf__.__static__[attr];
                if (typeof value === 'function') {
                    cls[attr] = parent[attr];
                }
            }
        }
        if (conf.__static__) {
            if (conf.__static__.__events__) {
                oop.makeStaticEventListener(cls, conf.__static__.__events__);
            }
            for (var attr in conf.__static__) {
                if (attr[0] === '_' && attr[1] === '_') {
                    continue;
                }
                var value = conf.__static__[attr];
                if (typeof value === 'function') {
                    var __super__ = null;
                    if (conf.__parent__ && conf.__parent__.__conf__.__static__ && typeof conf.__parent__.__conf__.__static__[attr] === 'function') {
                        __super__ = conf.__parent__.__conf__.__static__[attr];
                    }
                    value = createSubFunc(__super__, conf.__static__[attr], clsName + '__' + attr);
                    cls.prototype[attr] = (function(value) {
                        return function() {
                            return value.apply(this.__class__, arguments);
                        };
                    })(value);
                } else {
                    cls.prototype[attr] = value;
                }
                cls[attr] = value;
            }
        }
        for (var attr in conf) {
            if (attr[0] === '_' && attr[1] === '_') {
                continue;
            }
            var value = conf[attr];
            if (typeof value === 'function') {
                var __super__ = null;
                if (conf.__parent__ && typeof conf.__parent__.prototype[attr] === 'function') {
                    __super__ = conf.__parent__.prototype[attr];
                }
                value = createSubFunc(__super__, conf[attr], clsName + '__' + attr);
            }
            cls.prototype[attr] = value;
        }
        if (conf.__events__) {
            oop.makeEventListener(cls, conf.__events__);
        }
        return cls;
    };

    oop.makeEventListener = function(cls) {
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

    oop.makeStaticEventListener = function(cls) {
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
