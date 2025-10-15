const controllers = require('../controllers');
const middleware = require('../middleware');
const KalibrasiAlatCont = controllers.KalibrasiAlat;
const verifyToken = middleware.VerifyToken;
const allowedIP = middleware.AllowedIP;

module.exports = (app) => {
    app.get('/kalibrasi/get', [verifyToken], KalibrasiAlatCont.get);
    app.get('/kalibrasi/find', [verifyToken], KalibrasiAlatCont.find);
    app.get('/kalibrasi/getClosestDate', [allowedIP], KalibrasiAlatCont.getClosestDate);
    app.get('/kalibrasi/testMessage', KalibrasiAlatCont.testMessage);
}