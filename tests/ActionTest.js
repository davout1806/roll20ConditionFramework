

describe("Action suite", function() {
    var tokenId = "1";
    Davout.R20Utils = null;
    var mockMessage = null;
    var mockToken = {};
    var mockCharacter = {};
    var mockAttributeSheetObj =null;
    var mockBaseModSheetObj =null;
    var mockApcSheetObj =null;

    beforeEach(function(){
        state.Davout.TokensWithConditionObj = {};
        spyOn(window, 'sendChat');
        spyOn(window, 'log');
        mockAttributeSheetObj = {
            get: function (property){}
        };
        mockBaseModSheetObj = {
            get: function (property){}
        };
        mockApcSheetObj = {
            get: function (property){}
        };
        mockCharacter = {
            get: function (property){}
        };
    });

    it("Action: prevent action when token has prohibited condition effect", function(){
        spyOn(mockCharacter, "get").andReturn("c1");
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("id").thenReturn(tokenId);
        mockToken.get.when("name").thenReturn("Bob the Orc");

        Davout.R20Utils = {
            selectedToTokenObj: function(selectedObj){}
            , tokenObjToCharObj: function(tokenObj){}
        };
        spyOn(Davout.R20Utils, "selectedToTokenObj").andReturn(mockToken);
        spyOn(Davout.R20Utils, "tokenObjToCharObj").andReturn(mockCharacter);

        mockMessage = {selected: [mockToken]};

        Davout.ConditionObj.addConditionTo(tokenId, "blinded", "Bob the Orc");
        Davout.ActionObj.command._action(mockMessage, "improvise");
        expect(mockToken.get).toHaveBeenCalledWith("id");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Bob the Orc is prohibited from performing Improvise.<br>Blinded: 0. Cannot perform craft skill.<br>");
    });

    it("send chat message when action is unknown", function(){
        Davout.ActionObj.command._action(mockMessage, "blah");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Blah is an unknown action");
    });

    it("action takes into account condition modifier", function(){
        mockCharacter.get = jasmine.createSpy();
        mockCharacter.get.when("id").thenReturn("c1");
        mockCharacter.get.when("name").thenReturn("Orc");
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("id").thenReturn(tokenId);
        mockToken.get.when("name").thenReturn("Bob the Orc");

        Davout.R20Utils = {
            selectedToTokenObj: function(selectedObj){}
            , tokenObjToCharObj: function(tokenObj){}
        };
        spyOn(Davout.R20Utils, "selectedToTokenObj").andReturn(mockToken);
        spyOn(Davout.R20Utils, "tokenObjToCharObj").andReturn(mockCharacter);

        Davout.R20Utils.getAttribCurrentFor = jasmine.createSpy();
        Davout.R20Utils.getAttribCurrentFor.when("c1", "Dex").thenReturn("18");
        Davout.R20Utils.getAttribCurrentFor.when("c1", "Acrobatics-Base").thenReturn("1");
        Davout.R20Utils.getAttribCurrentFor.when("c1", "AC-Penalty").thenReturn("2");

        mockMessage = {selected: [mockToken]};

        Davout.ConditionObj.addConditionTo(tokenId, "baffled", "Bob the Orc");
        Davout.ConditionObj.addConditionTo(tokenId, "entangled", "Bob the Orc");
        Davout.ActionObj.command._action(mockMessage, "jump");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Baffled was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Entangled was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Orc Jump: [[floor(18/2-5)+1+ 1d20+ -6 - 2]]:<br>Baffled: -2<br>Entangled: -4<br>");
    });

    it("condition on target can grant acting player modifier", function(){
        var targetTokenId = "2";

        mockCharacter.get = jasmine.createSpy();
        mockCharacter.get.when("id").thenReturn("c1");
        mockCharacter.get.when("name").thenReturn("Orc");
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("id").thenReturn(tokenId);
        mockToken.get.when("name").thenReturn("Bob the Orc");

        Davout.R20Utils = {
            selectedToTokenObj: function(selectedObj){},
            tokenObjToCharObj: function(tokenObj){}
        };
        spyOn(Davout.R20Utils, "selectedToTokenObj").andReturn(mockToken);
        spyOn(Davout.R20Utils, "tokenObjToCharObj").andReturn(mockCharacter);

        Davout.R20Utils.getAttribCurrentFor = jasmine.createSpy();
        Davout.R20Utils.getAttribCurrentFor.when("c1", "Str").thenReturn("10");
        Davout.R20Utils.getAttribCurrentFor.when("c1", "Att-Melee-Base").thenReturn("0");

        state.Davout.TargetIdsOfAction[tokenId] = [targetTokenId];

        mockMessage = {selected: [mockToken], playerid: tokenId};

        Davout.ConditionObj.addConditionTo(targetTokenId, "blinded", "Target NPC");

        Davout.ActionObj.command._action(mockMessage, "attack-melee");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Blinded was added to Target NPC");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Orc Melee Attack: [[floor(10/2-5)+0+ 1d20+ 2]]:<br>Target:<br>Blinded: 2<br>");
    });
});