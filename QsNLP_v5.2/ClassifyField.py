import re
import csv
import queryQlikEngine


def findWholeWord(w):
    return re.compile(r'\b({0})\b'.format(w), flags=re.IGNORECASE).search
 
 
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

def checkCardinality(field, appName):
    request = {
                "handle": 1,
                "method": "GetFieldDescription",
                "params": {
                            "qFieldName": field
                          },
                "jsonrpc": "2.0",
                "id": 7
             }
             
    result = queryQlikEngine.GetInfo(appName, request)
    #result = queryQlikEngine.GetInfo("C:\\Users\\359084\\Documents\\Qlik\\Sense\\Apps\\Executive Dashboard.qvf", request)
    if result['result']['qReturn']['qCardinal']>1000:
        return True
    else:
        return False

def doClassify(result, MatchPercent, appName, query):
    # Check whether the word is there in Dimensions
    mesureDeffile = "data\\"+appName+"\\masterMeasureDefList.csv"
    mesureLabelfile = "data\\"+appName+"\\masterMeasureList.csv"
    dimensionDeffile = "data\\"+appName+"\\masterDimDefList.csv"
    dimensionLabelfile = "data\\"+appName+"\\masterDimList.csv"
    inMeasureDef = getMatches(mesureDeffile,"measureDef", result, 0)
    inMeasureLabel = getMatches(mesureLabelfile,"measureLabel", result, 0)
    inDimensionDef = getMatches(dimensionDeffile,"DimensionDef", result, 1)
    finalResult = getMatches(dimensionLabelfile,"calcDimensionLabel", result, 0)


    classfile = "data\\"+appName+"\\fieldClassification.csv"
    allFieldsWithDef = []
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
                if fieldTags['fieldName'] in masterDef or fieldTags['isText']=='True' or fieldTags['isTimeStamp']=='True' or fieldTags['isDate']=='True' or fieldTags['isKey']=='True' or (fieldTags['isInteger']=='True' and fieldTags['isNumeric']=='True'):
                    selected['classification'] = 'dimension'
                else:
                    if checkCardinality(fieldTags['fieldName'], appName)==True or (fieldTags['isInteger']=='False' and fieldTags['isNumeric']=='True'):
                        selected['classification'] = 'measure'
                    else:
                        selected['classification'] = 'dimension'

    print('#########-Dimension-##########')      
    dimension =[obj for obj in finalResult if obj['classification']=='dimension' and obj['percentMatch']>=MatchPercent and findWholeWord(obj['name'].lower())(query.lower())]  
    print([obj['name'] for obj in finalResult if obj['classification']=='dimension' and obj['percentMatch']>=MatchPercent and findWholeWord(obj['name'].lower())(query.lower())])
    print('###################################### dim')
    print(dimension)
    print('###################################### dim')
    dimension3 = []
    
    for dim in dimension:
        dimension2 = [obj['name'] for obj in dimension if findWholeWord(dim['name'].lower())(obj['name'].lower()) and dim['name'].lower() != obj['name'].lower() ]
        print(dim['name'])
        print(dimension2)
        
        if len(dimension2)==0 or len(dimension)==1:
            dimension3.extend([obj for obj in dimension if obj['name']==dim['name']])
    
    print([obj['name'] for obj in dimension3])
    
    print('#########-Measure-##########')   
    measure =[obj for obj in finalResult if obj['classification']=='measure'and obj['percentMatch']>=MatchPercent and findWholeWord(obj['name'].lower())(query.lower())]  
    print([obj['name'] for obj in finalResult if obj['classification']=='measure' and obj['percentMatch']>=MatchPercent and findWholeWord(obj['name'].lower())(query.lower())])    

    print('#########---------##########')
    #print(nonMatchingwords)

    return {
                "result": finalResult,
                "dimension": dimension3,
                "measure": measure
            } 

