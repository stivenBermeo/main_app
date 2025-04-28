from datetime import datetime
from pydantic import BaseModel, Field

class ModifiableEntryFields(BaseModel):
  title: str | None = Field(description="The title", max_length=100)
  body: str | None = Field(description="The content", max_length=590)

class Entry(ModifiableEntryFields):
  id: int
  timestamp: datetime
  title: str
  body: str