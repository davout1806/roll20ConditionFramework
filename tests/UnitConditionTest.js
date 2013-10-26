describe("Condition Unit suite", function () {
    describe("Effect constructor", function () {

        it("is invalid args", function () {
            expect(function () {
                new Davout.ConditionFW.Effect({}, [], [], "x");
            }).toThrow("Davout.ConditionFW.Effect Arg # 0 with value of {} is of an invalid type. Arg # 1 with value of [] is of an invalid type. Arg # 2 with value of [] is of an invalid type. Arg # 3 with value of \"x\" is of an invalid type.");
        });

        it("typical", function () {
            var effect = new Davout.ConditionFW.Effect("blind", false, false, 1, "something of note");
            expect(effect.efHasModifier).toEqual(true);
            expect(effect.efModifier).toEqual(1);
            expect(effect.efIsAttribute).toEqual(false);
            expect(effect.efNameOfAffected).toEqual("blind");
            expect(effect.efNote).toEqual("something of note");
            expect(effect.efIsProhibited).toEqual(false);
        });

        it("where prohibited is true", function () {
            var effect = new Davout.ConditionFW.Effect("blind", false, true, 1, "something of note");
            expect(effect.efHasModifier).toEqual(false);
            expect(effect.efModifier).toBeNaN();
            expect(effect.efIsAttribute).toEqual(false);
            expect(effect.efNameOfAffected).toEqual("blind");
            expect(effect.efNote).toEqual("something of note");
            expect(effect.efIsProhibited).toEqual(true);
        });

        it("where isAttribute is true", function () {
            var effect = new Davout.ConditionFW.Effect("blind", true, false, 1, "something of note");
            expect(effect.efHasModifier).toEqual(true);
            expect(effect.efModifier).toEqual(1);
            expect(effect.efIsAttribute).toEqual(true);
            expect(effect.efNameOfAffected).toEqual("blind");
            expect(effect.efNote).toEqual("something of note");
            expect(effect.efIsProhibited).toEqual(false);
        });

        it("where prohibited is true and isAttribute is true", function () {
            var effect = new Davout.ConditionFW.Effect("blind", true, true, 1, "something of note");
            expect(effect.efHasModifier).toEqual(false);
            expect(effect.efModifier).toBeNaN();
            expect(effect.efIsAttribute).toEqual(true);
            expect(effect.efNameOfAffected).toEqual("blind");
            expect(effect.efNote).toEqual("something of note");
            expect(effect.efIsProhibited).toEqual(true);
        });

    });

    describe("Condition constructor", function () {

        it("with invalid args", function () {
            expect(function () {
                Davout.ConditionFW.Condition([], 3, {}, 9);
            }).toThrow("Davout.ConditionFW.Condition Arg # 0 with value of [] is of an invalid type. Arg # 1 with value of 3 is of an invalid type. Arg # 2 with value of {} is of an invalid type. Arg # 3 with value of 9 is of an invalid type.");
        });

        it("typical", function () {
            var effects = new Array(
                new Davout.ConditionFW.Effect("balance", false, false, -2)
                , new Davout.ConditionFW.Effect("break-fall", false, false, -2, "huh")
            );
            var condition = new Davout.ConditionFW.Condition("baffled", effects);

            expect(condition.coName).toEqual("baffled");
            expect(condition.coMaxStackSize).toEqual(1);
            expect(condition.coNextConditionName).toEqual(undefined);
            expect(condition.coEffects).toEqual(
                {
                    "balance": [
                        {efModifier: -2, efHasModifier: true, efNameOfAffected: "balance", efNote: "", efIsProhibited: false, efIsAttribute: false }
                    ], "break-fall": [
                    {efModifier: -2, efHasModifier: true, efNameOfAffected: "break-fall", efNote: "huh", efIsProhibited: false, efIsAttribute: false }
                ]
                }
            );
        });

        it("where condition stackable", function () {
            var effects = new Array(new Davout.ConditionFW.Effect("Str", true, false, -2));
            var condition = new Davout.ConditionFW.Condition("fatigued", effects, 4);

            expect(condition.coName).toEqual("fatigued");
            expect(condition.coMaxStackSize).toEqual(4);
            expect(condition.coNextConditionName).toEqual(undefined);
            expect(condition.coEffects).toEqual(
                {
                    "Str": [
                        {efModifier: -2, efHasModifier: true, efNameOfAffected: "Str", efNote: "", efIsProhibited: false, efIsAttribute: true }
                    ]
                }
            );
        });

        it("where condition stackable with NextCondition", function () {
            var effects = new Array(new Davout.ConditionFW.Effect("Str", true, false, -2));
            var condition = new Davout.ConditionFW.Condition("fatigued", effects, 4, "unconscious");

            expect(condition.coName).toEqual("fatigued");
            expect(condition.coMaxStackSize).toEqual(4);
            expect(condition.coNextConditionName).toEqual("unconscious");
            expect(condition.coEffects).toEqual(
                {
                    "Str": [
                        {efModifier: -2, efHasModifier: true, efNameOfAffected: "Str", efNote: "", efIsProhibited: false, efIsAttribute: true }
                    ]
                }
            );
        });

    });

    describe("Condition ", function () {
        it("getEffectsAffectingAction with effect type checking", function () {
            var effects = new Array(
                new Davout.ConditionFW.Effect("Str", true, false, -2)
                , new Davout.ConditionFW.Effect("Jump", false, false, -2, "huh")
            );

            var condition = new Davout.ConditionFW.Condition("test", effects);

            var mockActionObj = {acName: "Str"};

            expect(function () {condition.getEffectsAffectingAction(mockActionObj)})
                .toThrow("Davout.ConditionFW.ConditionedToken.getAffectForAction: Looking for effects on action but effect was attribute effect.");

            mockActionObj = {acName: "Jump"};
            expect(function () {condition.getEffectsAffectingAction(mockActionObj)})
                .not.toThrow("Davout.ConditionFW.ConditionedToken.getAffectForAction: Looking for effects on action but effect was attribute effect.");
        });

        it("getEffectsAffectingActionsAttr with effect type checking", function () {
            var effects = new Array(
                new Davout.ConditionFW.Effect("Str", true, false, -2)
                , new Davout.ConditionFW.Effect("Jump", false, false, -2, "huh")
            );

            var condition = new Davout.ConditionFW.Condition("test", effects);

            var mockActionObj = {acName: "Str"};
            expect(function () {condition.getEffectsAffectingActionsAttr(mockActionObj)})
                .not.toThrow("Davout.ConditionFW.ConditionedToken.getAffectForAction: Looking for effects on attribute but effect was action effect.");

            mockActionObj = {acName: "Jump"};
            expect(function () {condition.getEffectsAffectingActionsAttr(mockActionObj)})
                .toThrow("Davout.ConditionFW.ConditionedToken.getAffectForAction: Looking for effects on attribute but effect was action effect.");
        });
    });

    describe("Condition getEffectsAffecting", function () {
        it("with matching name", function () {
            var effects = new Array(
                new Davout.ConditionFW.Effect("balance", false, false, -2)
                , new Davout.ConditionFW.Effect("break-fall", false, false, -2, "huh")
            );
            var condition = new Davout.ConditionFW.Condition("baffled", effects);

            expect(condition.getEffectsAffecting("break-fall")).toEqual([
                {efModifier: -2, efHasModifier: true, efNameOfAffected: "break-fall", efNote: "huh", efIsProhibited: false, efIsAttribute: false }
            ]);
        });

        it("with unmatching name", function () {
            var effects = new Array(
                new Davout.ConditionFW.Effect("balance", false, false, -2)
                , new Davout.ConditionFW.Effect("break-fall", false, false, -2, "huh")
            );
            var condition = new Davout.ConditionFW.Condition("baffled", effects);

            expect(condition.getEffectsAffecting("Melee Attack")).toEqual([]);
        });
    });
});