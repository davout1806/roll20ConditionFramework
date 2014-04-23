/**
 * Utilities that have incoming communication from the Roll20Server
 */

var Davout = Davout || {};
Davout.R20Utils = Davout.R20Utils || {};

/**
 * Return the Current value of attributeName from a given character sheet (charId)
 * @param charId
 * @param attributeName
 */
Davout.R20Utils.getAttribCurrentFor = function (charId, attributeName) {
    "use strict";
    return findObjs({ _type: 'attribute', name: attributeName, _characterid: charId })[0].get("current");
};

/**
 * Return the value of propertyName from the graphic object (id)
 * @param id
 * @param propertyName
 */
Davout.R20Utils.getGraphicProp = function (id, propertyName) {
    "use strict";
    return getObj("graphic", id).get(propertyName);
}

/**
 * Returns the roll20 token object for the singleSelectedObject
 * @param singleSelectedObject  Must be a "true" object not an array.
 */
Davout.R20Utils.selectedToTokenObj = function (singleSelectedObject) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.R20Utils.selectedToTokenObj", arguments, [Davout.Utils.isTrueObject]);

    var tokenObjR20 = getObj("graphic", singleSelectedObject._id);
    if (tokenObjR20 == undefined) return undefined;
    if (tokenObjR20.get("subtype") != "token") return undefined;
    return tokenObjR20;
};

/**
 * Given a tokenId return the id of it's backing character object
 * @param tokenId
 */
Davout.R20Utils.tokenIdToCharId = function (tokenId) {
    "use strict";
    if (tokenId == undefined) return undefined;
    if (tokenId == "") return undefined;
    var tokenObjR20 = getObj("graphic", tokenId);
    if (tokenObjR20.get("subtype") != "token") return undefined;
    var charId = tokenObjR20.get("represents");
    if (charId == "") return undefined;
    return  charId;
};

/**
 * Given a roll20 token object return the id of it's backing character object
 * @param tokenObject
 */
Davout.R20Utils.tokenObjToCharId = function (tokenObject) {
    "use strict";
    if (tokenObject == undefined) return undefined;

    var charId = tokenObject.get("represents");
    if (charId == undefined) return undefined;
    if (charId == "") return undefined;
    return charId;
};

/**
 * Given a roll20 token object return it's backing roll20 character object
 * @param tokenObject
 */
Davout.R20Utils.tokenObjToCharObj = function (tokenObject) {
    "use strict";
    return getObj("character", Davout.R20Utils.tokenObjToCharId(tokenObject));
};

/**
 * Given a character id return the corresponding character object
 * @param charId
 */
Davout.R20Utils.charIdToCharObj = function (charId) {
    "use strict";
    return getObj("character", charId);
};

/**
 * Return the UNIQUE roll20 token object by name.
 * If there is more than 1 token on the playerpageid page with the same name, this will return undefined.
 * @param name
 */
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

