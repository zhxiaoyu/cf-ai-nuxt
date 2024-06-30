<template>
    <div>
        <h1>Cloudflare AI WebUI</h1>
        <br />
        <p>A web UI for <a href="https://developers.cloudflare.com/workers-ai/">Cloudflare Workers AI</a>, which allows users to call multiple models of Cloudflare Workers AI.
        </p>
        <br />
        <p>This project is still in early stages of development. Please report any issues or feature requests on <a href="https://github.com/zhxiaoyu/cf-ai-nuxt">GitHub</a>.</p>
        <br />
        <h2>Support models:</h2>
        <ul>
            <li><b>- Text to Image:</b>
                <ul>
                    <li><i>@cf/stabilityai/stable-diffusion-xl-base-1.0</i></li>
                    <li><i>@cf/bytedance/stable-diffusion-xl-lightning</i></li>
                    <li><i>@cf/lykon/dreamshaper-8-lcm</i></li>
                </ul>
            </li>
            <li><b>- Image to Image:</b>
                <ul>
                    <li><i>@cf/runwayml/stable-diffusion-v1-5-img2img</i></li>
                </ul>
            </li>
            <li><b>- Image Inpaint:</b>
                <ul>
                    <li><i>@cf/runwayml/stable-diffusion-v1-5-inpainting</i></li>
                </ul>
            </li>
            <li><b>- Translation:</b>
                <ul>
                    <li><i>@cf/meta/m2m100-1.2b</i></li>
                </ul>
            </li>
        </ul>
    </div>
</template>