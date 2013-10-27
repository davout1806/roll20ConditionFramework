describe("Action suite", function () {
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

    xit ("conditions affects modifiers, no targets", function() {
        var affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectCollection.affEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.affEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.affEffectsAffectingTargetReaction).toEqual({});

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectCollection.affIsProhibited).toEqual(false);
        expect(affectCollection.affEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.affEffectsAffectingActorAttribute.length).toEqual(1);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.affEffectsAffectingTargetReaction).toEqual({});

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectCollection.affIsProhibited).toEqual(false);
        expect(affectCollection.affEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.affEffectsAffectingActorAttribute.length).toEqual(2);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.affEffectsAffectingTargetReaction).toEqual({});

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectCollection.affEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.affEffectsAffectingActorAttribute.length).toEqual(1);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.affEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.affEffectsAffectingTargetReaction).toEqual([]);

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], []);
        expect(affectCollection.affEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.affEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.affEffectsAffectingTargetReaction).toEqual([]);
    });

    xit("Action: prevent action when token has prohibited condition effect", function () {
        var targetTokenId = "2";
        mockMessage = {selected: [mockToken]};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        var affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["improvise"], []);
        expect(affectCollection.affIsProhibited).toEqual(true);
        expect(affectCollection.affEffectsAffectingActorAction[0].seaName).toEqual("Blinded");
        expect(affectCollection.affEffectsAffectingActorAction[0].seaIsProhibited).toEqual(true);
        expect(affectCollection.affEffectsAffectingActorAction[0].seaModifier).toBeNaN();
        expect(affectCollection.affEffectsAffectingActorAction[0].seaNote).toEqual("cannot perform craft skill.");
        expect(affectCollection.affEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.affEffectsAffectingTargetReaction).toEqual([]);
    });

    it("condition on target can grant acting player modifier", function () {
//        spyOn(window, 'randomInteger').andReturn(5);
        var targetTokenId = "2";
        var playerId = "99";

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Jack the Target");
        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);

        var targetToken = Davout.ConditionFW.getTokenInstance(targetTokenId);

        state.Davout.ConditionFW.TargetIdsOfAction[playerId] = [targetTokenId];

        mockMessage = {selected: [mockToken], playerid: tokenId};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["entangled"]);
        targetToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        var affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], [targetTokenId]);
        expect(affectCollection.affIsProhibited).toEqual(false);
        expect(affectCollection.affEffectsAffectingActorAction[0].seaName).toEqual("Entangled");
        expect(affectCollection.affEffectsAffectingActorAction[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.affEffectsAffectingActorAction[0].seaModifier).toEqual(-2);
        expect(affectCollection.affEffectsAffectingActorAction[0].seaNote).toEqual("");
        expect(affectCollection.affEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.affEffectsAffectingTargetReaction[targetTokenId][0].seaName).toEqual("Blinded");
        expect(affectCollection.affEffectsAffectingTargetReaction[targetTokenId][0].seaIsProhibited).toEqual(false);
        expect(affectCollection.affEffectsAffectingTargetReaction[targetTokenId][0].seaModifier).toEqual(-2);
        expect(affectCollection.affEffectsAffectingTargetReaction[targetTokenId][0].seaNote).toEqual("");
    });
});