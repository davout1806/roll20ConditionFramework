describe("Framework Commands suite", function () {

    it ("add condition", function(){
        var tokenId = "1";
        var selectedId = "200";
        var mockToken = {};
        window.getObj = jasmine.createSpy();
        window.getObj.when("graphic", selectedId).thenReturn(mockToken);
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("subtype").thenReturn("token");
        mockToken.get.when("id").thenReturn(tokenId);

        var mockSelected = {_id: selectedId};

        Davout.ConditionFW.command._manageCondition("ADD", [mockSelected], "fatigued");
        var conditionedToken = Davout.ConditionFW.getTokenInstance(tokenId);
        conditionedToken.addCondition(state.Davout.ConditionFW.ConditionLookup["entangled"]);

        var affectCollection = conditionedToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectCollection.affIsProhibited).toEqual(false);
    });
});