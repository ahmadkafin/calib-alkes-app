require('dotenv').config();

const jwt = require('jsonwebtoken');

module.exports = async (phone) => {
    const token = jwt.sign(
        {
            phone: phone,
            role: "ADMIN",
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h',
            audience: 'CalibAlkes',
            issuer: 'SiwaSystem',
            subject: 'AuthToken',
            jwtid: require('crypto').randomBytes(16).toString('hex'),
            algorithm: 'HS256',
        }
    );
    return token;
}