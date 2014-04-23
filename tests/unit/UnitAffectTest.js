describe("EffectOnToken Unit suite", function () {
    describe("EffectOnToken constructor", function () {

        it("is invalid args", function () {
            expect(function () {
                new Davout.ConditionFW.EffectOnToken([], 3, "dsfds");
            }).toThrow("Davout.ConditionFW.EffectOnToken Arg # 0 with value of [] is of an invalid type. Arg # 1 with value of 3 is of an invalid type. Arg # 2 with value of \"dsfds\" is of an invalid type.");
        });


    });
});