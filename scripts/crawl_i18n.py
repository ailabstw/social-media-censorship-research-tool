import os
import sys
import json
import time

from selenium import webdriver
from selenium.webdriver.support.ui import Select

STATE_FILE = './state.json'

if os.path.exists(STATE_FILE):
    with open(STATE_FILE, 'r') as f:
        output = json.load(f)
else:
    output = {}

# Before using this script, we need to prepare the following things
# 0. Create venv and pip install selenium 
# 1. Download selenium driver https://chromedriver.chromium.org/downloads
#    driver version should be close to your chrome version
# 2. Specify your web driver path below:

WEBDRIVER_EXEC_PATH = './chromedriver88.0.4324.96'

# 3. Run this script and then you should get result in file './output'
# 4. Copy the output content into i18n.js
# 5. You may not get what you want, you need to know which facebook post has the tag you want !!

# disable notification
options = webdriver.ChromeOptions()
prefs = {
    'profile.default_content_setting_values': {
        'notifications': 2
    },
    # not work for facebook
    #'intl.accept_languages': 'de-CH'
}

options.add_experimental_option('prefs', prefs)
options.add_argument("disable-infobars")
options.add_argument("user-data-dir=selenium")

driver = webdriver.Chrome(executable_path=WEBDRIVER_EXEC_PATH, options=options)
option_values = []

def wait():
    time.sleep(4)

def wait_for(secs):
    time.sleep(secs)

# For debug
#driver.get("https://www.facebook.com")
#sys.exit(0)

try:
    # loop all languages and parse i18n, choose 1 for test
    for i in range(65,100):

        # get edit lang button
        driver.get("https://www.facebook.com/settings?tab=language&view")
        wait()
        iframe = driver.find_element_by_css_selector("iframe")
        driver.get(iframe.get_attribute('src'))
        edit_lang_button = driver.find_element_by_css_selector('a[href="/settings?tab=language&section=account"]')
        edit_lang_button.click()

        # get and select options
        wait()
        select = Select(driver.find_element_by_css_selector('select[name="new_language"]'))
        if not option_values:
            original_lang = None
            for o in select.options:
                value = o.get_attribute('value')
                if o.is_selected():
                    original_lang = value
                option_values.append(value)      
            print(f'read options {option_values}')
            option_values.append(original_lang) # back to orignal language
        
        # no more lang option to test
        if i >= len(option_values):
            break
        
        select.select_by_value(option_values[i])
        print(f'{i}: run for lang {option_values[i]}')

        # submit
        submit = driver.find_element_by_css_selector('input[type="submit"]').submit()
        wait()

        # go to profile page
        driver.get("https://www.facebook.com/profile.php")

        # main routine is here, need to fill below
        lang = driver.find_element_by_tag_name('html').get_attribute('lang')
        wait()
        for i in range(8):
            wait_for(3)
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # We always need to fix this part for different users, here is code snippets for debug in developer console
        # let i = 0; for(let d of document.querySelectorAll('div[data-pagelet="ProfileTimeline"] img')) { console.log(i.toString() + ': ' + d.alt); i++; }
        # let i = 0; for(let d of document.querySelectorAll('div[data-pagelet="ProfileTimeline"] i[aria-label]')) { console.log(i.toString() + ': ' + d.ariaLabel); i++; }
        # let i = 0; for(let d of document.querySelectorAll('div[data-pagelet="ProfileTimeline"] div[style="text-align: start;"] div[role="button"]')) { console.log(i.toString() + ': ' + d.innerHTML); i++; }
        # let i = 0; for(let d of document.querySelectorAll('div[data-pagelet="ProfileTimeline"] div[aria-label]')) { console.log(i.toString() + ': ' + d.ariaLabel); i++; }   
        output[lang] = {
            # 所有人
            'public': driver.find_elements_by_css_selector('div[data-pagelet="ProfileTimeline"] img')[0].get_attribute('alt'), 
            # 分享對象：所有人
            'sharePublic': driver.find_elements_by_css_selector('div[data-pagelet="ProfileTimeline"] i[aria-label]')[0].get_attribute('aria-label'),
            # 查看更多
            'seeMore': driver.find_elements_by_css_selector('div[data-pagelet="ProfileTimeline"] div[style="text-align: start;"] div[role="button"]')[0].get_attribute('innerHTML'),
            # 編輯隱私設定
            'editPrivacy': driver.find_elements_by_css_selector('div[data-pagelet="ProfileTimeline"] div[aria-label]')[0].get_attribute('aria-label')
        }
        print(output[lang])

        with open(STATE_FILE, 'w') as f:
            json.dump(output, f, ensure_ascii=False)

        wait()

except Exception as e:
    print(f'failed to run all langs due to {e}')
    sys.exit(1)
    
# gen i18n here
with open('output', 'w') as f:
    def gen_field(f, key):
        f.write(key + ': { \n')
        for lang, texts in output.items():
            f.write(f'"{lang}": "{texts[key]}", \n')
        f.write('}, \n\n')

    for key in ['public', 'sharePublic', 'seeMore', 'editPrivacy']:
        gen_field(f, key)

driver.close()

print('done')
