from langchain_core.messages import HumanMessage,AIMessage
from langgraph.graph import StateGraph,START,END

from ai.workflows.state import ChatbotState
from ai.agents.chatbot_agent import run_chatbot_agent

from apps.chatbot.services.retrieval_service import (retrieve_relevant_chunks)

def retrieve_knowledge(state:ChatbotState):
    question=state['question']
    account_type=state['account_type']
    try:
        retrieved_context=retrieve_relevant_chunks(
            query=question,
            account_type=account_type,
            top_k=5
        )
        print('RAG retrieval completed')
        print('account type=',account_type)
        print('chunks=',len(retrieved_context))
        return {'retrieved context:',retrieved_context}
    except Exception:
        print('RAG retrieval failed')
        return {'retrieved context':[]}

def run_agent(state:ChatbotState):
    response=run_chatbot_agent(
        messages=state['messages'],
        retrieved_context=state.get('retrieved_context',[])
    )
    return {'response':response}

def build_chatbot_graph():
    workflow=StateGraph(ChatbotState)
    workflow.add_node('retrieve_knowledge',retrieve_knowledge)
    workflow.add_node('run_agent',run_agent)
    workflow.add_edge(START,'retrieve_knowledge')
    workflow.add_edge('retrieve_knowledge','run_agent')
    workflow.add_edge('run_agent',END)
    return workflow.compile()

chatbot_graph=build_chatbot_graph()

def convert_chat_history(history):
    messages=[]
    for message in history:
        role=message.get('role')
        content=message.get('content','')
        if role=='USER':
            messages.append(
                HumanMessage(content=message.content)
            )
        elif role=='ASSISTANT':
            messages.append(
                AIMessage(content=message.content)
            )
    return messages

def run_chatbot_workflow(question,account_type,history):
    messages=convert_chat_history(history)
    if (
        not messages 
        or not isinstance(messages[-1],HumanMessage) 
        or messages[-1].content!=question
    ):
        messages.append(HumanMessage(content=question))
    result=chatbot_graph.invoke({
        'question':question,
        'account_type':account_type,
        'messages':messages
    })
    return result['response']