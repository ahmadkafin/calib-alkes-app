require('dotenv').config();

const utils = require('../utils');
const phoneList = utils.phoneList;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
    }
    const parts = token.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json(resCom.UNAUTHORIZED("Invalid Authorization header format. Use Bearer <token>"));
    }

    const tValue = parts[1];
    try {
        const decoded = jwt.verify(tValue, process.env.JWT_SECRET);
        if (phoneList().includes(decoded.phone)) {
            next();
        }
        return res.status(401).json({ message: 'Access Denied. Invalid User.' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }

}