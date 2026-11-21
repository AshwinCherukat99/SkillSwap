from typing import TypedDict,Literal

class ChatbotState(TypedDict,total=False):
    question:str
    account_type:Literal['USER','MENTOR']
    history:list
    intent:str
    retrieved_context:list
    tool_results:list
    response:str