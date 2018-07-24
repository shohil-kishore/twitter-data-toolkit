# Testing the usage of Twitter's 30 day endpoint (part of Twitter's Premium Search API): https://developer.twitter.com/en/docs/tweets/search/api-reference/premium-search.
# Note that you'll have to apply for a developer account and create an app (as well as a dev environment) before accessing the 30 day endpoint. 

# By default, this endpoint responds with 100 Tweets (max of 500 Tweets).
# Write response to a JSON file by typing 'python twitter-30-day-search.py > tweets.json'
import requests
import json

# The end of the URL changes based on the name of your dev environment (mine is named 30daydev).
endpoint = "https://api.twitter.com/1.1/tweets/search/30day/30daydev.json" 

# Include your bearer token here after generating it with generate-bearer-token.php.
headers = {"Authorization":"Bearer YOURTOKEN", "Content-Type": "application/json"}  

# Insert your query here. Note that your fromDate/toDate will have to be within 30 days of the current date (if you're using the 30 day endpoint).
data = '{"query":"(notyourtonto OR racism)", "fromDate": "201807020000", "toDate": "201807200000"}'

# Posting the request. 
response = requests.post(endpoint, data=data, headers=headers).json()

# Printing the response. 
print(json.dumps(response, indent = 2))