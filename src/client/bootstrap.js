/**
 * @preserve Copyright 1995-2013. Steven Goodwin. All Rights Reserved.

The   sss    gggg x   x
     s      g      x x    
      sss   g  gg   x
         s  g   g  x x        
     ssss    gggg x   x     Engine

This file is copyright and may only be distributed under license.

Please see the licensing conditions for details.

http://www.sgxengine.com

*/

/**
 * @constructor
 */
SGXSystem = function() {}

SGXSystem.ready = false;
SGXSystem.includeLoadQueue = new Array();
SGXSystem.includeLoadQueueRunning = false;
SGXSystem.includeLoadQueueCallback = new Array();


SGXSystem.getElement = function(id) {
	return document.getElementById(id);
}

SGXSystem.showElement = function(id, visible)
{
	if (visible == undefined) {
		visible = true;
	}
	//
	var styleRef = NULL;
    if (document.getElementById) {
          // this is the way the standards work
		  var element = document.getElementById(id);
		  if (element) {
			styleRef = element.style;
		  }
     } else if (document.all) {
          // this is the way old msie versions work
          styleRef = document.all[id].style;
     } else if (document.layers) {
          // this is the way nn4 works
          styleRef = document.layers[id].style;
     }
	 //
	 if (styleRef) {
		styleRef.display = visible ? "block":"";
	 }
}

SGXSystem.hideElement = function(id, visible)
{
	showElement(id, false);
}

// Usage: Inheritance_Manager.extend(newClass, parentClass);
// To be placed after both ctor
// Also, to call the parent ctor:
//   newClass.baseConstructor.call(this, params);
/**
 * @constructor
 */
Inheritance_Manager = {};
Inheritance_Manager.extend = function(subClass, baseClass) {
    function inheritance() { }
    inheritance.prototype = baseClass.prototype;
    subClass.prototype = new inheritance();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
}


function sgxOutputTraceMessage(str) {
	if (window['loadFirebugConsole']) {
		window.loadFirebugConsole();
	} 
	//
	if (window.console) {
		window.console.log(str);
	}
}

function sysTrace(str) {
	if (typeof sysTraceEnabled != 'undefined' && sysTraceEnabled) {
		sgxOutputTraceMessage(str);
	}
}

// Start trace module - this embedded directly here so it's available from start

/**
 * @constructor
 * @param {number=} iDefaultLevel
 */
CTraceModule = function(iDefaultLevel) {
	if (iDefaultLevel == undefined) {
		iDefaultLevel = CTraceModule.SGX_ERR_REPORT_ALL;
	}
	this.m_iTraceLevel = iDefaultLevel;
}

CTraceModule.SGX_ERR_REPORT_NONE = 6;
CTraceModule.SGX_ERR_REPORT_ALL = 0;

CTraceModule.SGX_ERR_FATAL = 5;
CTraceModule.SGX_ERR_ERROR = 4;
CTraceModule.SGX_ERR_WARNING = 3;
CTraceModule.SGX_ERR_MESSAGE = 2;
CTraceModule.SGX_ERR_INFO = 1;


CTraceModule.prototype.setTraceLevel = function(iLevel) {
	this.m_iTraceLevel = iLevel;
}

CTraceModule.prototype.getTraceLevel = function() {
	return this.m_iTraceLevel;
}

CTraceModule.prototype.outputTrace = function(idx, pMessage) {
	if (pMessage == undefined) {
		pMessage = idx;
		idx = SGX_ERR_MESSAGE;
	}
	//
    if (idx < this.m_iTraceLevel || pMessage == null) {
        return false;
    }
    sgxOutputTraceMessage(pMessage);
    
	return true;
}

CTraceModule.prototype.outputError = function(idx, pMessage) {
	if (pMessage == undefined) {
		pMessage = idx;
	}
	
	this.outputTrace(SGX_ERR_ERROR, pMessage);
}

var GlobalTraceInstance;
function sgxTrace(msg) {
	if (GlobalTraceInstance == null) {
		GlobalTraceInstance = new CTraceModule();
	}
	GlobalTraceInstance.outputTrace(CTraceModule.SGX_ERR_MESSAGE, msg);
}

function sgxError(msg) {
	if (GlobalTraceInstance == null) {
		GlobalTraceInstance = new CTraceModule();
	}
	GlobalTraceInstance.outputTrace(CTraceModule.SGX_ERR_ERROR, msg);
}

function sgxHalt() {
	alert("Fatal error - Request to halt the processor.");
}
// End trace module
  
//   

Function.prototype.defaults = function()
{
  var _f = this;
  var _a = Array(_f.length-arguments.length).concat(
    Array.prototype.slice.apply(arguments));
  return function()
  {
    return _f.apply(_f, Array.prototype.slice.apply(arguments).concat(
      _a.slice(arguments.length, _a.length)));
  }
}

SGXSystem.pumpIncludeLoad = function() {

	if (!SGXSystem.includeLoadQueueRunning && SGXSystem.includeLoadQueue.length) {
		SGXSystem.includeLoadQueueRunning = true;
		sysTrace("Loading:" + SGXSystem.includeLoadQueue[0]);
		SGXSystem.includeFile(SGXSystem.includeLoadQueue[0], function() {
			sysTrace("Complete:" + SGXSystem.includeLoadQueue[0]);
			SGXSystem.includeLoadQueueRunning = false;
			SGXSystem.includeLoadQueue.shift();
			
			if (SGXSystem.includeLoadQueue.length == 0) {
				
				// We invoke all of the callbacks thus set-up. And clear only these. We
				// need to make explicit count of them, because otherwise any new include's added
				// in the callback will get lost.
				var count = SGXSystem.includeLoadQueueCallback.length;
				for(var i=0;i<count;++i) {
					//sysTrace("Include load queue callback:"+SGXSystem.includeLoadQueueCallback[i]);
					SGXSystem.includeLoadQueueCallback[i]();
				}
				// Now clear only the first 'count'
				for(var i=0;i<count;++i) {
					SGXSystem.includeLoadQueueCallback.shift();
				}
			}
			
			// Continue loading?
			SGXSystem.pumpIncludeLoad();
		});
	}
}

SGXSystem.include = function(url, callback)
{
	if (url) {
		sysTrace("Adding include:"+url);
		SGXSystem.includeLoadQueue = [].concat(SGXSystem.includeLoadQueue, url);
	}
	if (callback) {
		sysTrace("Adding callback:"+callback);
		SGXSystem.includeLoadQueueCallback = [].concat(SGXSystem.includeLoadQueueCallback, callback);
	}
	
	SGXSystem.pumpIncludeLoad();
}

SGXSystem.includeFile = function(url, callback)
{

    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}
