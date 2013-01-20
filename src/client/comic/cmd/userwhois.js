
/**
 * @constructor
 */
micUserWhois = function() { this.name = "whois"; }

micUserWhois.prototype.onProcess = function(client, arguments) {
	//  /whois nickname (message) 
	/*
	    luv2quilt is bossmom@elwo-01-094.dialup.netins.net * Enjoy the Journey........ 
    luv2quilt on @#bossmom 
    luv2quilt using Seattle.WA.US.Undernet.org the time for school is during a recession. 
    luv2quilt has been idle 18secs, signed on Sun Jul 23 18:47:26 
    luv2quilt End of /WHOIS list. */
	client.writeString("This command is not currently supported.");
}

micUserWhois.prototype.onReceive = function(client, arguments) {
}

micUserWhois.prototype.help = function(client) {
	return null;
}

