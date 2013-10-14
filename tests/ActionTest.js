

describe("A suite", function() {
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
        findObjs = jasmine.createSpy();
    });

    it("Action: prevent action when token has prohibited condition effect", function(){
        spyOn(mockCharacter, "get").andReturn("c1");
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("id").thenReturn(tokenId);
        mockToken.get.when("name").thenReturn("Bob the Orc");
        findObjs.when({_type: 'attribute', name: "Int", _characterid: "c1"}).thenReturn([mockAttributeSheetObj]);
        findObjs.when({_type: 'attribute', name: "Crafting-Base", _characterid: "c1"}).thenReturn([mockBaseModSheetObj]);

        Davout.R20Utils = {
            selectedToTokenObj: function(selectedObj){},
            tokenObjToCharObj: function(tokenObj){}
        };
        spyOn(Davout.R20Utils, "selectedToTokenObj").andReturn(mockToken);
        spyOn(Davout.R20Utils, "tokenObjToCharObj").andReturn(mockCharacter);

        mockMessage = {selected: [mockToken]};

        Davout.ConditionObj.addConditionTo(tokenId, "blinded", "Bob the Orc");
        Davout.Actions.command._action(mockMessage, "improvise");
        expect(mockToken.get).toHaveBeenCalledWith("id");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Bob the Orc is prohibited from performing Improvise.<br>Blinded: 0. Cannot perform craft skill.<br>");
    });

    xit("send chat message when action is unkown", function(){
        Davout.Actions.command._action(mockMessage, "blah");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Blah is an unknown action");
    });

    it("action takes into account condition modifier", function(){
        spyOn(mockAttributeSheetObj, "get").andReturn("18");
        spyOn(mockBaseModSheetObj, "get").andReturn("1");
        spyOn(mockApcSheetObj, "get").andReturn("2");
        mockCharacter.get = jasmine.createSpy();
        mockCharacter.get.when("id").thenReturn("c1");
        mockCharacter.get.when("name").thenReturn("Orc");
        mockToken.get = jasmine.createSpy();
        mockToken.get.when("id").thenReturn(tokenId);
        mockToken.get.when("name").thenReturn("Bob the Orc");
        findObjs.when({_type: 'attribute', name: "Dex", _characterid: "c1"}).thenReturn([mockAttributeSheetObj]);
        findObjs.when({_type: 'attribute', name: "Acrobatics-Base", _characterid: "c1"}).thenReturn([mockBaseModSheetObj]);
        findObjs.when({_type: 'attribute', name: "AC-Penalty", _characterid: "c1"}).thenReturn([mockApcSheetObj]);

        Davout.R20Utils = {
            selectedToTokenObj: function(selectedObj){},
            tokenObjToCharObj: function(tokenObj){}
        };
        spyOn(Davout.R20Utils, "selectedToTokenObj").andReturn(mockToken);
        spyOn(Davout.R20Utils, "tokenObjToCharObj").andReturn(mockCharacter);

        mockMessage = {selected: [mockToken]};

        Davout.ConditionObj.addConditionTo(tokenId, "baffled", "Bob the Orc");
        Davout.ConditionObj.addConditionTo(tokenId, "entangled", "Bob the Orc");
        Davout.Actions.command._action(mockMessage, "jump");

        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Baffled was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Entangled was added to Bob the Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Orc Jump: [[floor(18/2-5)+1+ 1d20+ -6 - 2]]");
    });
});