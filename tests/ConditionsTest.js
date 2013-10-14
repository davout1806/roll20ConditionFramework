
describe("A suite", function() {
    var tokenId = "1";

    beforeEach(function(){
        state.Davout.TokensWithConditionObj = {};
        spyOn(window, 'sendChat');
        spyOn(window, 'log');
    });

    it ("conditions can be added and removed", function(){
        expect(Davout.ConditionObj.listAllConditions(tokenId)).toEqual("");
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");
        expect(Davout.ConditionObj.listAllConditions(tokenId)).toEqual("Fatigued<br>");
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");
        expect(Davout.ConditionObj.listAllConditions(tokenId)).toEqual("Fatigued<br>Fatigued<br>");
        Davout.ConditionObj.removeConditionFrom(tokenId, "fatigued");
        expect(Davout.ConditionObj.listAllConditions(tokenId)).toEqual("Fatigued<br>");
        Davout.ConditionObj.removeConditionFrom(tokenId, "fatigued");
        expect(Davout.ConditionObj.listAllConditions(tokenId)).toEqual("");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 1 was added to Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 2 was added to Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued was removed from Orc");
        expect(log).toHaveBeenCalledWith("Added: condition Fatigued: 1 to Orc");
        expect(log).toHaveBeenCalledWith("Added: condition Fatigued: 2 to Orc");
        expect(log).toHaveBeenCalledWith("Removed: condition Fatigued removed from Orc");
    });

    it("conditions affects modifiers", function() {
        expect(Davout.ConditionObj.getModifierFor(tokenId, "str")).toEqual(0);
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");
        expect(Davout.ConditionObj.getModifierFor(tokenId, "str")).toEqual(-2);
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");
        expect(Davout.ConditionObj.getModifierFor(tokenId, "str")).toEqual(-4);
        Davout.ConditionObj.removeConditionFrom(tokenId, "fatigued");
        expect(Davout.ConditionObj.getModifierFor(tokenId, "str")).toEqual(-2);
        Davout.ConditionObj.removeConditionFrom(tokenId, "fatigued");
        expect(Davout.ConditionObj.getModifierFor(tokenId, "str")).toEqual(0);
    });

    it ("Condition: prevent action when token has prohibited condition effect", function(){
        expect(Davout.ConditionObj.isProhibited(tokenId, "improvise")).toBe(false);
        Davout.ConditionObj.addConditionTo(tokenId, "blinded", "Orc");
        expect(Davout.ConditionObj.isProhibited(tokenId, "improvise")).toBe(true);

        expect(Davout.ConditionObj.listConditionsAffecting(tokenId, "improvise")).toEqual("Blinded: 0. Cannot perform craft skill.<br>");

        Davout.ConditionObj.removeConditionFrom(tokenId, "blinded");
        expect(Davout.ConditionObj.isProhibited(tokenId, "improvise")).toBe(false);
        expect(Davout.ConditionObj.listConditionsAffecting(tokenId, "improvise")).toEqual("");
    });

    it("prevent adding a non-stackable condition when token already has the condition.", function(){
        Davout.ConditionObj.addConditionTo(tokenId, "blinded", "Orc");
        expect(Davout.ConditionObj.listAllConditions(tokenId)).toEqual("Blinded<br>");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Blinded was added to Orc");

        Davout.ConditionObj.addConditionTo(tokenId, "blinded", "Orc");
        expect(Davout.ConditionObj.listAllConditions(tokenId)).toEqual("Blinded<br>");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Orc already has the non-stackable condition Blinded");
    });

    it ("stackable conditions can stack to max and then switch to another condition", function(){
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");
        Davout.ConditionObj.addConditionTo(tokenId, "fatigued", "Orc");

        expect(Davout.ConditionObj.listAllConditions(tokenId)).toEqual("Fatigued<br>Fatigued<br>Fatigued<br>Fatigued<br>Unconscious<br>")
        expect(Davout.ConditionObj.listConditionsAffecting(tokenId, "str")).toEqual("Fatigued: -2<br>Fatigued: -2<br>Fatigued: -2<br>Fatigued: -2<br>");
        expect(Davout.ConditionObj.listConditionsAffecting(tokenId, "improvise")).toEqual("Unconscious: 0. Cannot perform craft skill.<br>");
    });

    it("multiple conditions that affect the same action/attribute will have their modifiers combined", function(){
        Davout.ConditionObj.addConditionTo(tokenId, "baffled", "Orc");
        Davout.ConditionObj.addConditionTo(tokenId, "entangled", "Orc");

        expect(Davout.ConditionObj.getModifierFor(tokenId, "tumble")).toEqual(-6);
    });
});

