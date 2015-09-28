.. image:: https://raw.githubusercontent.com/score-framework/doc/master/py.doc/score-banner.png
    :target: http://score-framework.org

`The SCORE Framework`_ is a collection of harmonized python and javascript
libraries for the development of large scale web projects. Powered by strg.at_.

.. _The SCORE Framework: http://score-framework.org
.. _strg.at: http://strg.at

score.oop
=========

.. _js_oop:

This module provides helpers for supporting an object oriented programming
style, which is our preferred way of programming in javascript. Several
implementation details are heavily dependent on personal taste, which means
that it is well possible that you might encounter some alien definitions.

The whole module tries to mimic classes in python for two reasons:

- we are also python developers, and
- python, the programming language, has much more elegant design decisions
  than javascript when it comes to OOP [#]_.
  

Creating Classes
----------------

The basic usage of the module is as follows::

    var Animal = oop.Class({

        __init__: function(self) {
            console.log('Animal constructor')
        }

    });

This call creates a trivial class that will log a debug message into the
console whenever the it is instantiated. Note that the first argument to all
functions is *always* the current object, i.e. *this*. This saves us a lot of
time, as the usual ``var self = this;`` declaration is sometimes forgotten.

The object passed to the function `oop.Class` is stored unmodified as the
`__conf__` property of the class. This means that the following code will
print `true`::

    var conf = {

        __init__: function(self) {
            console.log('Animal constructor')
        }

    };
    var Animal = oop.Class(conf);
    console.log(Animal.__conf__ === conf);

A best practise is to provide a class name as `__name__`, which will then be
available as an attribute to the class::

    var Animal = oop.Class({
        __name__: 'Animal',

        __init__: function(self) {
            console.log(self.__class__.__name__ + ' constructor')
        }

    });


Attributes
----------

You can define the default values of attributes as well. Such values are
specific to each object, meaning that the following code will print two
distinct speed values::

    var Animal = oop.Class({
        __name__: 'Animal',

        __init__: function(self) {
            console.log('Animal constructor')
        },

        speed: 10

    });

    var a = new Animal();
    a.speed = 9;
    var b = new Animal();
    a.speed = 8;
    console.log(a.speed); // 8
    console.log(b.speed); // 10


Sub-Classing
------------

In order to create a sub-class, you only need to pass the configuration value
`__parent__`::

    var Animal = oop.Class({
        __name__: 'Animal',

        __init__: function(self) {
            console.log('Animal constructor')
        }

    });

    var Bird = oop.Class({
        __name__: 'Bird',
        __parent__: Animal,

        __init__: function(self) {
            console.log('Bird constructor')
            self.__super__();
        }

    });

    var swallow = new Bird();
    swallow instanceof Animal;
    swallow instanceof Bird;

The above code will call the child constructor, followed by the base
constructor. As you can see, the matching function of the base class can
always be accessed via `self.__super__()`. This is true for *all* member
functions, not just the constructor::

    var Animal = oop.Class({
        __name__: 'Animal',

        carry: function(self, object) {
            console.log('Carrying ' + object);
        },

        drop: function(self, object) {
            console.log('Dropping ' + object);
        }

    });

    var Bird = oop.Class({
        __name__: 'Bird',

        speed: 10,

        carry: function(self, object) {
            self.__super__(object);
            self.speed = 1;
        },

        drop: function(self) {
            self.__super__();
            self.speed = 10;
        }

    });

    var swallow = new Bird();
    swallow.carry('coconut');


Static Attributes
-----------------

You can assign static values to the *class* (in contrast to the *objects* of
the class) by passing another configuration value called `__static__`::

    var Animal = oop.Class({
        __name__: 'Animal',

        __static__: {
            minSpeed: 9,
            maxSpeed: 11
        }

        __init__: function(self) {
            var cls = self.__class__;
            var diff = cls.maxSpeed - cls.minSpeed;
            self.speed = (int) (Math.random() * diff) + cls.minSpeed;
        }

    });

    console.log(Animal.minSpeed); // 9
    console.log(Animal.maxSpeed); // 11

    var a = new Animal();
    console.log(a.minSpeed); // undefined

All non-function values of the `__static__` object will only be accessible
through the class itself. Functions, on the other hand, will be accessible
through instances of the class, too. Note that the first parameter to *static*
functions is always the class itself::

    var Animal = oop.Class({
        __name__: 'Animal',

        __static__: {
            minSpeed: 9,
            maxSpeed: 11,
            randomSpeed: function(cls) {
                var diff = cls.maxSpeed - cls.minSpeed;
                return (int) (Math.random() * diff) + cls.minSpeed;
            }
        }

        __init__: function(self) {
            self.speed = self.__class__.randomSpeed();
        }

    });

    console.log(Animal.randomSpeed()); // 9
    console.log(Animal.randomSpeed()); // 10

    var a = new Animal();
    console.log(a.randomSpeed()); // 11

The *cls* parameter will receive the class the static function was called on,
not the one it was defined in. The following code uses different min and max
values for the same calculation, for example::

    var Snail = oop.Class({
        __name__: 'Snail',
        __parent__: Animal,

        __static__: {
            minSpeed: 0,
            maxSpeed: 1
        }

    });

    var otto = new Snail();
    console.log(otto.speed); // 1


Events
------

It is possible to mark a class as an events source by providing an
`__events__` configuration::

    var Animal = oop.Class({
        __name__: 'Animal',
        __events__: ['running', 'stopping'],

        run: function(self) {
            self.trigger('running', self.speed);
        },

        // ....

    });

    var otto = new Snail();

    otto.on('running', function(speed) {
        console.log('Otto started running at speed ' + speed);
    });

Providing a list of possible `__events__` creates the two methods `on` and
`trigger`. The `trigger` function just needs the name of an event, but all
additional arguments will be delegated to the callback functions registered
with `on`. The context of the callback (i.e. the `this` value) is always the
object triggering the event.

Both functions will throw an `Error` if the provided event name was
not configured.

Static Events
`````````````

It is also possible to configure event handling at the class level. In such
cases, the context of these callbacks is the class::

    var Animal = oop.Class({
        __name__: 'Animal',

        __static__: {
            __events__: ['create'],
        }

        __init__: function(self) {
            Snail.trigger('create', self);
        }

    });

    Animal.on('create', function(snail) {
        console.log('Created new ' + this.__name__);
    });

    var Snail = oop.Class({
        __name__: 'Snail',
        __parent__: Animal

    });

    new Snail(); // prints "Created new Snail" 


License
=======

Copyright © 2015 STRG.AT GmbH, Vienna, Austria

All files in and beneath this directory are part of The SCORE Framework.
The SCORE Framework and all its parts are free software: you can redistribute
them and/or modify them under the terms of the GNU Lesser General Public
License version 3 as published by the Free Software Foundation which is in the
file named COPYING.LESSER.txt.

The SCORE Framework and all its parts are distributed without any WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. For more details see the GNU Lesser General Public License.

If you have not received a copy of the GNU Lesser General Public License see
http://www.gnu.org/licenses/.

The License-Agreement realised between you as Licensee and STRG.AT GmbH as
Licenser including the issue of its valid conclusion and its pre- and
post-contractual effects is governed by the laws of Austria. Any disputes
concerning this License-Agreement including the issue of its valid conclusion
and its pre- and post-contractual effects are exclusively decided by the
competent court, in whose district STRG.AT GmbH has its registered seat, at the
discretion of STRG.AT GmbH also the competent court, in whose district the
Licensee has his registered seat, an establishment or assets.


Footnotes
=========

.. [#] This is mostly because javascript evolved under the influence of
  various browser vendors and committees with very few opportunities for
  breaking changes, whereas python has a benovelent dictator and has undergone
  radical rewrites in the past.
