import { client } from '$services/redis';
import type { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { serialize } from './serialize';
import { itemsKey } from '$services/keys';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));

	if (Object.keys(item).length === 0) {
		return null;
	}

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const commands = ids.map((id) => {
		return client.hGetAll(itemsKey(id));
	});

	const results = await Promise.all(commands);

	return results.map((item, i) => {
		if (Object.keys(item).length === 0) {
			return null;
		}

		return deserialize(ids[i], item);
	});
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	const id = genId();

	const serialized = serialize(attrs);

	await client.hSet(itemsKey(id), serialized);

	return id;
};
