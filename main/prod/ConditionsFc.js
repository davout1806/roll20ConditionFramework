/**
 * Note: ConditionName cannot contain spaces.
 */
var condition;
var effects = new Array(
    new Davout.ConditionFW.Effect("Balance", false, false, -2)
    , new Davout.ConditionFW.Effect("Break-fall", false, false, -2)
    , new Davout.ConditionFW.Effect("Jump", false, false, -2)
    , new Davout.ConditionFW.Effect("Tumble", false, false, -2)
);
condition = new Davout.ConditionFW.Condition("baffled", effects);
state.Davout.ConditionFW.ConditionLookup["baffled"] = condition;

effects = new Array(
    new Davout.ConditionFW.Effect("Improvise", false, true, 0, "cannot perform craft skill.")
    , new Davout.ConditionFW.Effect("VS-Melee Attack", false, false, -2)
    , new Davout.ConditionFW.Effect("VS-Hurl Attack", false, false, -2)
    , new Davout.ConditionFW.Effect("VS-Range Attack", false, false, -2)
    , new Davout.ConditionFW.Effect("Melee Attack", false, false, -8)
    , new Davout.ConditionFW.Effect("Hurl Attack", false, false, -8)
    , new Davout.ConditionFW.Effect("Range Attack", false, false, -8)
);
condition = new Davout.ConditionFW.Condition("blinded", effects);
state.Davout.ConditionFW.ConditionLookup["blinded"] = condition;

effects = new Array(
    new Davout.ConditionFW.Effect("Balance", false, false, -4)
    , new Davout.ConditionFW.Effect("Break-fall", false, false, -4)
    , new Davout.ConditionFW.Effect("Jump", false, false, -4)
    , new Davout.ConditionFW.Effect("Tumble", false, false, -4)
    , new Davout.ConditionFW.Effect("Melee Attack", false, false, -2)
    , new Davout.ConditionFW.Effect("Hurl Attack", false, false, -2)
    , new Davout.ConditionFW.Effect("Range Attack", false, false, -2)
);
condition = new Davout.ConditionFW.Condition("entangled", effects);
state.Davout.ConditionFW.ConditionLookup["entangled"] = condition;

effects = [new Davout.ConditionFW.Effect("Str", true, false, -2)];
condition = new Davout.ConditionFW.Condition("fatigued", effects, 4, "unconscious");
state.Davout.ConditionFW.ConditionLookup["fatigued"] = condition;

effects = [new Davout.ConditionFW.Effect("Improvise", false, true, 0, "cannot perform craft skill.")];
condition = new Davout.ConditionFW.Condition("unconscious", effects);
state.Davout.ConditionFW.ConditionLookup["unconscious"] = condition;


// ConditionsFc

