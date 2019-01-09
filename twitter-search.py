# Usage of Twitter's full-archive premium search endpoint. 
# Will make a certain number of requests using the next token.
# Used to collect entire days worth of data that matches a specific query.
# Include tweetDate, startDate, finishDate, endpoint, bearer token and maxResults specific to your project. 

import requests
import json

nextToken = ''
tweetDate = "201807200000"
startDate = '"201807200000"'
finishDate = '"201807210000"'
# The end of this URL changes based on the name of your dev environment (mine is named Dev).
endpoint = "https://api.twitter.com/1.1/tweets/search/fullarchive/Dev.json" 
# Include your bearer token here after generating it with generate-bearer-token.php.
headers = {"Authorization":"Bearer YOURTOKEN", "Content-Type": "application/json"}  

# For loop that will make a certain number of requests (incorporating the next token). numberOfRequests is a precaution.
numberOfRequests = 0
while numberOfRequests < 13:
    if numberOfRequests == 0:
        # Does not include the next token when making the first request. 
        data = '{"query":"(QUERY)", "maxResults":"500", "fromDate": ' + str(startDate) + ', "toDate": ' + str(finishDate) + "}"
    else:
        # Uses next token for all further requests.
        data = '{"query":"()", "maxResults":"500", "fromDate": ' + str(startDate) + ', "toDate": ' + str(finishDate) + ', "next": ' + str(nextToken) + "}"

    # Posting the request. 
    response = requests.post(endpoint, data=data, headers=headers).json()

    # Writing the response to a JSON file. Just a backup of the data.
    with open('data/all-tweets-' + tweetDate + '-' + str(numberOfRequests + 1) + '.json', 'w') as responseContent:
        responseContent.write(json.dumps(response, indent = 2))

    # Extract results to be written to a file.
    results = response["results"]
    
    # Get next token to make further requests. This will error out when there are no more Tweets to get. 
    nextToken = '"' + response["next"] + '"'
    print(nextToken)

    # Write just the results to a JSON file. 
    with open('data/tweets-' + tweetDate + '-' + str(numberOfRequests + 1) + '.json', 'w') as responseContent:
        responseContent.write(json.dumps(results, indent = 2))

    # Increment numberOfRequests. 
    numberOfRequests += 1