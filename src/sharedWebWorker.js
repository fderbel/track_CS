
	/**
	 * @name SharedWebWorker.js.
	 * @description
	 * SCript run on background on the platform, he receive information to collect and send them to samoTrace.js.
	 *
	 * @author  DERBEL Fatma
	 * @requires 
	 * @param
	 * @param 
	 * @todo 
	*/
	
	importScripts("jquerySansDom.js","SharedWebWorker");
	// Shared Variable 
	
	var TraceObj = null;
	/*=======================================================||
		The onconnect is an EventHandler representing    ||
					the code                 ||
		to be called when the connect event is raised    ||
	=======================================================  ||*/
	
	onconnect=function(e){
		"use strict";
	/** MessagePort connection is opened between the associated SharedWorker and the main thread.**/
		var port = e.ports[0];
	/**  an onmessage  allow to handle messages coming in through the port**/
		port.onmessage = function(event){
			var DataRecu = event.data;
			var messName = messageRecu.mess;
			// receive TraceInformation
			if (messName==='TraceInformation') {
			var TraceName = TraceInformation.TraceName;
			var BaseURI  = TraceInformation.BaseURI;
			/**init Trace From SamoTrace.js**/
			var TraceObj = Samotraces.KTBS.Trace (BaseURI.TraceName);
			}
			// receive Obsel To send it to ktbs
			else if (messName==='obsel') {
			if (TraceObj=== null) {
				// send message to the collecteur to get information about trace
			port.postMessage({mess:'GetTraceInf'});
			}
			TraceObj.create_obsel (DataRecu.OBSEL);
			}
		}
	}
