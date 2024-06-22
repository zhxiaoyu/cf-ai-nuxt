export default defineEventHandler(async (event) => {
    const pass = process.env.APP_PWD;
    const body = await readBody(event);
    const { password } = body;
    if (password !== pass) {
        setResponseStatus(event, 401);
        return { success: false, message: 'Password Incorrect' };
    }

    return { success: true, message: 'Password Correct' };
});
