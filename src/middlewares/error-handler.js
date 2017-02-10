export default async (ctx, next) => {
	try {
		await next();
	} catch (e) {
		const resError = {
			status: e.status || 500,
			statusText: e.message,
			errors: e.errors
		};
		if (e instanceof Error) {
			Object.assign(resError, {stack: e.stack});
		}
		Object.assign(ctx, {body: resError, status: e.status || 500});
	}
}