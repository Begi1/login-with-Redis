import bcrypt from 'bcrypt';
import { redis } from '../lib/redis.mjs';

const saltRounds = 10; 

export async function createUser(key, data) {
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = { ...data, password: hashedPassword };

    await redis.call('JSON.SET', key, '$', JSON.stringify(user));

    return user;
}

export async function passwordhash(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword
}

export async function comparePassword(password, hashedPassword) {
    try {
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    } catch (err) {
        console.error('Error comparing passwords:', err);
        return false;
    }
}