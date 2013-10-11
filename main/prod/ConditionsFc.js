var condition;
unconsciousEffect = new Davout.ConditionObj.Effect("Str", "", -2, false);
condition = new Davout.ConditionObj.Condition("Unconscious", new Array(unconsciousEffect));
state.Davout.ConditionObj["Unconscious"] = condition;

fatigueEffect = new Davout.ConditionObj.Effect("Str", "", -2, false);
condition = new Davout.ConditionObj.Condition("Fatigued", new Array(fatigueEffect), 4, "Unconscious");
state.Davout.ConditionObj["Fatigued"] = condition;

blindedNoCraft = new Davout.ConditionObj.Effect("Craft", "Blinded: Cannot perform craft skill.", 0, true);
condition = new Davout.ConditionObj.Condition("Blinded", new Array(blindedNoCraft));
state.Davout.ConditionObj["Blinded"] = condition;

// ConditionsFc

