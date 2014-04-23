Davout.ConditionFW.target = Davout.ConditionFW.target || {};

/** Move target image token to target token move. */
Davout.ConditionFW.target.moveTargetImg = function (obj) {
    var targetImgToken = obj.target;
    if (targetImgToken) {
        if (state.Davout.ConditionFW.TargetIdOfAction = obj.get("id")) {
            targetImgToken.set("left", obj.get("left"));
            targetImgToken.set("top", obj.get("top"));
        }
    }
};

Davout.ConditionFW.target.setTarget = function (targetId) {
    "use strict";
    var targetToken;

    targetToken = getObj("graphic", targetId);
    if (targetToken.get("subtype") == "token") {
        state.Davout.ConditionFW.TargetIdOfAction = targetId;
        var targetImgToken = Davout.R20Utils.findUniqueTokenByName(Davout.ConditionFW.targetImgName);
        if (targetImgToken != undefined) {
            targetToken.target = targetImgToken
            toBack(targetImgToken);
            Davout.ConditionFW.target.moveTargetImg(targetToken);
            sendChat("API", "/w gm " + targetToken.get("name") + " set as target");
        } else {
            sendChat("API", "/w gm Error occurred selecting target.")
        }
    }
};

Davout.ConditionFW.target.clearTarget = function (){
    state.Davout.ConditionFW.TargetIdOfAction = undefined;
};

// Target

