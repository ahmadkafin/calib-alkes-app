const { default: axios } = require('axios');
const fs = require('fs');
const moment = require('moment');

const dtNow = moment();

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.get = (req, res) => {
    const rawData = fs.readFileSync('./data/KalibrasiAlat.json');

    try {
        const fromRaw = JSON.parse(rawData);
        let data = fromRaw.map((e) => {
            const dt = moment(e.next_calib_date, 'DD-MMM-YYYY');
            const diffDays = dt.diff(dtNow, 'days');
            const bucket = mapToBucket(diffDays);
            return {
                ...e,
                diff_days: diffDays,
                bucket_days: bucket,
            }
        })
        const { filter_diff, alat_kesehatan, status, nama_ruangan, merk, nomor_seri } = req.query;

        data = data.filter((e) => {
            const matchDiff =
                filter_diff ? e.bucket_days === parseInt(filter_diff) : true;
            const matchAlat =
                alat_kesehatan ? e.alat_kesehatan === alat_kesehatan : true;
            const matchStatus = status ? e.status === status : true;
            const matchNamaRuangan = nama_ruangan ? e.nama_ruangan.includes(nama_ruangan) : true;
            const matchMerk = merk ? e.merk.includes(merk) : true;
            const matcNomorSeri = nomor_seri ? e.nomor_seri.includes(nomor_seri) : true;
            return matchDiff && matchAlat && matchStatus && matchNamaRuangan && matchMerk && matcNomorSeri;
        });

        if (data.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "data found"
            })
        }
        return res.status(200).json({
            status: 200,
            data: data,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.find = (req, res) => {
    const rawData = fs.readFileSync('./data/KalibrasiAlat.json');

    try {
        const data = JSON.parse(rawData);
        const found = data
            .map((e) => {
                const dt = moment(e.next_calib_date, 'DD-MMM-YYYY');
                const diffDays = dt.diff(dtNow, 'days');
                const bucket = mapToBucket(diffDays);
                return {
                    ...e,
                    diff_days: diffDays,
                    bucket_days: bucket,
                }
            }).find((e) => e.uuid === req.body.uuid);
        if (!found) {
            return res.status(404).json({
                status: 404,
                message: "data found"
            })
        }
        return res.status(200).json(found);
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getClosestDate = (req, res) => {
    const rawData = fs.readFileSync('./data/KalibrasiAlat.json');
    try {
        const data = JSON.parse(rawData);
        console.log(dtNow);
        const found = data.map((e) => {
            const dt = moment(e.next_calib_date, 'DD-MMM-YYYY');
            const diffDays = dt.diff(dtNow, 'days');
            const bucket = mapToBucket(diffDays);
            return {
                ...e,
                diff_days: diffDays,
                bucket_days: bucket,
            }
        }).filter((e) => e.bucket_days !== null);
        const grouped = found.reduce((acc, item) => {
            const b = String(item.bucket_days);
            if (!acc[b]) acc[b] = [];
            acc[b].push(item);
            return acc;
        }, {});

        return res.status(200).json({
            status: 200,
            data: grouped,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            data: e.message,
        });
    }
}

exports.testMessage = async (req, res) => {
    const response = await axios.post('http://192.168.1.9/siwa/webhook/whatsapp/', {
        message: "Test Mesasge from siwa server",
    });
    return res.status(200).json({
        status: 200,
        data: response.data,
    })
}

function mapToBucket(diffDays) {
    if (diffDays <= 0) return 0;
    if (diffDays <= 1) return 1;
    if (diffDays <= 30) return 30;
    if (diffDays <= 60) return 60;
    if (diffDays <= 90) return 90;
    return null;
}