Davout.ConditionFW = Davout.ConditionFW || {};

Davout.ConditionFW.Affect = function (actionObj, tokenWithConditions, workingStateChar) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Affect", arguments, [Davout.Utils.isTrueObject, Davout.Utils.isTrueObject, Davout.Utils.isTrueObject]);
    if (!(this instanceof Davout.ConditionFW.Affect)) {
        return new Davout.ConditionFW.Affect(actionObj, tokenWithConditions, workingStateChar)
    }

    this.afIsProhibited = false;
    this.afCondModTotal = 0;
    this.afAttributeModTotal = 0;
    this.afModList = [];
    this.afNotes = [];

};

Davout.ConditionFW.SingleEffectsAffect = function SingleEffectsAffect(conditionName, isProhibited, modifier, note) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.SingleEffectsAffect", arguments, [_.isString, _.isBoolean, _.isNumber, _.isString]);
    if (!(this instanceof Davout.ConditionFW.SingleEffectsAffect)) {
        return new Davout.ConditionFW.SingleEffectsAffect(conditionName, isProhibited, modifier, note)
    }

    this.seaName = conditionName;
    this.seaIsProhibited = isProhibited;
    this.seaModifier = modifier;
    this.seaNote = note;
};

Davout.ConditionFW.AffectCollection = function AffectCollection() {
    "use strict";
    if (!(this instanceof Davout.ConditionFW.AffectCollection)) {
        return new Davout.ConditionFW.AffectCollection()
    }
    this.affIsProhibited = false;
    this.affEffectsAffectingActorAction = [];
    this.affEffectsAffectingActorAttribute = [];
    this.affEffectsAffectingTargetReaction = {};

};
Davout.ConditionFW.AffectCollection.prototype.addEffectsAffectingAction = function (effectsAffectingAction) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.SingleEffectsAffect", arguments, [_.isArray]);

    if (effectsAffectingAction.length > 0) {
        this.affEffectsAffectingActorAction = this.affEffectsAffectingActorAction.concat(effectsAffectingAction);
    }
};

Davout.ConditionFW.AffectCollection.prototype.addEffectsAffectingActionAttr = function (effectsAffectingActionsAttr) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.SingleEffectsAffect", arguments, [_.isArray]);

    if (effectsAffectingActionsAttr.length > 0) {
        this.affEffectsAffectingActorAttribute = this.affEffectsAffectingActorAttribute.concat(effectsAffectingActionsAttr);
    }

};

Davout.ConditionFW.AffectCollection.prototype.addTargetEffectsAffects = function (targetTokenId, effectsAffectingAction) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.SingleEffectsAffect", arguments, [_.isString, _.isArray]);
    if (this.affEffectsAffectingTargetReaction[targetTokenId] === undefined) {
        this.affEffectsAffectingTargetReaction[targetTokenId] = []
    }
    this.affEffectsAffectingTargetReaction[targetTokenId] = this.affEffectsAffectingTargetReaction[targetTokenId].concat(effectsAffectingAction);
};

// Affect

