from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from utils.db import DB
import os

from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage
class ModifiableEntryFields(BaseModel):
  title: str | None = Field(description="The title", max_length=100)
  body: str | None = Field(description="The content", max_length=590)

class Entry(ModifiableEntryFields):
  id: int
  timestamp: datetime
  title: str
  body: str

app = FastAPI()
Database = DB()

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

@app.get("/blogs")
async def root():
  return { "data": Database.fetchAllEntries() }

@app.get("/blogs/mock")
def mock_blog():

  model = init_chat_model("llama3-8b-8192", model_provider="groq")
  messages = [
      SystemMessage("""
        Write a blog entry with title and body. You may choose the topic at random, and the blog should include a catchy title and an informative, engaging body that covers the following aspects:
        A brief introduction to the topic.
        A few key points or subtopics related to the main topic.
        An informative section with relevant details, examples, or anecdotes.
        A conclusion that ties everything together and encourages further engagement or thought.
      """),
  ]
  blogEntryResponse = model.invoke(messages)

  structuredModel = model.with_structured_output(ModifiableEntryFields)
  response = structuredModel.invoke([
    SystemMessage("Extract title and body from the following string"),
    HumanMessage(blogEntryResponse.content)
  ])

  return { "data": response }

@app.get("/blogs/{entry_id}")
async def detail(entry_id: int):
  return { "data": Database.fetch("SELECT * FROM entries WHERE id = %s", [entry_id]) }

@app.post("/blogs")
async def create(entry: ModifiableEntryFields):
  Database.upsert("INSERT INTO entries (title, body) VALUES (%s, %s)", [(entry.title, entry.body,)])
  return { "data": Database.fetchAllEntries() }

@app.put("/blogs/{entry_id}")
async def update(entry: ModifiableEntryFields, entry_id: int):
  updates = {}
  if entry.body:
    updates["body"] = entry.body
  if entry.title:
    updates["title"] = entry.title
  
  Database.upsert(f"UPDATE entries SET {', '.join(f'{column_name} = %s' for column_name in list(updates.keys()))} WHERE id = %s", [tuple([*list(updates.values()), entry_id])])

  return { "data": Database.fetch("SELECT * FROM entries WHERE id = %s", [entry_id]) }

@app.get("/summarize/{entry_id}")
def summarize(entry_id: int):
  entry = Database.fetch("SELECT * FROM entries WHERE id = %s", [entry_id])[0]
  entry_body = entry[2]

  model = init_chat_model("llama3-8b-8192", model_provider="groq")
  messages = [
      SystemMessage("Provide a brief description of the following text"),
      HumanMessage(entry_body),
  ]
  response = model.invoke(messages)

  return { "data": response.text() }
