
/**
 * @constructor
 */
micJoinChannel = function() { this.name = "join"; }

micJoinChannel.prototype.onProcess = function(client, arguments) {
	// /join #channelname
	client.setChannelName(arguments);
	client.writeString("Channel set to " + arguments);
	client.conduit.addChannelList(arguments);
	
	// Repopulate necessary to set the '*'
	client.conduit.refillChannelList();
	
	// Announce the channel to others...
	client.transmitString(CMD_ANNOUNCE_CHANNEL, CMD_USER_ALL, CMD_CHANNEL_ALL, arguments);
	// TODO: If no one else claims it, become the sysop
}

micJoinChannel.prototype.onReceive = function(client, arguments) {
}

micJoinChannel.prototype.help = function(client) {
	return " /join channelname     - Join (or create, if none exists) the given channel";
}

