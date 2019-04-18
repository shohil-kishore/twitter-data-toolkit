# Twitter Data Collector
This respository consists of Python/JavaScript files that allow users to identify their bearer token (application-only authentication), collect Tweets using Twitter's premium search endpoints and aggregate Tweets into one file for analysis purposes WITHOUT having to interact with code. Everything's done through a simple web application.

![Screenshot](https://raw.githubusercontent.com/shohil-kishore/twitter-data-collector/master/Other/Data%20Toolkit%20Example.png)

## File Structure
- twitter-data-app (work in progress): Allows users to input their consumer key and consumer private key to generate their bearer token.
- twitter-count (working script): Generates an estimate of total Tweets to be collected based on a user query.
- twitter-search (working script): Generates multiple requests and collects Tweets based on a user query.
- twitter-merger (working script): Aggregates all Tweets in a directory into one JSON file ready for analysis. 

# FAQ
## How is this different to other projects?
This project focuses on those with a non-technical background. When you simply want to collect some data to explore an idea, this is a great place to start. 

## Why should I use the Twitter API?
Utilizing Twitter's Premium Search API is particularly useful in a research context as it allows you to collect full-fidelity data that can be replicated by others. 

## How much does it cost to use the Twitter API?
For $99 USD, 100,000 Tweets can be collected using the Premium Search full-archive endpoint. 
