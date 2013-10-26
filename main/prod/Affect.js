Davout.ConditionFW = Davout.ConditionFW || {};

Davout.ConditionFW.Affect = function (actionObj, tokenWithConditions, workingStateChar) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition", arguments, [Davout.Utils.isTrueObject, Davout.Utils.isTrueObject, Davout.Utils.isTrueObject]);
    if (!(this instanceof Davout.ConditionFW.Affect)) {return new Davout.ConditionFW.Affect(actionObj, tokenWithConditions, workingStateChar)}

    this.afIsProhibited = false;
    this.afCondModTotal = 0;
    this.afAttributeModTotal = 0;
    this.afModList = [];
    this.afNotes = [];

};