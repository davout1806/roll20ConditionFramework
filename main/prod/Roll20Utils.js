/**
 * Utilities that have incoming communication from the Roll20Server
 */

var Davout = Davout || {};
Davout.R20Utils = Davout.R20Utils || {};

Davout.R20Utils.getAttribCurrentFor = function (charId, attributeName){
    "use strict";
    var attributeSheetObj = findObjs({ _type: 'attribute', name: attributeName, _characterid: charId })[0]
    return attributeSheetObj.get("current");
};

Davout.R20Utils.selectedToTokenObj = function (singleSelectedObject){
    "use strict";
    if (singleSelectedObject == undefined) return undefined;

    var tokenObjR20 = getObj("graphic", singleSelectedObject._id);
    if (tokenObjR20 == undefined) return undefined;
    if (tokenObjR20.get("subtype") != "token") return undefined;
    return tokenObjR20;
};

Davout.R20Utils.tokenIdToCharId = function (tokenId){
    "use strict";
    if (tokenId == undefined) return undefined;
    if (tokenId == "") return undefined;
    var tokenObjR20 = getObj("graphic", tokenId);
    if (tokenObjR20.get("subtype") != "token") return undefined;
    return tokenObjR20.get("represents");
};

Davout.R20Utils.tokenObjToCharId = function (tokenObject){
    "use strict";
    if (tokenObject == undefined) return undefined;

    var charId = tokenObject.get("represents");
    if (charId == undefined) return undefined;
    if (charId == "") return undefined;
    return charId;
};

Davout.R20Utils.tokenObjToCharObj = function (tokenObject){
    "use strict";
    return getObj("character", Davout.R20Utils.tokenObjToCharId(tokenObject));
};

// Roll20Utils

