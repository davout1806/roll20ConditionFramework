
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

    it ("conditions affects modifiers, no targets", function() {
        var affectForAction = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectForAction.targets).toEqual([]);
        expect(affectForAction.self.effectsAffectingAction).toEqual([]);
        expect(affectForAction.self.effectsAffectingActionsAttr).toEqual([]);

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        affectForAction = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectForAction.targets).toEqual([]);
        expect(affectForAction.self.effectsAffectingAction).toEqual([]);
        expect(affectForAction.self.effectsAffectingActionsAttr).toEqual([{name: "Fatigued", value: -2}]);

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        affectForAction = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectForAction.targets).toEqual([]);
        expect(affectForAction.self.effectsAffectingAction).toEqual([]);
        expect(affectForAction.self.effectsAffectingActionsAttr).toEqual([{name: "Fatigued", value: -2}, {name: "Fatigued", value: -2}]);

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        affectForAction = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectForAction.targets).toEqual([]);
        expect(affectForAction.self.effectsAffectingAction).toEqual([]);
        expect(affectForAction.self.effectsAffectingActionsAttr).toEqual([{name: "Fatigued", value: -2}]);

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        affectForAction = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectForAction.targets).toEqual([]);
        expect(affectForAction.self.effectsAffectingAction).toEqual([]);
        expect(affectForAction.self.effectsAffectingActionsAttr).toEqual([]);
    });

    it ("Condition: prevent action when token has prohibited condition effect", function(){
        expect(davoutToken.getAffectOn("improvise").afIsProhibited).toBe(false);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        var affect = davoutToken.getAffectOn("improvise");
        expect(affect.afIsProhibited).toBe(true);

        expect(affect.buildNotesString()).toEqual("Blinded, cannot perform craft skill.<br>");

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        affect = davoutToken.getAffectOn("improvise");
        expect(affect.afIsProhibited).toBe(false);
        expect(affect.buildNotesString()).toEqual("");
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

        var affect = davoutToken.getAffectOn("str");
        expect(affect.buildModListString()).toEqual("(Str) Fatigued: -2<br>(Str) Fatigued: -2<br>(Str) Fatigued: -2<br>(Str) Fatigued: -2<br>");
        affect = davoutToken.getAffectOn("improvise");
        expect(affect.afIsProhibited).toBe(true);
        expect(affect.buildNotesString()).toEqual("Unconscious, cannot perform craft skill.<br>");
    });

    it ("multiple conditions that affect the same action/attribute will have their modifiers combined", function(){
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["baffled"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["entangled"]);

        expect(davoutToken.getAffectOn("tumble").afCondModTotal).toEqual(-6);
    });

    // todo move to Action Test?
    it ("get modifier based on target", function(){
        var targetTokenId = "2";
        var playerId = "99";

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Troll");
        mockTargetToken.get.when("represents").thenReturn("c2");
        mockTargetToken.get.when("subtype").thenReturn("token");

        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);
        var targetToken = Davout.ConditionFW.getTokenInstance(targetTokenId);
        targetToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        state.Davout.ConditionFW.TargetIdsOfAction[playerId] = [targetTokenId];

        var affectForAction = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], [targetTokenId]);
        expect(affectForAction.self.effectsAffectingAction).toEqual([]);
        expect(affectForAction.self.effectsAffectingActionsAttr).toEqual([]);
        expect(affectForAction.targets[targetTokenId].effectsAffectingAction).toEqual([{name: "Blinded", value: -2}]);
        expect(affectForAction.targets[targetTokenId].effectsAffectingActionsAttr).toEqual([]);
    });

    it ("get modifier based on target using system specific rule", function(){
        var targetTokenId = "2";
        var playerId = "99";

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Troll");
        mockTargetToken.get.when("represents").thenReturn("c2");
        mockTargetToken.get.when("subtype").thenReturn("token");

        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);
        var targetToken = Davout.ConditionFW.getTokenInstance(targetTokenId);
        targetToken.addCondition(state.Davout.ConditionFW.ConditionLookup["flat-footed"]);
        state.Davout.ConditionFW.TargetIdsOfAction[playerId] = [targetTokenId];
    });
});

