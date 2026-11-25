from typing import TypedDict,Literal,Any
from langchain_core.messages import BaseMessage

class ChatbotState(TypedDict,total=False):
    question:str
    account_type:Literal['USER','MENTOR']
    messages:list[BaseMessage]
    retrieved_context:list[dict[str,Any]]
    response:str