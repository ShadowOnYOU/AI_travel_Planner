# 使用 Node.js 20 LTS 版本
# 使用 --no-cache 和 --pull 标志来避免缓存问题
FROM node:20-slim AS base

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 复制 package 文件
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用 - 设置必要的环境变量
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_AMAP_KEY=1e967f9e5d863f52e8e76a8b7c381669
ENV NEXT_PUBLIC_BAILIAN_API_KEY=sk-7b2ff1814ecb499d89d56e86af030b19
ENV NEXT_PUBLIC_BAILIAN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
ENV NEXT_PUBLIC_BAILIAN_MODEL_ID=qwen-plus
ENV NEXT_PUBLIC_SUPABASE_URL=https://untvtsdpychqwikqdkgg.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudHZ0c2RweWNocXdpa3Fka2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjM4NjQsImV4cCI6MjA3NjEzOTg2NH0.3lTm4PFwCxxKWgjE5YFP90I0oQgNKn-scOKCOqitIWs

RUN npm run build

# 生产运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
