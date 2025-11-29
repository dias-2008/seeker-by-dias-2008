#!/usr/bin/env python3
import requests
import uuid
import sys
import re
import builtins


def downloadImageFromUrl(url, path):
    """
    Downloads an image from a given URL and saves it to the specified path 
    with a unique filename.
    """
    if not url.startswith('http'):
        return None
    try:
        img_data = requests.get(url, timeout=10).content
    except requests.exceptions.RequestException as e:
        # Handle exceptions like timeout, connection errors
        builtins.print(f"Error downloading image from {url}: {e}")
        return None
        
    fPath = path + '/' + str(uuid.uuid1()) + '.jpg'
    with open(fPath, 'wb') as handler:
        handler.write(img_data)
    return fPath


def print(ftext, **args):
    """
    Custom print function to remove terminal color codes when output is redirected.
    """
    # Check if standard output is a TTY (interactive terminal)
    if sys.stdout.isatty():
        builtins.print(ftext, flush=True, **args)
    else:
        # Remove ANSI escape codes (color codes) for non-interactive output
        cleaned_text = re.sub(r'\33\[\d+m', '', ftext)
        builtins.print(cleaned_text, flush=True, **args)