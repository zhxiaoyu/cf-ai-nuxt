export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { model, source_lang, target_lang, text } = body;

    const workersBody = {
        source_lang: source_lang,
        target_lang: target_lang,
        text: text,
    };

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/ai/run/${model}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workersBody),
    });

    if (!res.ok) {
        return {
            status: res.status,
            message: await res.text(),
        };
    }

    return new Response(res.body, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
});