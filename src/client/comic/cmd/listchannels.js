
/**
 * @constructor
 */
micListChannels = function() { this.name = "list"; }

micListChannels.prototype.onProcess = function(client, arguments) {
	// /list
	client.transmitString(CMD_PROCESS, CMD_USER_ALL, CMD_CHANNEL_ALL, "list");
	client.conduit.clearChannelList();
	client.writeString("Requesting channel list..");
}

micListChannels.prototype.onReceive = function(client, arguments) {
	return client.getChannelName();
}

micListChannels.prototype.onReceiveResult = function(client, arguments) {
	client.conduit.addChannelList(arguments[1]);
}

micListChannels.prototype.help = function(client) {
	return " /list          - List all channels on the system";
}

