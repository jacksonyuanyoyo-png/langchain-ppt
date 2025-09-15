#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LangGraph 入门代码示例
这个示例展示了如何使用 LangGraph 创建一个简单的对话流程图

依赖安装:
pip install langgraph langchain-openai python-dotenv
"""

import os
from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
import asyncio


class GraphState(BaseModel):
    """图的状态定义"""
    messages: List[BaseMessage] = []
    user_intent: str = ""
    current_step: str = "start"
    conversation_history: List[str] = []


class LangGraphChatBot:
    """LangGraph 聊天机器人示例类"""
    
    def __init__(self, api_key: str = None):
        """
        初始化聊天机器人
        
        Args:
            api_key: OpenAI API 密钥，如果不提供会从环境变量读取
        """
        if api_key:
            os.environ["OPENAI_API_KEY"] = api_key
        
        # 初始化语言模型
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.7
        )
        
        # 创建提示模板
        self.system_prompt = ChatPromptTemplate.from_messages([
            ("system", "你是一个友好的AI助手。请根据用户的问题提供有帮助的回答。"),
            ("human", "{input}")
        ])
        
        # 初始化图和检查点保存器
        self.checkpointer = MemorySaver()
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """构建LangGraph工作流图"""
        
        # 创建状态图
        workflow = StateGraph(GraphState)
        
        # 添加节点
        workflow.add_node("analyze_intent", self._analyze_intent)
        workflow.add_node("generate_response", self._generate_response)
        workflow.add_node("save_conversation", self._save_conversation)
        
        # 设置入口点
        workflow.set_entry_point("analyze_intent")
        
        # 添加边（定义节点之间的转换）
        workflow.add_edge("analyze_intent", "generate_response")
        workflow.add_edge("generate_response", "save_conversation")
        workflow.add_edge("save_conversation", END)
        
        # 编译图
        return workflow.compile(checkpointer=self.checkpointer)
    
    def _analyze_intent(self, state: GraphState) -> Dict[str, Any]:
        """分析用户意图的节点"""
        if not state.messages:
            return {"current_step": "intent_analysis"}
        
        last_message = state.messages[-1]
        if isinstance(last_message, HumanMessage):
            user_input = last_message.content
            
            # 简单的意图分析逻辑
            intent = "general_question"
            if any(word in user_input.lower() for word in ["你好", "hello", "hi"]):
                intent = "greeting"
            elif any(word in user_input.lower() for word in ["再见", "bye", "goodbye"]):
                intent = "farewell"
            elif "?" in user_input or "？" in user_input:
                intent = "question"
            
            return {
                "user_intent": intent,
                "current_step": "intent_analyzed"
            }
        
        return {"current_step": "intent_analysis"}
    
    def _generate_response(self, state: GraphState) -> Dict[str, Any]:
        """生成回复的节点"""
        if not state.messages:
            return {"current_step": "response_generation"}
        
        last_message = state.messages[-1]
        if isinstance(last_message, HumanMessage):
            # 使用LLM生成回复
            prompt = self.system_prompt.format_messages(input=last_message.content)
            response = self.llm.invoke(prompt)
            
            # 添加AI回复到消息列表
            new_messages = state.messages + [AIMessage(content=response.content)]
            
            return {
                "messages": new_messages,
                "current_step": "response_generated"
            }
        
        return {"current_step": "response_generation"}
    
    def _save_conversation(self, state: GraphState) -> Dict[str, Any]:
        """保存对话历史的节点"""
        if len(state.messages) >= 2:
            last_human = None
            last_ai = None
            
            for msg in reversed(state.messages):
                if isinstance(msg, AIMessage) and last_ai is None:
                    last_ai = msg.content
                elif isinstance(msg, HumanMessage) and last_human is None:
                    last_human = msg.content
                
                if last_human and last_ai:
                    break
            
            if last_human and last_ai:
                conversation_entry = f"用户: {last_human}\nAI: {last_ai}"
                new_history = state.conversation_history + [conversation_entry]
                
                return {
                    "conversation_history": new_history,
                    "current_step": "conversation_saved"
                }
        
        return {"current_step": "save_conversation"}
    
    async def chat(self, user_input: str, thread_id: str = "default") -> str:
        """
        与聊天机器人对话
        
        Args:
            user_input: 用户输入
            thread_id: 对话线程ID，用于保持对话状态
            
        Returns:
            AI的回复
        """
        # 创建配置
        config = {"configurable": {"thread_id": thread_id}}
        
        # 获取当前状态
        current_state = await self.graph.aget_state(config)
        current_messages = current_state.values.get("messages", []) if current_state.values else []
        
        # 添加用户消息
        new_messages = current_messages + [HumanMessage(content=user_input)]
        
        # 运行图
        result = await self.graph.ainvoke(
            {"messages": new_messages},
            config=config
        )
        
        # 获取AI回复
        if result["messages"]:
            last_message = result["messages"][-1]
            if isinstance(last_message, AIMessage):
                return last_message.content
        
        return "抱歉，我无法理解您的问题。"
    
    def chat_sync(self, user_input: str, thread_id: str = "default") -> str:
        """
        同步版本的对话方法
        
        Args:
            user_input: 用户输入
            thread_id: 对话线程ID
            
        Returns:
            AI的回复
        """
        # 创建配置
        config = {"configurable": {"thread_id": thread_id}}
        
        # 获取当前状态
        current_state = self.graph.get_state(config)
        current_messages = current_state.values.get("messages", []) if current_state.values else []
        
        # 添加用户消息
        new_messages = current_messages + [HumanMessage(content=user_input)]
        
        # 运行图
        result = self.graph.invoke(
            {"messages": new_messages},
            config=config
        )
        
        # 获取AI回复
        if result["messages"]:
            last_message = result["messages"][-1]
            if isinstance(last_message, AIMessage):
                return last_message.content
        
        return "抱歉，我无法理解您的问题。"
    
    def get_conversation_history(self, thread_id: str = "default") -> List[str]:
        """获取对话历史"""
        config = {"configurable": {"thread_id": thread_id}}
        current_state = self.graph.get_state(config)
        return current_state.values.get("conversation_history", []) if current_state.values else []


def main():
    """主函数 - 演示如何使用LangGraph聊天机器人"""
    
    # 设置OpenAI API密钥（请替换为您的实际密钥）
    # os.environ["OPENAI_API_KEY"] = "your-api-key-here"
    
    print("=== LangGraph 聊天机器人示例 ===")
    print("注意：请确保设置了OPENAI_API_KEY环境变量")
    print("输入 'quit' 或 '退出' 来结束对话\n")
    
    try:
        # 创建聊天机器人实例
        chatbot = LangGraphChatBot()
        
        # 开始对话循环
        while True:
            user_input = input("用户: ").strip()
            
            if user_input.lower() in ['quit', 'exit', '退出', 'q']:
                print("再见！")
                break
            
            if not user_input:
                continue
            
            try:
                # 获取AI回复
                response = chatbot.chat_sync(user_input)
                print(f"AI助手: {response}\n")
                
            except Exception as e:
                print(f"发生错误: {e}\n")
    
    except KeyboardInterrupt:
        print("\n对话被中断。再见！")
    except Exception as e:
        print(f"初始化失败: {e}")
        print("请检查是否正确设置了OPENAI_API_KEY环境变量")


async def async_demo():
    """异步演示函数"""
    print("=== 异步 LangGraph 演示 ===")
    
    try:
        chatbot = LangGraphChatBot()
        
        # 演示多轮对话
        demo_inputs = [
            "你好！",
            "你能帮我解释一下什么是人工智能吗？",
            "谢谢你的解释。再见！"
        ]
        
        for user_input in demo_inputs:
            print(f"用户: {user_input}")
            response = await chatbot.chat(user_input)
            print(f"AI助手: {response}\n")
        
        # 显示对话历史
        history = chatbot.get_conversation_history()
        print("=== 对话历史 ===")
        for entry in history:
            print(entry)
            print("-" * 50)
            
    except Exception as e:
        print(f"异步演示失败: {e}")


if __name__ == "__main__":
    # 运行同步版本
    main()
    
    # 如果想要运行异步版本，取消下面的注释：
    # asyncio.run(async_demo())
