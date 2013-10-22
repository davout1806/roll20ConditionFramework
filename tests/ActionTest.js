describe("Action suite", function () {
    var tokenId = "1";
    var mockMessage = null;
    var mockToken = {};
    var davoutToken = {};
    var mockCharacter = {};

    beforeEach(function () {
        state.Davout.TokensWithConditionObj = {};
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("name").thenReturn("Bob the Orc");
        mockToken.get.when("represents").thenReturn("c1");
        mockToken.get.when("subtype").thenReturn("token");
        mockToken.get.when("id").thenReturn("1");
        window.getObj = jasmine.createSpy();
        window.getObj.when("graphic", tokenId).thenReturn(mockToken);

        davoutToken = Davout.TokenFactory.getInstance(tokenId);
        spyOn(window, 'sendChat');
        spyOn(window, 'log');
    });

    it("Action: prevent action when token has prohibited condition effect", function () {
        mockMessage = {selected: [mockToken]};
        window.getObj.when("character", "c1").thenReturn(mockCharacter);

        davoutToken.addCondition(state.Davout.ConditionObj["blinded"]);
        Davout.ActionObj.command._action(mockMessage, "improvise");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Blinded was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Bob the Orc is prohibited from performing Improvise.<br>Blinded, cannot perform craft skill.<br>");
    });

    it("action takes into account condition modifier", function () {
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

        davoutToken.addCondition(state.Davout.ConditionObj["baffled"]);
        davoutToken.addCondition(state.Davout.ConditionObj["entangled"]);
        Davout.ActionObj.command._action(mockMessage, "jump");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Baffled was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Entangled was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API"
            , "/w gm Bob the Orc Jump: Rolls 17 + (Dex: 4) + (Acrobatics-Base: 1) + (ACP: -3) + (Conditions: -6) = <b>13</b><br>Baffled: -2<br>Entangled: -4<br>");
    });

    it("condition on target can grant acting player modifier", function () {
        spyOn(window, 'randomInteger').andReturn(5);
        var targetTokenId = "2";

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

        var targetToken = Davout.TokenFactory.getInstance(targetTokenId);

        state.Davout.TargetIdsOfAction[tokenId] = [targetTokenId];

        mockMessage = {selected: [mockToken], playerid: tokenId};

        davoutToken.addCondition(state.Davout.ConditionObj["entangled"]);
        targetToken.addCondition(state.Davout.ConditionObj["blinded"]);

        Davout.ActionObj.command._action(mockMessage, "attack-melee");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Blinded was added to Jack the Target");
        expect(sendChat).toHaveBeenCalledWith("API"
            , "/w gm Bob the Orc Melee Attack: Rolls 5 + (Str: 1) + (Att-Melee-Base: 0) + (Conditions: -2) + (Opp Cond: 2) = <b>6</b><br>Entangled: -2<br>Blinded: 2<br>");
    });

    //TODO test with condition affecting attribute ex: Str

    it("action takes into account condition that modifies character attribute such as Dexterity", function () {
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

        davoutToken.addCondition(state.Davout.ConditionObj["fatigued"]);
        Davout.ActionObj.command._action(mockMessage, "jump");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 1 was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API"
            , "/w gm Bob the Orc Jump: Rolls 17 + (Dex: 3) + (Acrobatics-Base: 1) + (ACP: -3) = <b>18</b><br>(Dex) Fatigued: -2<br>");
    });
});