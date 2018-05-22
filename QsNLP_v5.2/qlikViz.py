from itertools import chain

def createChartsPropeties(cubeList, query):
    #print([{"type": "bar", "dataCube": [], "other": obj } for obj in cubeList])
    chartList = []
    for cube in cubeList:
        if len(cube['measure'])>0:
            #print("########################")
            #print(cube)
            #print(sum([obj['percentMatch'] for obj in cube['measure']]+[obj['percentMatch'] for obj in cube['dimension']]))
            #print("########################")

            matchingWeight = sum([obj['percentMatch'] for obj in cube['measure']]+[obj['percentMatch'] for obj in cube['dimension']])

            simpleDataCube = [obj['name'] for obj in cube['dimension']]
            simpleDataCube += ["="+obj['expression'] for obj in cube['measure']]
            dataCube = []
            dataDimWords = []
            dataMeasWords = []
            if len(cube['dimension'])==0 and len(cube['measure'])>1:
               dataCube = [{
                                "qDef": {
                                    "qFieldDefs": ["='Custom''"],
                                    "qFieldLabels": ["Custom"]
                                }
                          }]
            else:
                dataDimWords=(
                   [tag for tag in chain.from_iterable(
                       [obj['actword'] for obj in cube['dimension']]
                   )]
                )
                dataCube = [{
                                "qDef": {
                                    "qFieldDefs": [obj['name']],
                                    "qFieldLabels": [obj['name']]
                                },
                                "qOtherTotalSpec": obj['dimLimit']
                            } for obj in cube['dimension']]
            
            dataMeasWords=(
                [tag for tag in chain.from_iterable(
                    [obj['actword'] for obj in cube['measure']]
                )]
            )

            dataCube += [{
                            "qDef": { 
                                "qDef": "="+obj['expression'],
                                "qLabel": obj['name']
                            }
                        } for obj in cube['measure']]
            
            # footNote
            
            footnote = [obj['expression'] for obj in cube['measure']]

            
            footnoteDim = [obj['name'] for obj in cube['dimension']]
             

            properties = {
						    "dataPoint": {
							    "showLabels": 1
						    },
						    "color": {
							    "auto": 0,
							    "mode": "byDimension"
						    },
						    "footnote": ((', ').join(footnoteDim)) +' '+ ((', ').join(footnote))
					    }

            chartList.append({
                "type": "kpi" if len([obj['name'] for obj in cube['dimension']])==0 and len([obj['name'] for obj in cube['measure']])==1 else "table" if len([obj['name'] for obj in cube['dimension']])==0 and len([obj['name'] for obj in cube['measure']])>1 else "barchart",
                "dataCube": dataCube,
                "properties": properties,
                "matchingWeight": matchingWeight,
                "tags": [dataDimWords ,dataMeasWords],
                "totalWords": len(dataDimWords)+len(dataMeasWords)
            })
    
    FilteredList = [obj for obj in chartList if len(set(obj['tags'][0]) & set(obj['tags'][1]))==0 ]

    FilteredList.sort(key=lambda x:x['totalWords'], reverse=True)

    return FilteredList