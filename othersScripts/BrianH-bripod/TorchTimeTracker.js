/*
 *  roll20 User: https://app.roll20.net/users/38483/brian-h
 *  git User:    https://gist.github.com/bripod
 */

// roll20 API script for tracking time elapsed in rounds or turns, and tracking
// consumption of finite light sources -- right now, just torches
// Marking Time:
// "!r x" and "!t x" will increment the state.timeElapsed property by x or x*10 minutes
// "!time" will give the current time elapsed, and "!time x" will reset the time elapsed to x minutes
// Torches:
// The script will look for graphics named "Torch" whenever time passes
// I've used the bar1_max to indicate the max burning time (in rounds) of the torch,
// and bar1_value to track how much "fuel" is left. bar2_value can be set to 0 or 1 to turn the
// torch off and on, respectively.

function updateLights(lightSource,elapsedTime) {
    var burningTimeTotal = lightSource.get("bar1_max");
    var burningTimeRemaining = lightSource.get("bar1_value");
    var trigger_dim = Math.floor(burningTimeTotal * 0.3);
    var trigger_flicker = Math.floor(burningTimeTotal * 0.2);
    var trigger_almostOut = Math.floor(burningTimeTotal * 0.1);
    var brightRadius = 40;  // hard-coding these for torch
    var dimRadius = 18;     // should move these to function call
    var newBurningTimeRemaining = burningTimeRemaining - 1.0 * elapsedTime;
    if (burningTimeRemaining == 0 || lightSource.get("bar2_value") == 0) return; // make sure light source is lit & has fuel remaining
    if (newBurningTimeRemaining >= trigger_dim && lightSource.get("light_radius") !== brightRadius) {
        lightSource.set({ light_radius: brightRadius, light_dimradius: dimRadius});
    } else if (newBurningTimeRemaining <= trigger_dim && newBurningTimeRemaining > trigger_flicker && (burningTimeRemaining > trigger_dim || burningTimeRemaining == newBurningTimeRemaining)) {
        sendChat("Torch","/w gm grows dim. ");
        lightSource.set({ light_radius: Math.floor(brightRadius * 0.8), light_dimradius: Math.floor(dimRadius * 0.8)});
    } else if (newBurningTimeRemaining <= trigger_flicker && newBurningTimeRemaining > trigger_almostOut && (burningTimeRemaining > trigger_flicker || burningTimeRemaining == newBurningTimeRemaining)) {
        sendChat("Torch","/w gm begins to flicker. ");
        lightSource.set({ light_radius: Math.floor(brightRadius * 0.5), light_dimradius: Math.floor(dimRadius * 0.5)});
    } else if (newBurningTimeRemaining <= trigger_almostOut && newBurningTimeRemaining > 0&& (burningTimeRemaining > trigger_almostOut || burningTimeRemaining == newBurningTimeRemaining)) {
        sendChat("Torch","/w gm about to go out. ");
        lightSource.set({ light_radius: Math.floor(brightRadius * 0.2), light_dimradius: Math.floor(dimRadius * 0.3)});
    } else if (newBurningTimeRemaining <= 0) {
        newBurningTimeRemaining = 0;
        sendChat("Torch","/w gm goes out.");
        lightSource.set({
            bar2_value: 0,
            light_radius: "",
            light_dimradius: ""
        });
    };
    lightSource.set({
        bar1_value: newBurningTimeRemaining
    });
};

on("chat:message", function(msg) {
    if (msg.type == "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!time") !== -1) {
        var n = msg.content.split(" ", 2)
        if (n.length == 1) { // i.e., just "!time"
            sendChat("Timer","/w gm " + Math.floor(state.timeElapsed / 60) + " hours, " + Math.floor(state.timeElapsed % 60) + " minutes in the dungeon.");
        } else if (n.length == 2 && isNaN(n[1]) == false) { // i.e., "!time x" where "x" is a number
            state.timeElapsed = n[1];
            sendChat("Timer","/w gm " + Math.floor(state.timeElapsed / 60) + " hours, " + Math.floor(state.timeElapsed % 60) + " minutes in the dungeon.");
        }
    }
    if (msg.type == "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!r ") !== -1) {
        var n = msg.content.split(" ", 2)
        var numRounds = n[1].toLowerCase();
        state.timeElapsed = parseInt(state.timeElapsed) + parseInt(numRounds);
        var currentPageTorches = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            name: "Torch"
        });
        _.each(currentPageTorches, function(obj) {
            updateLights(obj,numRounds);
        });
    }
    if (msg.type == "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!t ") !== -1) {
        var n = msg.content.split(" ", 2)
        var numRounds = n[1].toLowerCase() * 10;
        state.timeElapsed = parseInt(state.timeElapsed) + parseInt(numRounds);
        var currentPageTorches = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            name: "Torch"
        });
        _.each(currentPageTorches, function(obj) {
            updateLights(obj,numRounds);
        });
    }
});

on("change:graphic:bar2_value", function(obj) {
    if (obj.get("name") == "Torch") {
        if (obj.get("bar2_value") > 0 ) {
            if (obj.get("bar1_value") > 0) {
                obj.set({bar2_value: 1});
            } else {obj.set({bar2_value: 0})};
            updateLights(obj,0);
        } else if (obj.get("bar2_value") <= 0 ) {
            obj.set({bar2_value: 0});
            obj.set({light_radius: "",light_dimradius: ""});
        };
    };
});