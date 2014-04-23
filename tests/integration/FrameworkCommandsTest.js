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

        Davout.ConditionFW.conditions.manageCondition("ADD", [mockSelected], "Fatigued");
        var conditionedToken = Davout.ConditionFW.conditions.getTokenInstance(tokenId);
        conditionedToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Entangled"]);

        var affectCollection = conditionedToken.getEffectsForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.efToCoIsProhibited).toEqual(false);
    });
});