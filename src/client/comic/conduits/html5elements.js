
/**
 * @constructor
 */
ComicConduitHTML5Element = function(client, htmlEntityOutputList, htmlEntityChannelList, htmlEntityInputBox, htmlEntitySendButton) {
	this.outputList = document.getElementById(htmlEntityOutputList);
	this.channelList = document.getElementById(htmlEntityChannelList);
	this.inputBox = document.getElementById(htmlEntityInputBox);
	this.sendButton = document.getElementById(htmlEntitySendButton);
	
	//
	if (this.sendButton) {
		this.sendButton.onclick = this.submitIRCText;
		this.sendButton["irc.client"] = client;
		
	}
	if (this.inputBox) {
		this.inputBox.onkeypress = this.onKeyPress;
		this.inputBox["irc.client"] = client;
	}
	//
	this.channelListData = [];
	this.client = client;
}

//
// Required methods by the conduit
//
ComicConduitHTML5Element.prototype.writeOutput = function(str) {
	if (this.outputList) {
		this.outputList.value = this.outputList.value + "\n" + str;
		this.outputList.scrollTop = this.outputList.scrollHeight;
	}
}

ComicConduitHTML5Element.prototype.clearChannelList = function() {
	this.channelListData = [];
	//
	if (this.channelList) {
		this.channelList.value = "";
	}
}

ComicConduitHTML5Element.prototype.addChannelList = function(str) {
	if (this.channelListData[str]) {
		return;	// already exists
	}
	//
	this.channelListData[str] = str;
	//
	this.appendChannelToInterface(str);
}

ComicConduitHTML5Element.prototype.appendChannelToInterface = function(displayName) {

	if (this.client.getChannelName() == displayName) {
		displayName += " *";
	}
	//
	if (this.channelList) {
		this.channelList.value += displayName + "\n";
		this.channelList.scrollTop = this.channelList.scrollHeight;
	}
}

ComicConduitHTML5Element.prototype.refillChannelList = function() {
	if (this.channelList) {
		this.channelList.value = "";
		for(var i in this.channelListData) {
			this.appendChannelToInterface(this.channelListData[i]);
		}
	}
}

//
// Internal
//
ComicConduitHTML5Element.prototype.submitIRCText = function(args)
{
	var oText = document.getElementById("irc.entrybox");
	var cmd = oText.value;
	
	if (typeof comicIssueCommand == 'function') {	// user over-ride?
		comicIssueCommand(cmd);
	} else {	
		this["irc.client"].issueCommand(cmd);
	}
	
	oText.value = "";
}

ComicConduitHTML5Element.prototype.onKeyPress = function(args)
{
	if(args.keyCode === 13) {
		var thisConduit = this["irc.client"].conduit;
		thisConduit.submitIRCText.call(thisConduit.sendButton);
		return false;
	} else if (args.keyCode === 38) {	// up
		// TODO: history on up/down keys
	} else if (args.keyCode === 40) {	// down
		// TODO: history on up/down keys
	}
}
    