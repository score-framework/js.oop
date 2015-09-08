define('lib/score/oop', [], function() {

    var oop = {};

    var superRe = /xyz/.test(function(){xyz;}) ? /\b__super__\b/ : /.*/;
    var argumentsRe = /xyz/.test(function(){xyz;}) ? /\barguments\b/ : /.*/;

    var createSubFunc = function(__super__, func) {
        var numargs = func.length;
        if (!argumentsRe.test(func)) {
            if (numargs === 0) {
                if (__super__ && superRe.test(func)) {
                    return function() {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return func;
                }
            } else if (numargs === 1) {
                if (__super__ && superRe.test(func)) {
                    return function() {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this, this);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return function() {
                        return func.call(this, this);
                    };
                }
            } else if (numargs === 2) {
                if (__super__ && superRe.test(func)) {
                    return function(arg1) {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this, this, arg1);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return function(arg1) {
                        return func.call(this, this, arg1);
                    };
                }
            } else if (numargs === 3) {
                if (__super__ && superRe.test(func)) {
                    return function(arg1, arg2) {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this, this, arg1, arg2);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return function(arg1, arg2) {
                        return func.call(this, this, arg1, arg2);
                    };
                }
            } else if (numargs === 4) {
                if (__super__ && superRe.test(func)) {
                    return function(arg1, arg2, arg3) {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this, this, arg1, arg2, arg3);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return function(arg1, arg2, arg3) {
                        return func.call(this, this, arg1, arg2, arg3);
                    };
                }
            } else if (numargs === 5) {
                if (__super__ && superRe.test(func)) {
                    return function(arg1, arg2, arg3, arg4) {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this, this, arg1, arg2, arg3, arg4);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return function(arg1, arg2, arg3, arg4) {
                        return func.call(this, this, arg1, arg2, arg3, arg4);
                    };
                }
            } else if (numargs === 6) {
                if (__super__ && superRe.test(func)) {
                    return function(arg1, arg2, arg3, arg4, arg5) {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this, this, arg1, arg2, arg3, arg4, arg5);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return function(arg1, arg2, arg3, arg4, arg5) {
                        return func.call(this, this, arg1, arg2, arg3, arg4, arg5);
                    };
                }
            } else if (numargs === 7) {
                if (__super__ && superRe.test(func)) {
                    return function(arg1, arg2, arg3, arg4, arg5, arg6) {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this, this, arg1, arg2, arg3, arg4, arg5, arg6);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return function(arg1, arg2, arg3, arg4, arg5, arg6) {
                        return func.call(this, this, arg1, arg2, arg3, arg4, arg5, arg6);
                    };
                }
            } else if (numargs === 8) {
                if (__super__ && superRe.test(func)) {
                    return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
                        var tmp = this.__super__;
                        this.__super__ = __super__;
                        var result = func.call(this, this, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                        this.__super__ = tmp;
                        return result;
                    };
                } else {
                    return function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
                        return func.call(this, this, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                    };
                }
            }
        }
        if (!argumentsRe.test(func)) {
            var args = Array(numargs + 1);
            if (__super__ && superRe.test(func)) {
                return function() {
                    args[0] = this;
                    for (var i = numargs - 1; i >= 0; i--) {
                        args[i + 1] = arguments[i];
                    }
                    var tmp = this.__super__;
                    this.__super__ = __super__;
                    var result = func.apply(this, args);
                    this.__super__ = tmp;
                    return result;
                };
            } else {
                return function() {
                    args[0] = this;
                    for (var i = numargs - 1; i >= 0; i--) {
                        args[i + 1] = arguments[i];
                    }
                    return func.apply(this, args);
                };
            }
        }
        if (__super__ && superRe.test(func)) {
            return function() {
                var args = Array(arguments.length + 1);
                args[0] = this;
                for (var i = arguments.length - 1; i >= 0; i--) {
                    args[i + 1] = arguments[i];
                }
                var tmp = this.__super__;
                this.__super__ = __super__;
                var result = func.apply(this, args);
                this.__super__ = tmp;
                return result;
            };
        } else {
            return function() {
                var args = Array(arguments.length + 1);
                args[0] = this;
                for (var i = arguments.length - 1; i >= 0; i--) {
                    args[i + 1] = arguments[i];
                }
                return func.apply(this, args);
            };
        }
    };

    oop.Class = function(conf) {
        if (typeof conf === 'undefined') {
            conf = {};
        }
        var cls;
        if (typeof conf.__init__ !== 'undefined') {
            cls = createSubFunc(conf.__parent__, conf.__init__);
        } else if (conf.__parent__) {
            cls = createSubFunc(conf.__parent__, function(self) {
                var args = [];
                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                conf.__parent__.apply(self, args);
            });
        } else {
            cls = createSubFunc(null, function() {});
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
                    if (arguments.length && typeof console === 'object' && typeof console.warn === 'function') {
                        console.warn('ignoring new arguments during invocation of bound function with arguments');
                    }
                    return self[funcname].apply(self, args);
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
                value = createSubFunc(__super__, conf[attr]);
            }
            cls.prototype[attr] = value;
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
                    value = createSubFunc(__super__, conf.__static__[attr]);
                    if (typeof cls.prototype[attr] === 'undefined') {
                        cls.prototype[attr] = (function(value) {
                            return function() {
                                value.apply(this.__class__, arguments);
                            };
                        })(value);
                    }
                } else {
                    cls.prototype[attr] = value;
                }
                cls[attr] = value;
            }
        }
        if (conf.__parent__ && conf.__parent__.__conf__.__static__) {
            for (var attr in conf.__parent__.__conf__.__static__) {
                if (attr[0] === '_' && attr[1] === '_') {
                    continue;
                }
                var value = conf.__parent__.__conf__.__static__[attr];
                if (typeof value === 'function') {
                    cls[attr] = conf.__parent__[attr];
                }
            }
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
                return;
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
            var result = true;
            for (var i = 0; i < this.__event_listeners__[event].length; i++) {
                var tmp = this.__event_listeners__[event][i].apply(this, args);
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
                return;
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
            var result = true;
            for (var i = 0; i < cls.__event_listeners__[event].length; i++) {
                var tmp = cls.__event_listeners__[event][i].apply(cls, args);
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
