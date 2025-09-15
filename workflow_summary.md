# 🔄 LangGraph 工作流程总览

## 📋 工作流架构

```
用户输入 → [analyze_intent] → [generate_response] → [save_conversation] → 结束
```

## 🔍 详细流程

### 1. 🚀 **START** (入口点)
- **触发**: 用户调用 `chat()` 或 `chat_sync()`
- **输入**: 用户消息 (HumanMessage)
- **状态初始化**: 将用户消息添加到 `state.messages`

### 2. 🧠 **analyze_intent** (意图分析)
- **功能**: 分析用户输入的意图类型
- **逻辑**:
  - 问候语检测: "你好", "hello", "hi" → `greeting`
  - 告别语检测: "再见", "bye", "goodbye" → `farewell`  
  - 问题检测: 包含 "?" 或 "？" → `question`
  - 默认分类: `general_question`
- **输出状态**:
  - `state.user_intent` = 意图类型
  - `state.current_step` = "intent_analyzed"

### 3. 💬 **generate_response** (回复生成)
- **功能**: 使用 LLM 生成智能回复
- **技术栈**:
  - 模型: ChatOpenAI (GPT-3.5-turbo)
  - 温度: 0.7 (平衡创造性和准确性)
  - 提示模板: 系统角色 + 用户输入
- **处理流程**:
  1. 格式化提示消息
  2. 调用 LLM API
  3. 获取回复内容
  4. 创建 AIMessage 对象
- **输出状态**:
  - `state.messages` += [AIMessage(content=回复内容)]
  - `state.current_step` = "response_generated"

### 4. 💾 **save_conversation** (对话保存)
- **功能**: 持久化对话历史
- **处理逻辑**:
  1. 从消息列表中提取最近的用户和AI消息
  2. 格式化为对话条目: "用户: xxx\nAI: xxx"
  3. 添加到对话历史列表
- **输出状态**:
  - `state.conversation_history` += [格式化对话]
  - `state.current_step` = "conversation_saved"

### 5. 🏁 **END** (结束)
- **输出**: 完整的状态对象
- **返回**: AI 生成的回复内容
- **持久化**: 通过 MemorySaver 自动保存所有状态

## 📊 状态管理

### GraphState 结构
```python
class GraphState(BaseModel):
    messages: List[BaseMessage] = []          # 对话消息列表
    user_intent: str = ""                     # 用户意图分类
    current_step: str = "start"               # 当前处理步骤
    conversation_history: List[str] = []      # 对话历史记录
```

### 检查点功能
- **MemorySaver**: 在每个节点执行后自动保存状态
- **thread_id**: 支持多个独立的对话线程
- **状态恢复**: 可以在任意点恢复对话状态

## 🔄 数据流动

```
输入: HumanMessage("你好")
  ↓
状态更新: state.messages = [HumanMessage("你好")]
  ↓
意图分析: state.user_intent = "greeting"
  ↓
LLM调用: 生成回复 "你好！我是AI助手..."
  ↓
状态更新: state.messages = [HumanMessage("你好"), AIMessage("你好！我是AI助手...")]
  ↓
历史保存: state.conversation_history = ["用户: 你好\nAI: 你好！我是AI助手..."]
  ↓
输出: "你好！我是AI助手..."
```

## ⚡ 核心特性

1. **模块化设计**: 每个功能封装为独立节点
2. **状态持久化**: 自动保存和恢复对话状态
3. **并发支持**: 多线程安全的对话管理
4. **错误处理**: 完善的异常处理机制
5. **扩展性**: 易于添加新节点和功能

## 🛠️ 使用方式

### 同步调用
```python
chatbot = LangGraphChatBot()
response = chatbot.chat_sync("你好")
print(response)  # "你好！我是AI助手..."
```

### 异步调用
```python
chatbot = LangGraphChatBot()
response = await chatbot.chat("你好")
print(response)  # "你好！我是AI助手..."
```

### 多线程对话
```python
# 线程1
response1 = chatbot.chat_sync("你好", thread_id="user_1")

# 线程2  
response2 = chatbot.chat_sync("Hello", thread_id="user_2")
```
