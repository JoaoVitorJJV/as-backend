import { getToday } from "../utils/getToday";

const getCurrentPassword = () => getToday().split('/').join('');

export const validatePassowrd = (password: string): boolean => {
    return password === getCurrentPassword();
}

export const createToken = () => {
    const currentPassword = getCurrentPassword();
    return `${process.env.DEFAULT_TOKEN}${currentPassword}`
}

export const validateToken = (token: string) => {
    return createToken() === token;
}