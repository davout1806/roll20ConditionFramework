describe("Action suite", function () {
    var tokenId = "1";
    var mockMessage = null;
    var mockToken = {};
    var davoutToken = {};
    var mockCharacter = {};

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
        spyOn(window, 'sendChat');
        spyOn(window, 'log');
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

    it("Action: prevent action when token has prohibited condition effect", function () {
        var targetTokenId = "2";
        mockMessage = {selected: [mockToken]};
        var mockTargetToken = {};
        window.getObj.when("character", "c1").thenReturn(mockCharacter);
        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);

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

    xit("action takes into account condition modifier", function () {
        spyOn(window, 'randomInteger').andReturn(17);
        window.getObj.when("character", "c1").thenReturn(mockCharacter);

        mockCharacter.get = jasmine.createSpy();
        mockCharacter.get.when("id").thenReturn("c1");
        mockCharacter.get.when("name").thenReturn("Orc");
        mockCharacter.getAttribCurrentFor = jasmine.createSpy();
        mockCharacter.getAttribCurrentFor.when("Dex").thenReturn(18);
        mockCharacter.getAttribCurrentFor.when("Acrobatics-Base").thenReturn(1);
        mockCharacter.getAttribCurrentFor.when("AC-Penalty").thenReturn(3);

        mockMessage = {selected: [mockToken]};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["baffled"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["entangled"]);
        Davout.ConditionFW.command._action(mockMessage, "jump");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Baffled was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Entangled was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API"
            , "/w gm Bob the Orc Jump: Rolls 17 + (Dex: 4) + (Acrobatics-Base: 1) + (ACP: -3) + (Conditions: -6) = <b>13</b><br>Baffled: -2<br>Entangled: -4<br>");
    });

    xit("condition on target can grant acting player modifier", function () {
        spyOn(window, 'randomInteger').andReturn(5);
        var targetTokenId = "2";
        var playerId = "99";

        var mockTargetToken = {};
        mockTargetToken.get = jasmine.createSpy();
        mockTargetToken.get.when("name").thenReturn("Jack the Target");
        window.getObj.when("graphic", targetTokenId).thenReturn(mockTargetToken);

        mockCharacter.get = jasmine.createSpy();
        mockCharacter.get.when("id").thenReturn("c1");
        mockCharacter.get.when("name").thenReturn("Orc");
        mockCharacter.getAttribCurrentFor = jasmine.createSpy();
        mockCharacter.getAttribCurrentFor.when("Str").thenReturn(12);
        mockCharacter.getAttribCurrentFor.when("Att-Melee-Base").thenReturn(0);
        window.getObj.when("character", "c1").thenReturn(mockCharacter);

        var targetToken = Davout.ConditionFW.getTokenInstance(targetTokenId);

        state.Davout.ConditionFW.TargetIdsOfAction[playerId] = [targetTokenId];

        mockMessage = {selected: [mockToken], playerid: tokenId};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["entangled"]);
        targetToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
//        var affectCollection = davoutToken.getAffectForAction(state.Davout.ConditionFW.ActionLookup["attack-melee"], [targetTokenId]);
//        expect(affectCollection.affIsProhibited).toEqual(false);   // todo need test where actor is blinded
//        expect(affectCollection.affEffectsAffectingActorAction).toEqual([]);
//        expect(affectCollection.affEffectsAffectingActorAttribute).toEqual([]);
//        expect(affectCollection.affEffectsAffectingTargetReaction[targetTokenId][0].seaName).toEqual("Blinded");
//        expect(affectCollection.affEffectsAffectingTargetReaction[targetTokenId][0].seaIsProhibited).toEqual(true);
//        expect(affectCollection.affEffectsAffectingTargetReaction[targetTokenId][0].seaModifier).toEqual(-2);
//        expect(affectCollection.affEffectsAffectingTargetReaction[targetTokenId][0].seaNote).toEqual("");

        Davout.ConditionFW.command._action(mockMessage, "attack-melee");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Blinded was added to Jack the Target");
        expect(sendChat).toHaveBeenCalledWith("API"
            , "/w gm Bob the Orc Melee Attack: Rolls 5 + (Str: 1) + (Att-Melee-Base: 0) + (Conditions: -2) + (Opp Cond: 2) = <b>6</b><br>Entangled: -2<br>Blinded: 2<br>");
    });

    //TODO test with condition affecting attribute ex: Str

    xit("action takes into account condition that modifies character attribute such as Dexterity", function () {
        spyOn(window, 'randomInteger').andReturn(17);
        window.getObj.when("character", "c1").thenReturn(mockCharacter);

        mockCharacter.get = jasmine.createSpy();
        mockCharacter.get.when("id").thenReturn("c1");
        mockCharacter.get.when("name").thenReturn("Orc");
        mockCharacter.getAttribCurrentFor = jasmine.createSpy();
        mockCharacter.getAttribCurrentFor.when("Dex").thenReturn(18);
        mockCharacter.getAttribCurrentFor.when("Acrobatics-Base").thenReturn(1);
        mockCharacter.getAttribCurrentFor.when("AC-Penalty").thenReturn(3);

        mockMessage = {selected: [mockToken]};

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        Davout.ConditionFW.command._action(mockMessage, "jump");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 1 was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API"
            , "/w gm Bob the Orc Jump: Rolls 17 + (Dex: 3) + (Acrobatics-Base: 1) + (ACP: -3) = <b>18</b><br>(Dex) Fatigued: -2<br>");
    });
});