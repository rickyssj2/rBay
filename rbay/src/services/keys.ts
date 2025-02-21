export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const usersKey = (id: string) => `users#${id}`;
export const sessionKey = (id: string) => `session#${id}`;
export const itemsKey = (id: string) => `items#${id}`;
export const usernamesUniqueKey = () => `usernames:unique`;
export const userLikesKey = (userId: string) => `users:likes#${userId}`;
export const usernamesKey = () => `usernames`;
