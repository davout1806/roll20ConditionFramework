
describe("Condition suite", function() {
    var tokenId = "1";
    var davoutToken;

    beforeEach(function(){
        state.Davout.TokensWithConditionObj = undefined;
        davoutToken = Davout.TokenFactory.getInstance(tokenId, "Orc");
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

    it("conditions affects modifiers", function() {
        expect(davoutToken.getModifierFor("str")).toEqual(0);
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.getModifierFor("str")).toEqual(-2);
        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.getModifierFor("str")).toEqual(-4);
        davoutToken.removeCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.getModifierFor("str")).toEqual(-2);
        davoutToken.removeCondition(state.Davout.ConditionObj["fatigued"]);
        expect(davoutToken.getModifierFor("str")).toEqual(0);
    });

    it ("Condition: prevent action when token has prohibited condition effect", function(){
        expect(davoutToken.isProhibited("improvise")).toBe(false);
        davoutToken.addCondition(state.Davout.ConditionObj["blinded"]);
        expect(davoutToken.isProhibited("improvise")).toBe(true);

        expect(davoutToken.listConditionsAffecting("improvise")).toEqual("Blinded: 0. Cannot perform craft skill.<br>");

        davoutToken.removeCondition(state.Davout.ConditionObj["blinded"]);
        expect(davoutToken.isProhibited("improvise")).toBe(false);
        expect(davoutToken.listConditionsAffecting("improvise")).toEqual("");
    });

    it("prevent adding a non-stackable condition when token already has the condition.", function(){
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

        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>Fatigued<br>Fatigued<br>Fatigued<br>Unconscious<br>")
        expect(davoutToken.listConditionsAffecting("str")).toEqual("Fatigued: -2<br>Fatigued: -2<br>Fatigued: -2<br>Fatigued: -2<br>");
        expect(davoutToken.listConditionsAffecting("improvise")).toEqual("Unconscious: 0. Cannot perform craft skill.<br>");
    });

    it("multiple conditions that affect the same action/attribute will have their modifiers combined", function(){
        davoutToken.addCondition(state.Davout.ConditionObj["baffled"]);
        davoutToken.addCondition(state.Davout.ConditionObj["entangled"]);

        expect(davoutToken.getModifierFor("tumble")).toEqual(-6);
    });

    it("get modifier based on target", function(){
        var targetTokenId = "2";
        var targetToken = Davout.TokenFactory.getInstance(targetTokenId, "Target NPC");
        targetToken.addCondition(state.Davout.ConditionObj["blinded"]);

        expect(targetToken.getModifierAsTarget("attack-melee")).toEqual(2);
    });
});

