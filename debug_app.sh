#!/bin/bash

# 清空或创建日志文件
echo "开始调试应用..." > debug.log

# 记录环境信息
echo "环境信息:" >> debug.log
echo "Node版本: $(node -v)" >> debug.log
echo "NPM版本: $(npm -v)" >> debug.log
echo "操作系统: $(uname -a)" >> debug.log

# 检查目录结构
echo -e "\n项目目录结构:" >> debug.log
ls -la >> debug.log

echo -e "\nsrc目录结构:" >> debug.log
ls -la src/ 2>/dev/null >> debug.log || echo "src目录不存在!" >> debug.log

# 检查package.json
echo -e "\npackage.json内容:" >> debug.log
cat package.json >> debug.log

# 检查关键文件
echo -e "\n主入口文件(main.ts):" >> debug.log
cat src/main.ts 2>/dev/null >> debug.log || echo "main.ts文件不存在!" >> debug.log

echo -e "\n路由配置:" >> debug.log
cat src/router/index.ts 2>/dev/null >> debug.log || echo "router/index.ts文件不存在!" >> debug.log

echo -e "\nApp.vue:" >> debug.log
cat src/App.vue 2>/dev/null >> debug.log || echo "App.vue文件不存在!" >> debug.log

# 检查依赖
echo -e "\n安装的npm包:" >> debug.log
npm list --depth=0 >> debug.log

# 运行构建看是否有错误
echo -e "\n尝试构建项目:" >> debug.log
npm run build >> debug.log 2>&1 || echo "构建失败" >> debug.log

# 启动开发服务器并记录输出
echo -e "\n启动开发服务器:" >> debug.log
npm run dev >> debug.log 2>&1 &
DEV_PID=$!

echo "开发服务器进程ID: $DEV_PID" >> debug.log

# 给服务器一些启动时间
sleep 5

# 检查是否正在运行
if ps -p $DEV_PID > /dev/null; then
  echo "开发服务器正在运行" >> debug.log
  
  # 尝试访问本地服务器
  echo -e "\n尝试访问 http://localhost:3000:" >> debug.log
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000 >> debug.log
  
  # 终止服务器
  kill $DEV_PID
  echo "已终止开发服务器" >> debug.log
else
  echo "开发服务器未能成功启动" >> debug.log
fi

echo -e "\n调试完成，请查看debug.log文件获取详细信息" 