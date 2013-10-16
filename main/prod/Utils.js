/**
 * Only place utilities here that interact with Roll20Servers only if communication is one way to the server
 */

var Davout = Davout || {};
Davout.Utils = Davout.Utils || {};

Davout.Utils.checkForSelectionAndMsgIfNot = function (selected, msgToSend, onlyOne, msgIfMoreThanOne){
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
    var whisper = "";
    if (whisperToGm) {
        whisper = "/w gm ";
    }
    sendChat("API", whisper + msg);
};

Davout.Utils.removeFromArrayFirstOccurOf = function(array, itemToRemove){
    var workingArray = array;
    var index = workingArray.indexOf(itemToRemove);
    if (index > -1) {
        workingArray.splice(index, 1);
    }

    return workingArray;
};

Davout.Utils.assertTrueObject = function(parameter, throwMsg){
    if (_.isUndefined(parameter)) throw throwMsg + " parameter: undefined";
    if (parameter == null) throw throwMsg + " parameter: null";
    if (_.isArray(parameter)) throw throwMsg + " parameter: array";
    if (_.isFunction(parameter)) throw throwMsg + " parameter: function";
    if (!_.isObject(parameter)) throw throwMsg + " parameter: other";
};

Davout.Utils.contains = function(array, obj) {
    return array.indexOf(obj) > -1;
};

Davout.Utils.capitaliseFirstLetter = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
};

//Utils

