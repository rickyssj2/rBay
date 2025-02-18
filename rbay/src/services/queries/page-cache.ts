import { client } from '../redis/client';

const cachedRoutes = new Set(['/privacy', '/auth/signin', '/auth/signup', '/about']);

export const getCachedPage = (route: string) => {
	if (route in cachedRoutes) {
		return client.get(`pagecache#${route}`);
	}
	return null;
};

export const setCachedPage = (route: string, page: string) => {
	return client.set(`pagecache#${route}`, page, {
		EX: 2
	});
};
