/*
 *  roll20 User: https://app.roll20.net/users/82116/melvin-mcsnatch
 */

var lights = function(radius,dim) {
    var light1 = findObjs({_type: "graphic", name: "light1"})[0];
    var light2 = findObjs({_type: "graphic", name: "light2"})[0];
    light1.set("light_radius", radius);
    light2.set("light_radius", radius);
    light1.set("light_dimradius", dim);
    light2.set("light_dimradius", dim);
};
on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!lite") !== -1) {
        lights(100,100);};});
on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!dark") !== -1) {
        lights(100,0);};});