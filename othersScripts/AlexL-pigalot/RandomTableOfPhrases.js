/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot

 Install instructions:

 Copy community.command into a script tab.
 Copy this script into any tab after community.command.

 Useage:

 This script has two commands:

 !phrases_add - This takes a table name as the first parameter and will create the table if it doesnt exist, its second parameter should be the phrase you wish to add (wrap it in quotes if it has spaces). eg !phrases_add alexsTable "The quick brown fox jumps over the lazy dog" or if you want emotes !phrases_add alexsTable "/me The quick brown fox jumps over the lazy dog".
 !phrases_roll - This takes one parameter and that is the table name and will output a phrase at random from that table.
*/

var pigalot = pigalot || {};
pigalot.requests = pigalot.requests || {};
pigalot.requests.phrases = pigalot.requests.phrases || {};


pigalot.requests.phrases._tables = {};

pigalot.requests.phrases._load = function() {
    if("pigalot.requests.phrases" in state) {
        // Get the JSON string from state.
        var jsonStr = state["pigalot.requests.phrases"];

        try {
            var obj = JSON.parse(jsonStr);
            pigalot.requests.phrases._tables = obj;
        } catch(e) {}
    }
};

pigalot.requests.phrases._save = function() {
    var jsonStr = JSON.stringify(pigalot.requests.phrases._tables);
    state["pigalot.requests.phrases"] = jsonStr;
};

pigalot.requests.phrases._add = function(table, phrase) {
    pigalot.requests.phrases._load();
    if(!(table in pigalot.requests.phrases._tables)) {
        pigalot.requests.phrases._tables[table] = [];
    }
    pigalot.requests.phrases._tables[table].push(phrase);
    pigalot.requests.phrases._save();
};

pigalot.requests.phrases._roll = function(table, who) {
    pigalot.requests.phrases._load();
    if(table in pigalot.requests.phrases._tables) {
        var players = findObjs({
            _type: "player",
            _displayname: who
        });
        var sendAs = who;
        if(players.length > 0) {
            var id = players[0].get("_d20userid");
            sendAs = "player|" + id;
        }

        var roll = randomInteger(pigalot.requests.phrases._tables[table].length) - 1;
        var message = pigalot.requests.phrases._tables[table][roll];

        sendChat(sendAs, message);
    };
};


on("ready", function() {
    // Requires community.command
    if(community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }

    var addcommand = {};
    addcommand.minArgs = 2;
    addcommand.maxArgs = 2;
    addcommand.typeList = ["str","str"];
    addcommand.syntax = "!phrases_add TableName Phrase";
    addcommand.handle = function(args, who, selected) {
        pigalot.requests.phrases._add(args[0].value, args[1].value);
        log("ADD" + selected);
    };
    community.command.add("phrases_add", addcommand);

    var rollcommand = {};
    rollcommand.minArgs = 1;
    rollcommand.maxArgs = 1;
    rollcommand.typeList = ["str"];
    rollcommand.syntax = "!phrases_roll TableName";
    rollcommand.handle = function(args, who, selected) {
        pigalot.requests.phrases._roll(args[0].value,who);
        log("ROL" + selected);
    };
    community.command.add("phrases_roll", rollcommand);
});