/**
 * Note: ConditionName cannot contain spaces.
 */
var condition;
var effects = new Array(
    new Davout.ConditionObj.Effect("balance", "", -2, false)
    , new Davout.ConditionObj.Effect("break-fall", "", -2, false)
    , new Davout.ConditionObj.Effect("jump", "", -2, false)
    , new Davout.ConditionObj.Effect("tumble", "", -2, false)
);
condition = new Davout.ConditionObj.Condition("baffled", effects);
state.Davout.ConditionObj["baffled"] = condition;

var effects = new Array(
    new Davout.ConditionObj.Effect("improvise", "cannot perform craft skill.", 0, true)
    , new Davout.ConditionObj.Effect("VS-attack-melee", "", 2, false)
    , new Davout.ConditionObj.Effect("VS-attack-hurl", "", 2, false)
    , new Davout.ConditionObj.Effect("VS-attack-range", "", 2, false)
    , new Davout.ConditionObj.Effect("attack-melee", "", -8, false)
    , new Davout.ConditionObj.Effect("attack-hurl", "", -8, false)
    , new Davout.ConditionObj.Effect("attack-range", "", -8, false)
);
condition = new Davout.ConditionObj.Condition("blinded", effects);
state.Davout.ConditionObj["blinded"] = condition;

effects = new Array(
    new Davout.ConditionObj.Effect("balance", "", -4, false)
    , new Davout.ConditionObj.Effect("break-fall", "", -4, false)
    , new Davout.ConditionObj.Effect("jump", "", -4, false)
    , new Davout.ConditionObj.Effect("tumble", "", -4, false)
    , new Davout.ConditionObj.Effect("attack-melee", "", -2, false)
    , new Davout.ConditionObj.Effect("attack-hurl", "", -2, false)
    , new Davout.ConditionObj.Effect("attack-range", "", -2, false)
);
condition = new Davout.ConditionObj.Condition("entangled", effects);
state.Davout.ConditionObj["entangled"] = condition;

effects = new Array(new Davout.ConditionObj.Effect("str", "", -2, false, true));
condition = new Davout.ConditionObj.Condition("fatigued", effects, 4, "unconscious");
state.Davout.ConditionObj["fatigued"] = condition;

condition = new Davout.ConditionObj.Condition("unconscious", new Array(new Davout.ConditionObj.Effect("improvise", "cannot perform craft skill.", 0, true)));
state.Davout.ConditionObj["unconscious"] = condition;


// ConditionsFc

