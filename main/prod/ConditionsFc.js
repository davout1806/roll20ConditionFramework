var condition;
var effects = new Array(
    new Davout.ConditionObj.Effect("Balance", "", -2, false)
    , new Davout.ConditionObj.Effect("Break-Fall", "", -2, false)
    , new Davout.ConditionObj.Effect("Jump", "", -2, false)
    , new Davout.ConditionObj.Effect("Tumble", "", -2, false)
);
condition = new Davout.ConditionObj.Condition("Baffled", effects);
state.Davout.ConditionObj["Baffled"] = condition;

condition = new Davout.ConditionObj.Condition("Blinded", new Array(new Davout.ConditionObj.Effect("Craft", "Blinded: Cannot perform craft skill.", 0, true)));
state.Davout.ConditionObj["Blinded"] = condition;

effects = new Array(
    new Davout.ConditionObj.Effect("Balance", "", -4, false)
    , new Davout.ConditionObj.Effect("Break-Fall", "", -4, false)
    , new Davout.ConditionObj.Effect("Jump", "", -4, false)
    , new Davout.ConditionObj.Effect("Tumble", "", -4, false)
);
condition = new Davout.ConditionObj.Condition("Entangled", effects);
state.Davout.ConditionObj["Entangled"] = condition;

effects = new Array(new Davout.ConditionObj.Effect("Str", "", -2, false));
condition = new Davout.ConditionObj.Condition("Fatigued", effects, 4, "Unconscious");
state.Davout.ConditionObj["Fatigued"] = condition;

condition = new Davout.ConditionObj.Condition("Unconscious", new Array(new Davout.ConditionObj.Effect("Craft", "Unconscious: Cannot perform craft skill.", 0, true)));
state.Davout.ConditionObj["Unconscious"] = condition;


// ConditionsFc

