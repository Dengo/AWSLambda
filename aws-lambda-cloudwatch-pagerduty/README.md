# Lambda-CloudWatch-PagerDuty
Amazon Lambda to receive alerts from CloudWatch and send it to PagerDuty Generic API.

PagerDuty already has integration with AWS CloudWatch, please refer to this guide for more information:
https://www.pagerduty.com/docs/guides/aws-cloudwatch-integration-guide/

But if you want to customize the notification message you receive from PageDuty you need to do manual integration using Lambda function.

## Getting Started
The Events API can be used with any "Generic API" integration in PagerDuty. If you don't already have a service with a "Generic API" integration, you should create one by following the steps in "Creating a Generic API Integration" guide: https://support.pagerduty.com/hc/en-us/articles/202830340-Creating-a-Generic-API-Integration

Once the integration has been created, make a note of its "Integration Key". You'll use this value, which is unique to the integration, as the service_key that's submitted to the Events API.
In `handler.js`, you will find `service_key`, which is the auth key for you PagerDuty service.
Set the correct values in this.

## Event Types

| event type | description |
|:-----------|:------------|
| Trigger | Your monitoring tools should send PagerDuty a trigger event to report a new or ongoing problem. When PagerDuty receives a trigger event, it will either open a new incident, or add a new trigger log entry to an existing incident, depending on the provided incident_key. |
| Resolve | Resolve events cause the referenced incident to enter the resolved state. Once an incident is resolved, it won't generate any additional notifications. New trigger events with the same incident_key as a resolved incident won't re-open the incident. Instead, a new incident will be created. Your monitoring tools should send PagerDuty a resolve event when the problem that caused the initial trigger event has been fixed. |
| Acknowledge | Acknowledge events cause the referenced incident to enter the acknowledged state. While an incident is acknowledged, it won't generate any additional notifications, even if it receives new trigger events. Your monitoring tools should send PagerDuty an acknowledge event when they know someone is presently working on the problem. |

for more information please refer to this link: https://developer.pagerduty.com/documentation/integration/events

### Amazon CloudWatch configuration
Set whatever CloudWatch you want in your CloudWatch settings.
Be sure to remember the SNS topic you send the alarms to.

### Amazon Lambda configuration
1. In the Lambda console panel, create a new Lambda function. Set the name to be whatever you want it to be.
2. For the code of the Lambda function, copy and paste the `handler.js` file.
3. After you have created the function, select *add event sources* for the Lambda function.
4. In the event sources, select *SNS* and select the topic for which you've created on CloudWatch.

That is all. You should be receiving CloudWatch alerts on your PagerDuty.

## Testing, Debugging
When you want to debug/test your Lambda function, try using `sns_sample_events.js`.

## License
This library is released under the MIT license.