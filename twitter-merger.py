# The merger allows you to combine multiple JSON objects into one while maintaining a valid JSON structure.
import os
import json

# Set global variables.
inputFiles = []
tweets = []

# Get an array of all file names in a certain directory.
for f in os.listdir(os.getcwd() + '/test-data'):
    inputFiles.append('test-data/' + f)

# Open each file path from the array and store the files contents in a variable (loads).
for eachFile in inputFiles:
    with open(eachFile, encoding='UTF-8') as inputData:
        tweets = json.loads(inputData.read())

    # Append JSON to a file (dumps) and add a comma to make it valid JSON.
    with open('test-data.json', 'a+') as outputFile:
        for eachTweet in tweets:
            outputFile.write(json.dumps(eachTweet, indent=2))
            outputFile.write(',')

# After this is done, add opening and closing brackets to the entire file. 
