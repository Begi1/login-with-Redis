import jwt from 'jsonwebtoken'

export function generateToken(payload, secret = process.env.JWT_SECRET_KEY, options = { expiresIn: '1h' }) {
    return jwt.sign(payload, secret, options);
}