/**
 * Only place utilities here that interact with Roll20Servers only if communication is one way to the server
 */

var Davout = Davout || {};
Davout.Utils = Davout.Utils || {};

/**
 * Check to see if token is actually selected
 * @param selected              Array of objects that is expected hold at least 1 token
 * @param msgToSend             Message to send if selected is undefined
 * @param onlyOne               If true then selected array is expected to hold 1 and only 1 token
 * @param msgIfMoreThanOne      Message to send is select is defined but does not hold 1 and only 1 token
 * @returns {boolean}
 */
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

//Davout.Utils.removeFromArrayFirstOccurOf = function (array, itemToRemove) {
//    "use strict";
//    Davout.Utils.argTypeCheck("Davout.Utils.removeFromArrayFirstOccurOf", arguments, [_.isArray, _.isNumber]);
//    var workingArray = array;
//    var index = workingArray.indexOf(itemToRemove);
//    if (index > -1) {
//        workingArray.splice(index, 1);
//    }
//
//    return workingArray;
//};

/**
 * Check if parameter is a "True" object.
 * @param parameter
 * @returns         Return false if parameter is undefined, null, is an array, or is a function
 */
Davout.Utils.isTrueObject = function (parameter) {
    "use strict";
    if (_.isUndefined(parameter)) return false;
    if (parameter == null) return false;
    if (_.isArray(parameter)) return false;
    if (_.isFunction(parameter)) return false;

    return _.isObject(parameter);
};

/**
 * Check if array holds the given obj
 * @param array
 * @param obj
 * @returns {boolean}
 */
Davout.Utils.contains = function (array, obj) {
    "use strict";
    return array.indexOf(obj) > -1;
};

Davout.Utils.capitaliseFirstLetter = function (string) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.Utils.capitaliseFirstLetter", arguments, [_.isString]);
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * I come from the Java world which is strongly typed.
 * I kept running into errors that were difficult to debug that were caused by me passing a parameter of the wrong type.
 * Calls to this method are placed right after method declarations to validate the types of parameter that were passed.
 *
 * Check if objects within args are of the expected type.
 * @param caller        The name of the method that is calling Davout.Utils.argTypeCheck.
 *                      If I can find out how to have javascript determine this automatically, I would remove this.
 * @param args          An array of all the objects that needs to checked
 * @param argTypeFuncs  For each object in args, this array will hold a type function for the expected type of args' object.
 *                      Note, for a given object in args the corresponding index in argTypeFuncs could be an array.
 *                      If so, then the given object in args can be of any type in that array.
 */
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

