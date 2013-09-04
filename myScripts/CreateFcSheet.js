var DavoutSheet = DavoutSheet || {};

DavoutSheet.attribs = [];
DavoutSheet.attribs["str"] = { name: "str" , current: 0};
DavoutSheet.attribs["dex"] = { name: "dex" , current: 0};
DavoutSheet.attribs["con"] = { name: "con" , current: 0};
DavoutSheet.attribs["int"] = { name: "int" , current: 0};
DavoutSheet.attribs["wis"] = { name: "wis" , current: 0};
DavoutSheet.attribs["cha"] = { name: "cha" , current: 0};
DavoutSheet.attribs["fort"] = { name: "Fortitude-Mod", current: 0, max: 0 };
DavoutSheet.attribs["ref"] = { name: "Reflex-Mod", current: 0, max: 0 };
DavoutSheet.attribs["will"] = { name: "Will-Mod", current: 0, max: 0 };

DavoutSheet.skills = [
    { name: "acrobatics", attribute: "dex", acp: true },
    { name: "athletics", attribute: "str", acp: true }
];

DavoutSheet.saves = [];
DavoutSheet.saves["fort"] = { name: "fort-save", attribute: "con", bonus: DavoutSheet.attribs["fort"].name };
DavoutSheet.saves["ref"] = { name: "ref-save", attribute: "dex", bonus: DavoutSheet.attribs["ref"].name };
DavoutSheet.saves["will"] = { name: "will-save", attribute: "wis", bonus: DavoutSheet.attribs["will"].name };
