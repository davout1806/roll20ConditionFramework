/**
 * Note: Action Name in chat command/property name cannot contain spaces.
 */
state.Davout.ActionObjs["fort-save"] = new Davout.ActionObj.Action("Fort Save", "Con", "Fortitude-Mod", false);
state.Davout.ActionObjs["improvise"] = new Davout.ActionObj.Action("Improvise", "Int", "Crafting-Base", false);
state.Davout.ActionObjs["jump"] = new Davout.ActionObj.Action("Jump", "Dex", "Acrobatics-Base", true);
state.Davout.ActionObjs["attack-melee"] = new Davout.ActionObj.Action("Melee Attack", "Str", "Att-Melee-Base", false);
state.Davout.ActionObjs["attack-hurl"] = new Davout.ActionObj.Action("Hurl Attack", "Dex", "Att-Hurl-Base", false);
state.Davout.ActionObjs["attack-range"] = new Davout.ActionObj.Action("Range Attack", "Dex", "Att-Range-Base", false);

state.Davout.DcActionObjs["attack-melee"] = new Davout.ActionObj.Action("Melee Attack", "Dex", "Defense", true);
state.Davout.DcActionObjs["attack-hurl"] = new Davout.ActionObj.Action("Hurl Attack", "Dex", "Defense", true);
state.Davout.DcActionObjs["attack-range"] = new Davout.ActionObj.Action("Range Attack", "Dex", "Defense", true);

// ActionsFC

