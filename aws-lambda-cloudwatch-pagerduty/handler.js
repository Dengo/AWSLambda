// This Lambda function integrate with PagerDuty Service using PagerDuty Events API
// https://developer.pagerduty.com/documentation/integration/events
console.log('[Amazon CloudWatch to PagerDuty Notification]');
//Follow this guide to create a service on PagerDuty and generate the service_key
// https://support.pagerduty.com/hc/en-us/articles/202830340-Creating-a-Generic-API-Integration
var service_key = "88888888888888888888888888888888";
var pg_path =  "/generic/2010-04-15/create_event.json";

var http = require ('https');
var querystring = require ('querystring');

exports.handler = function(event, context) {
	console.log(event.Records[0]);
    var incident_key = context.awsRequestId;
	// parse information
	var subject = event.Records[0].Sns.Subject;
	//var timestamp = event.Records[0].Sns.Timestamp;
	//var message = event.Records[0].Sns.Message;
    var event_type = "trigger";

	var s1 = subject.split(' ');
	var s2 = s1[1].split('awsroute53');
	var description = s2[0];
	
	if (subject.match('ALARM'))
	    description +=" is not responding";
	else if (subject.match('OK'))
	    description +=" is up now";

	var payloadStr = JSON.stringify({
			"service_key": service_key,
			"incident_key": incident_key,
			"event_type": event_type,
			"description": description
	});
	console.log(payloadStr);
	
	var options = {
		hostname: "events.pagerduty.com",
		port: 443,
		path: pg_path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': payloadStr.length
		}
	};
    //Trigger
	//////////////////////////////    
	var req = http.request(options, function(res) {
		console.log("Got response: " + res.statusCode);
		res.on("data", function(chunk) {
			console.log('BODY: '+chunk);
			//context.done(null, 'done!');
		});
	}).on('error', function(e) {
		context.done('error', e);
	});
	req.write(payloadStr);
	req.end();
	//Resolve
	//////////////////////////////
	event_type = "resolve";
	payloadStr = JSON.stringify({
			"service_key": service_key,
			"incident_key": incident_key,
			"event_type": event_type,
			"description": description
	});
	setTimeout(function() {
        var req2 = http.request(options, function(res) {
    		console.log("Got response: " + res.statusCode);
    		res.on("data", function(chunk) {
    			console.log('BODY: '+chunk);
    			context.done(null, 'done!');
    		});
    	}).on('error', function(e) {
    		context.done('error', e);
    	});
    	console.log(payloadStr);
    	req2.write(payloadStr);
    	req2.end();
    }, 2000);
};
