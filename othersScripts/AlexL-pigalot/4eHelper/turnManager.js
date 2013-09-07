/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot

 Warning this is work in progress don't expect it to always work!


 OK so this is just for Riley as he expressed an interest in what we are all doing with the API.

 This group of scripts is my ground work to building a system to make running a 4th edition D&D game easier for everyone by extending macros, handling status effects and maybe some other stuff down the line.
 */

var turnManager = {
	lastTurn : "",
	currentTurn : "",
	disableOutOfTurnTokens : true,
	onTurnUpdate : function() {
		var turnString = Campaign().get("_turnorder");
		var turnData = [];
		try {
			turnData = JSON.parse(turnString);
		} catch (e) {
		}
		
		if(turnData != undefined && turnData.length > 0) {
			var turn = turnData[0];
			if(turn.id in characterUtility.tokenLookup) {
				var id = characterUtility.tokenLookup[turn.id];
				if(id in characterUtility.characterCashe) {
					if(turnManager.currentTurn != id) {
					
						if(turnManager.currentTurn == "") {
							var tid = turnData[turnData.length - 1];
							if(tid.id in characterUtility.tokenLookup) {
								var cid = characterUtility.tokenLookup[tid.id];
								if(cid in characterUtility.characterCashe) {
									turnManager.currentTurn = cid;
								}
							}
						}
						// End of Turn.
						turnManager.lastTurn = turnManager.currentTurn;
						var c = characterUtility.characterCashe[turnManager.lastTurn];
						c.endTurn();
						if(turnManager.disableOutOfTurnTokens) c.disable();
						
						// Start of turn.
						turnManager.currentTurn = id;
						c = characterUtility.characterCashe[turnManager.currentTurn];
						c.startTurn();
						if(turnManager.disableOutOfTurnTokens) c.enable();
					}
				}
			}
		}
	},
	onReady : function() {
		
	}
};