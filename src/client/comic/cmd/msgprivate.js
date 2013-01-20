
/**
 * @constructor
 */
micPrivateMessage = function() { this.name = "msg"; }

micPrivateMessage.prototype.onProcess = function(client, arguments) {
	//  /msg nickname (message) 
	// *nick* msg
	// (should be a private, until further notice)
	client.writeString("This command is not currently supported.");
}

micPrivateMessage.prototype.onReceive = function(client, arguments) {
}

micPrivateMessage.prototype.help = function(client) {
	return null;
}

