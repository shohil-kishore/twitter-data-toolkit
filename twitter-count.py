# Will return the number of Tweets that match your request. Ensure you specify bucket, otherwise an hourly count will be returned.
# Insert a startDate, finishDate, endpoint, query and next token (if applicable) specific to your project.
import requests
import json

startDate = '"201804010000"'
finishDate = '"201806300000"'
endpoint = "https://api.twitter.com/1.1/tweets/search/fullarchive/Dev/counts.json" 
# Include your bearer token here after generating it with generate-bearer-token.php.
headers = {"Authorization":"Bearer YOURTOKEN", "Content-Type": "application/json"}  

# Ensure you change the query, and remove the next token if this is the first request.
data = '{"query":"(QUERY)", "next":"NEXTTOKEN", "bucket":"day", "fromDate": ' + str(startDate) + ', "toDate": ' + str(finishDate) + "}"

# Posting the request. 
response = requests.post(endpoint, data=data, headers=headers).json()

# Write the response to a JSON file. 
with open('count.json', 'w') as responseContent:
    responseContent.write(json.dumps(response, indent = 2))
