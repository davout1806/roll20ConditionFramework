var Davout = Davout || {};
Davout.ConditionFW = Davout.ConditionFW || {};
Davout.ConditionFW.command = Davout.ConditionFW.command || {};

state.Davout.ConditionFW.ActionLookup = state.Davout.ConditionFW.ActionLookup || {};
state.Davout.ConditionFW.TargetIdsOfAction = state.Davout.ConditionFW.TargetIdsOfAction || [];  //Array of Arrays of IDs

/**
 *
 * @param actionName        Format: Caps with spaces. Ex: Melee Attack
 * @param attrAffectedName  Format: Caps no spaces. Ex: Str
 * @param baseAffectedName  Format: Caps no spaces. Ex: Att-Melee-Base
 * @param doesApcPenApply
 * @constructor
 */
Davout.ConditionFW.Action = function Action (actionName, attrAffectedName, baseAffectedName, doesApcPenApply) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Action", arguments, [_.isString, _.isString, _.isString, _.isBoolean]);
    this.acName = actionName;
    this.acAttrAffectedName = attrAffectedName;
    this.acBaseAffectedName = baseAffectedName;
    this.acCharSheetAcpName = "AC-Penalty";
    this.acDoesApcPenApply = doesApcPenApply;
};

/**
 *
 * @returns {string} Name of reaction, used as affectedName in Effect.
 */
Davout.ConditionFW.Action.prototype.getTargetAffectedName = function(){
    return "VS-" + this.acName;
};

Davout.ConditionFW.Action.prototype.getResult = function (actingConditionedToken, targetIdsOfAction, affectCollection, dieResult) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Action.getResult", arguments, [Davout.Utils.isTrueObject, _.isArray, Davout.Utils.isTrueObject, [_.isNumber, _.isUndefined]]);
    var isProhibited = affectCollection.isProhibited();
    if (isProhibited === false) {
        dieResult = (dieResult === undefined) ? randomInteger(20) : dieResult;
        var actingChar = Davout.R20Utils.charIdToCharObj(actingConditionedToken.twcCharId);
        affectCollection.finalize();

        var attributeValue = actingChar.getAttribCurrentFor(this.acAttrAffectedName) + affectCollection.afCoFinalAttrbuteAffectMod;
        var baseValue = actingChar.getAttribCurrentFor(this.acBaseAffectedName) + affectCollection.afCoFinalActionAffectMod;
        var rollTotal = dieResult + Number(Math.floor(attributeValue / 2 - 5)) + Number(baseValue);

        var actionString = this.acName;
        actionString += ": Rolls " + dieResult + " + ";
        actionString += "(" + this.acAttrAffectedName + ": " + Math.floor(attributeValue / 2 - 5);
        actionString += ") + (" + this.acBaseAffectedName + ": " + baseValue + ")<br>";
        actionString += affectCollection.afCoDisplayMessage;

        if (this.acDoesApcPenApply) {
            var acpValue = actingChar.getAttribCurrentFor(this.acCharSheetAcpName);
            rollTotal -= Number(acpValue);
            actionString += " + (ACP: -" + acpValue + ")";
        }

        for (var i = 0; i < targetIdsOfAction.length; i++) {
            var targetId = targetIdsOfAction[i];

        }
    } else {
        sendChat("API", isProhibited);
    }
};

// Actions

