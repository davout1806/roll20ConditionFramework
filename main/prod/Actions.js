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
Davout.ConditionFW.Action.prototype.getReactionName = function(){
    return "VS-" + this.acName;
};

Davout.ConditionFW.Action.getResult = function (actingToken, targetTokenList) {

};
