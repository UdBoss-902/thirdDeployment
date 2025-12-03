#!/usr/bin/env python3
"""
UDBOSS Task Automator - CLI Productivity Engine
Author: Samuel David
Description: Add, view, and mark tasks as done. Stores tasks in local JSON DB.
"""

import json
import os
from pathlib import Path
from datetime import datetime

# File path for JSON DB
DB_FILE = Path.home() / 'udboss_tasks.json'

# Ensure DB exists
if not DB_FILE.exists():
    with open(DB_FILE, 'w') as f:
        json.dump([], f)

# Terminal colors
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def load_tasks():
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def save_tasks(tasks):
    with open(DB_FILE, 'w') as f:
        json.dump(tasks, f, indent=4)

def add_task():
    task = input('Enter task description: ').strip()
    if not task:
        print(f"{Colors.WARNING}Task cannot be empty.{Colors.ENDC}")
        return
    tasks = load_tasks()
    tasks.append({
        'description': task,
        'done': False,
        'created': datetime.now().isoformat()
    })
    save_tasks(tasks)
    print(f"{Colors.OKGREEN}Task added successfully!{Colors.ENDC}")

def list_tasks():
    tasks = load_tasks()
    if not tasks:
        print(f"{Colors.WARNING}No tasks found.{Colors.ENDC}")
        return
    print(f"{Colors.BOLD}UDBOSS TASK LIST:{Colors.ENDC}")
    for i, t in enumerate(tasks, 1):
        status = f"{Colors.OKGREEN}✔ Done{Colors.ENDC}" if t['done'] else f"{Colors.FAIL}✖ Pending{Colors.ENDC}"
        print(f"{i}. {t['description']} [{status}]")

def mark_done():
    tasks = load_tasks()
    if not tasks:
        print(f"{Colors.WARNING}No tasks to mark.{Colors.ENDC}")
        return
    list_tasks()
    try:
        idx = int(input('Enter task number to mark as done: ')) - 1
        if 0 <= idx < len(tasks):
            tasks[idx]['done'] = True
            save_tasks(tasks)
            print(f"{Colors.OKGREEN}Task marked as done!{Colors.ENDC}")
        else:
            print(f"{Colors.FAIL}Invalid task number.{Colors.ENDC}")
    except ValueError:
        print(f"{Colors.FAIL}Invalid input.{Colors.ENDC}")

def main():
    while True:
        print('\n--- UDBOSS TASK AUTOMATOR ---')
        print('1. Add Task')
        print('2. List Tasks')
        print('3. Mark Task Done')
        print('4. Exit')
        choice = input('Choose an option: ').strip()
        if choice == '1':
            add_task()
        elif choice == '2':
            list_tasks()
        elif choice == '3':
            mark_done()
        elif choice == '4':
            print(f"{Colors.OKCYAN}Goodbye!{Colors.ENDC}")
            break
        else:
            print(f"{Colors.WARNING}Invalid choice, try again.{Colors.ENDC}")

if __name__ == '__main__':
    main()