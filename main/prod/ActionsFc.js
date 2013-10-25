/**
 * Note: Action Name in chat command/property name cannot contain spaces.
 */
state.Davout.ConditionFW.ActionLookup["fort-save"] = new Davout.ConditionFW.Action("Fort Save", "Con", "Fortitude-Mod", false);
state.Davout.ConditionFW.ActionLookup["jump"] = new Davout.ConditionFW.Action("Jump", "Dex", "Acrobatics-Base", true);
state.Davout.ConditionFW.ActionLookup["improvise"] = new Davout.ConditionFW.Action("Improvise", "Int", "Crafting-Base", false);
state.Davout.ConditionFW.ActionLookup["attack-melee"] = new Davout.ConditionFW.Action("Melee Attack", "Str", "Att-Melee-Base", false);
state.Davout.ConditionFW.ActionLookup["attack-hurl"] = new Davout.ConditionFW.Action("Hurl Attack", "Dex", "Att-Hurl-Base", false);
state.Davout.ConditionFW.ActionLookup["attack-range"] = new Davout.ConditionFW.Action("Range Attack", "Dex", "Att-Range-Base", false);
state.Davout.ConditionFW.ActionLookup["haggle"] = new Davout.ConditionFW.Action("Haggle", "Wis", "Haggle-Base", false);

state.Davout.ConditionFW.DcChallengeLookup["attack-melee"] = new Davout.ConditionFW.StaticChallenge("Melee Defense", "Dex", "Defense");
state.Davout.ConditionFW.DcChallengeLookup["attack-hurl"] = new Davout.ConditionFW.StaticChallenge("Hurl Defense", "Dex", "Defense");
state.Davout.ConditionFW.DcChallengeLookup["attack-range"] = new Davout.ConditionFW.StaticChallenge("Range Defense", "Dex", "Defense");
state.Davout.ConditionFW.DcChallengeLookup["haggle"] = new Davout.ConditionFW.Action("Haggle", "Wis", "Haggle-Base", false);

// TODO I need targetTokenWithConditions && targetWorkingStateChar. Should I put all this into state? It would have to cleared either before or after each usage.
// TODO actually flat footed affects DC number NOT the attacker's roll. So should I move getAffectOn() back from Action to TokenWithConditions?
Davout.ConditionFW.Affect.prototype.applySystemSpecificRule = function (actionObj, tokenWithConditions, workingStateChar){
    "use strict";
    if (tokenWithConditions["flat-footed"] !== undefined && wo){
        //Defense-Base
    }
};

// ActionsFC

