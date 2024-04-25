require('dotenv').config()
module.exports = function (req, res, next) {
    const keyHeader = req.headers['x-api-key'],
        apiKey = process.env.API_KEY

    if (!keyHeader) {
        return res.status(403).send({
            auth: false,
            status: 403,
            success: false,
            message: 'No Key provided',
        })
    }

    if (keyHeader !== apiKey) {
        return res.status(401).send({
            auth: false,
            message: "Key doesn't match",
        })
    }
    next()
}
