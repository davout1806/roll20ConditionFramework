Davout.ConditionFW = Davout.ConditionFW || {};

//Davout.ConditionFW.EffectOnToken = function (actionObj, tokenWithConditions, workingStateChar) {
//    "use strict";
//    Davout.Utils.argTypeCheck("Davout.ConditionFW.EffectOnToken", arguments, [Davout.Utils.isTrueObject, Davout.Utils.isTrueObject, Davout.Utils.isTrueObject]);
//
//    this.afIsProhibited = false;
//    this.efToCondModTotal = 0;
//    this.afAttributeModTotal = 0;
//    this.afModList = [];
//    this.afNotes = [];
//
//};

Davout.ConditionFW.EffectOnToken = function EffectOnToken(conditionName, isProhibited, modifier, note) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.EffectOnToken", arguments, [_.isString, _.isBoolean, _.isNumber, _.isString]);

    this.seaName = conditionName;
    this.seaIsProhibited = isProhibited;
    this.seaModifier = modifier;
    this.seaNote = note;
};

Davout.ConditionFW.EffectOnTokenCollection = function EffectOnTokenCollection(tokenName, actionName) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.EffectOnTokenCollection", arguments, [_.isString, _.isString]);

    this.efToCoTokenName = tokenName;
    this.efToCoActionName = actionName;
    this.efToCoIsProhibited = false;
    this.efToCoEffectsAffectingActorAction = [];
    this.efToCoEffectsAffectingActorAttribute = [];
    this.efToCoEffectsAffectingTargetReaction = {};
    this.efToCoFinalAttrbuteAffectMod = 0;
    this.efToCoFinalActionAffectMod = 0;
    this.efToCoDisplayMessage = "";
};

Davout.ConditionFW.EffectOnTokenCollection.prototype.finalize = function (){
    if (this.efToCoEffectsAffectingActorAttribute.length > 0){
        this.efToCoDisplayMessage = "[ Attr: ";
    }

    for (var i = 0; i < this.efToCoEffectsAffectingActorAttribute.length; i++) {
        var attributeAffect = this.efToCoEffectsAffectingActorAttribute[i];
        this.efToCoDisplayMessage += attributeAffect.seaName + " (" + attributeAffect.seaModifier + " " + attributeAffect.seaNote + ")";
        this.efToCoFinalAttrbuteAffectMod += attributeAffect.seaModifier;
    }

    if (this.efToCoEffectsAffectingActorAttribute.length > 0){
        this.efToCoDisplayMessage += "]<br>";
    }

    if (this.efToCoEffectsAffectingActorAction.length > 0){
        this.efToCoDisplayMessage += "[ Action: ";
    }

    for (var i = 0; i < this.efToCoEffectsAffectingActorAction.length; i++) {
        var actionAffect = this.efToCoEffectsAffectingActorAction[i];
        this.efToCoDisplayMessage += actionAffect.seaName + " (" + actionAffect.seaModifier + " " + actionAffect.seaNote + ")";
        this.efToCoFinalActionAffectMod += actionAffect.seaModifier;
    }

    if (this.efToCoEffectsAffectingActorAction.length > 0){
        this.efToCoDisplayMessage += "]<br>";
    }
};

Davout.ConditionFW.EffectOnTokenCollection.prototype.addEffectsAffectingAction = function (effectsAffectingAction) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.EffectOnTokenCollection.prototype.addEffectsAffectingAction", arguments, [_.isArray]);

    if (effectsAffectingAction.length > 0) {
        this.efToCoEffectsAffectingActorAction = this.efToCoEffectsAffectingActorAction.concat(effectsAffectingAction);
    }
};

Davout.ConditionFW.EffectOnTokenCollection.prototype.addEffectsAffectingActionAttr = function (effectsAffectingActionsAttr) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.EffectOnTokenCollection.prototype.addEffectsAffectingActionAttr", arguments, [_.isArray]);

    if (effectsAffectingActionsAttr.length > 0) {
        this.efToCoEffectsAffectingActorAttribute = this.efToCoEffectsAffectingActorAttribute.concat(effectsAffectingActionsAttr);
    }

};

Davout.ConditionFW.EffectOnTokenCollection.prototype.addTargetEffectsAffects = function (targetTokenId, effectsAffectingAction) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.EffectOnTokenCollection.prototype.addTargetEffectsAffects", arguments, [_.isString, _.isArray]);
    if (this.efToCoEffectsAffectingTargetReaction[targetTokenId] === undefined) {
        this.efToCoEffectsAffectingTargetReaction[targetTokenId] = []
    }
    this.efToCoEffectsAffectingTargetReaction[targetTokenId] = this.efToCoEffectsAffectingTargetReaction[targetTokenId].concat(effectsAffectingAction);
};

Davout.ConditionFW.EffectOnTokenCollection.prototype.isProhibited = function (){
    if (this.efToCoIsProhibited){
        var msgStr = "/w gm " + this.efToCoTokenName + " is prohibited from performing "
            + this.efToCoActionName + ".<br>";

        _.each(this.efToCoEffectsAffectingActorAction, function(singleAffect){
            if (singleAffect.seaIsProhibited){
                msgStr += singleAffect.seaNote + "<br>";
            }
        });
        return msgStr;
    }

    return false;
};

// EffectOnToken

