/**
 * SSPS 开发服务器启动器
 * 同时启动前端 Next.js 和后端 Django 服务器
 */
const { spawn, execSync } = require('child_process');
const path = require('path');

console.log('🚀 启动 SSPS 开发环境...');

// 检查前端依赖是否已安装
console.log('🔍 检查前端依赖...');
try {
  execSync('cd project/front && npm install', { stdio: 'pipe' });
  console.log('✅ 前端依赖检查完成');
} catch (e) {
  console.log('⚠️  前端依赖安装可能存在问题，继续启动...');
}

// 检查后端依赖是否已安装
console.log('🔍 检查后端依赖...');
try {
  const djangoCheck = execSync('python -c "import django; print(django.get_version())"', { 
    cwd: path.join(__dirname, 'project/back/python'),
    stdio: 'pipe'
  });
  console.log(`✅ Django 已安装 (版本: ${djangoCheck.toString().trim()})`);
} catch (e) {
  console.log('⚠️  Django 未安装，请运行: pip install django djangorestframework');
}

// 启动前端开发服务器
console.log('🌐 启动前端开发服务器...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'project/front'),
  stdio: 'inherit'
});

// 启动后端开发服务器
console.log('⚙️  启动后端开发服务器...');
const backend = spawn('python', ['app.py'], {
  cwd: path.join(__dirname, 'project/back/python'),
  stdio: 'inherit'
});

// 监听进程错误
frontend.on('error', (err) => {
  console.error('前端服务器错误:', err);
});

backend.on('error', (err) => {
  console.error('后端服务器错误:', err);
});

console.log('\n✅ SSPS 开发环境已启动');
console.log('🌐 前端地址: http://localhost:3000');
console.log('⚙️  后端地址: http://localhost:8000');
console.log('\n按 Ctrl+C 停止服务器\n');

// 当主进程关闭时，也关闭子进程
process.on('SIGINT', () => {
  console.log('\n shutting down servers...');
  
  if (!frontend.killed) frontend.kill();
  if (!backend.killed) backend.kill();
  
  process.exit(0);
});