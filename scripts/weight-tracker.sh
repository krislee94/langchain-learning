#!/bin/bash
# 体重记录脚本 - 每天记录体重

DATE=$(date +"%Y-%m-%d")
TIME=$(date +"%H:%M")
WEIGHT_FILE="$HOME/.openclaw/workspace/memory/weight-log.md"

# 创建文件如果不存在
if [ ! -f "$WEIGHT_FILE" ]; then
    echo "# 体重记录日志" > "$WEIGHT_FILE"
    echo "" >> "$WEIGHT_FILE"
    echo "| 日期 | 时间 | 体重 (kg) | 备注 |" >> "$WEIGHT_FILE"
    echo "|------|------|-----------|------|" >> "$WEIGHT_FILE"
fi

# 提示输入体重
echo "=== 体重记录 ==="
echo "日期：$DATE $TIME"
echo ""
read -p "请输入今日体重 (kg): " WEIGHT

if [ -z "$WEIGHT" ]; then
    echo "❌ 未输入体重，已取消记录"
    exit 0
fi

read -p "备注 (可选，直接回车跳过): " NOTE

if [ -z "$NOTE" ]; then
    NOTE="-"
fi

# 记录到文件
echo "| $DATE | $TIME | $WEIGHT | $NOTE |" >> "$WEIGHT_FILE"

echo ""
echo "✅ 已记录：$WEIGHT kg"
echo "📁 保存位置：$WEIGHT_FILE"
