var condition;
fatigueEffectOne = new Davout.ConditionObj.Effect("Str", "", -2, false);
condition = new Davout.ConditionObj.Condition("FatiguedI", new Array(fatigueEffectOne));
state.Davout.ConditionObj["FatiguedI"] = condition;

blindedNoCraft = new Davout.ConditionObj.Effect("Craft", "Blinded: Cannot perform craft skill.", null, true);
condition = new Davout.ConditionObj.Condition("Blinded", new Array(blindedNoCraft));
state.Davout.ConditionObj["Blinded"] = condition;

// ConditionsFc

