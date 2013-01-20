
/**
 * @constructor
 */
micSetNick = function() { this.name = "nick"; }

micSetNick.prototype.onProcess = function(client, arguments) {
	if (arguments == "") {
		client.writeString("You are known as "+client.nick);
	} else {
		// BUGWARN: TODO: There may be duplicate names
		client.nick = arguments;
		client.writeString("Your nickname is now "+arguments);
	}
}

micSetNick.prototype.onReceive = function(client, arguments) {
}

micSetNick.prototype.help = function(client) {
	return " /nick [name]     - Change your nick name";
}

