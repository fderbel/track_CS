
/**
 * @name SharedWebWorker.js.
 * @description : SCript run on background on the platform, he receive information of the event collected to and send them to samoTrace.js.
 * @author  DERBEL Fatma
 * @requires JqueryWithoutDom.js and the bib SamoTraces.js
 * @param
 * @param 
 * @todo 
*/


// Shared Variable 

var TraceObj = null;
var connections = 0; // count active connections

/*=======================================================||
The onconnect is an EventHandler representing        ||
				the code                             ||
	to be called when the connect event is raised    ||
=======================================================  ||*/

onconnect=function(e){
	
/**Import samotraces-core-debug.js**/

importScripts("http://localhost:8080/bower_components/samotracesjs/dist/vendorsCore.js","http://localhost:8080/bower_components/samotracesjs/dist/samotraces-core-debug.js");

/** MessagePort connection is opened between the associated SharedWorker and the main thread.**/

var port = e.ports[0];
connections++;
port.postMessage ({mess:'open'+connections});

port.onmessage = function (event) {
	var DataRecu = event.data;
	var messName = DataRecu.mess;
	port.postMessage ({mess:messName});
	
		// receive TraceInformation
	if (messName=='TraceInformation') {
		TraceName = DataRecu.Trace_Information.TraceName;
		BaseURI  = DataRecu.Trace_Information.BaseURI;
		port.postMessage({mess:"TraceName "+TraceName});
		port.postMessage({mess:"BaseURI "+BaseURI});
		port.postMessage({mess:"trc "+JSON.stringify(Samotraces)});

		/**init Trace From SamoTrace.js**/
		TraceObj = new Samotraces.Ktbs.Trace (BaseURI+TraceName);
		port.postMessage({mess:"trc "+JSON.stringify (TraceObj)});
		
	}
		// receive Obsel To send it to ktbs
	else if (messName=='obsel') {
		port.postMessage({mess:"obs"});
		port.postMessage ({mess:DataRecu.OBSEL});
		if (TraceObj=== null) {
			// send message to the collecteur to get information about trace
			port.postMessage({mess:'GetTraceInf'});
		}
		TraceObj.create_obsel (DataRecu.OBSEL);
	}


},
port.onerror = function (e) {
  port.postMessage(e);
}

port.start();

}