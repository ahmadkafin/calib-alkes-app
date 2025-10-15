const controllers = require('../controllers');
const AuthController = controllers.Auth

module.exports = (app) => {
    app.post('/auth/login', AuthController.login);
    app.post('/auth/verify-tfa', AuthController.verifyTfa);
}