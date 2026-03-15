"""
实验 1-2：创建第一个 Agent

目标：10 行代码创建能使用工具的 AI 助手
"""

from langchain.agents import create_agent


# 定义工具函数
def get_weather(city: str) -> str:
    """
    获取指定城市的天气信息
    
    Args:
        city: 城市名称，如"北京"、"上海"
    
    Returns:
        天气描述字符串
    """
    # 这里是模拟数据，实际可以调用天气 API
    weather_data = {
        "北京": "晴朗，温度 25°C，湿度 40%",
        "上海": "多云，温度 22°C，湿度 65%",
        "广州": "小雨，温度 28°C，湿度 80%",
        "深圳": "晴朗，温度 30°C，湿度 70%",
    }
    return weather_data.get(city, f"{city} 天气数据暂不可用")


def get_time() -> str:
    """
    获取当前时间
    
    Returns:
        当前时间字符串
    """
    from datetime import datetime
    now = datetime.now()
    return now.strftime("%Y 年%m 月%d 日 %H:%M:%S")


def calculate(expression: str) -> str:
    """
    计算数学表达式
    
    Args:
        expression: 数学表达式，如"2+2"、"10*5"
    
    Returns:
        计算结果
    """
    try:
        # 安全的表达式求值
        result = eval(expression, {"__builtins__": {}}, {})
        return f"{expression} = {result}"
    except Exception as e:
        return f"计算错误：{e}"


# 创建 Agent
def create_my_agent():
    """
    创建一个包含多个工具的 Agent
    """
    agent = create_agent(
        model="claude-sonnet-4-5-20260128",  # 或 "gpt-4o" 等
        tools=[get_weather, get_time, calculate],
        system_prompt="""你是一个有帮助的助手，可以：
1. 查询天气（使用 get_weather 工具）
2. 告诉用户当前时间（使用 get_time 工具）
3. 进行数学计算（使用 calculate 工具）

请用友好、简洁的方式回答用户问题。
如果需要使用工具，请正确调用。""",
    )
    return agent


# 测试 Agent
def test_agent():
    """
    测试 Agent 的各种能力
    """
    print("=" * 60)
    print("LangChain 学习 - 实验 1-2：创建第一个 Agent")
    print("=" * 60)
    
    try:
        agent = create_my_agent()
        
        # 测试问题列表
        test_questions = [
            "北京今天天气怎么样？",
            "现在几点了？",
            "帮我算一下 123 * 456 等于多少",
            "上海和广州的天气哪个更好？",
        ]
        
        for question in test_questions:
            print(f"\n📝 问题：{question}")
            print("-" * 60)
            
            result = agent.invoke({
                "messages": [{"role": "user", "content": question}]
            })
            
            # 提取回复
            if hasattr(result, 'get') and 'messages' in result:
                messages = result['messages']
                # 获取最后一条 AI 消息
                for msg in reversed(messages):
                    if hasattr(msg, 'role') and msg.role == 'ai':
                        print(f"🤖 回复：{msg.content}")
                        break
            else:
                print(f"🤖 回复：{result}")
            
            print()
            
    except Exception as e:
        print(f"需要设置 API KEY 环境变量")
        print(f"错误：{e}")
        print("\n请设置以下环境变量之一：")
        print("  - ANTHROPIC_API_KEY (使用 Claude)")
        print("  - OPENAI_API_KEY (使用 GPT)")


if __name__ == "__main__":
    test_agent()
    
    print("\n" + "=" * 60)
    print("实验完成！")
    print("=" * 60)
    print("""
关键收获：
1. 使用 create_agent 只需几行代码创建 Agent
2. 定义 Python 函数即可作为工具供 Agent 使用
3. Agent 会自动决定何时调用哪个工具
4. system_prompt 可以指导 Agent 的行为风格

下一步：
- 尝试添加更多工具
- 修改 system_prompt 改变 Agent 人设
- 使用真实的 API（天气、新闻等）
    """)
