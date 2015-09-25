
/**
 * @name SharedWebWorker.js.
 * @description : SCript run on background on the platform, he receive information of the event collected to and send them to samoTrace.js.
 * @author  DERBEL Fatma
 * @requires  SamoTracesCore.js
 * @param
 * @param 
 * @todo 
*/


// Shared Variable 

var TraceObj = null;
var connections = 0; // count active connections
var Model_URI;
var header;
var body;

/*=======================================================||
The onconnect is an EventHandler representing        ||
				the code                             ||
	to be called when the connect event is raised    ||
=======================================================  ||*/

onconnect=function(e){
	
/**Import samotraces-core-debug.js**/
importScripts('/samotracesjs/dist/samotraces-core-debug.js');
/** MessagePort connection is opened between the associated SharedWorker and the main thread.**/

var port = e.ports[0];
connections++;
port.postMessage ({mess:'open'+connections});

port.onmessage = function (event) {
	var DataRecu = event.data;
	var messName = DataRecu.mess;
	port.postMessage ({mess:messName});
	
		// receive TraceInformation
	if (messName==='TraceInformation') {
		var TraceName = DataRecu.Trace_Information.TraceName;
		var BaseURI  = DataRecu.Trace_Information.BaseURI;
		Model_URI = DataRecu.Trace_Information.ModelURI;
		port.postMessage({mess:"TraceName "+TraceName});
		port.postMessage({mess:"BaseURI "+BaseURI});
		port.postMessage({mess:"type  "+typeof(Samotraces)});

		/**init Trace From SamoTrace.js**/
		//TraceObj = new Samotraces.Ktbs.Trace (BaseURI+TraceName);
		TraceObj = new Samotraces.Ktbs.Trace (BaseURI+TraceName);
		port.postMessage({mess:"trc "+JSON.stringify (TraceObj)});
		
	}
		// receive Obsel To send it to ktbs
	else if (messName==='obsel') {
		port.postMessage({mess:"obs"});
		port.postMessage ({mess:DataRecu.OBSEL});
		if (TraceObj=== null) {
			// send message to the collecteur to get information about trace
			port.postMessage({mess:'GetTraceInf'});
		}
		port.postMessage({mess:"ModelURI "+Model_URI})
		TraceObj.create_obsel (DataRecu.OBSEL,Model_URI);
	} else if (messName=== 'DataPage'){
		header=DataRecu.header;
		body = DataRecu.body;
	}else if (messName=== 'GetDataPage'){
		port.postMessage({mess:body});
		port.postMessage({mess:'DataIframe',header:header,body:body});
	}


},

port.start();

}