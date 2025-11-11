# 🐳 Docker 镜像使用说明

## 📦 镜像信息

### Docker 镜像地址
```
crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 镜像详情
- **镜像摘要**: sha256:66eb765e452d2a04c0ec85e968d646115054dc9f863d027b0267f41479ccd95b
- **镜像大小**: ~246MB
- **基础镜像**: node:20-slim
- **构建时间**: 2025年11月11日
- **版本特性**: 包含用户体验改进，增加了保存行程的明显提示

## 🚀 运行方式

### 方式一：一键运行（最简单）

```bash
# 如果容器名称冲突，先清理现有容器
docker rm -f ai-travel-planner 2>/dev/null || true

# 运行新容器（推荐使用平台参数以确保兼容性）
docker run -d --name ai-travel-planner -p 3000:3000 --platform linux/amd64 crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 方式二：分步运行

```bash
# 1. 拉取镜像
docker pull crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest

# 2. 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 方式三：使用脚本

```bash
# 下载项目并运行脚本
git clone https://github.com/ShadowOnYOU/AI_travel_Planner.git
cd AI_travel_Planner
./run.sh
```

## 🌐 访问应用

启动成功后，在浏览器中访问：
```
http://localhost:3000
```

## 🔧 容器管理

### 查看状态
```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看容器日志
docker logs ai-travel-planner

# 实时查看日志
docker logs -f ai-travel-planner
```

### 容器操作
```bash
# 停止容器
docker stop ai-travel-planner

# 启动已停止的容器
docker start ai-travel-planner

# 重启容器
docker restart ai-travel-planner

# 删除容器
docker rm ai-travel-planner

# 强制删除运行中的容器
docker rm -f ai-travel-planner
```

### 镜像管理
```bash
# 查看本地镜像
docker images

# 删除镜像
docker rmi crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest

# 清理未使用的镜像
docker image prune
```

## 🛠️ 故障排查

### 端口占用问题

```bash
# 检查端口占用
lsof -i :3000

# 如果端口被占用，可以：
# 1. 杀死占用进程
kill -9 <PID>

# 2. 或使用其他端口
docker run -d --name ai-travel-planner -p 8080:3000 crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest

# 然后访问 http://localhost:8080
```

### 容器启动失败

```bash
# 查看详细错误信息
docker logs ai-travel-planner

# 检查容器状态
docker ps -a

# 如果遇到容器名称冲突，先删除现有容器
docker rm -f ai-travel-planner

# 重新运行容器（建议加上平台参数）
docker run -d --name ai-travel-planner -p 3000:3000 --platform linux/amd64 crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 常见错误处理

#### 错误：容器名称冲突
```
Error: The container name "/ai-travel-planner" is already in use
```
**解决方案**：
```bash
# 方法1: 删除现有容器
docker rm -f ai-travel-planner

# 方法2: 使用不同的容器名
docker run -d --name ai-travel-planner-new -p 3000:3000 --platform linux/amd64 [镜像地址]

# 方法3: 检查现有容器是否已经在运行
docker ps | grep ai-travel-planner
# 如果已运行，直接访问 http://localhost:3000
```

#### 错误：平台不兼容
```
Error: no matching manifest for linux/arm64/v8
```
**解决方案**：
```bash
# 强制使用 amd64 平台
docker run -d --name ai-travel-planner -p 3000:3000 --platform linux/amd64 [镜像地址]
```

### 网络问题

如果无法访问应用：
1. 检查 Docker 是否正常运行：`docker ps`
2. 检查端口映射是否正确：`docker port ai-travel-planner`
3. 检查防火墙设置
4. 尝试使用 `localhost` 或 `127.0.0.1` 访问

## ⚙️ 高级配置

### 环境变量配置

```bash
# 如需自定义配置，可以传递环境变量
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  -e NEXT_PUBLIC_AMAP_KEY=your_amap_key \
  -e NEXT_PUBLIC_BAILIAN_API_KEY=your_bailian_key \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 数据持久化

```bash
# 如果需要持久化数据
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  -v ai-travel-data:/app/data \
  crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

## 📋 系统要求

### 最低要求
- Docker 20.10+
- 512MB 可用内存
- 1GB 可用磁盘空间
- 网络连接（用于 API 调用）

### 推荐配置
- Docker 最新版本
- 1GB+ 可用内存
- 2GB+ 可用磁盘空间
- 稳定的网络连接

## 🔍 验证安装

运行以下命令验证安装是否成功：

```bash
# 1. 检查容器是否运行
docker ps | grep ai-travel-planner

# 2. 检查应用是否响应
curl -I http://localhost:3000

# 3. 查看应用日志
docker logs ai-travel-planner | tail -10
```

如果看到类似以下输出，说明安装成功：
```
HTTP/1.1 200 OK
...
```

## 🧪 测试账户信息

为方便助教和评审人员测试，提供以下测试账户：

```
用户名：335933870@qq.com
密码：123321
```

**使用说明**：
1. 访问 http://localhost:3000/auth/signin
2. 使用上述账户登录
3. 可以直接体验所有功能，无需重新注册

## ⚠️ 重要提醒：Supabase 数据库密钥

**Supabase 密钥会定期过期**，如果遇到以下情况，说明需要更新数据库密钥：

### 过期症状
- 用户注册/登录失败
- 行程保存功能异常
- 控制台出现数据库连接错误
- 页面显示 "Authentication failed" 等错误

### 解决方案
1. **联系开发者**获取最新的 Supabase 密钥
2. **临时解决**：系统会自动降级到本地存储模式，核心功能仍可正常使用
3. **验证功能**：可通过配置页面 http://localhost:3000/config 测试数据库连接

### 联系信息
- **开发者**：ShadowOnYOU
- **GitHub Issues**：https://github.com/ShadowOnYOU/AI_travel_Planner/issues
- **邮箱**：[如需要可提供]

## 📞 技术支持

如遇到问题：
1. 首先检查 Docker 日志：`docker logs ai-travel-planner`
2. 确认系统满足最低要求
3. **检查 Supabase 密钥是否过期**（见上方重要提醒）
4. 参考故障排查部分
5. 查看项目 GitHub 页面：https://github.com/ShadowOnYOU/AI_travel_Planner

---

## 🎯 推荐运行命令

### 一键运行（处理所有常见问题）
```bash
# 完整的一键运行命令，自动处理容器冲突和平台兼容性
docker rm -f ai-travel-planner 2>/dev/null || true && \
docker run -d --name ai-travel-planner -p 3000:3000 --platform linux/amd64 \
crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest && \
echo "✅ 启动成功！访问地址: http://localhost:3000"
```

### 临时测试运行
```bash
# 使用 --rm 参数，容器停止后自动删除，适合测试
docker run --rm -p 3001:3000 --platform linux/amd64 \
crpi-ttmopfgqdmld0jn5.cn-hangzhou.personal.cr.aliyuncs.com/ai_by_sgh/ai-travel-planner:latest
```

### 检查运行状态
```bash
# 检查容器是否成功启动
docker ps | grep ai-travel-planner && echo "✅ 容器运行中" || echo "❌ 容器未运行"
```