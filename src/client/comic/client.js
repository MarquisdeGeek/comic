
var CMD_TEXT = "text";
var CMD_PING = "myping";
var CMD_PING_RETURN = "mypong";
var CMD_NOTICE = "notice";
var CMD_PROCESS = "process";
var CMD_PROCESS_RESULT = "process_result";
var CMD_ANNOUNCE_CHANNEL = "announce_channel";

var CMD_USER_ALL = "";

var CMD_CHANNEL_ALL = "";
var CMD_CHANNEL_CURRENT = "<current>";

/**
 * @constructor
 */
ComicIRC = function() {
	this.url = null;
	this.conduit = null;
	this.proxy = null;
	this.nick = "anonymous" + Math.floor((Math.random()*1000)+1);
	this.channel = "public";
	this.ignoreList = new Array();
	
	this.commandList = new Array();
	addCmd = function(mic) {
		name = mic.name;
		this.commandList[name] = mic;
	};
	
	addCmd.call(this, new micSetNick());
	addCmd.call(this, new micJoinChannel());
	addCmd.call(this, new micMeAction());
	addCmd.call(this, new micPrivateMessage());
	addCmd.call(this, new micPrivateNotice());
	addCmd.call(this, new micPing());
	addCmd.call(this, new micUserIgnore());
	addCmd.call(this, new micUserUnignore());
	addCmd.call(this, new micUserWhois());
	addCmd.call(this, new micListChannels());	
	addCmd.call(this, new micHelp());
	
	// External commands
	this.extCommandList = new Array();
	
}


ComicIRC.prototype.initialize = function() {
	// Add the current channel to the list, before we properly refill later
	this.conduit.addChannelList(this.getChannelName());
	
	// Initialise the session by getting the channels
	// TODO: check that this (random) nick isn't used also
	this.transmitString(CMD_PROCESS, CMD_USER_ALL, CMD_CHANNEL_ALL, "list");
}

ComicIRC.prototype.addCommand = function(extCommandName, extCommandImpl) {
	this.extCommandList[extCommandName] = extCommandImpl;
}


ComicIRC.prototype.getNick = function() {
	return this.nick;
}

ComicIRC.prototype.getChannelName = function() {
	return this.channel;
}

ComicIRC.prototype.setChannelName = function(channel) {
	this.channel = channel;
}

ComicIRC.prototype.setOutputConduit = function(conduit) {
	this.conduit = conduit;
}

ComicIRC.prototype.setProxyConduit = function(proxy) {
	this.proxy = proxy;
}

ComicIRC.prototype.setPushConduit = function(pushProxy) {
	this.pushProxy = pushProxy;
}


ComicIRC.prototype.issueCommand = function(cmd) {
	if (cmd[0] == '/') {
		firstSpace = cmd.indexOf(' ');
		if (firstSpace == -1) {
			command = cmd.substr(1);
			argumentString = "";
		} else {
			command = cmd.substr(1, firstSpace-1);
			argumentString = cmd.substr(firstSpace+1);
		}
		
		// Check both int/ext lists
		cmd = this.commandList[command];
		if (!cmd) {
			cmd = this.extCommandList[command];
		}
		//
		if (cmd) {
			cmd.onProcess(this, argumentString);
		} else {
			this.writeString("Unknown command : "+command);
		}
		
		
	} else {
		// we write it when the msg returns
		this.transmitString(CMD_TEXT, CMD_USER_ALL, CMD_CHANNEL_CURRENT, "<" + this.nick + "> " + cmd);
	}
}

ComicIRC.prototype.writeString = function(str) {
	if (this.conduit && str && str != "") {
		this.conduit.writeOutput(str);
	}
}

ComicIRC.prototype.transmitString = function(command, userTo, channelTo, str) {
	if (channelTo == CMD_CHANNEL_CURRENT) {
		channelTo = this.getChannelName();
	}
	
	this.proxy.sendCommand([command, userTo, channelTo, this.nick, str]);
}

ComicIRC.prototype.receiveData = function(dataString) {

	var data = dataString.split(",");

	if (data[0] != "irc") {
		return false;
	}

	var command = data[1];
	var userTo = data[2];
	var channelTo = data[3];
	var userFrom = data[4];
	
	var j = "";
	var str = "";
	for(var i=5;i<data.length;++i) {
		str = str + j + data[i];
		j = ",";
	}
	
	if (command == CMD_TEXT) {
		if (this.ignoreList[userFrom] == userFrom) {
			// ignore
		} else if (channelTo == "" || channelTo == this.getChannelName()) {
			this.writeString(str);
		}
		
	} else if (command == CMD_PING) {
		if (userTo == this.nick) {
			this.transmitString(CMD_PING_RETURN, userFrom, CMD_CHANNEL_ALL, str);
		}
	} else if (command == CMD_PING_RETURN) {
		if (userTo == this.nick) {
			var ms = new Date().getTime();
			var originalMs = parseInt(str, 10);
			this.writeString("Ping returned in "+(ms - originalMs)+" ms");
		}
		
	} else if (command == CMD_NOTICE) {
		if (userTo == this.nick) {
			this.writeString(str);
		}
		
	} else if (command == CMD_PROCESS) {
		var theCommand = data[5].split(' ');
		var cmd = this.commandList[theCommand[0]];
		if (cmd && cmd.onReceive) {
			var str = cmd.onReceive(this, theCommand);
			str = theCommand[0] + " " + str;
			this.transmitString(CMD_PROCESS_RESULT, userFrom, CMD_CHANNEL_ALL, str);
		}
	} else if (command == CMD_PROCESS_RESULT) {
		if (userTo == this.nick) {
			var theCommand = data[5].split(' ');
			var cmd = this.commandList[theCommand[0]];
			if (cmd && cmd.onReceiveResult) {
				cmd.onReceiveResult(this, theCommand);
			}
		}
		
	} else if (command == CMD_ANNOUNCE_CHANNEL) {
		this.conduit.addChannelList(data[5]);
	}

	return true;
}

// Utility method
ComicIRC.prototype.extractDualArguments = function(arguments) {
	var data = arguments.split(' ');
	var j = "";
	var str = "";
	for(var i=1;i<data.length;++i) {
		str = str + j + data[i];
		j = " ";
	}
	
	var dual = new Array();
	dual[0] = data[0];
	dual[1] = str;
	
	return dual;
}


