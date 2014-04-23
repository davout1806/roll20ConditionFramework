
// NOTE: the name used as the index in MUST state.Davout.ConditionFW.DcChallengeLookup[] match the name used as the index in state.Davout.ConditionFW.ActionLookup
state.Davout.ConditionFW.DcChallengeLookup["Attack-melee"] = new Davout.ConditionFW.StaticChallenge("Melee Defense", "Dex", "Defense");
state.Davout.ConditionFW.DcChallengeLookup["Attack-hurl"] = new Davout.ConditionFW.StaticChallenge("Hurl Defense", "Dex", "Defense");
state.Davout.ConditionFW.DcChallengeLookup["Attack-range"] = new Davout.ConditionFW.StaticChallenge("Range Defense", "Dex", "Defense");
state.Davout.ConditionFW.DcChallengeLookup["Haggle"] = new Davout.ConditionFW.Action("Haggle", "Wis", "Haggle-Base", false);

// DcCalculatorFc