/**
 * Only place utilities here that interact with Roll20Servers only if communication is one way to the server
 */

var Davout = Davout || {};
Davout.Utils = Davout.Utils || {};

Davout.Utils.checkForSelectionAndMsgIfNot = function (selected, msgToSend, onlyOne, msgIfMoreThanOne) {
    "use strict";
    if (selected == undefined) {
        sendChat("API", msgToSend);
        return false;
    }

    if (onlyOne && selected.length != 1) {
        sendChat("API", msgIfMoreThanOne);
        return false;
    }

    return true;
};

//Davout.Utils.sendDirectedMsgToChat = function (whisperToGm, msg) {
//    "use strict";
//    var whisper = "";
//    if (whisperToGm) {
//        whisper = "/w gm ";
//    }
//    sendChat("API", whisper + msg);
//};

Davout.Utils.removeFromArrayFirstOccurOf = function (array, itemToRemove) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.Utils.removeFromArrayFirstOccurOf", arguments, [_.isArray, _.isNumber]);
    var workingArray = array;
    var index = workingArray.indexOf(itemToRemove);
    if (index > -1) {
        workingArray.splice(index, 1);
    }

    return workingArray;
};

Davout.Utils.isTrueObject = function (parameter) {
    "use strict";
    if (_.isUndefined(parameter)) return false;
    if (parameter == null) return false;
    if (_.isArray(parameter)) return false;
    if (_.isFunction(parameter)) return false;

    return _.isObject(parameter);
};

Davout.Utils.contains = function (array, obj) {
    "use strict";
    return array.indexOf(obj) > -1;
};

Davout.Utils.capitaliseFirstLetter = function (string) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.Utils.capitaliseFirstLetter", arguments, [_.isString]);
    return string.charAt(0).toUpperCase() + string.slice(1);
};

Davout.Utils.argTypeCheck = function (caller, args, argTypeFuncs) {
    "use strict";
    var errors = [];
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        var typeFunc = argTypeFuncs[i];
        if (typeFunc !== null) {
            if (_.isArray(typeFunc)) {
                var atLeastOne = false;
                _.each(typeFunc, function (func) {
                    if (func(arg)) {
                        atLeastOne = true;
                    }
                });
                if (!atLeastOne) {
                    errors.push("Arg # " + i + " with value of " + JSON.stringify(arg) + " is of an invalid type.");
                }
            } else {
                if (!typeFunc(arg)) {
                    errors.push("Arg # " + i + " with value of " + JSON.stringify(arg) + " is of an invalid type.");
                }
            }
        }
    }

    if (errors.length > 0) {
        throw caller + " " + errors.join(" ");
    }
};

//Utils

