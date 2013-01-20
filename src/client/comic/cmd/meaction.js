
/**
 * @constructor
 */
micMeAction = function() { this.name = "me"; }

micMeAction.prototype.onProcess = function(client, arguments) {
	client.transmitString(CMD_TEXT, CMD_USER_ALL, CMD_CHANNEL_CURRENT, client.nick + " " + arguments);
}

micMeAction.prototype.onReceive = function(client, arguments) {
}

micMeAction.prototype.help = function(client) {
	return " /me [action]     - Emotes an action";
}

