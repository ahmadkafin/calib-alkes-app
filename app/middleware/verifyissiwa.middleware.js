require('dotenv').config();

module.exports = (req, res, next) => {
    const secret = process.env.INTERNAL_SECRET_KEY;
    const token = req.headers['x-internal-secret'];

    if (!token || token !== secret) {
        return res.status(403).json({
            status: 403,
            message: "Forbidden"
        })
    }
    next();
}