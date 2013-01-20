comic
=====

An HTML5 only IRC client. (Although, TBH, it does need a few lines of server 
code to echo the messages between machines.)

Before using, you might create an account on Pusher (pusher.com) and get your
app ID, and associated data. Then:

1. Upload the server/sendevent.php file to your server, and fill in 
   your Pusher credentials.
   
2. Rename 'settings-template.js' to 'settings.js' and fill in your 
   Pusher details, and server location. The g_ProxyURL should be in the form:

   var g_ProxyURL = "http://[domain]/[path]/sendevent.php?cmd=";

3. Run it!

Note: If you plan on hosting the client code on a different machine to the 
server code (e.g. if you are developing on localhost, but want live data)
then add:

  header('Access-Control-Allow-Origin: [domain name here]')

to the php code.


Note: The SGX bootstrap is used under license of, er, myself!
