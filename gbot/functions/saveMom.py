import requests

def saveMOM(mom,foulLangUsers,url,id):
    url = url
    myobj = {'id':id,'mom': mom, 'fUser':foulLangUsers}
    print(myobj)
    x = requests.post(url, data = myobj)
    # print(x.text)
    return True
    
# saveMOM("sample mommmmmmmmmmmm","ss,vds,vdsd",'http://localhost:3000/api/users/addMeetingData','235453ewf')