const express = require('express');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

// app.use(cors());


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const { sheetsReader } = require('./app/utils/');

async function main() {
    await sheetsReader.fetchData("KalibrasiAlat", "KalibrasiAlat");
}

const pullData = async () => {
    const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    await sheetsReader.fetchData("KalibrasiAlat", "KalibrasiAlat").then(() => {
        axios.post('http://192.168.1.9/siwa/webhook/whatsapp/', {
            message: `✅ Tarik data Kalibrasi Alat selesai pada ${time}`,
            number: '081312425757'
        })
    }).then((resp) => {
        console.log(`[${time}] ✅ Tarik data Google Sheets selesai`);
    }).catch((err) => {
        axios.post('http://192.168.1.9/siwa/webhook/whatsapp/', {
            message: `❌ Tarik data Kalibrasi Alat gagal pada ${time}`,
            number: '081312425757'
        })
        console.error(`[${time}] ❌ Tarik data Google Sheets gagal: ${err.message}`);
    });
}

cron.schedule('0 */6 * * *', pullData, { timezone: 'Asia/Jakarta' });
// cron.schedule('21 9 * * *', pullData, { timezone: 'Asia/Jakarta' });


app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello from callib-app"
    })
});

require('./app/routes')(app);
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})