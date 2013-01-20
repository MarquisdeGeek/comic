
/**
 * @constructor
 */
ComicConduitPushPusher = function(client) {
	SGXSystem.include([  "http://js.pusher.com/1.12/pusher.min.js"], function() {

		// Enable pusher logging - don't include this in production
		Pusher.log = function(message) {
			//if (window.console && window.console.log) window.console.log(message);
		};

		// Flash fallback logging - don't include this in production
		WEB_SOCKET_DEBUG = true;

		var pusher = new Pusher(g_PusherID);
		var channel = pusher.subscribe('comic-channel');
		
		channel.bind('my_event', function(data) {
			if (typeof comicProcessRemoteCommand == 'function') {	// user over-ride
				comicProcessRemoteCommand(data['message']);
			} else {
				client.receiveData(data['message']);
			}
		});

	});
}
