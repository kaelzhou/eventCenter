/**
 * Created by kaelzhou on 17/2/22.
 */



function Event() {
    this._event = this._event || {};
}

module.exports = Event;

Event.prototype.emit = function (type) {
    if (!type) {
        return;
    }

    if (!this._event[type]) {
        return;
    }
    // console.log(arguments);
    var args = [];
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
    }

    if (args.length <= 0) {
        if (isFunction(this._event[type])) {
            this._event[type].call(this)
        } else {
            var listeners = this._event[type].slice();
            for (i = 0; i < listeners.length; i++)
                listeners[i].call(this);
        }
    }  else {
        if (isFunction(this._event[type])) {
            this._event[type].apply(this, args)
        } else {
            var listeners = this._event[type].slice();
            for (i = 0; i < listeners.length; i++)
                listeners[i].apply(this, args);
        }
    }
}

Event.prototype.on = function (type, listener) {
    this.addListener(type, listener);
}

Event.prototype.addListener = function (type, listener) {
    if (!this._event) {
        this._event = {};
    }

    if (!this._event[type]) {
        this._event[type] = listener;
    } else if (isObject(this._event[type])) {
        this._event[type].push(listener);
    } else {
        this._event[type] = [this._event[type], listener];
    }
}

Event.prototype.removeListener = function (type, listener) {
    if (!this._event[type]) {
        return;
    }

    if (isFunction(this._event[type])) {
        delete this._event[type];
    } else if (isObject(this._event[type])){
        if (!listener) {
            delete this._event[type];
            return;
        }
        var list = this._event[type];
        var position = -1;
        for (var i = 0; i < list.length; i++) {
            if (listener === list[i] ||
                (isFunction(listener.listener) && listener.listener === listener)) {
                position = i;
                break;
            }
        }

        if (position < 0) {
            delete this._event[type];
            return;
        }

        if (list.length == 1) {
            delete this._event[type];
            return;
        }

        list.splice(position, 1);
    }
}

Event.prototype.once = function (type, listener) {

    function g() {
        this.removeListener(type, g);

        listener.apply(this, arguments);
    }

    g.listener = listener;
    this.on(type, g)
}



function isObject(arg) {
    return typeof arg === "object";
}


function isFunction(arg) {
    return typeof arg === "function";
}