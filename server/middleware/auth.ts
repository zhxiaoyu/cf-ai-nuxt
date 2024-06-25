import { defineEventHandler, H3Event, sendError } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    if(!event.path.startsWith('/api/')) return;
    const authHeader = event.node.req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('token ')) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
    }

    const clientPass = authHeader.split(' ')[1];

    if (clientPass !== process.env.APP_PWD) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
    }
});
