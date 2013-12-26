describe("Affect suite", function () {
    var tokenId = "1";
    var mockMessage = null;
    var mockToken = {};
    var davoutToken = {};

    beforeEach(function () {
        state.Davout.ConditionFW.TokensWithConditionObj = {};
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("name").thenReturn("Bob the Orc");
        mockToken.get.when("represents").thenReturn("c1");
        mockToken.get.when("subtype").thenReturn("token");
        mockToken.get.when("id").thenReturn("1");
        window.getObj = jasmine.createSpy();
        window.getObj.when("graphic", tokenId).thenReturn(mockToken);

        davoutToken = Davout.ConditionFW.getTokenInstance(tokenId);
    });

    it ("conditions affects modifiers, no targets", function() {
        var affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.afCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingTargetReaction).toEqual({});

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Fatigued"]);
        affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.afCoIsProhibited).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingActorAttribute.length).toEqual(1);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.afCoEffectsAffectingTargetReaction).toEqual({});

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Fatigued"]);
        affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.afCoIsProhibited).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingActorAttribute.length).toEqual(2);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.afCoEffectsAffectingTargetReaction).toEqual({});

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["Fatigued"]);
        affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingActorAttribute.length).toEqual(1);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.afCoEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.afCoEffectsAffectingTargetReaction).toEqual([]);

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["Fatigued"]);
        affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingTargetReaction).toEqual([]);
    });

    it("Action: prevent action when token has prohibited condition effect", function () {
        mockMessage = {selected: [mockToken]};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Blinded"]);
        var affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["Improvise"], []);
        expect(affectCollection.isProhibited()).toEqual("/w gm Bob the Orc is prohibited from performing Improvise.<br>cannot perform craft skill.<br>");
        expect(affectCollection.afCoIsProhibited).toEqual(true);
        expect(affectCollection.afCoEffectsAffectingActorAction[0].seaName).toEqual("Blinded");
        expect(affectCollection.afCoEffectsAffectingActorAction[0].seaIsProhibited).toEqual(true);
        expect(affectCollection.afCoEffectsAffectingActorAction[0].seaModifier).toBeNaN();
        expect(affectCollection.afCoEffectsAffectingActorAction[0].seaNote).toEqual("cannot perform craft skill.");
        expect(affectCollection.afCoEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingTargetReaction).toEqual([]);
    });

    it("condition on target can grant acting player modifier", function () {
        var targetTokenId = "2";
        var playerId = "99";

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Jack the Target");
        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);

        var targetToken = Davout.ConditionFW.getTokenInstance(targetTokenId);

        state.Davout.ConditionFW.TargetIdOfAction[playerId] = targetTokenId;

        mockMessage = {selected: [mockToken], playerid: tokenId};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Entangled"]);
        targetToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Blinded"]);
        var affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], targetTokenId);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.afCoIsProhibited).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAction[0].seaName).toEqual("Entangled");
        expect(affectCollection.afCoEffectsAffectingActorAction[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingActorAction[0].seaModifier).toEqual(-2);
        expect(affectCollection.afCoEffectsAffectingActorAction[0].seaNote).toEqual("");
        expect(affectCollection.afCoEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.afCoEffectsAffectingTargetReaction[targetTokenId][0].seaName).toEqual("Blinded");
        expect(affectCollection.afCoEffectsAffectingTargetReaction[targetTokenId][0].seaIsProhibited).toEqual(false);
        expect(affectCollection.afCoEffectsAffectingTargetReaction[targetTokenId][0].seaModifier).toEqual(2);
        expect(affectCollection.afCoEffectsAffectingTargetReaction[targetTokenId][0].seaNote).toEqual("");
    });

    /*
    it ("get modifier based on target using system specific rule", function(){
        var targetTokenId = "2";
        var playerId = "99";

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Jack the Target");
        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);

        var targetToken = Davout.ConditionFW.getTokenInstance(targetTokenId);

        state.Davout.ConditionFW.TargetIdOfAction[playerId] = [targetTokenId];

        mockMessage = {selected: [mockToken], playerid: tokenId};

        targetToken.addCondition(state.Davout.ConditionFW.ConditionLookup["flat-footed"]);
    });
    */
});