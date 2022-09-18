export class ApiError extends Error {
	constructor(url: any, status: any) {
		super(`'${url}' returned ${status}`);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}
		this.name = "ApiError";
		// @ts-ignore
		this.status = status;
	}
}

export async function fetchJson(url: any, options:any) {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new ApiError(url, response.status);
	}
	return response.json();
}
