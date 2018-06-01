import csv
import re
# For identifying the filters 
import json
from websocket import create_connection
from json import JSONEncoder

class MyEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__

def findWholeWord(w):
    return re.compile(r'\b({0})\b'.format(w), flags=re.IGNORECASE).search
            
# Analysye Non Matching words and get the field values using search API

def openApplication(ws, applicationID, requestID):
    #print ("### opened ###")
    handshake = {
        "method": "OpenDoc",
        "handle": -1,
        "params": [
            applicationID
        ],
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(handshake)
    ws.send(data)

def getSearchAssociation(ws, searchTerm, requestID):
    #print ("### searching... ###")
    handshake = {
        "handle": 1,
        "method": "SearchResults",
        "params": {
            "qOptions": {
                "qContext": 0
            },
            "qTerms": [
                searchTerm
            ],
            "qPage": {
                "qOffset": 0,
                "qCount": 10,
                "qMaxNbrFieldMatches": -1
            }
        },
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(handshake)
    ws.send(data)
    result  = eval(ws.recv())
    #print(result)
    return result['result']['qResult']['qSearchGroupArray']
    #print(result['result']['qResult']['qSearchGroupArray'][0])

def get(nonMatchingwords, appName, query): 
    ws = create_connection("ws://localhost:4848/app")
    #application = "C:\\Users\\359084\\Documents\\Qlik\\Sense\\Apps\\Executive Dashboard.qvf"
    #application = "D:\Qlik\Apps\Executive Dashboard.qvf"
    #application = "D:\Qlik\Apps\Consumer_Sales.qvf"
    application = appName
    requestID = 1
    # Open the qliksense application
    openApplication(ws, application, requestID)
    requestID+=1
    result =  ws.recv()
    result =  ws.recv()

    allFields = []
    allFieldsWithDef = []
    file = "data\\"+appName+"\\fieldList.csv"
    classfile = "data\\"+appName+"\\fieldClassification.csv"
    dimensionDeffile = "data\\"+appName+"\\masterDimDefList.csv"

    # Get Field to Field Def from Master Dimension 
    with open(dimensionDeffile, newline='') as csvfile:
        measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in measureReader:
            allFieldsWithDef.append({
                "field": row[0],
                "def" : row[1]
            })


    # Identify Matching Fields in the query
    with open(file, newline='') as csvfile:
        measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in measureReader:
            line=row[0]
            allFields.append(line)

    filters = []
    for term in nonMatchingwords:
        associations = getSearchAssociation(ws, term, requestID)
        requestID+=1
        allKeyWords = [obj for obj in [obj['qItems'] for obj in associations]]# if obj['qTotalNumberOfMatches']==1]
        
        singleMatch = [{"Name" : obj[0]['qIdentifier'], "qTerm" : [obj[0]['qItemMatches'][0]['qText']]} for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1 and obj[0]['qItemMatches'][0]['qText'].lower()==term.lower()]

        for match in singleMatch:
            if match['Name'] not in allFields:
                match['actualName'] =  [obj['def'] for obj in allFieldsWithDef if obj['field'] == match['Name']][0]
            else:
                match['actualName'] =  match['Name']

        csv_rows = []

        with open(classfile) as csvfile:
            reader = csv.DictReader(csvfile)
            title = reader.fieldnames
            for row in reader:
                csv_rows.extend([{title[i]:row[title[i]] for i in range(len(title))}])

        for fieldTags in csv_rows:
            for selected in singleMatch:
                if selected['actualName']==fieldTags['fieldName']:
                    masterDef = [obj['def'] for obj in allFieldsWithDef]
                    
                    if fieldTags['fieldName'] in masterDef or fieldTags['isText']=='True' or fieldTags['isTimeStamp']=='True' or fieldTags['isDate']=='True' or fieldTags['isKey']=='True':
                        selected['classification'] = 'dimension'
                    else:
                        selected['classification'] = 'measure'
        
        # logic used to find matching keywords
        allwordsInResult = [ item.split() for innerlist in [item['qTerm'] for item in singleMatch] for item in innerlist ]
        alldistwordsInResult = [ item.lower() for innerlist in allwordsInResult for item in innerlist ]
        alldistwordsInResult = [ item.lower() for innerlist in allwordsInResult for item in innerlist ]

        qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in [ item.lower() for innerlist in [item.lower().split() for item in obj['qTerm']] for item in innerlist ]]
        #qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in [item.lower().split() for item in obj['qTerm']]]
        
        
        if len(qualifiedMatch)>0:
            # Check whether the filter is already availabel
            single = [obj[0]['qIdentifier'] for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1]
            alreadyAvailableWords = [obj['actualName'] for obj in filters]
            qTerms = [obj['actualName'] for obj in qualifiedMatch]

            if len([obj['actualName'] for obj in qualifiedMatch if obj['actualName'] not in alreadyAvailableWords])>0:
                filters+=(qualifiedMatch)
            else:
                for qItem in qualifiedMatch:
                    for item in filters:
                        if item['actualName'] == qItem['actualName']:
                            item['qTerm'] = item['qTerm'] + qItem['qTerm']
    
    filterFinal = [obj for obj in filters if obj['Name'].lower() in query.lower()]
    
    filterFinal3 = []
    for dim in filterFinal:
        filterFinal2 = [obj['Name'] for obj in filterFinal if findWholeWord(dim['Name'].lower())(obj['Name'].lower()) and dim['Name'].lower() != obj['Name'].lower() ]
        if len(filterFinal2)==0 or len(filterFinal)==1:
            filterFinal3.extend([obj for obj in filterFinal if obj['Name']==dim['Name']])
            
    print([obj['Name'] for obj in filterFinal3])
    print('#########- Filters -##########')
    print([{"Name":obj['Name'], "Value":obj['qTerm']} for obj in filterFinal3])
    print('#########- ------- -##########')
    '''
    response = {
        "filters": filters,
        "dimension": dimension,
        "measure": measure,
        "nonmatchingwords": nonMatchingwords,
        "measureKeyword": [{"aggrFunc":"SUM", "measureField":obj['name']} for obj in measure]
    }
    '''
    return filterFinal3

