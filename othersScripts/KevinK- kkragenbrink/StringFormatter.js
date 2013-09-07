/*
 *  roll20 User: https://app.roll20.net/users/15313/kevin-k
 *  git User:    https://gist.github.com/kkragenbrink
*/

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * Formats a string for printing.
 *
 * @name    debug
 * @param   {Mixed[]}       {...}
 * @return  {Void}
 * @copyright               https://raw.github.com/joyent/node/master/LICENSE
 */
var formatRegexp                        = /%[sdj%]/g;
var format = function (f) {
    var args                            = Array.prototype.slice.call(arguments, 0);
    var argl                            = args.length;

    if (typeof f !== 'string') {
        var objects                     = [];
        while (argl--) {
            objects.unshift(args[i].toString());
        }

        return objects.join(' ');
    }

    var i                               = 1;
    var str = String(f).replace(formatRegexp, function (x) {
        if (x === '%%') return '%';
        if (i >= args) return x;
        switch (x) {
            case '%s' : return String(args[i++]);
            case '%d' : return Number(args[i++]);
            case '%j' : return JSON.stringify(args[i++]);
            default:
                return x;
        }
    });

    var x;
    while (i++ < argl) {
        x                               = args[i];
        if (x === null || typeof x !== 'object') {
            str                         = [str, x].join(' ')
        }
        else {
            str                         += [str, x.toString()].join();
        }
    }

    return str;
};