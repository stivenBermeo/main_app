from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage

from utils.db import DB
from models.entry import ModifiableEntryFields, MockEntryModel


Database = DB()
class JournalController():
  async def index(self):
    return { "data": Database.fetchAllEntries() }

  async def show(self, entry_id: int):
    return { "data": Database.fetch("SELECT * FROM entries WHERE id = %s", [entry_id]) }
  
  async def store(self, entry: ModifiableEntryFields):
    Database.upsert("INSERT INTO entries (title, body) VALUES (%s, %s)", [(entry.title, entry.body,)])
    return { "data": Database.fetchAllEntries() }
  
  async def update(self, entry: ModifiableEntryFields, entry_id: int):
    updates = {}
    if entry.body:
      updates["body"] = entry.body
    if entry.title:
      updates["title"] = entry.title
    
    Database.upsert(f"UPDATE entries SET {', '.join(f'{column_name} = %s' for column_name in list(updates.keys()))} WHERE id = %s", [tuple([*list(updates.values()), entry_id])])

    return { "data": Database.fetch("SELECT * FROM entries WHERE id = %s", [entry_id]) }
  
  def mock_blog_entry(self):

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

    structuredModel = model.with_structured_output(MockEntryModel)
    response = structuredModel.invoke([
      SystemMessage("Extract title and body from the following string"),
      HumanMessage(blogEntryResponse.content)
    ])

    return { "data": response }

  def summarize_entry(self, entry_id: int):
    entry = Database.fetch("SELECT * FROM entries WHERE id = %s", [entry_id])[0]
    entry_body = entry["body"]

    model = init_chat_model("llama3-8b-8192", model_provider="groq")
    messages = [
        SystemMessage("Provide a brief description of the following text"),
        HumanMessage(entry_body),
    ]
    response = model.invoke(messages)

    return { "data": response.text() }