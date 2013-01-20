
SGXSystem.include([  "comic/conduits/sgxfile.js"], function() {
	// Done
});

/**
 * @constructor
 */
ComicConduitProxySGXFile = function(client, url) {
	this.url = url;
}

ComicConduitProxySGXFile.prototype.sendCommand = function(arguments) {
	cmd = "irc";
	
	for(var i in arguments) {
		cmd += "," + arguments[i];
	}
	
	f = new CSGXFile(this.url + cmd);
	f.open();
	f.slerp(function(result) {
		if (result != "") {
			this.writeString(result);
		}
	});
	
}

