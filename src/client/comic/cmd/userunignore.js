
/**
 * @constructor
 */
micUserUnignore = function() { this.name = "unignore"; }

micUserUnignore.prototype.onProcess = function(client, arguments) {
	//  /unignore nickname
	client.ignoreList[arguments] = null;
	client.writeString(arguments + " has been removed from your ignore list");
}

micUserUnignore.prototype.onReceive = function(client, arguments) {
}

micUserUnignore.prototype.help = function(client) {
	return " /unignore [name] - No longer ignore the user";
}

