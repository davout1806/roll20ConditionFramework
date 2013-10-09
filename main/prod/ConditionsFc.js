var condition;
unconsciousEffect = new Davout.ConditionObj.Effect("Str", "", -2, false);
condition = new Davout.ConditionObj.Condition("Unconscious", new Array(unconsciousEffect));
state.Davout.ConditionObj["Unconscious"] = condition;

fatigueEffectFour = new Davout.ConditionObj.Effect("Str", "", -2, false);
condition = new Davout.ConditionObj.Condition("Fatigued-IV", new Array(fatigueEffectFour), "Unconscious", false);
state.Davout.ConditionObj["Fatigued-IV"] = condition;

fatigueEffectThree = new Davout.ConditionObj.Effect("Str", "", -2, false);
condition = new Davout.ConditionObj.Condition("Fatigued-III", new Array(fatigueEffectThree), "Fatigued-IV", true);
state.Davout.ConditionObj["Fatigued-III"] = condition;

fatigueEffectTwo = new Davout.ConditionObj.Effect("Str", "", -2, false);
condition = new Davout.ConditionObj.Condition("Fatigued-II", new Array(fatigueEffectTwo), "Fatigued-III", true);
state.Davout.ConditionObj["Fatigued-II"] = condition;

fatigueEffectOne = new Davout.ConditionObj.Effect("Str", "", -2, false);
condition = new Davout.ConditionObj.Condition("Fatigued", new Array(fatigueEffectOne), "Fatigued-II", true);
state.Davout.ConditionObj["Fatigued"] = condition;

blindedNoCraft = new Davout.ConditionObj.Effect("Craft", "Blinded: Cannot perform craft skill.", null, true);
condition = new Davout.ConditionObj.Condition("Blinded", new Array(blindedNoCraft));
state.Davout.ConditionObj["Blinded"] = condition;

// ConditionsFc

