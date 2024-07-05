# Cloudflare AI Web UI
[English](./README.md) | 简体中文

Cloudflare Workers AI 的 Web UI，允许用户调用 Cloudflare Workers AI 的多种模型。

## 支持的模型:
-  文本生图
   -  @cf/stabilityai/stable-diffusion-xl-base-1.0
   -  @cf/bytedance/stable-diffusion-xl-lightning
   -  @cf/lykon/dreamshaper-8-lcm
-  以图生图
   -  @cf/runwayml/stable-diffusion-v1-5-img2img
-  图像局部重绘
   -  @cf/runwayml/stable-diffusion-v1-5-inpainting
-  以图生文
   -  @cf/llava-hf/llava-1.5-7b-hf
   -  @cf/unum/uform-gen2-qwen-500m
-  翻译
   -  @cf/meta/m2m100-1.2b
-  摘要
   -  @cf/facebook/bart-large-cnn

## 部署到 Cloudflare Pages
-  Fork 本仓库
-  创建一个新的 Cloudflare Pages 项目
-  设置你的仓库作为Cloudflare Pages 项目源
-  设置如下环境变量
   -  `CF_ID`: 你的Cloudflare账户ID
   -  `CF_TOKEN`: 你的Cloudflare账户Token
   -  `APP_PWD`: 你的密码
-  部署项目


## 本地开发

安装依赖:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```
在根目录创建一个 `.env` 文件，写入如下环境变量:

```bash
# .env
CF_ID = 你的Cloudflare账户ID
CF_TOKEN = 你的Cloudflare账户Token
APP_PWD = 你的密码
```
在 `http://localhost:3000` 启动开发服务器:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```