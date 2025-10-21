require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const utils = require('../utils');
const signToken = utils.signToken;
const phoneList = utils.phoneList;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async (req, res) => {
    try {
        const pwd = process.env.PASSWORD_AUTH;
        const { phone, password } = req.body || {};

        if (!phone) {
            return res.status(400).json({
                status: 400,
                message: "phone is required"
            });
        }
        if (phoneList().includes(phone) && password === pwd) {
            const jsonData = fs.readFileSync('./tfa.json');
            const dataExisting = jsonData ? JSON.parse(jsonData) : [];
            const newData = {
                phone: phone,
                tfa: generateFourDigitRandomNumber(),
            }
            const updated = [...dataExisting, newData];
            fs.writeFileSync('./tfa.json', JSON.stringify(updated, null, 2), "utf-8");

            try {
                await axios.post('http://192.168.1.9/siwa/webhook/whatsapp/', {
                    message: `Your Two Factor Authentication code is ${newData.tfa}`,
                    number: phone,
                }, { timeout: 5000 });

                return res.status(200).json({
                    status: 200,
                    TFA: true,
                });
            } catch (error) {
                console.error("Webhook error:", error.message);
                return res.status(500).json({
                    status: 500,
                    message: "Failed to send webhook",
                    error: error.message,
                });
            }

        }
        return res.status(401).json({
            status: 401,
            TFA: false
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        })
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.verifyTfa = async (req, res) => {
    try {
        // phone will be stored in localstorage
        const { phone, tfaCode } = req.body || {};
        if (!phone || !tfaCode) {
            return res.status(400).json({
                status: 400,
                message: "phone and code is required"
            })
        }
        const jsonFile = fs.readFileSync('./tfa.json');
        const jsonData = JSON.parse(jsonFile) || [];
        const found = jsonData.find((e) => e.phone === phone && e.tfa === tfaCode);
        const updated = jsonData.filter((e) => e.phone !== phone);

        if (!found) {
            return res.status(401).json({
                status: 401,
                message: "Invalid Code"
            })
        }

        fs.writeFileSync('./tfa.json', JSON.stringify(updated, null, 2), "utf-8");
        const token = await signToken(phone);
        return res.status(200).json({
            status: 200,
            message: "code match",
            phone: phone,
            token: token
        })
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        })
    }
}

function generateFourDigitRandomNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}
