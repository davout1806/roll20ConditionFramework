var Davout = Davout || {};
Davout.R20Utils = Davout.R20Utils || {};

Davout.R20Utils.adjustAttributeForChar = function(characterId, attributeName, modifier){
    var attrib = findObjs({_type: "attribute", name: "cur_" + attributeName, _characterid: characterId})[0];
    if (attrib == undefined){
        return;
    }

    attrib.set("current", parseInt(attrib.get("current")) + modifier);
};

Davout.R20Utils.selectedToTokenObj = function (singleSelectedObject){
    if (singleSelectedObject == undefined) return undefined;

    var tokenObjR20 = getObj("graphic", singleSelectedObject._id);
    if (tokenObjR20 == undefined) return undefined;
    if (tokenObjR20.get("subtype") != "token") return undefined;
    return tokenObjR20;
};

Davout.R20Utils.tokenObjToCharObj = function (tokenObject){
    if (tokenObject == undefined) return undefined;

    var charId = tokenObject.get("represents");
    if (charId == undefined) return undefined;
    if (charId == "") return undefined;
    return getObj("character", charId);
};

// Roll20Utils

