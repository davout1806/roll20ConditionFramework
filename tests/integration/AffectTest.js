describe("EffectOnToken suite", function () {
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

        davoutToken = Davout.ConditionFW.conditions.getTokenInstance(tokenId);
    });

    it ("conditions affects modifiers, no targets", function() {
        var affectCollection = davoutToken.getEffectsForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.efToCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingTargetReaction).toEqual({});

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Fatigued"]);
        affectCollection = davoutToken.getEffectsForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.efToCoIsProhibited).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute.length).toEqual(1);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.efToCoEffectsAffectingTargetReaction).toEqual({});

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Fatigued"]);
        affectCollection = davoutToken.getEffectsForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.efToCoIsProhibited).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute.length).toEqual(2);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.efToCoEffectsAffectingTargetReaction).toEqual({});

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["Fatigued"]);
        affectCollection = davoutToken.getEffectsForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute.length).toEqual(1);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaName).toEqual("Fatigued");
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaModifier).toEqual(-2);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute[0].seaNote).toEqual("");
        expect(affectCollection.efToCoEffectsAffectingTargetReaction).toEqual([]);

        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["Fatigued"]);
        affectCollection = davoutToken.getEffectsForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], []);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAction).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingTargetReaction).toEqual([]);
    });

    it("Action: prevent action when token has prohibited condition effect", function () {
        mockMessage = {selected: [mockToken]};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Blinded"]);
        var affectCollection = davoutToken.getEffectsForAction(state.Davout.ConditionFW.ActionLookup["Improvise"], []);
        expect(affectCollection.isProhibited()).toEqual("/w gm Bob the Orc is prohibited from performing Improvise.<br>cannot perform craft skill.<br>");
        expect(affectCollection.efToCoIsProhibited).toEqual(true);
        expect(affectCollection.efToCoEffectsAffectingActorAction[0].seaName).toEqual("Blinded");
        expect(affectCollection.efToCoEffectsAffectingActorAction[0].seaIsProhibited).toEqual(true);
        expect(affectCollection.efToCoEffectsAffectingActorAction[0].seaModifier).toBeNaN();
        expect(affectCollection.efToCoEffectsAffectingActorAction[0].seaNote).toEqual("cannot perform craft skill.");
        expect(affectCollection.efToCoEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingTargetReaction).toEqual([]);
    });

    it("condition on target can grant acting player modifier", function () {
        var targetTokenId = "2";
        var playerId = "99";

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Jack the Target");
        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);

        var targetToken = Davout.ConditionFW.conditions.getTokenInstance(targetTokenId);

        state.Davout.ConditionFW.TargetIdOfAction[playerId] = targetTokenId;

        mockMessage = {selected: [mockToken], playerid: tokenId};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Entangled"]);
        targetToken.addCondition(state.Davout.ConditionFW.ConditionLookup["Blinded"]);
        var affectCollection = davoutToken.getEffectsForAction(state.Davout.ConditionFW.ActionLookup["Attack-melee"], targetTokenId);
        expect(affectCollection.isProhibited()).toEqual(false);
        expect(affectCollection.efToCoIsProhibited).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAction[0].seaName).toEqual("Entangled");
        expect(affectCollection.efToCoEffectsAffectingActorAction[0].seaIsProhibited).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingActorAction[0].seaModifier).toEqual(-2);
        expect(affectCollection.efToCoEffectsAffectingActorAction[0].seaNote).toEqual("");
        expect(affectCollection.efToCoEffectsAffectingActorAttribute).toEqual([]);
        expect(affectCollection.efToCoEffectsAffectingTargetReaction[targetTokenId][0].seaName).toEqual("Blinded");
        expect(affectCollection.efToCoEffectsAffectingTargetReaction[targetTokenId][0].seaIsProhibited).toEqual(false);
        expect(affectCollection.efToCoEffectsAffectingTargetReaction[targetTokenId][0].seaModifier).toEqual(2);
        expect(affectCollection.efToCoEffectsAffectingTargetReaction[targetTokenId][0].seaNote).toEqual("");
    });

    /*
    it ("get modifier based on target using system specific rule", function(){
        var targetTokenId = "2";
        var playerId = "99";

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Jack the Target");
        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);

        var targetToken = Davout.ConditionFW.conditions.getTokenInstance(targetTokenId);

        state.Davout.ConditionFW.TargetIdOfAction[playerId] = [targetTokenId];

        mockMessage = {selected: [mockToken], playerid: tokenId};

        targetToken.addCondition(state.Davout.ConditionFW.ConditionLookup["flat-footed"]);
    });
    */
});