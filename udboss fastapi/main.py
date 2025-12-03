from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from pathlib import Path
import json

app = FastAPI(title="UDBOSS Task API", description="Demo Task API by Samuel David")

# JSON file to store tasks
DB_FILE = Path("udboss_tasks.json")
if not DB_FILE.exists():
    with open(DB_FILE, "w") as f:
        json.dump([], f)

class Task(BaseModel):
    description: str
    done: bool = False

def load_tasks():
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_tasks(tasks):
    with open(DB_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return load_tasks()

@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    tasks = load_tasks()
    tasks.append(task.dict())
    save_tasks(tasks)
    return task

@app.put("/tasks/{task_index}", response_model=Task)
def mark_done(task_index: int):
    tasks = load_tasks()
    if task_index < 0 or task_index >= len(tasks):
        raise HTTPException(status_code=404, detail="Task not found")
    tasks[task_index]['done'] = True
    save_tasks(tasks)
    return tasks[task_index]

@app.delete("/tasks/{task_index}")
def delete_task(task_index: int):
    tasks = load_tasks()
    if task_index < 0 or task_index >= len(tasks):
        raise HTTPException(status_code=404, detail="Task not found")
    removed = tasks.pop(task_index)
    save_tasks(tasks)
    return {"removed": removed}
