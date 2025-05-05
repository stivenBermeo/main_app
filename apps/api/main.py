import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.journal_controller import JournalController 
from models.entry import ModifiableEntryFields

app = FastAPI()

origins = [
  os.environ["LOCAL_ORIGIN"],
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

journal_controller = JournalController()

@app.get("/blogs")
async def root():
  return await journal_controller.index()

@app.get("/blogs/mock")
def mock_blog_entry():
  return journal_controller.mock_blog_entry()

@app.get("/blogs/{entry_id}")
async def detail(entry_id: int):
  return await journal_controller.show(entry_id)

@app.post("/blogs")
async def create(entry: ModifiableEntryFields):
  return await journal_controller.store(entry)

@app.put("/blogs/{entry_id}")
async def update(entry: ModifiableEntryFields, entry_id: int):
  return await journal_controller.update(entry, entry_id)

@app.get("/summarize/{entry_id}")
def summarize_entry(entry_id: int):
  return journal_controller.summarize_entry(entry_id)
