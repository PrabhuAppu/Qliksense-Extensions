import csv
from itertools import chain

# For finding near matches
import difflib 

def Get(query):
    queryLower = query.lower()
    search = query
    search = [word.strip() for word in search.lower().split(" ")]

    # create a dictionary for all search words, setting each count to 0
    wordsMatching = dict.fromkeys(search, 0)

    # Check whether the word is there in Dimensions
    file = "data\\Executive Dashboard.qvf\\fieldList.csv"
    
    dimensions = []
    result = []
    nonMatchingwords = []
    allFieldsWithDef = []
    allFields = []
    
    # Identify Matching Fields in the query
    with open(file, newline='') as csvfile:
        measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in measureReader:
            line=row[0]
            wordD = line.lower() 
            dimCount = {}
            dimCount[line] = 0
            allFields.append(line)
            wrd = []
            
            if wordD in queryLower:
                dimCount[line] += 1
                wrd = wrd + (line.lower().split())

            if dimCount[line] > 0 and row[0].replace("\n","") not in [obj['name'].lower() for obj in result]:
                result.append({
                    'name': row[0].replace("\n",""),
                    'wordsMatching': dimCount[line],
                    'actword': wrd,
                    'percentMatch': len(row[0].replace("\n","").split())/len(wordD.split())
                })
       
    # Identify Fields that has mtching words
    with open(file, newline='') as csvfile:
        measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in measureReader:
            line=row[0]
            dimCount = {}
            dimCount[line] = 0
            allFields.append(line)
            wrd = []
            for word in line.lower().split():
                if word in wordsMatching:
                    # found a word you wanted to count, so count it
                    dimCount[line] += 1
                    wrd.append(word)

            if dimCount[line] > 0 and line not in [obj['name'] for obj in result]:
                result.append({
                    'name': line.replace("\n",""),
                    'wordsMatching': dimCount[line],
                    'actword': wrd,
                    #'numberOfWords': 
                    'percentMatch': dimCount[line]/len(line.lower().split())
                })

    allWords = [obj for obj in chain.from_iterable([obj['name'].lower().split() for obj in result])]
    allWords2 = [obj for obj in chain.from_iterable([[obj['name'].lower().split(), obj['actword']] for obj in result])]

    nonMatchingwords = [obj for obj in wordsMatching if obj not in allWords]
    nearestMatch = []

    for nonmatch in nonMatchingwords:
        
        nearMatch = difflib.get_close_matches(nonmatch, allFields)
        
        for newMatch in nearMatch:
            if newMatch.lower() not in allWords:
                result.append({
                    'name': newMatch,
                    'wordsMatching': 1,
                    'actword': [nonmatch],
                    'percentMatch': 1
                })
                nearestMatch.append(nonmatch)
                allWords = [obj for obj in chain.from_iterable([obj['name'].lower().split() for obj in result])]
    print('##########-- Matching Fields --########')
    print([[obj['name'], obj['percentMatch']] for obj in result])
    '''
    print("Field\t% Matching")
    for row in [[obj['name'], obj['percentMatch']] for obj in result]:
        print(row[0]+"\t"+str(row[1]))
    '''
    print('##########-- --------------- --########')

    print('##########-- Non Matching words --########')
    print([obj for obj in nonMatchingwords if obj not in nearMatch])
    print('##########-- --------------- --########')

    return {"result": result, "nonMatchingwords": nonMatchingwords }

