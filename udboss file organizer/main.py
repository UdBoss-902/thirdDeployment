#!/usr/bin/env python3
"""
UDBOSS File Organizer - Smart Folder Cleaner
Author: Samuel David
Description: Organizes files in a folder into categories (images, docs, zips, code, etc.)
"""

import os
import shutil
from pathlib import Path

# File categories
CATEGORIES = {
    'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
    'Documents': ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx'],
    'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
    'Audio': ['.mp3', '.wav', '.aac', '.flac'],
    'Video': ['.mp4', '.mkv', '.mov', '.avi'],
    'Code': ['.py', '.js', '.html', '.css', '.java', '.cpp', '.cs']
}

# Terminal colors
class Colors:
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'

def organize_folder(folder_path):
    folder = Path(folder_path)
    if not folder.exists():
        print(f"{Colors.FAIL}Folder does not exist.{Colors.ENDC}")
        return

    files = [f for f in folder.iterdir() if f.is_file()]
    if not files:
        print(f"{Colors.WARNING}No files found to organize.{Colors.ENDC}")
        return

    for file in files:
        moved = False
        for category, extensions in CATEGORIES.items():
            if file.suffix.lower() in extensions:
                dest_folder = folder / category
                dest_folder.mkdir(exist_ok=True)
                shutil.move(str(file), str(dest_folder / file.name))
                moved = True
                print(f"{Colors.OKGREEN}Moved {file.name} to {category}/{Colors.ENDC}")
                break
        if not moved:
            dest_folder = folder / 'Others'
            dest_folder.mkdir(exist_ok=True)
            shutil.move(str(file), str(dest_folder / file.name))
            print(f"{Colors.WARNING}Moved {file.name} to Others/{Colors.ENDC}")

    print(f"{Colors.OKGREEN}Folder organized successfully!{Colors.ENDC}")

if __name__ == '__main__':
    folder_input = input('Enter the path of the folder to organize: ').strip()
    organize_folder(folder_input)