"""
实验 2-1：理解消息传递流程

展示消息如何在 LangChain 系统中流动
"""

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate


def demo_message_types():
    """演示不同类型的消息"""
    print("=" * 60)
    print("消息类型演示")
    print("=" * 60)
    
    # 系统消息
    system_msg = SystemMessage(content="你是一个有帮助的助手")
    print(f"\n系统消息:")
    print(f"  类型：{type(system_msg).__name__}")
    print(f"  内容：{system_msg.content}")
    
    # 用户消息
    human_msg = HumanMessage(content="你好，请帮我")
    print(f"\n用户消息:")
    print(f"  类型：{type(human_msg).__name__}")
    print(f"  内容：{human_msg.content}")
    
    # AI 消息
    ai_msg = AIMessage(content="当然，我很乐意帮助你！")
    print(f"\nAI 消息:")
    print(f"  类型：{type(ai_msg).__name__}")
    print(f"  内容：{ai_msg.content}")
    
    # 消息列表
    messages = [system_msg, human_msg, ai_msg]
    print(f"\n消息历史 ({len(messages)} 条):")
    for i, msg in enumerate(messages):
        print(f"  {i+1}. [{msg.__class__.__name__}] {msg.content[:30]}...")


def demo_prompt_template():
    """演示提示词模板如何格式化消息"""
    print("\n" + "=" * 60)
    print("提示词模板演示")
    print("=" * 60)
    
    # 创建模板
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是{role}，{style}"),
        ("human", "{question}"),
    ])
    
    # 格式化
    formatted = prompt.invoke({
        "role": "数学老师",
        "style": "擅长用简单例子解释概念",
        "question": "什么是微积分？"
    })
    
    print(f"\n格式化后的消息:")
    for msg in formatted.messages:
        print(f"  [{msg.__class__.__name__}] {msg.content}")


def demo_message_chain():
    """演示消息链的传递"""
    print("\n" + "=" * 60)
    print("消息链演示")
    print("=" * 60)
    
    # 模拟对话流程
    conversation_flow = """
    1. 用户输入 → HumanMessage
    2. HumanMessage + SystemMessage → 发送给 LLM
    3. LLM 回复 → AIMessage
    4. AIMessage 添加到历史
    5. 下一轮对话包含所有历史消息
    """
    print(conversation_flow)
    
    # 实际示例
    history = []
    
    # 第一轮
    history.append(HumanMessage(content="你好"))
    print(f"\n第一轮 - 发送：{history[-1].content}")
    
    # 模拟 AI 回复
    history.append(AIMessage(content="你好！有什么可以帮助你的？"))
    print(f"第一轮 - 接收：{history[-1].content}")
    
    # 第二轮
    history.append(HumanMessage(content="帮我计算 2+2"))
    print(f"\n第二轮 - 发送：{history[-1].content}")
    print(f"第二轮 - 历史消息数：{len(history)}")
    
    # 模拟 AI 回复
    history.append(AIMessage(content="2+2=4"))
    print(f"第二轮 - 接收：{history[-1].content}")


if __name__ == "__main__":
    print("LangChain 学习 - 实验 2-1：理解消息传递\n")
    
    demo_message_types()
    demo_prompt_template()
    demo_message_chain()
    
    print("\n" + "=" * 60)
    print("关键收获:")
    print("=" * 60)
    print("""
1. LangChain 使用统一的消息类型：
   - SystemMessage: 系统指令
   - HumanMessage: 用户输入
   - AIMessage: AI 回复

2. 所有模型都使用相同的消息格式

3. ChatPromptTemplate 可以动态生成消息

4. 消息历史按顺序传递给 LLM
    """)
