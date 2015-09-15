
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
	var id = ($(element.parentNode)
	.children(element.tagName)
	.index(element) + 1);
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
var id = ($(element.parentNode)
.children(element.tagName)
.index(element) + 1);
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
  obsel.hasType = e.type ;
  obsel.hasSubject = e.type;
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
  	obsel.hasType = e.type ;
    obsel.hasSubject = e.type;
  	obsel.attributes = attribute ;
  sharedWorker.port.postMessage({mess: "obsel", OBSEL: obsel});
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
          $(document).on(event[i].type, sendObsel);
        }        else {
          $(document).on(event[i].type, {typeO: event[i].typeObsel}, sendObselWithType);
        }
      }      else {
        if ((event[i].typeObsel === undefined) || (event[i].typeObsel === "")) {
          $(event[i].selectors[j].Selector).on (event[i].type, sendObsel);
        }        else {
          $(event[i].selectors[j].Selector).on (event[i].type, {typeO: event[i].typeObsel}, sendObselWithType);
        }
      } 
    }
  }
  }

  
	/*================Collectur ===========*/
	
	$(document).ready(function() {
    "use strict";
    console.log ("the tracing is started");
    /******** get information about trace  from server ****************/
    listenServer(); 
      
    /***** Load webworker ******/
    /***** solution with Shared web Worker ************/
    if (window.SharedWorker) {
      
      sharedWorker = new SharedWorker (Path_SharedWebWorker);
      sharedWorker.port.start();
      /**Listener when receive message from webworker**/
      sharedWorker.port.onerror = function(e) {
        consloe.log('ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message);
    }
      sharedWorker.port.onmessage = function(e) {
        console.log (e.data.mess);
				var messName = e.data.mess;
        //var messName = messageRecu.mess;
        if (messName === "GetTraceInf") {
          //listenServer();
          var TraceName = "t1/";
          var BAseURI = "http://localhost:8001/base1/";
          var Model_URI = "http://localhost:8001/m1/";
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
      
    $.ajax({
      type: "GET",
      url: Path_Config_File,
      dataType: "json",
      success: function(donnees) {
        if (donnees === null) {return false ; }
        for (var host = 0;host < donnees.Page.length;host++) {
          if ((document.URL === donnees.Page[host].URL) || (document.location.host === donnees.Page[host].HostName)) { 
            collectData(donnees.Page[host]);
          }
        }
          
      },
      error: function OnGetAllMembersError(request, status, error) {console.log(status + "" + error);}  

    });

  });
  