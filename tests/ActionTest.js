describe("Action suite", function () {
    var tokenId = "1";
    var mockMessage = null;
    var mockToken = {};
    var davoutToken = {};
    var mockCharacter = {};



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