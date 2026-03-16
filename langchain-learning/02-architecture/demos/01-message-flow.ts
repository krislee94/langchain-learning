/**
 * 实验 2-1：理解消息传递流程
 *
 * 展示消息如何在 LangChain 系统中流动
 *
 * 运行方式：
 *   npx tsx 02-architecture/demos/01-message-flow.ts
 */

import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';

// ============================================================================
// 演示函数
// ============================================================================

/**
 * 演示不同类型的消息
 */
function demoMessageTypes() {
  console.log('='.repeat(60));
  console.log('消息类型演示');
  console.log('='.repeat(60));

  // 系统消息
  const systemMsg = new SystemMessage('你是一个有帮助的助手');
  console.log(`\n系统消息:`);
  console.log(`  类型：${systemMsg.constructor.name}`);
  console.log(`  内容：${systemMsg.content}`);

  // 用户消息
  const humanMsg = new HumanMessage('你好，请帮我');
  console.log(`\n用户消息:`);
  console.log(`  类型：${humanMsg.constructor.name}`);
  console.log(`  内容：${humanMsg.content}`);

  // AI 消息
  const aiMsg = new AIMessage('当然，我很乐意帮助你！');
  console.log(`\nAI 消息:`);
  console.log(`  类型：${aiMsg.constructor.name}`);
  console.log(`  内容：${aiMsg.content}`);

  // 消息列表
  const messages = [systemMsg, humanMsg, aiMsg];
  console.log(`\n消息历史 (${messages.length} 条):`);
  messages.forEach((msg, i) => {
    const contentPreview =
      typeof msg.content === 'string' ? msg.content.slice(0, 30) : '[复杂内容]';
    console.log(`  ${i + 1}. [${msg.constructor.name}] ${contentPreview}...`);
  });
}

/**
 * 演示提示词模板如何格式化消息
 */
async function demoPromptTemplate() {
  console.log('\n' + '='.repeat(60));
  console.log('提示词模板演示');
  console.log('='.repeat(60));

  // 创建模板
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', '你是{role}，{style}'],
    ['human', '{question}'],
  ]);

  // 格式化
  const formatted = await prompt.invoke({
    role: '数学老师',
    style: '擅长用简单例子解释概念',
    question: '什么是微积分？',
  });

  console.log(`\n格式化后的消息:`);
  const messages = Array.isArray(formatted)
    ? formatted
    : (formatted as { messages?: unknown[] }).messages || [];
  messages.forEach((msg: { content?: unknown; constructor?: { name?: string } }) => {
    const content = typeof msg.content === 'string' ? msg.content : '[复杂内容]';
    console.log(`  [${msg.constructor?.name ?? 'Unknown'}] ${content}`);
  });
}

/**
 * 演示消息链的传递
 */
function demoMessageChain() {
  console.log('\n' + '='.repeat(60));
  console.log('消息链演示');
  console.log('='.repeat(60));

  // 模拟对话流程
  const conversationFlow = `
  1. 用户输入 → HumanMessage
  2. HumanMessage + SystemMessage → 发送给 LLM
  3. LLM 回复 → AIMessage
  4. AIMessage 添加到历史
  5. 下一轮对话包含所有历史消息
  `;
  console.log(conversationFlow);

  // 实际示例
  const history: Array<HumanMessage | AIMessage> = [];

  // 第一轮
  history.push(new HumanMessage('你好'));
  console.log(`\n第一轮 - 发送：${history[history.length - 1].content}`);

  // 模拟 AI 回复
  history.push(new AIMessage('你好！有什么可以帮助你的？'));
  console.log(`第一轮 - 接收：${history[history.length - 1].content}`);

  // 第二轮
  history.push(new HumanMessage('帮我计算 2+2'));
  console.log(`\n第二轮 - 发送：${history[history.length - 1].content}`);
  console.log(`第二轮 - 历史消息数：${history.length}`);

  // 模拟 AI 回复
  history.push(new AIMessage('2+2=4'));
  console.log(`第二轮 - 接收：${history[history.length - 1].content}`);
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  console.log('LangChain 学习 - 实验 2-1：理解消息传递\n');

  demoMessageTypes();
  await demoPromptTemplate();
  demoMessageChain();

  console.log('\n' + '='.repeat(60));
  console.log('关键收获:');
  console.log('='.repeat(60));
  console.log(`
1. LangChain 使用统一的消息类型：
   - SystemMessage: 系统指令
   - HumanMessage: 用户输入
   - AIMessage: AI 回复

2. 所有模型都使用相同的消息格式

3. ChatPromptTemplate 可以动态生成消息

4. 消息历史按顺序传递给 LLM
  `);
}

// 运行主函数
main();
