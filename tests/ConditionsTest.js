
describe("Condition suite", function() {
    var tokenId = "1";
    var davoutToken;
    var mockToken = {};

    beforeEach(function(){
        state.Davout.TokensWithConditionObj = undefined;
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("name").thenReturn("Orc");
        mockToken.get.when("represents").thenReturn("c1");
        mockToken.get.when("subtype").thenReturn("token");
        window.getObj = jasmine.createSpy();
        window.getObj.when("graphic", tokenId).thenReturn(mockToken);

        davoutToken = Davout.TokenFactory.getInstance(tokenId);
        spyOn(window, 'sendChat');
        spyOn(window, 'log');
    });

    it ("conditions can be added and removed", function(){
        expect(davoutToken.listAllConditions()).toEqual("");
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>");
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>Fatigued<br>");
        davoutToken.removeCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>");
        davoutToken.removeCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 1 was added to Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 2 was added to Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued was removed from Orc");
        expect(log).toHaveBeenCalledWith("Added: condition Fatigued: 1 to Orc");
        expect(log).toHaveBeenCalledWith("Added: condition Fatigued: 2 to Orc");
        expect(log).toHaveBeenCalledWith("Removed: condition Fatigued removed from Orc");
    });

    it ("conditions affects modifiers", function() {
        expect(davoutToken.getAffect("str").condModTotal).toEqual(0);
        expect(davoutToken.getAffect("str").attributeMod).toEqual(0);
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.getAffect("str").condModTotal).toEqual(0);
        expect(davoutToken.getAffect("str").attributeMod).toEqual(-2);
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.getAffect("str").condModTotal).toEqual(0);
        expect(davoutToken.getAffect("str").attributeMod).toEqual(-4);
        davoutToken.removeCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.getAffect("str").condModTotal).toEqual(0);
        expect(davoutToken.getAffect("str").attributeMod).toEqual(-2);
        davoutToken.removeCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.getAffect("str").condModTotal).toEqual(0);
        expect(davoutToken.getAffect("str").attributeMod).toEqual(0);
    });

    it ("Condition: prevent action when token has prohibited condition effect", function(){
        expect(davoutToken.getAffect("improvise").isProhibited).toBe(false);
        davoutToken.addCondition(state.Davout.ConditionObj["blinded"]);
        var affect = davoutToken.getAffect("improvise");
        expect(affect.isProhibited).toBe(true);

        expect(affect.buildNotesString()).toEqual("Blinded, cannot perform craft skill.<br>");

        davoutToken.removeCondition(state.Davout.ConditionObj["blinded"]);
        affect = davoutToken.getAffect("improvise");
        expect(affect.isProhibited).toBe(false);
        expect(affect.buildNotesString()).toEqual("");
    });

    it ("prevent adding a non-stackable condition when token already has the condition.", function(){
        davoutToken.addCondition(state.Davout.ConditionObj["blinded"]);
        expect(davoutToken.listAllConditions()).toEqual("Blinded<br>");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Blinded was added to Orc");

        davoutToken.addCondition(state.Davout.ConditionObj["blinded"]);
        expect(davoutToken.listAllConditions()).toEqual("Blinded<br>");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Orc already has the non-stackable condition Blinded");
    });

    it ("stackable conditions can stack to max and then switch to another condition", function(){
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);

        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>Fatigued<br>Fatigued<br>Fatigued<br>Unconscious<br>");

        var affect = davoutToken.getAffect("str");
        expect(affect.buildModListString()).toEqual("(Str) Fatigued: -2<br>(Str) Fatigued: -2<br>(Str) Fatigued: -2<br>(Str) Fatigued: -2<br>");
        affect = davoutToken.getAffect("improvise");
        expect(affect.isProhibited).toBe(true);
        expect(affect.buildNotesString()).toEqual("Unconscious, cannot perform craft skill.<br>");
    });

    it ("multiple conditions that affect the same action/attribute will have their modifiers combined", function(){
        davoutToken.addCondition(state.Davout.ConditionObj["baffled"]);
        davoutToken.addCondition(state.Davout.ConditionObj["entangled"]);

        expect(davoutToken.getAffect("tumble").condModTotal).toEqual(-6);
    });

    it ("get modifier based on target", function(){

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Troll");
        mockTargetToken.get.when("represents").thenReturn("c2");
        mockTargetToken.get.when("subtype").thenReturn("token");

        var targetTokenId = "2";
        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);
        var targetToken = Davout.TokenFactory.getInstance(targetTokenId);
        targetToken.addCondition(state.Davout.ConditionObj["blinded"]);

        expect(targetToken.getAffectAsTarget("attack-melee").condModTotal).toEqual(2);
    });
});

