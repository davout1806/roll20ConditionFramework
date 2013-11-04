Davout.ConditionFW = Davout.ConditionFW || {};

Davout.ConditionFW.Affect = function (actionObj, tokenWithConditions, workingStateChar) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Affect", arguments, [Davout.Utils.isTrueObject, Davout.Utils.isTrueObject, Davout.Utils.isTrueObject]);

    this.afIsProhibited = false;
    this.afCondModTotal = 0;
    this.afAttributeModTotal = 0;
    this.afModList = [];
    this.afNotes = [];

};

Davout.ConditionFW.SingleEffectsAffect = function SingleEffectsAffect(conditionName, isProhibited, modifier, note) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.SingleEffectsAffect", arguments, [_.isString, _.isBoolean, _.isNumber, _.isString]);

    this.seaName = conditionName;
    this.seaIsProhibited = isProhibited;
    this.seaModifier = modifier;
    this.seaNote = note;
};

Davout.ConditionFW.AffectCollection = function AffectCollection(tokenName, actionName) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.AffectCollection", arguments, [_.isString, _.isString]);

    this.afCoTokenName = tokenName;
    this.afCoActionName = actionName;
    this.afCoIsProhibited = false;
    this.afCoEffectsAffectingActorAction = [];
    this.afCoEffectsAffectingActorAttribute = [];
    this.afCoEffectsAffectingTargetReaction = {};
    this.afCoFinalAttrbuteAffectMod = 0;
    this.afCoFinalActionAffectMod = 0;
    this.afCoFinalTargetActionAffectMod = 0;
    this.afCoDisplayMessage = "";
};

Davout.ConditionFW.AffectCollection.prototype.finalize = function (){
    if (this.afCoEffectsAffectingActorAttribute.length > 0){
        this.afCoDisplayMessage = "[ Attr: ";
    }

    for (var i = 0; i < this.afCoEffectsAffectingActorAttribute.length; i++) {
        var attributeAffect = this.afCoEffectsAffectingActorAttribute[i];
        this.afCoDisplayMessage += attributeAffect.seaName + " (" + attributeAffect.seaModifier + " " + attributeAffect.seaNote + ")";
        this.afCoFinalAttrbuteAffectMod += attributeAffect.seaModifier;
    }

    if (this.afCoEffectsAffectingActorAttribute.length > 0){
        this.afCoDisplayMessage += "]<br>";
    }

    if (this.afCoEffectsAffectingActorAction.length > 0){
        this.afCoDisplayMessage += "[ Action: ";
    }

    for (var i = 0; i < this.afCoEffectsAffectingActorAction.length; i++) {
        var actionAffect = this.afCoEffectsAffectingActorAction[i];
        this.afCoDisplayMessage += actionAffect.seaName + " (" + actionAffect.seaModifier + " " + actionAffect.seaNote + ")";
        this.afCoFinalActionAffectMod += actionAffect.seaModifier;
    }

    if (this.afCoEffectsAffectingActorAction.length > 0){
        this.afCoDisplayMessage += "]<br>";
    }
};

Davout.ConditionFW.AffectCollection.prototype.addEffectsAffectingAction = function (effectsAffectingAction) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.AffectCollection.prototype.addEffectsAffectingAction", arguments, [_.isArray]);

    if (effectsAffectingAction.length > 0) {
        this.afCoEffectsAffectingActorAction = this.afCoEffectsAffectingActorAction.concat(effectsAffectingAction);
    }
};

Davout.ConditionFW.AffectCollection.prototype.addEffectsAffectingActionAttr = function (effectsAffectingActionsAttr) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.AffectCollection.prototype.addEffectsAffectingActionAttr", arguments, [_.isArray]);

    if (effectsAffectingActionsAttr.length > 0) {
        this.afCoEffectsAffectingActorAttribute = this.afCoEffectsAffectingActorAttribute.concat(effectsAffectingActionsAttr);
    }

};

Davout.ConditionFW.AffectCollection.prototype.addTargetEffectsAffects = function (targetTokenId, effectsAffectingAction) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.AffectCollection.prototype.addTargetEffectsAffects", arguments, [_.isString, _.isArray]);
    if (this.afCoEffectsAffectingTargetReaction[targetTokenId] === undefined) {
        this.afCoEffectsAffectingTargetReaction[targetTokenId] = []
    }
    this.afCoEffectsAffectingTargetReaction[targetTokenId] = this.afCoEffectsAffectingTargetReaction[targetTokenId].concat(effectsAffectingAction);
};

Davout.ConditionFW.AffectCollection.prototype.isProhibited = function (){
    if (this.afCoIsProhibited){
        var msgStr = "/w gm " + this.afCoTokenName + " is prohibited from performing "
            + this.afCoActionName + ".<br>";

        _.each(this.afCoEffectsAffectingActorAction, function(singleAffect){
            if (singleAffect.seaIsProhibited){
                msgStr += singleAffect.seaNote + "<br>";
            }
        });
        return msgStr;
    }

    return false;
};

// Affect

