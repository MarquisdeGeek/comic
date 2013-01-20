var g_pIRClient;

//
// All apps begin with set-up, like this
//
function initComicWrapper() {
	g_pIRClient = new ComicIRC();
	
	// The 'conduits' control all input/output/transfers between Comic clients
	// If you decide to not use pusher (for example) you will need to write a new conduit for it
	g_pIRClient.setOutputConduit(new ComicConduitHTML5Element(g_pIRClient, "irc.result", "irc.channels", "irc.entrybox", "irc.sendbutton"));
	g_pIRClient.setProxyConduit(new ComicConduitProxySGXFile(g_pIRClient, g_ProxyURL));
	g_pIRClient.setPushConduit(new ComicConduitPushPusher(g_pIRClient));
	
	// Write standard blurb to window
	g_pIRClient.writeString("This is an example of the 'Comic' IRC-like chat client");
	g_pIRClient.writeString("It is written entirely in HTML5, and uses Pusher");
	g_pIRClient.writeString("Find the code at github.com/marquisdegeek");
	g_pIRClient.writeString(" ");
	g_pIRClient.writeString("Note: any conversation here is public");
	g_pIRClient.writeString("Type '/nick name' to change your name or '/help' for help");
	g_pIRClient.writeString("Your current nick is " + g_pIRClient.getNick());
	
	// Configure your own commands like this
	g_pIRClient.addCommand("local", new ircLocalCommand());
	
	// When everything's ready, you must call this....
	g_pIRClient.initialize();
}

// If you wish to intercept the IRC commands/message then implement this
// global method. If not, commands will be issued to the client automatically.
function comicIssueCommand(cmd) {
	if (!g_bLocalOnly) {
		g_pIRClient.issueCommand(cmd);
	}
}

// If you wish to intercept the IRC commands from other users (e.g. for extra
// filtering) then do so here.
function comicProcessRemoteCommand(data) {
	result = g_pIRClient.receiveData(data);
	if (!result) {
		// The push command wasn't an IRC command anyway! Therefore, we must
		// process 'data' by our own app.
	}
}


//
// Here's an example of a custom command
//
var g_bLocalOnly = false;	// don't send commands remotely

/**
 * @constructor
 */
ircLocalCommand = function() { 
	this.name = "local"; 
}

ircLocalCommand.prototype.onProcess = function(ircClient, cmdArguments) {
	if (cmdArguments == "off") {
		g_bLocalOnly = false;
		ircClient.writeString("Commands are now sent to the server");
	} else {
		g_bLocalOnly = true;
		ircClient.writeString("All commands are copied to the local window, only");
	}
}


