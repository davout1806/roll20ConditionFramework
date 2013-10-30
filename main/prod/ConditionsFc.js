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
condition = new Davout.ConditionFW.Condition("Baffled", effects);
state.Davout.ConditionFW.ConditionLookup["Baffled"] = condition;

effects = new Array(
    new Davout.ConditionFW.Effect("Improvise", false, true, 0, "cannot perform craft skill.")
    , new Davout.ConditionFW.Effect("VS-Melee Attack", false, false, 2)  // blinded target grants attacker a +2 to hit modifier
    , new Davout.ConditionFW.Effect("VS-Hurl Attack", false, false, 2)
    , new Davout.ConditionFW.Effect("VS-Range Attack", false, false, 2)
    , new Davout.ConditionFW.Effect("Melee Attack", false, false, -8)
    , new Davout.ConditionFW.Effect("Hurl Attack", false, false, -8)
    , new Davout.ConditionFW.Effect("Range Attack", false, false, -8)
);
condition = new Davout.ConditionFW.Condition("Blinded", effects);
state.Davout.ConditionFW.ConditionLookup["Blinded"] = condition;

effects = new Array(
    new Davout.ConditionFW.Effect("Balance", false, false, -4)
    , new Davout.ConditionFW.Effect("Break-fall", false, false, -4)
    , new Davout.ConditionFW.Effect("Jump", false, false, -4)
    , new Davout.ConditionFW.Effect("Tumble", false, false, -4)
    , new Davout.ConditionFW.Effect("Melee Attack", false, false, -2)
    , new Davout.ConditionFW.Effect("Hurl Attack", false, false, -2)
    , new Davout.ConditionFW.Effect("Range Attack", false, false, -2)
);
condition = new Davout.ConditionFW.Condition("Entangled", effects);
state.Davout.ConditionFW.ConditionLookup["Entangled"] = condition;

effects = [new Davout.ConditionFW.Effect("Str", true, false, -2)];
condition = new Davout.ConditionFW.Condition("Fatigued", effects, 4, "unconscious");
state.Davout.ConditionFW.ConditionLookup["Fatigued"] = condition;

effects = [new Davout.ConditionFW.Effect("Improvise", false, true, 0, "cannot perform craft skill.")];
condition = new Davout.ConditionFW.Condition("Unconscious", effects);
state.Davout.ConditionFW.ConditionLookup["Unconscious"] = condition;


// ConditionsFc

