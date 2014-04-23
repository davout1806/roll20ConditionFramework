
// NOTE: the name used as the index in state.Davout.ConditionFW.DcChallengeLookup[] MUST match the name used as the index in state.Davout.ConditionFW.ActionLookup
state.Davout.ConditionFW.DcChallengeLookup = state.Davout.ConditionFW.DcChallengeLookup || {};

Davout.ConditionFW.StaticChallenge = function StaticChallenge(name, attrAffectedName, baseAffectedName){
    this.scName = name;
    this.scAttrAffectedName = attrAffectedName;
    this.scBaseAffectedName = baseAffectedName;
};

Davout.ConditionFW.StaticChallenge.prototype.calc = function (targetId){
    var tokenObj = Davout.ConditionFW.conditions.getTokenInstance(targetId);
    var effectOnTokenCollection = tokenObj.getEffectsForAction(this.scName);
    var charId = Davout.R20Utils.tokenIdToCharId(targetId);

};


// DcCalculator