var davout = davout || {};

davout.attribs = [];
davout.attribs["str"] = { name: "str" , current: 0};
davout.attribs["dex"] = { name: "dex" , current: 0};
davout.attribs["con"] = { name: "con" , current: 0};
davout.attribs["int"] = { name: "int" , current: 0};
davout.attribs["wis"] = { name: "wis" , current: 0};
davout.attribs["cha"] = { name: "cha" , current: 0};
davout.attribs["fort"] = { name: "Fortitude-Mod", current: 0, max: 0 };
davout.attribs["ref"] = { name: "Reflex-Mod", current: 0, max: 0 };
davout.attribs["will"] = { name: "Will-Mod", current: 0, max: 0 };

davout.skills = [
    { name: "acrobatics", attribute: "dex", acp: true },
    { name: "athletics", attribute: "str", acp: true }
];

davout.saves = [];
davout.saves["fort"] = { name: "fort-save", attribute: "con", bonus: davout.attribs["fort"].name };
davout.saves["ref"] = { name: "ref-save", attribute: "dex", bonus: davout.attribs["ref"].name };
davout.saves["will"] = { name: "will-save", attribute: "wis", bonus: davout.attribs["will"].name };
