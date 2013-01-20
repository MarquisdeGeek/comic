
/**
 * @constructor
 */
micPrivateNotice = function() { this.name = "notice"; }

micPrivateNotice.prototype.onProcess = function(client, arguments) {
	dual = client.extractDualArguments(arguments);

	client.transmitString(CMD_NOTICE, dual[0], CMD_CHANNEL_ALL, "*"+client.nick + "* " + dual[1]);
}

micPrivateNotice.prototype.onReceive = function(client, arguments) {
}

micPrivateNotice.prototype.help = function(client) {
	return " /notice [name] message     - Send a private message. (Warning: this is hackable by knowledgeable users)";
}

