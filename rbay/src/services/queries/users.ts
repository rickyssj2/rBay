import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usernamesKey, usernamesUniqueKey, usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
	// Use the username argument to look up the person's UserID
	// in the `usernames` sorted set
	const decimalId = await client.zScore(usernamesKey(), username);

	// make sure we actually got an ID from the lookup
	if (!decimalId) {
		throw new Error(`User does not exist`);
	}

	// Take the ID and convert it back to Hexadecimal
	const id = decimalId.toString(16);

	// Use the ID to look up the user's hash
	const user = await client.hGetAll(usersKey(id));

	// Deserialize and return the has
	return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();

	// See if username is already in use
	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);

	// if so throw an error
	if (exists) {
		throw new Error('Username is taken');
	}

	// Otherwise, continue
	await client.hSet(usersKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	});

	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
