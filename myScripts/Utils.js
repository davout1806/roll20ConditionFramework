var DavoutUtils = DavoutUtils || {};

DavoutUtils.adjustAttributeForChar = function(characterId, attributeName, modifier){
    var attrib = findObjs({_type: "attribute", name: "cur_" + attributeName, _characterid: characterId})[0];
    if (attrib == undefined){
        return;
    }

    attrib.set("current", parseInt(attrib.get("current")) + modifier);
};

DavoutUtils.checkSelectAndSendIfFalse = function(selected, msgToSend){
    if (selected == undefined) {
        sendChat("API", msgToSend);
        return false;
    }

    return true;
};