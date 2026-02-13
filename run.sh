#!/bin/bash
echo "🃏 斗地主游戏 - 本地部署脚本"
echo "=============================="
echo ""
echo "1. 开发模式 (npm run dev)"
echo "2. 构建生产版 (npm run build)"  
echo "3. 预览生产版 (npm run preview)"
echo ""

read -p "请选择 [1-3]: " choice

case $choice in
  1) npm run dev ;;
  2) npm run build ;;
  3) npm run preview ;;
  *) echo "无效选择" ;;
esac
