
/**
 * @name Collector.js.
 * @description
 * SCript run on any page html to collect event 
 *
 * @author  DERBEL Fatma
 * @requires File webworker 
 * @param {String}  URI of path config file
 * @param {String}  
 * @todo 
*/

  /*Trace Information */
  var TraceName = "t1/";
  var BAseURI = "http://localhost:8001/base1/";
  var Model_URI = "http://localhost:8001/base1/m1#" ;
  
  var scripts = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length-1];
  var path = thisScript.src.replace(/\/script\.js$/, '/'); 
  var Path_SharedWebWorker = path.replace("collecteurTrack.js","sharedWebWorker.js");
  var Path_Config_File = path.replace("collecteurTrack.js","configTrack.json");
	var sharedWorker;
	
  

  
	/*=======================================================||
		COMMUNICATE WITH THE SERVER COLLECTOR                ||
	=======================================================  ||*/
	function listenServer() {
		"use strict";
	console.log ("Listen");
	var allcookie = document.cookie.split(";");
	console.log ("Lenght", allcookie.length - 1);
	for (var i = 0;i < allcookie.length - 1;i++) { 
		if (allcookie[i].split("=")[0] === " BAseURI") {
			var BAseURI = decodeURIComponent(allcookie[i].split("=")[1]);
		}
		if (allcookie[i].split("=")[0] === "TraceName") {
			var TraceName = allcookie[i].split("=")[1];
		}
		if (allcookie[i].split("=")[0] === " Model_URI") {
			var Model_URI = decodeURIComponent(allcookie[i].split("=")[1]);
		}
	}  
	if ((BAseURI) && (TraceName) && (Model_URI)) {
		var Trace_Information = {TraceName: TraceName, BaseURI: BAseURI, ModelURI: Model_URI};
		/**** Send to the webworker traceInformation *****/
		sharedWorker.port.postMessage({mess: "TraceInformation", Trace_Information: Trace_Information});
	}
}

/*=======================================================||
  Send Data f page to configuration                      ||
=======================================================  ||*/

function sendDataOfPage() {
  "use strict";
  if (document.getElementsByTagName("base").length !== 0){
      var head = document.head.innerHTML;
    }else {
      var Base = "<base href = \""+document.location.href+"\" target=\"_blank\">" ;
      var head = Base + document.head.innerHTML;
      sharedWorker.port.postMessage({mess:"DataPage", body:document.body.innerHTML,header:head}); 
    }
}
  
  /*=======================================================||
      COLLECT THE INFORMATION OF THE VISITED PAGE          ||
      COLLECT THE INFORMATION OF THE VISITED PAGE          ||
       AND SEND THEM TO THE WEBWORKER TO CREATE AN OBSEL    ||
  =======================================================  ||*/
  function send_URL(URL) {
		"use strict";
	  var attribute = {};
    attribute.hasType="Open_Page";
    attribute.hasSubject="obsel of action open page ";
    attribute.attributes={};
    attribute.attributes.hasDate =new Date().format("yyyy-MM-dd h:mm:ss");
    attribute.attributes.hasDocument_URL = URL;
	  attribute.attributes.hasDocument_Title = document.title;
	  /**** Send to webworker *****/
	    sharedWorker.port.postMessage({mess: "obsel", OBSEL: attribute});
	}
  
  /*=======================================================||
    COLLECT THE ATTRIBUTES OF THE EVENT AND              ||
    SEND THEM TO WebWorker TO CREATE AN OBSEL            ||
  =======================================================  ||*/
 
  
var  getXPath = function (element) {
	 "use strict";
// derived from http://stackoverflow.com/a/3454579/1235487
while (element && element.nodeType !== 1) {
	element = element.parentNode;
}
if (typeof (element) === "undefined") { return "(undefined)"; }
if (element === null) { return "(null)"; }

var xpath = "";
for (true; element && element.nodeType === 1; element = element.parentNode) {
	//if (typeof(element.id) !== "undefined") return "#" + element.id;
	// var id = ($(element.parentNode)
	// .children(element.tagName)
	// .index(element) + 1);
  var id = Array.prototype.indexOf.call(element.parentNode.childNodes, element);
	id = (id > 1  ?  "[" + id + "]"  :  "");
	xpath = "/" + element.tagName.toLowerCase() + id + xpath;
}
		
return xpath;
};
 var getElementName = function (element) {
	 "use strict";
while (element && element.nodeType !== 1) {
	element = element.parentNode;
}
if (typeof (element) === "undefined") { return "(undefined)"; }
if (element === null) { return "(null)"; }

//if (typeof(element.id) !== "undefined") return "#" + element.id;
// var id = ($(element.parentNode)
// .children(element.tagName)
// .index(element) + 1);
  var id = Array.prototype.indexOf.call(element.parentNode.childNodes, element);
id = (id > 1  ?  "[" + id + "]"  :  "");
var nameE = element.tagName.toLowerCase() + id;

return nameE;
};

 var getElementId = function (element) {
	 "use strict";
while (element && element.nodeType !== 1)  {
	element = element.parentNode;
}
if (typeof (element) === "undefined") { return "(undefined)"; }
if (element === null) { return "(null)"; }

if (typeof (element.id) !== "undefined") { return element.id; }

return "#";
};
Date.prototype.format = function(format) { // jshint ignore:line
	"use strict";
	var o = {
	"M+": this.getMonth() + 1, //month
	"d+": this.getDate(),    //day
	"h+": this.getHours(),   //hour
	"m+": this.getMinutes(), //minute
	"s+": this.getSeconds(), //second
	"q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
	"S": this.getMilliseconds() //millisecond
};

if (/(y+)/.test(format)) {
	format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
}

for (var k in o) {
	if (new RegExp("(" + k + ")").test(format)) {  
		format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	}
}
return format;
};
   
  function fillCommonAttributes (e, attributes) {
		"use strict";
  attributes.hasDate = new Date().format("yyyy-MM-dd h:mm:ss");
  attributes.hasType = e.type;
  attributes.hasDocument_URL = document.URL;
  attributes.hasDocument_Title = document.title;
  attributes.ctrlKey = e.ctrlKey;
  attributes.shiftKey = e.shiftKey;
  attributes.hasTarget = getXPath(e.target);
  attributes.hasTarget_targetName = getElementName(e.target);
  if (e.target.id) { attributes.hasTarget_targetId = e.target.id; }
  if (e.target.alt) { attributes.hasTarget_ALT = e.target.alt; }
  if (e.target.value) {attributes.hasTarget_Value = e.target.value;}
  if (e.target.firstChild) {if ((e.target.firstChild.nodeValue) && (e.target.firstChild.nodeValue !== "")) {attributes.hasTarget_TextNode = e.target.firstChild.nodeValue.replace(/[\n]/gi, "");}}
  if (e.keyCode) {attributes.keyCode = e.keyCode;}
  if (e.target.className) {attributes.hasTarget_ClassName = e.target.className.toString();}
  if (e.target.text) { 
    var text = e.target.text.replace(/[\n]/gi, "");
  attributes.hasTarget_targetText = text; }
  if (e.target.title) {attributes.hasTarget_Title = e.target.title;}
  if (e.currentTarget) {
    attributes.currentTarget = getXPath(e.currentTarget);
    attributes.hascurrentTarget_currentTargetName = getElementName(e.currentTarget);
    if (e.currentTarget.id) {
      attributes.hasCurrentTarget_currentTargetId = getElementId(e.currentTarget);
    }
    if (e.currentTarget.text) {
      var texte = e.currentTarget.text.replace(/[\n]/gi, "");
      attributes.hasCurrentTarget_currentTargetText = texte;
    }
  }
  if (e.explicitOriginalTarget) {
    attributes.hasOriginalTarget = getXPath(e.explicitOriginalTarget);
    attributes.hasOriginalTarget_originalTargetName = getElementName(e.explicitOriginalTarget);
    if (e.explicitOriginalTarget.id) {
      attributes.hasOriginalTarget_originalTargetId = getElementId(e.explicitOriginalTarget);
    }
    if (e.explicitOriginalTarget.text) {
      attributes.hasOriginalTarget_originalTargetText = e.explicitOriginalTarget.text;
    }
  }
  if (e.target.tagName === "IMG") {
    attributes.hasImgSrc = e.target.src;
  }
  }
	
	var sendObsel =  function(e) {
		 "use strict";
     var obsel = {};
 	var attribute = {
 		'x': e.clientX,
 		'y': e.clientY,
 	};
 	fillCommonAttributes(e, attribute);
  
  obsel.type  = e.type ;
  obsel.subject = e.type;
 	obsel.attributes = attribute;
  sharedWorker.port.postMessage({mess: "obsel", OBSEL: obsel});
};
  var sendObselWithType =  function(e) {
		  "use strict";
      var obsel = {};
      var attribute = {
  		'x': e.clientX,
  		'y': e.clientY,
  	};
  	fillCommonAttributes(e, attribute);
  
    console.log(e.target.typeO);
  	obsel.type = e.target.typeO ;
    obsel.subject = e.type;
  	obsel.attributes = attribute ;
  sharedWorker.port.postMessage({mess: "obsel", OBSEL: obsel});
};
var addEvent = function (el, eventType, handler) {
  "use strict";
  if (el.addEventListener) { // DOM Level 2 browsers
    el.addEventListener(eventType, handler, false);
  } else if (el.attachEvent) { // IE <= 8
    el.attachEvent('on' + eventType, handler);
  } else { // ancient browsers
    el['on' + eventType] = handler;
  }
};

	/*=======================================================||
      BROWSE THE CONFIGURATION FILE                    ||
  =======================================================  ||*/
  
  function collectData(Data) {  
		"use strict";  
  console.log ("page collected");
  var event = Data.event;
  for (var i = 0; i < event.length; i++) {  
    // browse selector of each event
    for (var j = 0; j < event[i].selectors.length; j++) { 
      if ((event[i].selectors[j].Selector === undefined) || (event[i].selectors[j].Selector === "")) {
        if ((event[i].typeObsel === undefined) || (event[i].typeObsel === "")) {
          //$(document).on(event[i].type, sendObsel); //TODO
            addEvent (document,event[i].type, sendObsel);
        }        else {
        //  $(document).on(event[i].type, {typeO: event[i].typeObsel}, sendObselWithType);//TODO
          addEvent (document,event[i].type, sendObselWithType);
        }
      }      else {
        if ((event[i].typeObsel === undefined) || (event[i].typeObsel === "")) {
          //$(event[i].selectors[j].Selector).on (event[i].type, sendObsel);
          console.log (addEvent (document.querySelector(event[i].selectors[j].Selector),event[i].type, sendObsel));
          addEvent (document.querySelector(event[i].selectors[j].Selector),event[i].type, sendObsel);

        }        else {
          //$(event[i].selectors[j].Selector).on (event[i].type, {typeO: event[i].typeObsel}, sendObselWithType);
          document.querySelector(event[i].selectors[j].Selector).typeO = event[i].typeObsel ;
          addEvent (document.querySelector(event[i].selectors[j].Selector),event[i].type, sendObselWithType);
        }
      } 
    }
  }
  }

  
	/*================Collectur ===========*/
	document.addEventListener("DOMContentLoaded", function() {
    "use strict";
    console.log ("the tracing is started");
    /******** get information about trace  from server ****************/
    listenServer();     
        /***** Load webworker ******/
    /***** solution with Shared web Worker ************/
    if (window.SharedWorker) {
      
      sharedWorker = new SharedWorker (Path_SharedWebWorker);
      sharedWorker.port.start();
      sendDataOfPage();
      /**Listener when receive message from webworker**/
      sharedWorker.port.onmessage = function(e) {
        console.log (e.data.mess);
				var messName = e.data.mess;
        //var messName = messageRecu.mess;
        if (messName === "GetTraceInf") {
          //listenServer();
          
          var Trace_Information = {TraceName: TraceName, BaseURI: BAseURI, ModelURI: Model_URI};
      		/**** Send to the webworker traceInformation *****/
      		sharedWorker.port.postMessage({mess: "TraceInformation", Trace_Information: Trace_Information}); 
        }
      };
      
    }  
		else /***** solution without Shared web Worker ************/
      {
      
      }
      
      
    /****** Collect information about document  **********/
    send_URL(document.URL) ;
      
    /******** get configuration  information  ************/
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data === null) {return false ; }
                    for (var host = 0;host < data.Page.length;host++) {
                      if ((document.URL === data.Page[host].URL) || (document.location.host === data.Page[host].HostName)) { 
                        collectData(data.Page[host]);
                      }
                    }
            } else {
                console.log ("erreur get config file ",xhr);
            }
        }
    };
    xhr.open("GET", Path_Config_File, true);
    xhr.send();
  });
  