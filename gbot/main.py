from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
from selenium.webdriver.common.keys import Keys

from functions.login import turnOffMicCam,AskToJoin,Glogin,joinNow
from functions.foullang import foulLanguage
from functions.saveMom import saveMOM
import sys
#ADD CREDENTIALS HERE
CREDS = {'email' : 'app.modzy123@gmail.com','passwd':'modzy1234QWE'}

opt = Options()
opt.add_argument("--disable-infobars")
opt.add_argument("--mute-audio")
opt.add_argument("start-maximized")
opt.add_argument("enable-usermedia-screen-capturing")
opt.add_experimental_option('excludeSwitches', ['test-type'])
opt.add_experimental_option("prefs", {
    "profile.default_content_setting_values.media_stream_mic": 1,
    "profile.default_content_setting_values.media_stream_camera": 1,
    "profile.default_content_setting_values.geolocation": 1,
    "profile.default_content_setting_values.notifications": 1
})

driver= webdriver.Chrome(executable_path=r"C:\Users\s\Downloads\chromedriver_win32\chromedriver.exe",options=opt)
print("browser up")

def commands():
    i=2
    key=1
    j=1
    driver.find_element(By.XPATH,'//i[normalize-space()="chat"]').click()
    mom=[]
    foulLangUser=[]
    time.sleep(2)
    driver.find_element(By.XPATH,'//textarea[@name="chatTextInput"]').send_keys("Hi i am modzy bot!!\nType '/help' to see all commands" + Keys.ENTER)
    #infinite loop
    while(key==1):
        time.sleep(1)
        WebDriverWait(driver, 300000000).until(EC.visibility_of_element_located((By.XPATH,'//*[@id="ow3"]/div[1]/div/div[9]/div[3]/div[4]/div[2]/div[2]/div/div[3]/div['+str(i)+']/div[2]/div')))
        instText=driver.find_element(By.XPATH,'//*[@id="ow3"]/div[1]/div/div[9]/div[3]/div[4]/div[2]/div[2]/div/div[3]/div['+str(i)+']/div[2]/div').text
        instText=str(instText).lower()
        
        if(foulLanguage(instText)):
            nameFoulUser=driver.find_element(By.XPATH,'//*[@id="ow3"]/div[1]/div/div[9]/div[3]/div[4]/div[2]/div[2]/div/div[3]/div['+str(i)+']/div[1]/div[1]').text
            foulLangUser.append(str(nameFoulUser))
            driver.find_element(By.XPATH,'//textarea[@name="chatTextInput"]').send_keys(str(nameFoulUser)+", please don't make use of inappropriate language." + Keys.ENTER)
            i+=2
            print(' Foul message',i,j)
        elif(instText=='/help'):
            driver.find_element(By.XPATH,'//textarea[@name="chatTextInput"]').send_keys("1. /mom: To add text to MOM\n /mom (text to be added)\n2. /seemom: to see MOM \n3. /defaulters: to see defaulter list\n4. /save : to see save the MOM"+ Keys.ENTER)
            i=i+2
        elif(instText.find('/mom')!=-1):
            mom.append(str(instText[4:]))
            driver.find_element(By.XPATH,'//textarea[@name="chatTextInput"]').send_keys("Added to MOM"+ Keys.ENTER)
            i=i+2
        elif(instText=='/save'):
            finalMOM = "" 
            for ele in mom: 
                finalMOM += ele 
            allFoulLangUser = ""
            for user in foulLangUser: 
                finalMOM += str(user)+','  
            driver.find_element(By.XPATH,'//textarea[@name="chatTextInput"]').send_keys("Final MOM: \n"+finalMOM+"\n Defaulter list: "+allFoulLangUser+ Keys.ENTER)
            i=i+2
            saveMOM(finalMOM,allFoulLangUser,sys.argv[0],sys.argv[1])
        elif(instText=='/seemom'):
            tempMOM = "" 
            for ele in mom: 
                tempMOM += ele  
            driver.find_element(By.XPATH,'//textarea[@name="chatTextInput"]').send_keys("MOM: \n"+tempMOM+ Keys.ENTER)
            i=i+2
        elif(instText=='/defaulters'):
            tempFoulLangUser = ""
            for user in foulLangUser: 
                tempFoulLangUser += str(user)+','  
            driver.find_element(By.XPATH,'//textarea[@name="chatTextInput"]').send_keys("Defaulter list: "+tempFoulLangUser+ Keys.ENTER)
            i=i+2
        else:
            i+=1

# login()
Glogin(CREDS['email'], CREDS['passwd'],driver)
time.sleep(2)
driver.get("https://meet.google.com/oqu-jxqo-bkt")
# 
# turnOffMicCam(driver)
# driver.implicitly_wait(15)
# joinNow(driver)
AskToJoin(driver)
driver.implicitly_wait(10)
time.sleep(5)
commands()

