
/**
 * @constructor
 */
micHelp = function() { this.name = "help"; }

micHelp.prototype.onProcess = function(client, arguments) {
	if (arguments != "") {
		cmd = client.commandList[arguments];
		if (cmd) {
			client.writeString("Help for : " + arguments);
			client.writeString(cmd.help());
		} else {
			client.writeString(arguments + " is not a known, or implemented, command.");
		}
		return;
	}
	
	client.writeString("ComicIRC : A basic IRC-like client in HTML5, by Steven Goodwin");
	client.writeString(" Internal commands:");
	for(var i in client.commandList) {
		m = client.commandList[i].help();
		if (m) {
			client.writeString(m);
		}
	}
	
	if (client.extCommandList.length) {
		client.writeString(" External commands:");
		for(var i in client.extCommandList) {
			m = client.extCommandList[i].help();
			if (m) {
				client.writeString(m);
			}
		}
	}
}

micHelp.prototype.onReceive = function(client, arguments) {
}

micHelp.prototype.help = function(client) {
	return null;
}

