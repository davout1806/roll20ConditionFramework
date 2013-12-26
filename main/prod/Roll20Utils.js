/**
 * Utilities that have incoming communication from the Roll20Server
 */

var Davout = Davout || {};
Davout.R20Utils = Davout.R20Utils || {};

Davout.R20Utils.getAttribCurrentFor = function (charId, attributeName) {
    "use strict";
    return findObjs({ _type: 'attribute', name: attributeName, _characterid: charId })[0].get("current");
};

Davout.R20Utils.getGraphicProp = function (id, propertyName) {
    "use strict";
    return getObj("graphic", id).get(propertyName);
}

Davout.R20Utils.selectedToTokenObj = function (singleSelectedObject) {
    "use strict";
    if (singleSelectedObject == undefined) return undefined;

    var tokenObjR20 = getObj("graphic", singleSelectedObject._id);
    if (tokenObjR20 == undefined) return undefined;
    if (tokenObjR20.get("subtype") != "token") return undefined;
    return tokenObjR20;
};

Davout.R20Utils.tokenIdToCharId = function (tokenId) {
    "use strict";
    if (tokenId == undefined) return undefined;
    if (tokenId == "") return undefined;
    var tokenObjR20 = getObj("graphic", tokenId);
    if (tokenObjR20.get("subtype") != "token") return undefined;
    return tokenObjR20.get("represents");
};

Davout.R20Utils.tokenObjToCharId = function (tokenObject) {
    "use strict";
    if (tokenObject == undefined) return undefined;

    var charId = tokenObject.get("represents");
    if (charId == undefined) return undefined;
    if (charId == "") return undefined;
    return charId;
};

Davout.R20Utils.tokenObjToCharObj = function (tokenObject) {
    "use strict";
    return getObj("character", Davout.R20Utils.tokenObjToCharId(tokenObject));
};

Davout.R20Utils.charIdToCharObj = function (charId) {
    "use strict";
    return getObj("character", charId);
};

Davout.R20Utils.findUniqueTokenByName = function (name) {
    "use strict";
    var tokens = findObjs({
        _pageid: Campaign().get("playerpageid"),
        _type: "graphic",
        _subtype: "token",
        _name: name
    });

    if (tokens.length > 1) {
        sendChat("API", "/w gm More than 1 token with name " + name + " exists on page.");
        return undefined;
    }

    if (tokens.length == 0) {
        sendChat("API", "/w gm Token with name " + name + " does not exist on page.");
        return undefined;
    }

    return tokens[0];
}
// Roll20Utils

