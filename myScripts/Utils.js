var DavoutUtils = DavoutUtils || {};

DavoutUtils.adjustAttributeForChar = function(characterId, attributeName, modifier){
    var attrib = findObjs({_type: "attribute", name: "cur_" + attributeName, _characterid: characterId})[0];
    if (attrib == undefined){
        return;
    }

    attrib.set("current", parseInt(attrib.get("current")) + modifier);
};

DavoutUtils.checkForSelectionAndSendIfNothing = function(selected, msgToSend){
    if (selected == undefined) {
        sendChat("API", msgToSend);
        return false;
    }

    return true;
};

DavoutUtils.removeFromArrayFirstOccurOf = function(array, itemToRemove){
    var workingArray = array;
    var index = workingArray.indexOf(itemToRemove);
    if (index > -1) {
        workingArray.splice(index, 1);
    }

    return workingArray;
};