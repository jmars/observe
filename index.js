(function umd(require){
  if (typeof exports === 'object') {
    module.exports = require('1');
  } else if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function(){ return require('1'); });
  } else {
    this['observe'] = require('1');
  }
})((function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @api public
   */

  function require(name){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];
    var threw = true;

    try {
      fn.call(m.exports, function(req){
        var dep = modules[id][1][req];
        return require(dep || req);
      }, m, m.exports, outer, modules, cache, entries);
      threw = false;
    } finally {
      if (threw) {
        delete cache[id];
      } else if (name) {
        // expose as 'name'.
        cache[name] = cache[id];
      }
    }

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.observe = observe;
exports.unobserve = unobserve;
exports.notify = notify;
exports.start = start;
exports.stop = stop;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Watched = [];

var Callback = Symbol('observe:callback');
var Pending = Symbol('observe:pending');

function Descriptor(name, object, callback) {
  var _Object$create;

  return Object.seal(Object.assign(Object.create(null, (_Object$create = {}, _defineProperty(_Object$create, Callback, { value: callback }), _defineProperty(_Object$create, 'name', { value: name, enumerable: true }), _defineProperty(_Object$create, 'object', { value: object, enumerable: true }), _Object$create)), {
    type: '',
    oldValue: object[name]
  }));
}

function observe(object, callback) {
  if (Object.observe) return Object.observe(object, callback);
  object[Pending] = [];
  Watched = Watched.concat(Object.keys(object).map(function (key) {
    return Descriptor(key, object, callback);
  }));
}

function unobserve(object, callback) {
  if (Object.unobserve) return Object.unobserve(object, callback);
  Watched = Watched.reduce(function (acc, curr) {
    if (curr.object !== object && curr[Callback] !== callback) {
      acc.push(curr);
    }
    return acc;
  }, []);
}

function notify() {
  if (Object.observe) return;
  Watched = Watched.reduce(function (acc, desc) {
    var newVal = desc.object[desc.name];
    if (desc.oldValue !== newVal) {
      desc.object[Pending].push(desc);
      if (newVal === undefined) {
        desc.type = 'delete';
        return;
      } else {
        desc.type = 'update';
      }
    }
    acc.push(desc);
    return acc;
  }, []);
  Watched.forEach(function (desc) {
    if (!desc.object[Pending].length) return;
    desc[Callback](desc.object[Pending]);
    desc.object[Pending].length = 0;
  });
}

var interval = null;

function start() {
  if (Object.observe) return;
  interval = setInterval(notify, 100);
}

function stop() {
  if (Object.observe) return;
  clearInterval(interval);
}
}, {}]}, {}, {"1":""}));