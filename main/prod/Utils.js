var Davout = Davout || {};
Davout.Utils = Davout.Utils || {};

Davout.Utils.adjustAttributeForChar = function(characterId, attributeName, modifier){
    var attrib = findObjs({_type: "attribute", name: "cur_" + attributeName, _characterid: characterId})[0];
    if (attrib == undefined){
        return;
    }

    attrib.set("current", parseInt(attrib.get("current")) + modifier);
};

Davout.Utils.selectedToToken = function (singleSelectedObject){
    if (singleSelectedObject == undefined) return false;

    var tokenObjR20 = getObj("graphic", singleSelectedObject._id);
    if (tokenObjR20 == undefined) return false;
    if (tokenObjR20.get("subtype") != "token") return false;
    return tokenObjR20;
};

Davout.Utils.tokenToCharId = function (tokenObject){
    if (tokenObject == undefined) return false;

    var charId = tokenObject.get("represents");
    if (charId == undefined) return false;
    if (charId == "") return false;
    return charId;
};

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

//Utils

