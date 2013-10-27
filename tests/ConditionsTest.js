
describe("Condition suite", function() {
    var tokenId = "1";
    var davoutToken;
    var mockToken = {};

    beforeEach(function(){
        state.Davout.ConditionFW.TokensWithConditionObj = undefined;
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("name").thenReturn("Orc");
        mockToken.get.when("represents").thenReturn("c1");
        mockToken.get.when("subtype").thenReturn("token");
        window.getObj = jasmine.createSpy();
        window.getObj.when("graphic", tokenId).thenReturn(mockToken);

        davoutToken = Davout.ConditionFW.getTokenInstance(tokenId);
        spyOn(window, 'sendChat');
        spyOn(window, 'log');
    });

    it ("conditions can be added and removed", function(){
        expect(davoutToken.listAllConditions()).toEqual("");
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>");
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>Fatigued<br>");
        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>");
        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 1 was added to Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 2 was added to Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued was removed from Orc");
        expect(log).toHaveBeenCalledWith("Added: condition Fatigued: 1 to Orc");
        expect(log).toHaveBeenCalledWith("Added: condition Fatigued: 2 to Orc");
        expect(log).toHaveBeenCalledWith("Removed: condition Fatigued removed from Orc");
    });

    it ("prevent adding a non-stackable condition when token already has the condition.", function(){
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        expect(davoutToken.listAllConditions()).toEqual("Blinded<br>");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Blinded was added to Orc");

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        expect(davoutToken.listAllConditions()).toEqual("Blinded<br>");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Orc already has the non-stackable condition Blinded");
    });

    it ("stackable conditions can stack to max and then switch to another condition", function(){
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);

        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>Fatigued<br>Fatigued<br>Fatigued<br>Unconscious<br>");

    });
});

