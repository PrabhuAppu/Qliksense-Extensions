import csv
with open('eggs.csv', 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    #spamwriter.writerow(['Spam'] * 5 + ['Baked Beans'])
    spamwriter.writerow(['Spam', 'Lovely,||\nSpam', 'Wonderful Spam'])



with open('eggs.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for row in spamreader:
         print(row[0])

# create a dictionary for all search words, setting each count to 0
# count = dict.fromkeys(search, 0)

'''
p = re.compile('(?<![\S"])([^"\s]+)(?![\S"])')#('(?<![\S"])([^"\s]+)(?![\S"])')
m = p.findall('"quick" "brown" fox jumps "over" "the" lazy dog')
print(m)
match = re.search(r'(\bSales\b)','|Sum({<[Fiscal Year]={$(=vYTDYear)}, FiscalMonthNum={"<=$(vCurrentMonthNum)"}>}[Sales Price]*[Sales Quantity])/Sum({<[Fiscal Year]={$(=(vYTDYear)-1)}, FiscalMonthNum={"<=$(vCurrentMonthNum)"}>}[Sales Price]*[Sales Quantity])|')
'''
#/THIS\d+(?=(?:(?:(?:[^"\\]++|\\.)*+"){2})*+(?:[^"\\]++|\\.)*+$)/
#match = re.findall('{<[\S\s\w}]*>}','|Sum({<[Fiscal Year]={$(=vYTDYear)}, FiscalMonthNum={"<=$(vCurrentMonthNum)"}>}[Sales Price]*[Sales Quantity])/Sum({<[Fiscal Year]={$(=(vYTDYear)-1)}, FiscalMonthNum={"<=$(vCurrentMonthNum)"}>}[Sales Price]*[Sales Quantity])|')
#match = re.findall(r'(?<!{[\s\S\w])','{ Isaac')

#match = p.sub('', '{<a href="foo.com" class="bar">}I Want This {<b>}text!{</b>}{</a>}')
#match = p.sub('', '|Sum({<[Fiscal Year]={$(=vYTDYear)}, FiscalMonthNum={"<=$(vCurrentMonthNum)"}>}[Sales Price]*[Sales Quantity])/Sum({<[Fiscal Year]={$(=(vYTDYear)-1)}, FiscalMonthNum={"<=$(vCurrentMonthNum)"}>}[Sales Price]*[Sales Quantity])|')
#print(match)
#match = re.findall("Sales Quantity", match)
#print(match)




    for meas in queryResult['measure']:
        HyperCube['dimension'] = []
        HyperCube['measure'] = [meas]
       
        
        for meas2 in queryResult['measure']:
            if meas2['name'] != meas['name']:
                alreadyAvailableMeas = [obj['actword'] for obj in [obj for obj in HyperCube['measure']]]
                alreadyAvailableMeas = [ item for innerlist in alreadyAvailableMeas for item in innerlist ]

                if  len([obj for obj in meas2['actword'] if obj not in alreadyAvailableMeas])>0:
                    HyperCube['measure'].append(meas2)
        
        for dim2 in queryResult['dimension']:

            alreadyAvailableMeas = [obj['actword'] for obj in [obj for obj in HyperCube['measure']]]
            alreadyAvailableMeas = [ item for innerlist in alreadyAvailableMeas for item in innerlist ]

            alreadyAvailable = [obj['actword'] for obj in [obj for obj in HyperCube['dimension']]]
            alreadyAvailable = [ item for innerlist in alreadyAvailable for item in innerlist ] + alreadyAvailableMeas

            if  len([obj for obj in dim2['actword'] if obj not in alreadyAvailable])>0:
                HyperCube['dimension'].append(dim2)
        
        
