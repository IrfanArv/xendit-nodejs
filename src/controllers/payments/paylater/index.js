require('dotenv').config()

module.exports = {
    async createCustomer(req, res) {
        try {
            let { userId, givenNames, email, mobileNumber } = req.body.data

            console.log('userId = ' + userId)
            console.log('givenNames = ' + givenNames)
            console.log('email = ' + email)
            console.log('mobileNumber = ' + mobileNumber)
        } catch (err) {
            return res.status(400).send({
                status: 400,
                success: false,
                message: 'Bad Request',
                data: {
                    errors: err.message,
                },
            })
        }
    },
}
