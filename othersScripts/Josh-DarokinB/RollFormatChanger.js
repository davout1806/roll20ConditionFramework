/*
 *  roll20 User: https://app.roll20.net/users/84478/josh
 *  git User:    https://gist.github.com/DarokinB
 */

//Global Identifier
var rollFormat = rollFormat || {};

rollFormat.CSSBGColor = "#66CCFF"; //Color of background
rollFormat.CSSbrdrColor = "blue"; //color of border
rollFormat.CSSfontColor = "black"; // color of text
rollFormat.CSSfumbleColor = "red"; //color of lowest rolls (1 on 1dX)
rollFormat.CSScriticalColor = "white"; //color of highest rolls (X on 1dX)

rollFormat.modCSS =  "font-size: 1.1em;"; //Modifer size
rollFormat.totCSS =  "font-size: 1.8em;"; //Totals size

rollFormat.CSS = "background:" + rollFormat.CSSBGColor + "; color:" + rollFormat.CSSfontColor + "; border-radius: 8px; padding:4px; font-size: 1.1em; border-style:solid; border-color:" + rollFormat.CSSbrdrColor + "; border-width:1px;";


on("chat:message", function(msgOld) {
    //tests for a roll command
    if (msgOld.content.indexOf("!r ") !== -1) {
        var player = msgOld.who;
        var currMsg = msgOld.content.replace("!r ", "");
        var notes = "";

        sendChat(player, "\n/roll " + currMsg, function(op) {

            var output = "<TABLE border='0' cellpadding = '4' style='text-align:center;'><TR>";
            var obj = JSON.parse(op[0].content);

            //loop through cleanedMsg to display each die rolled
            _.each(obj.rolls, function(nMsg){
                switch(nMsg.type) {
                    case "R":
                        output += "<TD border='1'><div style='" + rollFormat.CSS + "'>";
                        output += nMsg.dice + "d" + nMsg.sides + " = <br />(";
                        var count = 0;
                        _.each(nMsg.results, function(resOut){
                            count += 1;
                            if(resOut.d == true){
                                output += "<i style='text-decoration: line-through'>"
                            }
                            if (resOut.v == nMsg.sides) {
                                output += "<strong style='font-size: 1.5em; color:" + rollFormat.CSScriticalColor + "';>" + resOut.v + "</strong>";
                            } else if (resOut.v == 1){
                                output += "<strong style='font-size: 1.5em; color:" + rollFormat.CSSfumbleColor + "';>" + resOut.v + "</strong>";
                            } else {
                                output += resOut.v;
                            }
                            if(resOut.d == true) {
                                output += "</i>"
                            }
                            if (count !== nMsg.results.length) {
                                output += ",";
                            }
                        });
                        output += ") </div></TD>";
                        break;
                    case "M":
                        output += "<TD><div style='" + rollFormat.modCSS + "'>";
                        output += nMsg.expr + "</div></TD>";
                        break;
                    case "C":
                        notes += nMsg.text;
                        break;
                }
            });

            output += "<TD><div style='" + rollFormat.totCSS+ "'> = " + obj.total + notes + "</div> </TD> </TR> </TABLE>"
            sendChat(player, "/direct " + output);
        });

    }

});
