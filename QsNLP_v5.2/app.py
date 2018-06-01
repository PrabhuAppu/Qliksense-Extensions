import GetMatchingFields
import ClassifyField
import filters
#import aggrMethod
import combinations
import qlikViz

from flask import Flask
from flask_cors import CORS
#.ext.
import json

app = Flask(__name__)
CORS(app)

def getChart(query):
    appName = "Executive Dashboard.qvf"
    data = GetMatchingFields.Get(query)
    classData = ClassifyField.doClassify(data['result'], 0.5, appName, query)
    
    if len(classData)==0:
        classData = ClassifyField.doClassify(data['result'], 0.75, appName, query)

    if len(classData)==0:
        classData = ClassifyField.doClassify(data['result'], 0.5, appName, query)

    filter = filters.get(data['nonMatchingwords'], appName, query)  

    

    result = {
        "filters": filter,
        "dimension": classData["dimension"],
        "measure": classData["measure"],
        "nonmatchingwords": data['nonMatchingwords'],
        "measureKeyword": "MesureMethod"
        #[{"aggrFunc":"SUM", "measureField":obj['name']} for obj in classData["measure"]]
    }

    #print([obj['name'] for obj in classData["measure"]])
    print(result)
    print('##############################') 

    cube = combinations.buildChartCombination(result, query)
    print(cube)
    ch = qlikViz.createChartsPropeties(cube, query)
    
    return ch

standalone = False
if standalone==True:
    query = "What is the Regionwise Sales Amount in Year 2013 2012"
    query ="Sales Amount by Sales Rep Name"
    query = "Sales Amount by Product"
    query = "Sales Quantity by Product type desc"
    query = "Sales Quantity of Beer and Wine"
    #query = "How much Sales is happened in Europe"
    query = "Regionwise Sales"
    #query = "Sales by Stephanie"
    #data = GetMatchingFields.Get("What is the Regionwise Sales Amount in Year 2013 2012")
    query = "What is the Regionwise Sales Amount in Year 2013 2012"
       
    #query = "Sales Quantity by Product type desc"
    #query = "Show no of Product Sold in Europe" 
    query = "Show the avg sales in all region by product"
    query ="Top 10 Product Type by Sales"
    query = "What is the Regionwise Sales Amount in Year 2013 2012"
    print('##########-- Query --########')
    print(query)
    print('##########-- ----- --########')
    chart = getChart(query)
    print('##########-- Chart --########')
    printChart = []
    '''
    print("Field\t% Matching")
    for row in [[obj['name'], obj['percentMatch']] for obj in result]:
        print(row[0]+"\t"+str(row[1]))
    '''
    for chartElem in chart:#[obj for obj in chart if len(set(obj['tags'][0]) & set(obj['tags'][1]))==0 ]:
        #print("type: "+chartElem['type'])
        dataPrint = "\n"+chartElem['type']+"\t"
        for elem in chartElem['dataCube']:
            try:
                #print("\nDimension: "+(",").join(elem['qDef']['qFieldLabels']))
                dataPrint += (",").join(elem['qDef']['qFieldLabels'])+"\t"
            except KeyError:
                dataPrint += (elem['qDef']['qDef'])
                #print("\nMeasure: "+ (elem['qDef']['qDef']))
        print(dataPrint)
    print('##########-- ----- --########')
    
else:
    @app.route('/query/<query>', methods=['GET'])
    def show_user_profile(query):
        charts = getChart(query)
        return json.dumps(charts)

    if __name__ == "__main__":
        app.run()

