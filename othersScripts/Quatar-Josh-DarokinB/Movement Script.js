/*
 *  roll20 User: https://app.roll20.net/users/84478/josh
 *  git User:    https://gist.github.com/DarokinB
 *  roll20 User: https://app.roll20.net/users/74414/quatar
 */
//Settings
var MovementTracker = MovementTracker || {};

MovementTracker.TOTALPINS = 20; //The number of pins you have on your map
MovementTracker.SQUARE_AURA = false; //Change to true if you want it to be square auras
MovementTracker.Aura1_Color = "#4a86e8"; //The double move color (Single move color if SHOW_SINGLE_MOVE_ONLY is true)
MovementTracker.Aura2_Color = "#FFFFFF"; //The single move color
MovementTracker.GMName = "DM (GM)"; //The display name of the GM to override controls
MovementTracker.DISPLAY_MESSAGES = false; //Set true if you want the system to make announcements
MovementTracker.DEFAULT_DOUBLE_MOVE = false; //Set true if you want players to be able to double move without !DoubleMove
MovementTracker.SHOW_SINGLE_MOVE_ONLY = true; //Set to false if you want to see single/double move aura by default

/* ********************* COMMANDS AVAILABLE *********************************
*   !DoubleMove  - Unlocks the double move for this turn and make an announcement
                   Only GM and controlling player can do this.
*   !MoveDoOver  - Moves the token back to its original position, only the GM 
*                  and controlling player can do this.
*   !MoveLast    - Moves the token back one position. Only the GM and controlling
*                  player can do this.
*   !ToggleMovement - Shuts off the movement tracker
*   !ResetPins   - Moves all pins off the map
*   !ShowPins    - Move all pins to the top left corner so you can copy and paste
*                  them to another map.
*   !Override_Maximum - Allows characters to move past their maximums.
******************************************************************************/

//Scripts Globals
MovementTracker.OriginalX = 0; //Position started from beginning of turn
MovementTracker.OriginalY = 0; //Position started from beginning of turn
MovementTracker.MoveNumber = 1;
MovementTracker.TokenSizeX = 0;
MovementTracker.TokenSizeY = 0;
MovementTracker.ENABLE_MOVEMENT = true; //Toggle for disabling system
MovementTracker.OVERRIDE_MAXIMUM = false; //Toggle for ignoring speed maximums
MovementTracker.GM_MOVES_COUNT = 0; //The number os units the GM moves the player this turn
MovementTracker.DOUBLE_MOVE = false; //Toggle for double move.
MovementTracker.CurrentToken = ""; //Saves the current token to see if it changed
     
on("change:campaign:turnorder", function () {
    if (MovementTracker.ENABLE_MOVEMENT == false) return; //Do nothing if disabled
    if (InitiativeCheck() == false) return; //Exit if initiative os empty;

    //Get current token
    var current_token = GetCurrentToken();
    if (current_token == "") return;

    if (current_token == MovementTracker.CurrentToken) return; // Exit if the new token is the same as the old token (Turn order was modified but not advanced)
    
    //Reset global variables
    MovementTracker.OriginalX = 0;
    MovementTracker.OriginalY = 0;
    MovementTracker.MoveNumber = 1;
    MovementTracker.GM_MOVES_COUNT = 0; //Resets GM Moves
    MovementTracker.OVERRIDE_MAXIMUM = false; //Resets overrise after each turn.
    MovementTracker.DOUBLE_MOVE = false; //Resets double move after each turn.
    
    var Speed = 0;
    var CurrentX = 0;
    var CurrentY = 0;
    
    //Move the pins off the map until you are ready to use them then
    ResetAllPins();
    
    //Saves token
    MovementTracker.CurrentToken = current_token;
    
    //Sets token size
    MovementTracker.TokenSizeX = current_token.get("width");
    MovementTracker.TokenSizeY = current_token.get("height");
    MovementTracker.OriginalX = current_token.get("left");
    MovementTracker.OriginalY = current_token.get("top");
 
    //Sets their speed back to maximum
    if (current_token.get("represents") !== "") {
        SetCharSpeed(current_token.get("represents"), GetCharMaxSpeed(current_token.get("represents")));
        //Saves the speed to be used later
        Speed = GetCharSpeed(current_token.get("represents"));
    }
    else
    {
        //Non Players are ignored, now that everything got reset
        return;
    }
    
    if (Speed == "" || Speed == NaN) {
        Speed = 0;
    }
    
    //Place XPin1 below the player and assign the aura
    SetPin(1, current_token.get("left"), current_token.get("top"), MovementTracker.TokenSizeX, MovementTracker.TokenSizeY, Speed, (Speed * 2));
    MovementTracker.MoveNumber = MovementTracker.MoveNumber + 1; //Moves to the next pin
});
 
on("change:graphic", function(obj, prev) {
    if (MovementTracker.ENABLE_MOVEMENT == false) return; //Do nothing if disabled
    if (InitiativeCheck() == false) return; //Exit if initiative os empty;
    //if the graphic was not moved, exit
    if (obj.get("top") == prev["top"] && obj.get("left") == prev["left"]) return;

   
    var unitsMoved = 0;
    var Speed = 0;
    
    //Non Players are ignored
    if(obj.get("represents") == "") return;
    
    //Check to make sure it is the players turn
    var c = Campaign();
    var turn_order = JSON.parse(c.get('turnorder'));
    var turn = turn_order.shift();
    if (turn.id != obj.id) {
        obj.set("top", prev["top"]);
        obj.set("left", prev["left"]);
        if (MovementTracker.DISPLAY_MESSAGES) {
            sendChat("System", "/desc " + obj.get("name") + ", it is not your turn");
        }
        return;
    }
    
    //Test for speed and place
    if (obj.get("left") != prev["left"] || obj.get("top") != prev["top"]) {
        //Sets a new pin to the location
        if (obj.get("represents") !== "") {
            Speed = GetCharMaxSpeed(obj.get("represents")); //Gets the characters Speed
        }
        else
        {
            Speed = 0;
        }
    
        if (Speed == "" || Speed == NaN) {
            Speed = 0;
        }

        SetPin(MovementTracker.MoveNumber, obj.get("left"), obj.get("top"), obj.get("width"), obj.get("height"), 0);
        
        unitsMoved = CalcUnitsMoved(); //Gets the total distance moved
        
        //Test for single move
        if(Speed < unitsMoved && MovementTracker.OVERRIDE_MAXIMUM == false && MovementTracker.DOUBLE_MOVE == false && MovementTracker.DEFAULT_DOUBLE_MOVE == false) {
            obj.set("top", prev["top"]);
            obj.set("left", prev["left"]);
            RemovePin(MovementTracker.MoveNumber);
            var unitsMoved2 = CalcUnitsMoved(); //Gets the total distance moved
            SetPin(MovementTracker.MoveNumber-1, obj.get("left"), obj.get("top"), obj.get("width"), obj.get("height"), Speed - unitsMoved2, ((Speed * 2) - unitsMoved2)); //re-set the current Pin, refresh aura
            if (MovementTracker.DISPLAY_MESSAGES) {
                sendChat("System", "/desc " + obj.get("name") + " unable to move more than single speed. Type !DoubleMove to go faster.");
            }
        }
        else {
        
            //Test for movement limits
            if(Speed * 2 < unitsMoved && MovementTracker.OVERRIDE_MAXIMUM == false) {
                obj.set("top", prev["top"]);
                obj.set("left", prev["left"]);
                RemovePin(MovementTracker.MoveNumber);
                var unitsMoved2 = CalcUnitsMoved(); //Gets the total distance moved
                SetPin(MovementTracker.MoveNumber-1, obj.get("left"), obj.get("top"), obj.get("width"), obj.get("height"), Speed - unitsMoved2, ((Speed * 2) - unitsMoved2)); //re-set the current Pin, refresh aura
                if (MovementTracker.DISPLAY_MESSAGES) {
                    sendChat("System", "/desc " + obj.get("name") + " unable to move due to speed limitation");
                }
            }
            else {
            
                //Subtract movement from speed
                SetCharSpeed(obj.get("represents"), Speed - unitsMoved);
                SetPin(MovementTracker.MoveNumber, obj.get("left"), obj.get("top"), obj.get("width"), obj.get("height"), Speed - unitsMoved, ((Speed * 2) - unitsMoved));
                MovementTracker.MoveNumber = MovementTracker.MoveNumber + 1;
            }
        }
    }
});
 
on("chat:message", function(msg) {   
    if (MovementTracker.ENABLE_MOVEMENT == false) return; //Do nothing if disabled
    if(msg.type == "api" && msg.content.indexOf("!MoveDoOver") !== -1 && MovementTracker.OriginalX !== 0 && MovementTracker.OriginalY !== 0) {
        
        //Checks to make sure we are in initiative
        var c = Campaign();
        var turn_order = JSON.parse(c.get('turnorder'));
        
        if (!turn_order.length) {
            return;
        }
        var turn = turn_order.shift();
        var current_token = getObj('graphic', turn.id);
        
        /***********************  TESTS FOR PLAYER CONTROL ****************************/
        //Get the name of the player that sent the command
        var Player = msg.who;
        var PlayerID = 0;
        
        //Convert the name of the player to the id and stores as CharID
        var CurrentPlayer = findObjs({
            _type: "player",
        });
        _.each(CurrentPlayer, function(cPlayer) {
            
            if (cPlayer.get('_displayname').indexOf(Player) == 0) {
                PlayerID = cPlayer.id;                
            }
        });
        
        //If current token is not controlled by player, cancel
        var PlayerTest = false;
        
        var Chars = findObjs({
            _type: "character",
            _id: current_token.get("represents"),
        });
        _.each(Chars, function(CharObj) {
            if (CharObj.get("controlledby").indexOf(PlayerID) !== -1) {
                PlayerTest = true;
            }
        })
        
        if( PlayerTest == false && current_token.get("name") !== Player && MovementTracker.GMName !== Player) {
            if (MovementTracker.DISPLAY_MESSAGES) {
                sendChat("System", "/desc " + Player + ", you do not control this character.");
            }
            return;
        }
        /****************** END TEST  ***************************/
        
        //Move current token back to it's original place
        current_token.set({
            'top': MovementTracker.OriginalY,
            'left': MovementTracker.OriginalX,
        });
        MovementTracker.GM_MOVES_COUNT = 0; //The number os units the GM moves the player this turn
        MovementTracker.DOUBLE_MOVE = false; //Resets double move
        
        //Sets Speed to Maximum
        SetCharSpeed(current_token.get("represents"), GetCharMaxSpeed(current_token.get("represents")));
        
        ResetAllPins();
        
        //Sets XPin1
        var Speed = GetCharMaxSpeed(current_token.get("represents"));
        SetPin(1, current_token.get("left"), current_token.get("top"), current_token.get("width"), current_token.get("height"), Speed, Speed * 2)
        
        MovementTracker.MoveNumber = 2; //Moves to the next pin
    }
});

// Double Move 
on("chat:message", function(msg) {   
    if (MovementTracker.ENABLE_MOVEMENT == false) return; //Do nothing if disabled
    if(msg.type == "api" && msg.content.indexOf("!DoubleMove") !== -1 && MovementTracker.DOUBLE_MOVE == false && MovementTracker.DEFAULT_DOUBLE_MOVE == false) {

        //Checks to make sure we are in initiative
        var c = Campaign();
        var turn_order = JSON.parse(c.get('turnorder'));
        
        if (!turn_order.length) {
            return;
        }
        var turn = turn_order.shift();
        var current_token = getObj('graphic', turn.id);
        
        /***********************  TESTS FOR PLAYER CONTROL ****************************/
        //Get the name of the player that sent the command
        var Player = msg.who;
        var PlayerID = 0;
        
        //Convert the name of the player to the id and stores as CharID
        var CurrentPlayer = findObjs({
            _type: "player",
        });
        _.each(CurrentPlayer, function(cPlayer) {
            
            if (cPlayer.get('_displayname').indexOf(Player) == 0) {
                PlayerID = cPlayer.id;                
            }
        });
        
        //If current token is not controlled by player, cancel
        var PlayerTest = false;
        
        var Chars = findObjs({
            _type: "character",
            _id: current_token.get("represents"),
        });
        _.each(Chars, function(CharObj) {
            if (CharObj.get("controlledby").indexOf(PlayerID) !== -1) {
                PlayerTest = true;
            }
        })
        
        if( PlayerTest == false && current_token.get("name") !== Player && MovementTracker.GMName !== Player) {
            if (MovementTracker.DISPLAY_MESSAGES) {
                sendChat("System", "/desc " + Player + ", you do not control this character.");
            }
            return;
        }
        /****************** END TEST  ***************************/
        
        MovementTracker.DOUBLE_MOVE = true;

        var Speed = 0;
        if (current_token.get("represents") !== "") {
            Speed = GetCharMaxSpeed(current_token.get("represents")); //Gets the characters Speed
        }
        else
        {
            Speed = 0;
        }
    
        if (Speed == "" || Speed == NaN) {
            Speed = 0;
        }

        var unitsMoved2 = CalcUnitsMoved(); //Gets the total distance moved
        SetPin(MovementTracker.MoveNumber-1, current_token.get("left"), current_token.get("top"), current_token.get("width"), current_token.get("height"), Speed - unitsMoved2, ((Speed * 2) - unitsMoved2)); //refresh aura

        if (MovementTracker.DISPLAY_MESSAGES) {
            sendChat("System", "/desc " + current_token.get("name") + " is now double moving.");
        }
        else
        {
            sendChat("Movement Tracker", "/w gm "+ current_token.get("name") + " is now double moving.");
        }
    }
});
 
on("chat:message", function(msg) {   
    if (MovementTracker.ENABLE_MOVEMENT == false) return; //Do nothing if disabled
    if(msg.type == "api" && msg.content.indexOf("!MoveLast") !== -1 && MovementTracker.OriginalX !== 0 && MovementTracker.OriginalY !== 0 ) {
        //Restore the last movement to the character
        if (MovementTracker.MoveNumber == 2) return; //Test if this is the original position
        
        var OldPinX = 0;
        var OldPinY = 0;
        var Speed = 0;
        
        //Load the Current Tokens Info
        var c = Campaign();
        var turn_order = JSON.parse(c.get('turnorder'));
        
        if (!turn_order.length) {
            return;
        }
        var turn = turn_order.shift();
        var current_token = getObj('graphic', turn.id);
        
        /***********************  TESTS FOR PLAYER CONTROL ****************************/
        //Get the name of the player that sent the command
        var Player = msg.who;
        var PlayerID = 0;
        
        //Convert the name of the player to the id and stores as CharID
        var CurrentPlayer = findObjs({
            _type: "player",
        });
        _.each(CurrentPlayer, function(cPlayer) {
            
            if (cPlayer.get('_displayname').indexOf(Player) == 0) {
                PlayerID = cPlayer.id;                
            }
        });
        
        //If current token is not controlled by player, cancel
        var PlayerTest = false;
        
        var Chars = findObjs({
            _type: "character",
            _id: current_token.get("represents"),
        });
        _.each(Chars, function(CharObj) {
            if (CharObj.get("controlledby").indexOf(PlayerID) !== -1) {
                PlayerTest = true;
            }
        })
 
        if( PlayerTest == false && current_token.get("name") !== Player && MovementTracker.GMName !== Player) {
            if (MovementTracker.DISPLAY_MESSAGES) {
                sendChat("System", "/desc " + Player + ", you do not control this character.");
            }
            return;
        }
        /****************** END TEST  ***************************/
        
        //Sets token size
        MovementTracker.TokenSizeX = current_token.get("width");
        MovementTracker.TokenSizeY = current_token.get("height");
        
        //Load the last pins info
        var firstPin = findObjs({
            _pageid: Campaign().get("playerpageid"),                              
            _type: "graphic",
            name: "XPin" + (MovementTracker.MoveNumber - 2),
        });
        _.each(firstPin, function(tPins) {
            OldPinX = tPins.get("left");
            OldPinY = tPins.get("top");
        });
        
       RemovePin(MovementTracker.MoveNumber - 1);
        
        //Move token back to last position
        current_token.set({
            'left': OldPinX,
            'top': OldPinY,
        });
        
        MovementTracker.MoveNumber = MovementTracker.MoveNumber - 1;
        var unitsMoved = CalcUnitsMoved();
        var Speed = GetCharMaxSpeed(current_token.get("represents"));
        
        //Set the last pin aura to the new speed
        var Pins = findObjs({
            _pageid: Campaign().get("playerpageid"),                              
            _type: "graphic",
            name: "XPin" + (MovementTracker.MoveNumber - 1),
        });
        // Check if we're double moving
        var doubleMove = ( MovementTracker.DEFAULT_DOUBLE_MOVE || MovementTracker.DOUBLE_MOVE || !MovementTracker.SHOW_SINGLE_MOVE_ONLY );

        _.each(Pins, function(tPin) {
            var pinname = tPin.get("name");
            if (pinname.substr(0,4) == "XPin") {
                if (doubleMove) {
                    tPin.set({
                        'aura2_radius': Speed - unitsMoved || "",
                        'aura1_radius': (Speed * 2) - unitsMoved || "",
                        'aura2_color': MovementTracker.Aura2_Color,
                        'aura1_color': MovementTracker.Aura1_Color,
                    });
                }
                else {
                    tPin.set({
                        'aura2_radius': Speed - unitsMoved || "",
                        'aura1_radius': "",
                        'aura2_color': MovementTracker.Aura1_Color,
                        'aura1_color': MovementTracker.Aura1_Color,
                    });
                }
            }
        });
        
    }
});

on("chat:message", function(msg) {   
    
    if (msg.type == "api" && msg.content.indexOf("!ToggleMovement") !== -1 && MovementTracker.GMName == msg.who) {
        
        if (MovementTracker.ENABLE_MOVEMENT == true) {
            
            MovementTracker.ENABLE_MOVEMENT = false;
        }
        else {
            MovementTracker.ENABLE_MOVEMENT = true;
        }
        
        ResetAllPins();
    }
}); 

on("chat:message", function(msg) {   
    
    if (msg.type == "api" && msg.content.indexOf("!ResetPins") !== -1 && MovementTracker.GMName == msg.who) {
        
        ResetAllPins();
    }
}); 

on("chat:message", function(msg) {   
    
    if (msg.type == "api" && msg.content.indexOf("!ShowPins") !== -1 && MovementTracker.GMName == msg.who) {
        
        ShowAllPins();
    }
}); 

on("chat:message", function(msg) {   
    
    if (msg.type == "api" && msg.content.indexOf("!Override_Maximum") !== -1 && MovementTracker.GMName == msg.who) {

        if ( MovementTracker.OVERRIDE_MAXIMUM == true) {
            MovementTracker.OVERRIDE_MAXIMUM = false;
        }
        else {
            MovementTracker.OVERRIDE_MAXIMUM = true;
        }
    }
}); 

function SetPin(PinNumber, LeftPos, TopPos, Width, Height, AuraSize, Speed) {
    // Check if we're double moving
    var doubleMove = ( MovementTracker.DEFAULT_DOUBLE_MOVE || MovementTracker.DOUBLE_MOVE || !MovementTracker.SHOW_SINGLE_MOVE_ONLY );
    
    //Resets all pins auras
    var Pins = findObjs({
        _pageid: Campaign().get("playerpageid"),                              
        _type: "graphic",
    });
    _.each(Pins, function(tPin) {
        var pinname = tPin.get("name");
        if (pinname.substr(0,4) == "XPin") {
            tPin.set({
                'aura2_radius': "",
                'aura2_color': MovementTracker.Aura2_Color,
                'aura2_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura2': true,
                'aura1_radius': "",
                'aura1_color': MovementTracker.Aura1_Color,
                'aura1_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura1': true,
            });
        }
    });
    
    //Set the last pin aura to the new speed
    var Pins = findObjs({
        _pageid: Campaign().get("playerpageid"),                              
        _type: "graphic",
        name: "XPin" + (PinNumber),
    });
    
  
    //If no aura or speed is given, set it to empty
    if (AuraSize == "NaN") {
        AuraSize = "";
    }
    if (Speed == NaN) {
        Speed = "";
    }
    _.each(Pins, function(tPin) {
        if (doubleMove) { //everything stays the same, two auras
            tPin.set({
                'left': LeftPos,
                'top': TopPos,
                'width': Width,
                'height': Height,
                'aura2_radius': AuraSize,
                'aura2_color': MovementTracker.Aura2_Color,
                'aura2_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura2': true,
                'aura1_radius': Speed || "",
                'aura1_color': MovementTracker.Aura1_Color,
                'aura1_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura1': true,
            });
        }
        else { // No Aura1 (double move) and Aura2 in Aura1 color
            tPin.set({
                'left': LeftPos,
                'top': TopPos,
                'width': Width,
                'height': Height,
                'aura2_radius': AuraSize,
                'aura2_color': MovementTracker.Aura1_Color,
                'aura2_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura2': true,
                'aura1_radius': "",
                'aura1_color': MovementTracker.Aura1_Color,
                'aura1_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura1': true,
            });
        }
        toBack(tPin);
    });
};


function GetCharSpeed(CharID) {
    
    var charSpeed = findObjs({
        name: "Speed",
        _characterid: CharID,
    });
    _.each(charSpeed, function(atrSpd){
        results =  atrSpd.get("current");
    });
    
    if (results == NaN) {
        results = "";
    }
    
    return results;
};

function GetCharMaxSpeed(CharID) {
    var results = "";
    
    var charSpeed = findObjs({
        name: "Speed",
        _characterid: CharID,
    });
    _.each(charSpeed, function(atrSpd){
        results =  atrSpd.get("max");
    });
    
    if (results == NaN) {
        results = "";
    }
    return results;
};

function SetCharSpeed(CharID, Speed){
    var charSpeed = findObjs({
        name: "Speed",
        _characterid: CharID,
    });
    _.each(charSpeed, function(atrSpd){
        atrSpd.set("current", Speed);
    });
};

function SubtCharSpeed(CharID, Speed) {
    var results = true;
    
    var charSpeed = findObjs({
        name: "Speed",
        _characterid: CharID,
    });
    _.each(charSpeed, function(atrSpd){
        if (atrSpd.get("current") < Speed) {
            results = false;
        }
        
        atrSpd.set("current", atrSpd.get("current") - Speed);
        return;
    });
    
    return results;
};

function ResetAllPins() {
    var Pins = findObjs({
        _pageid: Campaign().get("playerpageid"),                              
        _type: "graphic",
    });
    _.each(Pins, function(tPin) {
        var pinname = tPin.get("name");
        if (pinname.substr(0,4) == "XPin") {
            tPin.set({
                'left': -280,
                'top': -280,
                'width': 70,
                'height': 70,
                'aura2_radius': "",
                'aura2_color': MovementTracker.Aura2_Color,
                'aura2_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura2': true,
                'aura1_radius': "",
                'aura1_color': MovementTracker.Aura1_Color,
                'aura1_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura1': true,
            });
        }
    });
};

function RemovePin(PinNumber) {
    var Pins = findObjs({
        _pageid: Campaign().get("playerpageid"),                              
        _type: "graphic",
        name: "XPin" + PinNumber,
    });
    _.each(Pins, function(tPin) {
        var pinname = tPin.get("name");
        if (pinname.substr(0,4) == "XPin") {
            tPin.set({
                'left': -280,
                'top': -280,
                'width': 70,
                'height': 70,
                'aura2_radius': "",
                'aura2_color': "#00FF00",
                'aura2_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura2': true,
                'aura1_radius': "",
                'aura1_color': MovementTracker.Aura1_Color,
                'aura1_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura1': true,
            });
        }
    });
};

function GetCurrentToken() {
    var c = Campaign();
    var turn_order = JSON.parse(c.get('turnorder'));
    
    if (!turn_order.length) {
        return;
    }
    var turn = turn_order.shift();
    return getObj('graphic', turn.id) || "";
};

function InitiativeCheck() {
    var c = Campaign();
    var turn_order = JSON.parse(c.get('turnorder'));
    
    if (!turn_order.length) {
        ResetAllPins();
        return false;
    }
};

function CalcUnitsMoved() {
/*  This function calculates the total movement of the character this turn
    based on the pins locations
*/
    var currentPage = getObj("page", Campaign().get("playerpageid"));
    var DiagType = currentPage.get("diagonaltype");
    var isHex = false;
    var diag = 0;
    var straight = 0;
    var currLeft = 0;
    var currTop = 0;
    var lastLeft = 0;
    var lastTop = 0;
    var diagMultiplyer = 1;
    var unitsMoved = 0;
    
    //Get the scale for the players map
    scale = currentPage.get("scale_number");
    
    //Diagonal multiplier
    if (DiagType == "threefive") {
        diagMultiplyer = 1.5;
    }
    
    //Is the Map a Hex Map?
    if (currentPage.get("grid_type") == "hex" || currentPage.get("grid_type") == "hexh") {
        isHex = true;
    }
    
    var loop = 1;

    while (loop <= MovementTracker.TOTALPINS) {
        var Pins = findObjs({
            _pageid: Campaign().get("playerpageid"),                              
            _type: "graphic",
            name: "XPin" + loop,
        });
        _.each(Pins, function(tPin) {
            currTop = tPin.get("top");
            currLeft = tPin.get("left");
        });
        
        if (!(currTop == -280 && currLeft == -280 ) && !( lastLeft == -280 && lastTop == -280) && loop !== 1) {
                
            if (isHex == false) {
                //Calculates distance per pin for square grids
                
                yDif = Math.abs(currTop/70 - lastTop/70);
                xDif = Math.abs(currLeft/70 - lastLeft/70);
                
                if (xDif > yDif) {
                    diag = yDif + diag;
                    straight = xDif - yDif + straight;
                }
                else { 
                    diag = xDif + diag;
                    straight = yDif - xDif + straight;
                }
                
            }
            else { //Calculates distance per pin for Hex
                var x1 = currLeft;
                var x2 = lastLeft;
                var y1 = currTop;
                var y2 = lastTop;
                
                straight = Math.round(Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2))/76) + straight;
            }
            
        }
        
        lastTop = currTop;
        lastLeft = currLeft; 
        loop = loop + 1;
    }
    
    unitsMoved = straight + Math.floor(diag * diagMultiplyer) - MovementTracker.GM_MOVES_COUNT;
    return unitsMoved * scale;
};

function ShowAllPins() {
    var Pins = findObjs({
        _pageid: Campaign().get("playerpageid"),                              
        _type: "graphic",
    });
    _.each(Pins, function(tPin) {
        var pinname = tPin.get("name");
        if (pinname.substr(0,4) == "XPin") {
            tPin.set({
                'left': 35,
                'top': 35,
                'width': 70,
                'height': 70,
                'aura2_radius': "",
                'aura2_color': MovementTracker.Aura2_Color,
                'aura2_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura2': true,
                'aura1_radius': "",
                'aura1_color': MovementTracker.Aura1_Color,
                'aura1_square': MovementTracker.SQUARE_AURA,
                'showplayers_aura1': true,
            });
        }
    });
};

function MyTurn(obj) {
    //Check to make sure it is the players turn
    var c = Campaign();
    var turn_order = JSON.parse(c.get('turnorder'));
    var turn = turn_order.shift();
    
    if (turn_order.length == 0 ) return true;
    
    if (turn.id != obj.id) {
        if (MovementTracker.DISPLAY_MESSAGES) {
            sendChat("System", "/desc " + obj.get("name") + ", it is not your turn");
        }
        return false;
    }  
    else {
        return true;
    }
};