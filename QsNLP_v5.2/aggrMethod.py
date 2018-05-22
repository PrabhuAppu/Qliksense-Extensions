import csv

def getAggrMethod(query, cube):

    search = [word.strip() for word in query.lower().split(" ")]

    # Generic Words File
    file = "data\\genericWords.csv"

    # Loop though Generic Words.csv

    expression = {
            "CountMeasure": False,
            "exp":"SUM( <SET> <FIELD> )",
            "omitWords": [],
            "dimensionLimit": {}
        }#"SUM( <SET> <FIELD> )"

    with open(file, newline='') as csvfile:
        measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in measureReader:
            
            if " "+row[1].replace(" <FIELD>","").replace(" <NUMBER>","").lower()+" " in query.lower():
                print("yes")
                expression = identifyField(row, query, cube)
            elif row[1].replace(" <FIELD>","").replace(" <NUMBER>","").lower()+" " in query.lower():
                expression = identifyField(row, query, cube)
        
    return expression#"SUM( <SET> <FIELD> )"#, "measureField":obj['name']} for obj in classData["measure"]]

def identifyField(row, query, cube):
    
    if row[0]=="1" :
        for dim in [{"tagword": obj['actword'], "Name":obj['name']} for obj in cube['dimension']]+[{"tagword": obj['actword'], "Name":obj['Name']} for obj in cube['measure']]:
            for d in dim["tagword"]:
                if row[1].replace("<FIELD>", d).lower() in query.lower():
                    return {
                        "CountMeasure": True,
                        "exp": row[2].replace("<FIELD>", dim["Name"]),
                        "omitWords": [],
                        "dimensionLimit": {},
                        'measure':{
                            'expression':row[2].replace("<FIELD>", dim["Name"]),
                            'actword': dim["tagword"],
                            'name': dim["Name"],
                            'calcDimensionLabel': 0,
                            'measureLabel': 0,
                            'measureDef': 0,
                            'DimensionDef': 0,
                            'wordsMatching': len(dim["tagword"]),
                            'classification': 'measure',
                            'percentMatch': 1.0
                        }
                    }
    elif row[0]=="2":
        
        return {
            "CountMeasure": False,
            "exp":row[2],
            "omitWords": [],
            "dimensionLimit": {}
        }

    elif row[0]=="3":
        limit = identifyNextWord(query, 'top', 1)
        return {
            "CountMeasure": False,
            "exp":row[2],
            "omitWords": ['top', str(limit)],
            "dimensionLimit": {
                                    "qOtherMode": "OTHER_COUNTED",
                                    "qOtherCounted": {
                                        "qv": str(limit)
                                    },
                                    "qOtherLimit": {
                                        "qv": "0.05"
                                    },
                                    "qOtherLimitMode": "OTHER_GT_LIMIT",
                                    "qSuppressOther": 0,
                                    "qForceBadValueKeeping": 1,
                                    "qApplyEvenWhenPossiblyWrongResult": 1,
                                    "qGlobalOtherGrouping": 0,
                                    "qOtherCollapseInnerDimensions": 0,
                                    "qOtherSortMode": "OTHER_SORT_DESCENDING",
                                    "qTotalMode": "TOTAL_OFF",
                                    "qReferencedExpression": {
                                        "qv": ""
                                    }
                            }
            }

def identifyNextWord(query, key, pos):
    search = [word.strip() for word in query.lower().split(" ")]
    for i in range(0 , len(search)-1):
        if key==search[i]:
            return search[i+pos]
    #print("class")