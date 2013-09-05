var DavoutUtils = DavoutUtils || {};

DavoutUtils.isSenderGm = function(msg){
    return (msg.who.indexOf("(GM)") !== -1);
}

DavoutUtils.adjustAttributeForChar = function(characterId, attributeName, modifier){
    var attrib = findObjs({_type: "attribute", name: "cur_" + attributeName, _characterid: characterId})[0];
    if (attrib == undefined){
        return;
    }

    attrib.set("current", parseInt(attrib.get("current")) + modifier);
}