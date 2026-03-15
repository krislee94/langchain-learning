"""
实验 2-2：创建自定义工具

学习如何定义和使用 LangChain 工具
"""

from langchain_core.tools import tool
from pydantic import BaseModel, Field


# 方法 1：使用@tool 装饰器（最简单）
@tool
def add(a: int, b: int) -> int:
    """两个数相加"""
    return a + b


@tool
def multiply(a: int, b: int) -> int:
    """两个数相乘"""
    return a * b


# 方法 2：带详细描述的装饰器
@tool("calculate_area")
def calculate_area(length: float, width: float) -> str:
    """
    计算矩形面积
    
    Args:
        length: 长度（米）
        width: 宽度（米）
    
    Returns:
        面积描述字符串
    """
    area = length * width
    return f"面积：{length}m × {width}m = {area}m²"


# 方法 3：使用 Pydantic 定义参数 schema
class SearchArgs(BaseModel):
    """搜索参数"""
    query: str = Field(description="搜索关键词")
    limit: int = Field(default=5, description="返回结果数量，最大 10")


@tool(args_schema=SearchArgs)
def search_info(query: str, limit: int = 5) -> str:
    """搜索信息"""
    # 模拟搜索
    return f"搜索结果（前{limit}条）关于'{query}'"


# 方法 4：直接创建 Tool 对象
from langchain_core.tools import StructuredTool

def greet(name: str, greeting: str = "你好") -> str:
    """打招呼"""
    return f"{greeting}, {name}!"


greet_tool = StructuredTool.from_function(
    func=greet,
    name="greet_person",
    description="向某人打招呼",
)


def demo_tool_inspection():
    """检查工具属性"""
    print("=" * 60)
    print("工具属性检查")
    print("=" * 60)
    
    tools = [add, multiply, calculate_area, search_info, greet_tool]
    
    for tool_func in tools:
        print(f"\n工具：{tool_func.name}")
        print(f"  描述：{tool_func.description}")
        print(f"  参数 schema: {tool_func.args_schema}")


def demo_tool_execution():
    """演示工具执行"""
    print("\n" + "=" * 60)
    print("工具执行演示")
    print("=" * 60)
    
    # 直接调用
    print(f"\nadd(3, 5) = {add.invoke({'a': 3, 'b': 5})}")
    print(f"multiply(4, 7) = {multiply.invoke({'a': 4, 'b': 7})}")
    print(f"calculate_area(10, 5) = {calculate_area.invoke({'length': 10, 'width': 5})}")
    print(f"search_info('AI') = {search_info.invoke({'query': 'AI', 'limit': 3})}")
    print(f"greet_tool('张三') = {greet_tool.invoke({'name': '张三'})}")


def demo_tool_in_agent():
    """演示在 Agent 中使用工具"""
    print("\n" + "=" * 60)
    print("在 Agent 中使用工具")
    print("=" * 60)
    
    try:
        from langchain.agents import create_agent
        
        agent = create_agent(
            model="claude-sonnet-4-5",
            tools=[add, multiply, calculate_area],
            system_prompt="你是数学助手，可以帮助计算。",
        )
        
        # 测试
        result = agent.invoke({
            "messages": [{"role": "user", "content": "3 加 5 等于多少？"}]
        })
        
        print(f"\n问题：3 加 5 等于多少？")
        print(f"回复：{result['messages'][-1].content}")
        
    except Exception as e:
        print(f"需要设置 API KEY: {e}")


if __name__ == "__main__":
    print("LangChain 学习 - 实验 2-2：创建自定义工具\n")
    
    demo_tool_inspection()
    demo_tool_execution()
    demo_tool_in_agent()
    
    print("\n" + "=" * 60)
    print("关键收获:")
    print("=" * 60)
    print("""
1. 使用@tool 装饰器快速创建工具

2. 工具需要：
   - 名称（自动从函数名获取）
   - 描述（从 docstring 获取）
   - 参数 schema（从类型注解获取）

3. 可以使用 Pydantic 自定义参数 schema

4. 工具可以直接调用或通过 Agent 调用
    """)
