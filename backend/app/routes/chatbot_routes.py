from fastapi import APIRouter
from app.services.chatbot_service import get_chatbot_response
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    
router = APIRouter()

@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    result = get_chatbot_response(request.message)
    return {"response": result}
