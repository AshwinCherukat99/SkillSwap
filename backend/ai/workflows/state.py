from typing import TypedDict,Literal

class ChatbotState(TypedDict,total=False):
    question:str
    account_type:Literal['USER','MENTOR']
    messages:list
    retrieved_context:list
    response:str