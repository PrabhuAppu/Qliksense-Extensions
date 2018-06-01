import copy
import aggrMethod

def buildChartCombination(queryResult, query):
    HyperCubeListDim = []
    HyperCubeListMeas = []

    # Gets all the words from measure and dimension
    #allActWords = [(obj['actword']) for obj in queryResult['measure']] + [(obj['actword']) for obj in queryResult['dimension']] 
    #allActWords = [ item for innerlist in allActWords for item in innerlist ]
    
    allActWords = [' '.join(obj['actword']) for obj in queryResult['measure']] + [' '.join(obj['actword']) for obj in queryResult['dimension']] 
    #allActWords = [ item for innerlist in allActWords for item in innerlist ]
    
    dim={}
    

    
    # Start with dimension
    iter = -1
    # iteration is set to -1

    ### --------------------------------------------------------------------- ###
    # for each dimension in query Result 
    # (where dimension is not a filter - to avoid the use of dimension both in set analysis filtera and chart dimension)
    ### --------------------------------------------------------------------- ###
    for dim in [obj for obj in queryResult['dimension'] if obj['name'] not in [obj['actualName'] for obj in queryResult['filters']]]:
        HyperCube = {}
        # Add the dimension in Hypercube
        HyperCube['dimension'] = [dim]
        HyperCube['measure'] = []
        iter += 1
        iter2 = -1
    
        ### --------------------------------------------------------------------- ###
        # Second inner for loop to compare each dimension against another dimension 
        # to identify all possible combinations based on key words
        ### --------------------------------------------------------------------- ###
        for dim2 in queryResult['dimension']:
            iter2 += 1

            # Skip the comparison for same dimension (Outer and Inner Loop) - Also ignore the dimension available in filters
            if iter2 > iter and dim2['name'] not in [obj['actualName'] for obj in queryResult['filters']]:
            #if dim2['name'] != dim['name']:
                # Get the keywords from all dimensions added in hypercube  
                #alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['dimension']]]
                #alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]
                
                alreadyAvailable = [' '.join(obj['actword']) for obj in [obj for obj in HyperCube['dimension']]]
                #alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]

                ### --------------------------------------------------------------------- ###
                # Compare the keyword of new dimension with existing dimensions' keyword in hypercube 
                # If the keyword not exists then add it to the HyperCube 
                ### --------------------------------------------------------------------- ###
                #if  len([obj for obj in dim2['actword'] if obj not in alreadyAvailable])>=len(dim2['actword']):
                if ' '.join(dim2['actword']) not in alreadyAvailable:
                    HyperCube['dimension'].append(dim2)
        
        ### --------------------------------------------------------------------- ###
        # Second inner for loop to compare each dimension against another measure 
        # to identify all possible combinations based on key words
        ### --------------------------------------------------------------------- ###
        for meas2 in queryResult['measure']:
            # Get the keywords from all dimensions added in hypercube  
            #alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['dimension']]]
            #alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]

            alreadyAvailable = [' '.join(obj['actword']) for obj in [obj for obj in HyperCube['dimension']]]
            
            # Get the keywords from all measures added in hypercube  
            #alreadyAvailableMeas = [obj['actword'] for obj in [obj for obj in HyperCube['measure']]]
            #alreadyAvailableMeas = [ item for innerlist in alreadyAvailableMeas for item in innerlist ]+alreadyAvailable

            alreadyAvailableMeas = [' '.join(obj['actword']) for obj in [obj for obj in HyperCube['measure']]]
            alreadyAvailableMeas = alreadyAvailableMeas+alreadyAvailable
            
            ### --------------------------------------------------------------------- ###
            # Compare the keyword of new measure with existing dimensions' keyword and measures' keyword in hypercube 
            # If the keyword not exists then add it to the HyperCube 
            ### --------------------------------------------------------------------- ###
            #if  len([obj for obj in meas2['actword'] if obj not in alreadyAvailableMeas])>=len(meas2['actword']):
            if  ' '.join(meas2['actword']) not in alreadyAvailableMeas:
                # print(alreadyAvailableMeas)
                # print(meas2['name'])
                # print(dim['name'])
                # print(meas2['actword'])
                # print('#############################')
                HyperCube['measure'].append(meas2)
                   
        HyperCubeListDim.append(copy.deepcopy(HyperCube))

    # Start with measure
    iter = -1
    
    wordsFromPrevious = [obj for obj in HyperCubeListDim]


    ### --------------------------------------------------------------------- ###
    # if all the keyword combination returns only set of dimensions and not any measure
    # Then do the same comparison starting from measures
    # For each measure in query Result
    ### --------------------------------------------------------------------- ###
    for meas in [obj for obj in queryResult['measure']]:
        HyperCube = {}
        HyperCube['measure'] = [meas]
        HyperCube['dimension'] = []
        iter += 1
        iter2 = -1

        ### --------------------------------------------------------------------- ###
        # Second inner for loop to compare each measure against another measure 
        # to identify all possible combinations based on key words
        ### --------------------------------------------------------------------- ###
        for meas2 in queryResult['measure']:
            iter2 += 1
            if iter2 > iter:
                # Get the keywords from all measures added in hypercube  
                #alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['measure']]]
                #alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]
                
                alreadyAvailable = [' '.join(obj['actword']) for obj in [obj for obj in HyperCube['measure']]]
                #alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]
                
                ### --------------------------------------------------------------------- ###
                # Compare the keyword of new measure with existing measures' keyword in hypercube 
                # If the keyword not exists then add it to the HyperCube 
                ### --------------------------------------------------------------------- ###
                #if  len([obj for obj in meas2['actword'] if obj not in alreadyAvailable])>=len(meas2['actword']):
                if  ' '.join(meas2['actword']) not in alreadyAvailable:
                    HyperCube['measure'].append(meas2)
       
        
        ### --------------------------------------------------------------------- ###
        # Second inner for loop to compare each measure against another dimension 
        # to identify all possible combinations based on key words
        ### --------------------------------------------------------------------- ###
        for dim2 in queryResult['dimension']:
            
            if dim2['name'] not in [obj['actualName'] for obj in queryResult['filters']]:
            #if dim2['name'] != dim['name']:
                # Get the keywords from all measures added in hypercube  
                #alreadyAvailableMeas = [obj['actword'] for obj in [obj for obj in HyperCube['measure']]]
                #alreadyAvailableMeas = [ item for innerlist in alreadyAvailableMeas for item in innerlist ]
                alreadyAvailableMeas = [' '.join(obj['actword']) for obj in [obj for obj in HyperCube['measure']]]
                
                # Get the keywords from all dimensions added in hypercube
                #alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['dimension']]]
                #alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ]+alreadyAvailableMeas

                alreadyAvailable = [' '.join(obj['actword']) for obj in [obj for obj in HyperCube['dimension']]]
                alreadyAvailable = alreadyAvailable+alreadyAvailableMeas
                
                ### --------------------------------------------------------------------- ###
                # Compare the keyword of new measure with existing dimensions' keyword and measures' keyword in hypercube 
                # If the keyword not exists then add it to the HyperCube 
                ### --------------------------------------------------------------------- ###
                #if  len([obj for obj in dim2['actword'] if obj not in alreadyAvailable])>=len(dim2['actword']):
                if  ' '.join(dim2['actword']) not in alreadyAvailable:
                    HyperCube['dimension'].append(dim2)
                # Need to revisit this scenario and create the same for measures too
                else:
                    HyperCubeListMeas.append({
                        "measure":  copy.deepcopy(HyperCube['measure']),
                        "dimension": [dim2]
                    })
        
        
        HyperCubeListMeas.append(copy.deepcopy(HyperCube))

    HyperCubeList=[]
    # remove duplicate HyperCube

    
    #chartProp = createChartsPropeties(HyperCubeList)

    for cube in HyperCubeListDim:
        dimensions = [obj['name'] for obj in cube['dimension']]
        measures = [obj['name'] for obj in cube['measure']]
        identified = False
        '''
        for cube2 in HyperCubeListMeas:
            dimensions2 = [obj['name'] for obj in cube2['dimension']]
            measures2 = [obj['name'] for obj in cube2['measure']]
            if dimensions==dimensions2 and measures == measures2:
                identified = True
        if identified == False:
        '''        
        HyperCubeList.append(cube)
    
    for cube in HyperCubeListMeas:
        dimensions = [obj['name'] for obj in cube['dimension']]
        measures = [obj['name'] for obj in cube['measure']]
        identified = False
        for cube2 in HyperCubeListDim:
            dimensions2 = [obj['name'] for obj in cube2['dimension']]
            measures2 = [obj['name'] for obj in cube2['measure']]
            if dimensions == dimensions2 and measures == measures2:
                identified = True
        if identified == False:        
            HyperCubeList.append(cube)
            
    
    #print([{'dimension':[item['name'] for item in obj['dimension']], 'measure':[item['name'] for item in obj['measure']] } for obj in HyperCubeList])
    createMeasureWithFilter(HyperCubeList, queryResult, query)
    #print(HyperCubeList)
    return HyperCubeList

def createMeasureWithFilter(cubeList, queryResult, query):
    chartList = []
    v = 0
    for cube in cubeList:
        if len(cube['measure'])==0:
            MeasureMethod = aggrMethod.getAggrMethod(query, cube)
            Exp = MeasureMethod#"SUM( <SET> <FIELD> )"
            
            ReducedFilter = []
            if MeasureMethod!=None and len(MeasureMethod["omitWords"])>0:
                ReducedFilter = [obj for obj in queryResult['filters'] if len(set([obj.lower() for obj in obj['qTerm']]) & set([obj.lower() for obj in MeasureMethod["omitWords"]]))==0]
            else:
                ReducedFilter = queryResult['filters']
            
            filter = "{<"+(",").join(["["+obj['actualName']+"]"+"={"+(",").join(["'"+term+"'" for term in obj['qTerm']])+"}"  for obj in ReducedFilter])+">}" if len(ReducedFilter)>0 else ""
        
            if MeasureMethod!=None and MeasureMethod["CountMeasure"]: 
                MeasureMethod['measure']["expression"].replace("<SET>",filter)  
                cube['measure'].append(MeasureMethod['measure'])
                cube['dimension'] = [obj for obj in cube['dimension'] if obj['name'] != MeasureMethod['measure']['name']]

            for measure in cube['measure']:
                measure['expression'] = measure['expression'].replace("<SET>",filter)
            #measure['expression']=Exp.replace("<FIELD>",'['+measure['name']+']').replace("<SET>",filter)
            
            if MeasureMethod!=None:
                for dim in cube['dimension']:
                    dim['dimLimit']=MeasureMethod['dimensionLimit']
            else:
                for dim in cube['dimension']:
                    dim['dimLimit']={}
        else:
            for measure in cube['measure']:
                MeasureMethod = aggrMethod.getAggrMethod(query, cube)

                #Exp = queryResult['measureKeyword']#"SUM( <SET> <FIELD> )"
                Exp = MeasureMethod['exp']#"SUM( <SET> <FIELD> )"

                

                ReducedFilter = []
                if len(MeasureMethod["omitWords"])>0:
                    #ReducedFilter = [obj for obj in queryResult['filters'] if len(set(obj['qTerm']) & set(MeasureMethod["omitWords"]))==0]
                    ReducedFilter = [obj for obj in queryResult['filters'] if len(set([obj.lower() for obj in obj['qTerm']]) & set([obj.lower() for obj in MeasureMethod["omitWords"]]))==0]
                    
                else:
                    ReducedFilter = queryResult['filters']

                
                #add dimension Limit
                #if(len(cube['dimension'])>0):
                vDim = 0
                for dim in cube['dimension']:
                    dim['dimLimit']=MeasureMethod['dimensionLimit']
                
                print("omitWordsasas")
                print(ReducedFilter)

                filter = "{<"+(",").join(["["+obj['actualName']+"]"+"={"+(",").join(["'"+term+"'" for term in obj['qTerm']])+"}"  for obj in ReducedFilter])+">}" if len(ReducedFilter)>0 else "" 
                measure['expression']=Exp.replace("<FIELD>",'['+measure['name']+']').replace("<SET>",filter)
