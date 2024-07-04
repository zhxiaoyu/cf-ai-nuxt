# Cloudflare AI Web UI
English | [简体中文](./README_CN.md)

A web UI for Cloudflare Workers AI, which allows users to call multiple models of Cloudflare Workers AI.

## Support models:
-  Text to Image
   -  @cf/stabilityai/stable-diffusion-xl-base-1.0
   -  @cf/bytedance/stable-diffusion-xl-lightning
   -  @cf/lykon/dreamshaper-8-lcm
-  Image to Image
   -  @cf/runwayml/stable-diffusion-v1-5-img2img
-  Image Inpaint
   -  @cf/runwayml/stable-diffusion-v1-5-inpainting
-  Translation
   -  @cf/meta/m2m100-1.2b
-  Summary
   -  @cf/facebook/bart-large-cnn

## Deploy on Cloudflare Pages
-  Fork this repository
-  Create a Cloudflare Pages project
-  Add the repository as a source
-  Set the environment variables
   -  `CF_ID`: Your Cloudflare account ID
   -  `CF_TOKEN`: Your Cloudflare API token
   -  `APP_PWD`: Your application password
-  Deploy the project


## Local Development

Install the dependencies:

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
Create a `.env` file in the root directory and set the following environment variables:

```bash
# .env
CF_ID = YOUR_CLOUDFLARE_ACCOUNT_ID
CF_TOKEN = YOUR_CLOUDFLARE_API_TOKEN
APP_PWD = YOUR_APPLICATION_PASSWORD
```
Start the development server on `http://localhost:3000`:

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