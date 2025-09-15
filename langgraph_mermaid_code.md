# LangGraph 工作流程 - Mermaid 图表代码

## 🔄 主要工作流程图

```mermaid
graph TD
    Start([🚀 START<br/>用户输入]) --> UserInput[📝 添加用户消息<br/>HumanMessage]
    UserInput --> AnalyzeIntent[🧠 analyze_intent<br/>意图分析]
    
    AnalyzeIntent --> IntentCheck{检查消息类型}
    IntentCheck -->|包含问候语| Greeting[😊 意图: greeting]
    IntentCheck -->|包含告别语| Farewell[👋 意图: farewell] 
    IntentCheck -->|包含问号| Question[❓ 意图: question]
    IntentCheck -->|其他| General[💬 意图: general_question]
    
    Greeting --> UpdateIntent[📝 更新 user_intent]
    Farewell --> UpdateIntent
    Question --> UpdateIntent
    General --> UpdateIntent
    
    UpdateIntent --> GenerateResponse[💬 generate_response<br/>生成回复]
    GenerateResponse --> LLMCall[🤖 调用 ChatOpenAI<br/>GPT-3.5-turbo]
    LLMCall --> AddAIMessage[📝 添加 AI 消息<br/>AIMessage]
    
    AddAIMessage --> SaveConv[💾 save_conversation<br/>保存对话]
    SaveConv --> FormatConv[📝 格式化对话条目<br/>用户: xxx<br/>AI: xxx]
    FormatConv --> UpdateHistory[📚 更新对话历史]
    
    UpdateHistory --> Checkpoint[💾 检查点保存<br/>MemorySaver]
    Checkpoint --> End([🏁 END<br/>返回回复])
    
    %% 样式定义
    classDef startEnd fill:#e8f5e8,stroke:#27ae60,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef intent fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    classDef update fill:#fce4ec,stroke:#e91e63,stroke-width:2px
    
    class Start,End startEnd
    class AnalyzeIntent,GenerateResponse,SaveConv,LLMCall,AddAIMessage,FormatConv process
    class IntentCheck decision
    class Greeting,Farewell,Question,General intent
    class UserInput,UpdateIntent,UpdateHistory,Checkpoint update
```

## 📊 状态变化流程图

```mermaid
graph LR
    InitState[📋 初始状态<br/>messages: []<br/>user_intent: ''<br/>current_step: 'start'] 
    
    InitState --> AddMsg[📝 添加用户消息<br/>messages: [HumanMessage]]
    AddMsg --> IntentState[🧠 意图分析完成<br/>user_intent: 'greeting'<br/>current_step: 'intent_analyzed']
    IntentState --> ResponseState[💬 回复生成完成<br/>messages: [Human, AI]<br/>current_step: 'response_generated']
    ResponseState --> SaveState[💾 对话保存完成<br/>conversation_history: [...]<br/>current_step: 'conversation_saved']
    
    %% 样式定义
    classDef stateBox fill:#f0f8ff,stroke:#4682b4,stroke-width:2px
    class InitState,AddMsg,IntentState,ResponseState,SaveState stateBox
```

## ⚡ 执行时序图

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant Chat as 🤖 聊天机器人
    participant Intent as 🧠 意图分析
    participant LLM as 🤖 GPT-3.5
    participant Memory as 💾 内存保存
    
    User->>+Chat: chat_sync("你好")
    Chat->>+Intent: 分析意图("你好")
    Intent-->>-Chat: intent="greeting"
    Chat->>+LLM: 生成回复("你好")
    LLM-->>-Chat: "你好！我是AI助手..."
    Chat->>+Memory: 保存对话历史
    Memory-->>-Chat: 保存完成
    Chat-->>-User: "你好！我是AI助手..."
```

## 🏗️ 简化架构图

```mermaid
graph TB
    subgraph "LangGraph 聊天机器人"
        A[用户输入] --> B[意图分析]
        B --> C[生成回复]
        C --> D[保存对话]
        D --> E[返回结果]
    end
    
    subgraph "状态管理"
        F[GraphState]
        G[MemorySaver]
        H[CheckPoint]
    end
    
    subgraph "外部服务"
        I[OpenAI API]
        J[GPT-3.5-turbo]
    end
    
    B -.-> F
    C -.-> I
    C -.-> J
    D -.-> G
    D -.-> H
```

## 🔧 组件关系图

```mermaid
classDiagram
    class GraphState {
        +List~BaseMessage~ messages
        +str user_intent
        +str current_step
        +List~str~ conversation_history
    }
    
    class LangGraphChatBot {
        +ChatOpenAI llm
        +MemorySaver checkpointer
        +StateGraph graph
        +chat_sync(input) str
        +chat(input) str
        -_analyze_intent(state) Dict
        -_generate_response(state) Dict
        -_save_conversation(state) Dict
    }
    
    class StateGraph {
        +add_node(name, func)
        +add_edge(from, to)
        +set_entry_point(node)
        +compile() CompiledGraph
    }
    
    class MemorySaver {
        +get_state(config)
        +put_state(config, state)
    }
    
    LangGraphChatBot --> GraphState
    LangGraphChatBot --> StateGraph
    LangGraphChatBot --> MemorySaver
    StateGraph --> GraphState
```

## 📋 使用方法

### 在 Markdown 文档中使用
直接复制上面的代码块到您的 Markdown 文件中，支持 Mermaid 的平台会自动渲染。

### 在在线工具中使用
- [Mermaid Live Editor](https://mermaid.live/)
- [GitHub](https://github.com) (支持在 README.md 中渲染)
- [GitLab](https://gitlab.com) (支持在文档中渲染)
- [Notion](https://notion.so) (通过 Mermaid 块)

### 在代码编辑器中使用
- VS Code: 安装 "Mermaid Preview" 插件
- Typora: 内置支持
- Obsidian: 内置支持
