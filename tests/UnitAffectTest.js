describe("Affect Unit suite", function () {
    describe("Affect constructor", function () {

        it("is invalid args", function () {
            expect(function () {
                new Davout.ConditionFW.Affect([], {});
            }).toThrow("Davout.ConditionFW.Affect Arg # 0 with value of [] is of an invalid type. Arg # 1 with value of {} is of an invalid type.");
        });


    });
});