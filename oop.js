/**
 * Copyright © 2015,2016 STRG.AT GmbH, Vienna, Austria
 *
 * This file is part of the The SCORE Framework.
 *
 * The SCORE Framework and all its parts are free software: you can redistribute
 * them and/or modify them under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation which is in the
 * file named COPYING.LESSER.txt.
 *
 * The SCORE Framework and all its parts are distributed without any WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. For more details see the GNU Lesser General Public
 * License.
 *
 * If you have not received a copy of the GNU Lesser General Public License see
 * http://www.gnu.org/licenses/.
 *
 * The License-Agreement realised between you as Licensee and STRG.AT GmbH as
 * Licenser including the issue of its valid conclusion and its pre- and
 * post-contractual effects is governed by the laws of Austria. Any disputes
 * concerning this License-Agreement including the issue of its valid conclusion
 * and its pre- and post-contractual effects are exclusively decided by the
 * competent court, in whose district STRG.AT GmbH has its registered seat, at
 * the discretion of STRG.AT GmbH also the competent court, in whose district the
 * Licensee has his registered seat, an establishment or assets.
 */

// Universal Module Loader
// https://github.com/umdjs/umd
// https://github.com/umdjs/umd/blob/v1.0.0/returnExports.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['score.init'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('score.init'));
    } else {
        // Browser globals (root is window)
        factory(root.score);
  }
}(this, function (score) {

    score.extend('oop', [], function() {

        var oop = {
            __version__: "0.4.2"
        };

        var superRe = /\b__super__\b/;
        var argumentsRe = /\barguments\b/;

        /**
         * Extracts a function's parameter names.
         * Expects Function.toString() to return the whole function definition,
         * which should work for all supported browsers. Handles comments and
         * arbitrary whitespace in function definition correctly.
         * @return array
         */
        var extractParameterNames = function(function_) {
            var i = 0;
            var funcStr = extractParameterNames.toString.call(function_);
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
            };
            var startIdx = skipTo('(') + 1;
            var stopIdx = skipTo(')');
            return funcStr
                .substring(startIdx, stopIdx)
                .replace(/\/\*.*?\*\//, '')
                .replace(/\/\/.*?\n/, '')
                .trim()
                .split(/\s*,\s*/);
        };

        /**
         * Creates a wrapper function for given *function_* with given *name*,
         * which will provide various features:
         * - The wrapped *function_* will always receive `this` as first argument.
         * - The given *__super__* function will be accessible as
         *   `this.__super__()` within the function body.
         */
        var createSubFunc = function(__super__, function_, name) {
            if (!argumentsRe.test(function_) && function_.length === 0 && (!__super__ || !superRe.test(function_))) {
                // none of the features below are required,
                // just return the function
                return function_;
            }
            var args = extractParameterNames(function_).slice(1);
            var declaration = 'function ' + name + '(' + args.join(', ') + ') {\n';
            var body;
            if (argumentsRe.test(function_)) {
                // function body contains `arguments`, so we will pass the received
                // arguments to the function.  this is a bad scenario
                // performance-wise, as usage of `arguments` causes the browser to
                // handle the function differently.
                body = '    var __args__ = new Array(arguments.length + 1);\n' +
                       '    __args__[0] = this;\n' +
                       '    for (var i = 0; i < arguments.length; i++) {\n' +
                       '        __args__[i + 1] = arguments[i];\n' +
                       '    }\n' +
                       '    var __result__ = function_.apply(this, __args__);\n';
            } else if (function_.length > 1) {
                body = '    var __result__ = function_.call(this, this, ' + args.join(', ') + ');\n';
            } else if (function_.length == 1) {
                body = '    var __result__ = function_.call(this, this);\n';
            } else {
                body = '    var __result__ = function_.call(this);\n';
            }
            if (__super__ && superRe.test(function_)) {
                // store the current value of this.__super__ so we may restore it
                // after the function call.  every function will have a correct
                // __super__ value this way, even when calling one such function
                // from another.
                body = '    var __previous_super__ = this.__super__;\n' +
                       '    this.__super__ = __super__.bind(this);\n' +
                       body +
                       '    this.__super__ = __previous_super__;\n';
            } else {
                body = '    var __previous_super__ = this.__super__;\n' +
                       '    delete this.__super__;\n' +
                       body +
                       '    this.__super__ = __previous_super__;\n';
            }
            body += '    return __result__;\n}';
            // console.log('[' + declaration + body + ']');
            /* jshint -W061 */ return eval('[' + declaration + body + ']')[0];
        };

        var createConstructor = function(name, conf, parents, members, methods) {
            var __init__, __parent_init__;
            if (conf.__init__) {
                __init__ = conf.__init__;
            }
            for (var i = parents.length - 1; i >= 0; i--) {
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
                call = '        return new ' + name + '(' + args.join(', ') + ');\n';
            }
            body = '    if (!(this instanceof ' + name + ')) {\n' +
                        call +
                   '    }\n';
            if (parents[parents.length - 1].prototype.__events__) {
                body += '        this.__events__ = {\n' +
                        '            validNames: ' + name + '.prototype.__events__.validNames,\n' +
                        '            listeners: {}\n' +
                        '        };\n';
            }
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
            /* jshint -W061 */ return eval('[' + declaration + body + ']')[0];
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

        /**
         * Returns the configured inheritance chain as a list.
         * The first entry will always be oop.Class, the last entry will always be
         * the configured __parent__ (if there is one).
         */
        var gatherParents = function(conf) {
            if (!conf.__parent__) {
                return [oop.Class];
            }
            var parents = [];
            for (var parent = conf.__parent__; parent; parent = parent.__conf__.__parent__) {
                parents.push(parent);
            }
            if (parents[parents.length - 1] !== oop.Exception) {
                parents.push(oop.Class);
            }
            parents = parents.reverse();
            return parents;
        };

        oop.Class = function(conf) {
            checkConf(conf);
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
                        if (attr[0] === '_' && attr[1] === '_') {
                            continue;
                        }
                        var thing = cls.__conf__.__static__[attr];
                        if (typeof thing === 'function') {
                            staticMethods[attr] = cls.__conf__.__static__.__unbound__[attr];
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
            var prototype = Object.create(conf.__parent__ ? conf.__parent__.prototype : oop.Class.prototype);
            // gather static members
            if (conf.__static__) {
                conf.__static__.__unbound__ = {};
                for (var attr in conf.__static__) {
                    var thing = conf.__static__[attr];
                    if (typeof thing === 'function') {
                        if (typeof staticMembers[attr] !== 'undefined') {
                            throw new Error('Static member ' + clsName + '.' + attr + ' was not a function in a parent class');
                        }
                        conf.__static__.__unbound__[attr] = prototype[attr] = staticMethods[attr] = createSubFunc(staticMethods[attr], thing, clsName + '__' + attr);
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
                cls[attr] = staticMembers[attr];
            }
            for (var attr in staticMethods) {
                cls[attr] = staticMethods[attr].bind(cls);
            }
            cls.__conf__ = conf;
            cls.__name__ = conf.__name__;
            cls.prototype = prototype;
            cls.prototype.__class__ = cls;
            cls.prototype.constructor = cls;
            cls.toString = function() {
                return '<' + cls.__name__ + ' class>';
            };
            // handle event definitions
            setEventNames(cls, conf, true);
            if (conf.__events__) {
                setEventNames(cls, conf, false);
            }
            return cls;
        };

        var setEventNames = function(cls, conf, static_) {
            var names = {}, inheritedNames;
            if (!static_ && conf.__parent__) {
                inheritedNames = conf.__parent__.prototype.__events__.validNames;
                if (inheritedNames === '__all__') {
                    names = '__all__';
                } else {
                    for (var name in inheritedNames) {
                        names[name] = inheritedNames[name];
                    }
                }
            }
            var events = conf.__events__;
            if (static_) {
                events = [];
                if (conf.__static__ && conf.__static__.__events__) {
                    events = conf.__static__.__events__;
                }
            }
            if (events instanceof Array) {
                for (var i = 0; i < events.length; i++) {
                    names[events[i]] = cls;
                }
            } else if (events) {
                names = '__all__';
            }
            if (static_) {
                cls.__events__ = {
                    validNames: names,
                    listeners: {}
                };
            } else {
                cls.prototype.__events__ = {
                    validNames: names,
                    listeners: {}
                };
            }
        };

        var eventFunctions = {

            on: function(self, eventList, callback) {
                var events = eventList.trim().split(/\s+/);
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    if (self.__events__.validNames !== '__all__' && !self.__events__.validNames[event]) {
                        throw new Error('Invalid event "' + event + '"');
                    }
                    if (typeof self.__events__.listeners[event] === 'undefined') {
                        self.__events__.listeners[event] = [];
                    }
                    self.__events__.listeners[event].push(callback);
                }
                return self;
            },

            off: function(self, eventList, callback) {
                var events = eventList.trim().split(/\s+/);
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    if (self.__events__.validNames !== '__all__' && !self.__events__.validNames[event]) {
                        throw new Error('Invalid event "' + event + '"');
                    }
                    if (typeof self.__events__.listeners[event] === 'undefined') {
                        continue;
                    }
                    if (typeof callback === 'undefined') {
                        delete self.__events__.listeners[event];
                    } else {
                        var idx = self.__events__.listeners[event].indexOf(callback);
                        if (idx < 0) {
                            continue;
                        }
                        if (self.__events__.listeners[event].length == 1) {
                            delete self.__events__.listeners[event];
                        } else {
                            self.__events__.listeners[event].splice(idx, 1);
                        }
                    }
                }
                return self;
            },

            trigger: function(self, event) {
                if (self.__events__.validNames !== '__all__' && !self.__events__.validNames[event]) {
                    throw new Error('Invalid event "' + event + '"');
                }
                if (typeof self.__events__.listeners[event] === 'undefined') {
                    return true;
                }
                var args = [];
                for (var i = 2; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                var listeners = self.__events__.listeners[event].slice(0);
                var result = true;
                for (var i = 0; i < listeners.length; i++) {
                    var funcResult = listeners[i].apply(self, args);
                    if (typeof funcResult !== 'undefined' && !funcResult) {
                        result = false;
                    }
                }
                return result;
            }

        };

        oop.Class.__conf__ = {
            __name__: 'Class',

            __static__: {

                __events__: [],

                on: eventFunctions.on,

                off: eventFunctions.off,

                trigger: eventFunctions.trigger,

                __unbound__: {
                    on: function(eventList, callback) {
                        return oop.Class.on.call(this, this, eventList, callback);
                    },
                    off: function(eventList, callback) {
                        return oop.Class.off.call(this, this, eventList, callback);
                    },
                    trigger: function(event) {
                        var args = new Array(arguments.length + 1);
                        args[0] = this;
                        for (var i = 0; i < arguments.length; i++) {
                            args[i + 1] = arguments[i];
                        }
                        return oop.Class.trigger.apply(this, args);
                    },
                }

            },

            __events__: [],

            on: eventFunctions.on,

            off: eventFunctions.off,

            trigger: eventFunctions.trigger,

            toString: function(self) {
                return '<' + self.__class__.__name__ + ' object>';
            }

        };

        oop.Class.__name__ = 'Class';

        oop.Class.__events__ = {validNames: {}, listeners: {}};

        oop.Class.on = oop.Class.__conf__.__static__.on.bind(oop.Class);

        oop.Class.off = oop.Class.__conf__.__static__.off.bind(oop.Class);

        oop.Class.trigger = oop.Class.__conf__.__static__.trigger.bind(oop.Class);

        oop.Class.prototype.__events__ = {validNames: {}, listeners: {}};

        oop.Class.prototype.on = function Class__on(eventList, callback) {
            return eventFunctions.on.call(this, this, eventList, callback);
        };

        oop.Class.prototype.off = function Class__off(eventList, callback) {
            return eventFunctions.off.call(this, this, eventList, callback);
        };

        oop.Class.prototype.trigger = function Class__trigger(event) {
            var args = new Array(arguments.length + 1);
            args[0] = this;
            for (var i = 0; i < arguments.length; i++) {
                args[i + 1] = arguments[i];
            }
            return eventFunctions.trigger.apply(this, args);
        };

        oop.Class.prototype.toString = function() {
            return oop.Class.__conf__.toString.call(this, this);
        };

        oop.Class.prototype.__str__ = oop.Class.prototype.toString;

        oop.Exception = function(message) {
            return oop.Exception.__conf__.__init__.call(this, this, message);
        };

        oop.Exception.__conf__ = {
            __name__: "Exception",

            __init__: function(self, message) {
                Error.call(this);
                this.name = this.__class__.__name__;
                this.message = message;
                this.stack = (new Error()).stack;
            }
        };

        oop.Exception.__name__ = oop.Exception.__conf__.__name__;

        oop.Exception.__init__ = oop.Exception.__conf__.__init__;

        oop.Exception.prototype = Object.create(Error.prototype);

        oop.Exception.prototype.toString = function() {
            return oop.Class.__conf__.toString.call(this, this);
        };

        oop.Exception.prototype.__class__ = oop.Exception;

        oop.Exception.prototype.__str__ = oop.Exception.prototype.toString;

        return oop;

    });

}));
