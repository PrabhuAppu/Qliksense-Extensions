import re
import csv
import copy
from itertools import chain

# For identifying the filters 
import json
from websocket import create_connection
from json import JSONEncoder

# For finding near matches
import difflib 

# webAPI

from flask import Flask
from flask.ext.cors import CORS

from json import JSONEncoder

app = Flask(__name__)
CORS(app)

# mainPrams
MatchPercent = 1

class MyEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__

def AnalyseQuery(query):
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
                    'percentMatch': dimCount[line]/len(line.lower().split())
                })

    allWords = [obj for obj in chain.from_iterable([obj['name'].lower().split() for obj in result])]
    nonMatchingwords = [obj for obj in wordsMatching if obj not in allWords]

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
                allWords = [obj for obj in chain.from_iterable([obj['name'].lower().split() for obj in result])]

    def getMatches(file, type, result, index):
        removeSetIdentifiers = re.compile(r'{<.*?>}')
        for field in result:
            field[type] = 0
            with open(file, newline='') as csvfile:
                measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
                for row in measureReader:
                    match1 = removeSetIdentifiers.sub('',row[index])
                    '''
                    print((match1))
                    removebrackets = re.compile(r'\('+field['name']+'.*?\)')
                    print(removebrackets.sub('',match1))
                    '''
                    match2 = re.findall(field['name'], match1)
                    if len(match2)>0:
                        field[type] += 1
        return result

    

    # Check whether the word is there in Dimensions
    mesureDeffile = "data\\Executive Dashboard.qvf\\masterMeasureDefList.csv"
    mesureLabelfile = "data\\Executive Dashboard.qvf\\masterMeasureList.csv"
    dimensionDeffile = "data\\Executive Dashboard.qvf\\masterDimDefList.csv"
    dimensionLabelfile = "data\\Executive Dashboard.qvf\\masterDimList.csv"
    inMeasureDef = getMatches(mesureDeffile,"measureDef", result, 0)
    inMeasureLabel = getMatches(mesureLabelfile,"measureLabel", result, 0)
    inDimensionDef = getMatches(dimensionDeffile,"DimensionDef", result, 1)
    finalResult = getMatches(dimensionLabelfile,"calcDimensionLabel", result, 0)


    classfile = "data\\Executive Dashboard.qvf\\fieldClassification.csv"

    # Get Field to Field Def from Master Dimension 
    with open(dimensionDeffile, newline='') as csvfile:
        measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in measureReader:
            allFieldsWithDef.append({
                "field": row[0],
                "def" : row[1]
            })

    csv_rows = []
    finalResultTags = []

    with open(classfile) as csvfile:
            reader = csv.DictReader(csvfile)
            title = reader.fieldnames
            for row in reader:
                csv_rows.extend([{title[i]:row[title[i]] for i in range(len(title))}])
            finalResultTags = [obj for obj in csv_rows if obj['fieldName'] in [obj['name'] for obj in finalResult]]

    for fieldTags in finalResultTags:
        for selected in finalResult:
            if selected['name']==fieldTags['fieldName']:
                masterDef = [obj['def'] for obj in allFieldsWithDef]
                if fieldTags['fieldName'] in masterDef or fieldTags['isText']=='True' or fieldTags['isTimeStamp']=='True' or fieldTags['isDate']=='True' or fieldTags['isKey']=='True':
                    selected['classification'] = 'dimension'
                else:
                    selected['classification'] = 'measure'

    print('#########-Dimension-##########')      
    #print([obj for obj in finalResult if obj['classification']=='dimension'])
    dimension =[obj for obj in finalResult if obj['classification']=='dimension' and obj['percentMatch']>=MatchPercent]  
    print([obj for obj in finalResult if obj['classification']=='dimension' and obj['percentMatch']>=MatchPercent])

    print('#########-Measure-##########')   
    measure =[obj for obj in finalResult if obj['classification']=='measure'and obj['percentMatch']>=MatchPercent]  
    print([obj for obj in finalResult if obj['classification']=='measure' and obj['percentMatch']>=MatchPercent])    

    print('#########-Non Matching Words-##########')
    print(nonMatchingwords)

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
        #print(result['result']['qResult']['qSearchGroupArray'])
        return result['result']['qResult']['qSearchGroupArray']
        #print(result['result']['qResult']['qSearchGroupArray'][0])


    ws = create_connection("ws://localhost:4848/")
    #application = "C:\\Users\\359084\\Documents\\Qlik\\Sense\\Apps\\Executive Dashboard.qvf"
    application = "D:\Qlik\Apps\Executive Dashboard.qvf"
    #application = "D:\Qlik\Apps\Consumer_Sales.qvf"
    requestID = 1
    # Open the qliksense application
    openApplication(ws, application, requestID)
    requestID+=1
    result =  ws.recv()

    filters = []
    for term in nonMatchingwords:
        associations = getSearchAssociation(ws, term, requestID)
        requestID+=1
        allKeyWords = [obj for obj in [obj['qItems'] for obj in associations]]# if obj['qTotalNumberOfMatches']==1]
        
        singleMatch = [{"Name" : obj[0]['qIdentifier'], "qTerm" : [obj[0]['qItemMatches'][0]['qText']]} for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1]

        for match in singleMatch:
            if match['Name'] not in allFields:
                match['actualName'] =  [obj['def'] for obj in allFieldsWithDef if obj['field'] == match['Name']][0]
            else:
                match['actualName'] =  match['Name']

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

    print('#########-Filters-##########')
    print(filters)
    response = {
        "filters": filters,
        "dimension": dimension,
        "measure": measure,
        "nonmatchingwords": nonMatchingwords,
        "measureKeyword": [{"aggrFunc":"SUM", "measureField":obj['name']} for obj in measure]
    }
    return response

def buildChartCombination(queryResult):
    HyperCubeList = []
    allActWords = [(obj['actword']) for obj in queryResult['measure']] + [(obj['actword']) for obj in queryResult['dimension']] 
    allActWords = [ item for innerlist in allActWords for item in innerlist ]
    dim={}
    

    
    # Start with dimension
    iter = -1
    for dim in [obj for obj in queryResult['dimension'] if obj['name'] not in [obj['actualName'] for obj in queryResult['filters']]]:
        HyperCube = {}
        HyperCube['dimension'] = [dim]
        HyperCube['measure'] = []
        iter += 1
        iter2 = -1
        
        for dim2 in queryResult['dimension']:
            iter2 += 1
            if iter2 > iter and dim2['name'] not in [obj['actualName'] for obj in queryResult['filters']]:
            #if dim2['name'] != dim['name']:
                alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['dimension']]]
                alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]
                if  len([obj for obj in dim2['actword'] if obj not in alreadyAvailable])>0:
                    HyperCube['dimension'].append(dim2)
        
        for meas2 in queryResult['measure']:
            alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['dimension']]]
            alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]
            alreadyAvailableMeas = [obj['actword'] for obj in [obj for obj in HyperCube['measure']]]
            alreadyAvailableMeas = [ item for innerlist in alreadyAvailableMeas for item in innerlist ]+alreadyAvailable
            if  len([obj for obj in meas2['actword'] if obj not in alreadyAvailableMeas])>0:
                HyperCube['measure'].append(meas2)
       
        HyperCubeList.append(copy.deepcopy(HyperCube))
       
    # Start with measure
    
    iter = -1
    for meas in [obj for obj in queryResult['measure']]:
        HyperCube = {}
        HyperCube['measure'] = [meas]
        HyperCube['dimension'] = []
        iter += 1
        iter2 = -1
        
        for meas2 in queryResult['measure']:
            iter2 += 1
            if iter2 > iter:
                alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['measure']]]
                alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]
                
                if  len([obj for obj in meas2['actword'] if obj not in alreadyAvailable])>0:
                    HyperCube['measure'].append(meas2)
       

        for dim2 in queryResult['dimension']:
            
            if dim2['name'] not in [obj['actualName'] for obj in queryResult['filters']]:
            #if dim2['name'] != dim['name']:
                alreadyAvailableMeas = [obj['actword'] for obj in [obj for obj in HyperCube['measure']]]
                alreadyAvailableMeas = [ item for innerlist in alreadyAvailableMeas for item in innerlist ]

                alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['dimension']]]
                alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]+alreadyAvailableMeas
                if  len([obj for obj in dim2['actword'] if obj not in alreadyAvailable])>0:
                    HyperCube['dimension'].append(dim2)
        
        
        HyperCubeList.append(copy.deepcopy(HyperCube))
        
    createMeasureWithFilter(HyperCubeList, queryResult)
    chartProp = createChartsPropeties(HyperCubeList)
    return chartProp

def createMeasureWithFilter(cubeList, queryResult):
    chartList = []
    for cube in cubeList:
        for measure in cube['measure']:
            Exp = "SUM( <SET> <FIELD> )";
            
            filter = "{<"+(",").join(["["+obj['actualName']+"]"+"={"+(",").join(["'"+term+"'" for term in obj['qTerm']])+"}"  for obj in queryResult['filters']])+">}" if len(queryResult["filters"])>0 else "" 
            measure['expression']=Exp.replace("<FIELD>",'['+measure['name']+']').replace("<SET>",filter)

def createChartsPropeties(cubeList):
    #print([{"type": "bar", "dataCube": [], "other": obj } for obj in cubeList])
    chartList = []
    for cube in cubeList:
        if len(cube['measure'])>0:
            dataCube = [obj['name'] for obj in cube['dimension']]
            dataCube += ["="+obj['expression'] for obj in cube['measure']]
            chartList.append({
                "type": "kpi" if len([obj['name'] for obj in cube['dimension']])==0 else "barchart",
                "dataCube": dataCube,
                "properties": {"title":"On the fly barchart"}
            })
    return chartList
    
    
standalone = True
if standalone == True:
    query = "What is the Regionwise Sales Amount in Year 2013 2012"
    #query = "How much Sales is happened in Europe"
    #query = "Regionwise Sales"
    #query = "Sales by Stephanie"
    data = AnalyseQuery(query)
    
    charts = buildChartCombination(data)
    print('#########-Charts-##########')
    print(charts)

    print(data)
else:
    @app.route('/query/<query>', methods=['GET'])
    def show_user_profile(query):
        # show the user profile for that user
        data = AnalyseQuery(query)
        charts = buildChartCombination(data)
        #return MyEncoder().encode(charts)
        return json.dumps(charts)

    if __name__ == "__main__":
        app.run()
