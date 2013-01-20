
/**
 * @constructor
 */
micPing = function() { this.name = "ping"; }

micPing.prototype.onProcess = function(client, arguments) {
	//  /ping nickname
	var ms = new Date().getTime();
	client.transmitString(CMD_PING, arguments, CMD_CHANNEL_ALL, ms);

	client.writeString("Ping sent...");
}

micPing.prototype.onReceive = function(client, arguments) {
}

micPing.prototype.help = function(client) {
	return null;
}

