
/**
 * @constructor
 */
 CSGXFile = function(url) {
 
	if (url.indexOf("http")==-1) {	// relative files
		if (url.indexOf("/") != 0) {
			url = CSGXFileSystem.get().tempRootLocation + "/" + url;
		} 
	}
	
	this.url = url;
	this.onFileOpen = function(){}
	this.onFileOpenFailed = function(){}
	this.onFileClose = function(){}
}

/**
 * @constructor
 */
createXMLHttpRequest = function() {
   try { return new XMLHttpRequest(); } catch(e) {}
   try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
   sgxError("XMLHttpRequest not supported - you can not retrieve external data files");
   return null;
}
 
CSGXFile.prototype.open = function() {
	this.getrequest=new createXMLHttpRequest();
	
	if (!this.getrequest) {
		sgxTrace("File '"+this.url+"' failed to load because the browser doesn't support XMLHttpRequest");
		this.onFileOpenFailed();
		return false;
	}

	this.onFileOpen(this);
	return true;
}
 
CSGXFile.prototype.close = function() {
	this.onFileClose(this);
	return true;
}
 
CSGXFile.prototype.slerp = function(cbfn) {
	if (!this.open()) {
		return false;
	}
	if (window.location.href.indexOf("http")==-1) {
		sgxTrace("File '"+this.url+"' failed to load because you can't load local files. The URL must begin 'http'");
		this.onFileOpenFailed(this);
		return false;
	}
	//
	var thisGetRequest = this.getrequest;
	var thisFile = this;
	this.getrequest.onreadystatechange=function(){
		if (thisGetRequest['readyState']==4){
			if (thisGetRequest['status']==200){
				if (cbfn) {
					cbfn(thisGetRequest['responseText']);
				}
				thisFile.close();
			} else {	// even from  local, i.e. window.location.href.indexOf("http")==-1
				sgxTrace("File '"+thisFile.url+"' failed to load because the GET request broke, probably missing.");
				thisFile.onFileOpenFailed(thisFile);
			}
		}
	};
	
	try { 	
		this.getrequest.open("GET", thisFile.url, true)
		this.getrequest.send(null);
	} catch(e) {
		sgxTrace("File '"+thisFile.url+"' failed to load because of the exception "+e.toString());
		thisFile.onFileOpenFailed(thisFile);
	}
}
 