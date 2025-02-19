import { client } from '../redis/client';
import { pageCacheKey } from '$services/keys';

const cachedRoutes = new Set(['/privacy', '/auth/signin', '/auth/signup', '/about']);

export const getCachedPage = (route: string) => {
	if (route in cachedRoutes) {
		return client.get(pageCacheKey(route));
	}
	return null;
};

export const setCachedPage = (route: string, page: string) => {
	return client.set(pageCacheKey(route), page, {
		EX: 2
	});
};
