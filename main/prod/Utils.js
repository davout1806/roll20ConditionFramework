/**
 * Only place utilities here that interact with Roll20Servers only if communication is one way to the server
 */

var Davout = Davout || {};
Davout.Utils = Davout.Utils || {};

Davout.Utils.checkForSelectionAndMsgIfNot = function (selected, msgToSend, onlyOne, msgIfMoreThanOne){
    "use strict";
    if (selected == undefined) {
        sendChat("API", msgToSend);
        return false;
    }

    if (onlyOne && selected.length != 1){
        sendChat("API", msgIfMoreThanOne);
        return false;
    }

    return true;
};

Davout.Utils.sendDirectedMsgToChat = function (whisperToGm, msg){
    "use strict";
    var whisper = "";
    if (whisperToGm) {
        whisper = "/w gm ";
    }
    sendChat("API", whisper + msg);
};

Davout.Utils.removeFromArrayFirstOccurOf = function(array, itemToRemove){
    "use strict";
    var workingArray = array;
    var index = workingArray.indexOf(itemToRemove);
    if (index > -1) {
        workingArray.splice(index, 1);
    }

    return workingArray;
};

Davout.Utils.assertTrueObject = function(parameter, throwMsg){
    "use strict";
    if (_.isUndefined(parameter)) throw throwMsg + " parameter: undefined";
    if (parameter == null) throw throwMsg + " parameter: null";
    if (_.isArray(parameter)) throw throwMsg + " parameter: array";
    if (_.isFunction(parameter)) throw throwMsg + " parameter: function";
    if (!_.isObject(parameter)) throw throwMsg + " parameter: other";
};

Davout.Utils.contains = function(array, obj) {
    "use strict";
    return array.indexOf(obj) > -1;
};

Davout.Utils.capitaliseFirstLetter = function(string){
    "use strict";
    return string.charAt(0).toUpperCase() + string.slice(1);
};

//Utils

