<p align="center">
  <img src="https://raw.githubusercontent.com/QwerMike/snippet-sharing/master/docs/logo.png" width="100">
  <h1 align="center">Snippet Sharing</h1>
</p>

*Snippet Sharing is a service for sharing code/text snippets. It allows you to paste a text snippet, and then you can share the link to it with somebody.*


|     Firebase functions    |           Client          |          Automated Tests        |
|:-------------------------:|:-------------------------:|:-------------------------------:|
| [![Build Status][fb]][fp] | [![Build Status][cb]][cp] | [![Build Status][autob]][autop] |
| [![Deployment][fdb]][fdp] | [![Deployment][cdb]][cdp] |                                 |

[fb]: https://dev.azure.com/tmikent/snippet-sharing/_apis/build/status/snippet-sharing-functions-ci?branchName=master
[fp]: https://dev.azure.com/tmikent/snippet-sharing/_build/latest?definitionId=3&branchName=master
[cb]: https://dev.azure.com/tmikent/snippet-sharing/_apis/build/status/snippet-sharing-client-ci?branchName=master
[cp]: https://dev.azure.com/tmikent/snippet-sharing/_build/latest?definitionId=2&branchName=master
[fdb]: https://vsrm.dev.azure.com/tmikent/_apis/public/Release/badge/fe89bfae-ea9c-4908-8852-906d5ebc763f/1/2
[fdp]: https://dev.azure.com/tmikent/snippet-sharing/_release?definitionId=1
[cdb]: https://vsrm.dev.azure.com/tmikent/_apis/public/Release/badge/fe89bfae-ea9c-4908-8852-906d5ebc763f/2/3
[cdp]: https://dev.azure.com/tmikent/snippet-sharing/_release?definitionId=2
[autob]: https://dev.azure.com/tmikent/snippet-sharing/_apis/build/status/snippet-share-automated-tests?branchName=master
[autop]: https://dev.azure.com/tmikent/snippet-sharing/_build/latest?definitionId=5&branchName=master


## Info
1) You paste a text/code snippet you want to share.
2) Then you publish it and will get two links:
    - first is for update/delete access
    - second is only for read access
3) Send the appropriate link to the person you want.

*NOTE: It's your responsibility to save the link with update/delete access if you want to make changes later.* 

## Links
- [Functional specifications][1]
- [Architecture][2]
- [SOLID compliant][3]
- [Clickable Prototype][4]

[1]: https://github.com/QwerMike/dr-guess/blob/master/docs/func-spec-uml.svg
[2]: https://github.com/QwerMike/dr-guess/blob/master/docs/architecture.md
[3]: https://github.com/QwerMike/dr-guess/blob/master/docs/solid-compliant.md
[4]: https://invis.io/D7RFJO33GX9#/356907043_Main

## API Endpoints

### `POST /createSnippet`
Request body: 
```Javascript
{ author: String, title: String, data: String, type: String }
```

Responses:
- 200 OK
```Javascript
{ privateUid: String, publicUid: String }
```
- 400 Bad Request
```Javascript
{ message: 'Property "data" is required.' }
```
- 405 Method Not Allowed
```Javascript
{ message: 'Send a POST request.' }
```

---
### `GET /getSnippet`
Query params: `id`

Responses:
- 200 OK 
```Javascript
{
  snippet: {
    author: String,
    title: String,
    data: String,
    type: String,
    publicUid: String 
  },
  readonly: Boolean
}
```
- 400 Bad Request
```Javascript
{ message: 'Search parameter "id" is required.' }
```
- 404 Not Found
```Javascript
{ message: 'Snippet ${id} is not found.' }
```
- 405 Method Not Allowed
```Javascript
{ message: 'Send a GET request.' }
```

---
### `DELETE /deleteSnippet`
Query params: `id`

Request body: 
```Javascript
{ author: String, title: String, data: String, type: String }
```

Responses:
- 200 OK
```Javascript
{ message: 'Snippet ${id} is successfully deleted.' }
```
- 400 Bad Request
```Javascript
{ message: 'Search parameter "id" is required.' }
```
- 405 Method Not Allowed
```Javascript
{ message: 'Send a DELETE request.' }
```

---
### `PUT /updateSnippet`
Query params: `id`

Request body:
```Javascript
{ author: String, title: String, data: String, type: String }
```

Responses:  
- 200 OK
```Javascript
{ message: 'Successfully updated snippet ${id}.' }
```
- 400 Bad Request
```Javascript
{ message: 'Search parameter "id" is required.' }
```
- 400 Bad Request
```Javascript
{ message: 'Property "data" is required.' }
```
- 405 Method Not Allowed
```Javascript
{ message: 'Send a PUT request.' }
```

## Storage

As storage we use Firebase Realtime Database, which:
* is cloud-hosted;
* NoSQL;
* always up-to-date, as data is synced across all clients in realtime;
* remains available even if the app goes offline;
* is available from client devices - can be accessed directly from a mobile device or web browser;
* has data validation through the Firebase Realtime Database Security Rules on r/w operations.

The database can only be accessed in admin mode. That's how Cloud Functions actually use the database.
![Storage model](https://raw.githubusercontent.com/QwerMike/snippet-sharing/master/docs/storage-model.png)

We store snippets, which have:
* data - text or code, which cannot be empty;
* title - optional title for the snippet;
* author - optional author of the snippet;
* type - the type of text or code set by the author (currently supports most popular programming and markup languages);
* public_id - unique identifier, which grants view-only access to the snippet;
* private_id - unique identifier, which grants full access to the snippet.

Also we have redundant proxy object for the sake of convenient data processing in cloud functions.
![db-diagram](https://raw.githubusercontent.com/QwerMike/snippet-sharing/master/docs/db-diagram.png)

For example, the database has the following look (basically, it's JSON file):
```JSON
{
  "readonlyProxy" : {
    "-LTZRmZk06r6qVYxt73S" : {
      "snippet" : "-LTZRmZj9w0HFukFMlNd"
    },
    "-LTZUkkE_LDHaFs7UG1s" : {
      "snippet" : "-LTZUkkDVRQeS3LeXt9K"
    }
  },
  "snippets" : {
    "-LTZRmZj9w0HFukFMlNd" : {
      "author" : "John Wick",
      "data" : "next target -> you",
      "publicUid" : "-LTZRmZk06r6qVYxt73S",
      "title" : "You better watch out",
      "type" : "plain_text"
    },
    "-LTZUkkDVRQeS3LeXt9K" : {
      "author" : "Pewds",
      "data" : "alert('Subscribe to PewDiePie')",
      "publicUid" : "-LTZUkkE_LDHaFs7UG1s",
      "title" : "#SubToPewds",
      "type" : "javascript"
    }
  }
}
```

## Resiliency
There are four endpoints in the API, conforming to basic CRUD operations.
Snippets can be viewed with read only or edit rights.
All endpoints have their timeout set to sixty seconds.
All errors are handled properly on the client side.

|    Endpoint    |                       Resiliency                     |
| -------------- |:----------------------------------------------------:|
| createSnippet  | error if no value is in the request body             |
| getSnippet     | error if no snippet with that id                     |
| updateSnippet  | error if no snippet with edit permission by that id  |
| deleteSnippet  | error if no snippet with edit permission by that id  |

## Security
The service is completely anonymous, no user data is stored, hence, there cannot be any breaches.  
When creating a snippet the author gets two links - one with edit permission and another one with view/read only permission.  
Links are generated by Firebase(through push method) and supposed to be unique.

The thread model diagram. Report could be found [here](https://github.com/QwerMike/snippet-sharing/blob/master/docs/threadModelReport.htm).
![Thread model diagram](https://raw.githubusercontent.com/QwerMike/snippet-sharing/master/docs/threadModelDiagram.png)

## SLA
### Hosting and Realtime Database
> Firebase will use commercially reasonable efforts to make Firebase available with a Monthly Uptime Percentage (defined below) of at least 99.95%, in each case during any monthly billing cycle.

Terms:
**"Monthly Uptime Percentage"** is calculated by subtracting from 100% the percentage of continuous 5 minute periods of Downtime during the month. Percentage measurements exclude downtime resulting directly or indirectly from any Firebase SLA Exclusion (defined below).

**"Downtime"** means more than a five percent Error Rate, or complete lack of external connectivity to the service. Downtime is measured based on server side Error Rate.

**"Error Rate"** means the number of Valid Requests that result in a response with HTTP Status 500 and Code "Internal Error" divided by the total number of Valid Requests during that period. Repeated identical requests do not count towards the Error Rate unless they conform to the Back-off Requirements.

**"Back-off Requirements"** means, when an error occurs, the Application is responsible for waiting for a period of time before issuing another request. This means that after the first error, there is a minimum back-off interval of 1 second and for each consecutive error, the back-off interval increases exponentially up to 32 seconds.

A **"Service Credit"** is a dollar credit, calculated as set forth below, that we may credit back to an eligible account.

|            Monthly Uptime Percentage	               | Service Credit Percentage |
| ---------------------------------------------------- | :-----------------------: |
| Less than 99.95% but equal to or greater than 99.0%	 |             10%           |
| Less than 99.0%	                                     |             30%           |

### Google Cloud Functions

|      Covered Service 	   | Monthly Uptime Percentage |
| ------------------------ | :-----------------------: |
|  Google Cloud Functions	 |        >= 99.5%           |

> If Google does not meet the SLO, and if Customer meets its obligations under this SLA, Customer will be eligible to receive the Financial Credits described below.

**"Financial Credit"** means the following:

| Monthly Uptime Percentage | 			Percentage of monthly bill for the respective<br>Covered Service which does not meet SLO that will be<br>credited to future monthly bills of Customer |
| ------------------------- | :----------------------------------------------: |
|       99% to < 99.5%	    |                           10%                    |
|       95% to < 99%        |                           25%                    |
|              < 95%        |                           50%                    |

## Monitoring & Telemetry
Model:
![Model](https://github.com/QwerMike/dr-guess/blob/master/docs/telemetry&monitoring-model.png)

Monitoring & telemerty results can be found [here](https://github.com/QwerMike/dr-guess/blob/master/docs/monitoring-telemetry).
Firebase has built-in tools for basic monitoring of:
- Crashes;
- Connections (realtime & overall history);
- Storage usage;
- Performance
  * App startup metrics;
  * Network response metrics;
  * Database load.
- App health;
- Error groups;
- Logs.

They provide metrics for:
- Database;
- Storage;
- Hosting;
- Cloud Functions.

We use Application Insights ([react-appinsights][4]), which provides us with:
* Request rates, response times, and failure rates - which pages are most popular, at what times of day, see which pages perform best;
* Dependency rates, response times, and failure rates - check if external services are slowing down our app;
* Exceptions - both server and browser exceptions are reported;
* Page views and load performance - reported by users' browsers;
* AJAX calls from web pages - rates, response times, and failure rates;
* React-specific metrics:
  * Tracking of router changes;
  * React components usage statistics.

![ai-app-map](https://raw.githubusercontent.com/QwerMike/snippet-sharing/master/docs/ai_app_map.png)
![ai-search](https://raw.githubusercontent.com/QwerMike/snippet-sharing/master/docs/ai_search.png)

[4]: https://github.com/Azure/react-appinsights
