/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot

 Warning this is work in progress don't expect it to always work!


 OK so this is just for Riley as he expressed an interest in what we are all doing with the API.

 This group of scripts is my ground work to building a system to make running a 4th edition D&D game easier for everyone by extending macros, handling status effects and maybe some other stuff down the line.
 */

function utility(className) {
	
	this.className = className;

	this.characterCashe = {};

	this.logError = function(message) {
		log("Error(" + this.className + "): " + message);
	};
	
	this.logWarning = function(message) {
		log("Warning(" + this.className + "): " + message);
	};
	
	this.logDebug = function(message) {
		log("Debug(" + this.className + "): " + message);
	};
	
	this.getJSONString = function(obj) {
		var jsonStr = JSON.stringify(obj, function(key, value) {
				if(key.charAt(0) === "_") return "";
				else return value;
			});
		return jsonStr;
	};
	
	this.between = function(input, min, max) {
		return (input <= max && input >= min);
	};
} 