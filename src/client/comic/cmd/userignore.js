
/**
 * @constructor
 */
micUserIgnore = function() { this.name = "ignore"; }

micUserIgnore.prototype.onProcess = function(client, arguments) {
	//  /ignore nickname
	//  /ignore -r
	// also unignore
	dual = client.extractDualArguments(arguments);
	if (dual[0] == "-r") {
		client.ignoreList[dual[1]] = null;
	} else {
		client.ignoreList[dual[0]] = dual[0];
		client.writeString(dual[0] + " has been added to your ignore list");
	}
}

micUserIgnore.prototype.onReceive = function(client, arguments) {
}

micUserIgnore.prototype.help = function(client) {
	return " /ignore [name]   - Ignore the user";
}

