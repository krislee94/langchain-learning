"""
实验 1-1：比较不同模型提供商

目标：理解 LangChain 统一模型接口的价值
"""

# 方法 1：使用 Anthropic Claude
def demo_anthropic():
    print("=" * 50)
    print("Anthropic Claude 示例")
    print("=" * 50)
    
    try:
        from langchain_anthropic import ChatAnthropic
        from langchain_core.messages import HumanMessage
        
        model = ChatAnthropic(
            model="claude-sonnet-4-5-20260128",
            temperature=0.7,
            max_tokens=1024,
        )
        
        response = model.invoke([
            HumanMessage(content="用一句话介绍你自己")
        ])
        
        print(f"Claude 回复：{response.content}")
        
    except Exception as e:
        print(f"需要设置 ANTHROPIC_API_KEY 环境变量")
        print(f"错误：{e}")


# 方法 2：使用 OpenAI GPT
def demo_openai():
    print("\n" + "=" * 50)
    print("OpenAI GPT 示例")
    print("=" * 50)
    
    try:
        from langchain_openai import ChatOpenAI
        from langchain_core.messages import HumanMessage
        
        model = ChatOpenAI(
            model="gpt-4o",
            temperature=0.7,
        )
        
        response = model.invoke([
            HumanMessage(content="用一句话介绍你自己")
        ])
        
        print(f"GPT 回复：{response.content}")
        
    except Exception as e:
        print(f"需要设置 OPENAI_API_KEY 环境变量")
        print(f"错误：{e}")


# 方法 3：使用 Google Gemini
def demo_google():
    print("\n" + "=" * 50)
    print("Google Gemini 示例")
    print("=" * 50)
    
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.messages import HumanMessage
        
        model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.7,
        )
        
        response = model.invoke([
            HumanMessage(content="用一句话介绍你自己")
        ])
        
        print(f"Gemini 回复：{response.content}")
        
    except Exception as e:
        print(f"需要设置 GOOGLE_API_KEY 环境变量")
        print(f"错误：{e}")


# 关键洞察：统一的接口
def demo_unified_interface():
    """
    展示 LangChain 的核心价值：统一的模型接口
    
    无论使用哪个提供商，代码结构完全相同：
    1. 导入对应的模型类
    2. 实例化模型（传入 model 名称和参数）
    3. 调用 invoke 方法（传入消息列表）
    4. 从 response.content 获取回复
    """
    print("\n" + "=" * 50)
    print("统一接口演示")
    print("=" * 50)
    
    print("""
LangChain 的核心价值之一：标准化接口

所有模型都遵循相同的模式：

    from langchain_xxx import ChatXXX
    model = ChatXXX(model="xxx", temperature=0.7)
    response = model.invoke([HumanMessage("你好")])
    print(response.content)

切换模型只需改一行代码！
    """)


if __name__ == "__main__":
    print("LangChain 学习 - 实验 1-1：比较不同模型")
    print("本实验展示 LangChain 统一模型接口的价值\n")
    
    # 运行演示（需要对应的 API KEY）
    demo_anthropic()
    demo_openai()
    demo_google()
    demo_unified_interface()
    
    print("\n" + "=" * 50)
    print("实验完成！")
    print("=" * 50)
    print("""
关键收获：
1. LangChain 为不同 LLM 提供商提供统一接口
2. 切换模型只需更改导入和实例化代码
3. 消息格式和调用方式保持一致
4. 避免供应商锁定，便于测试和比较
    """)
