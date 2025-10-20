const express = require('express');
const app = express();
const cron = require('node-cron');

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const { sheetsReader } = require('./app/utils/');

async function main() {
    await sheetsReader.fetchData("KalibrasiAlat", "KalibrasiAlat");
}

const pullData = async () => {
    await sheetsReader.fetchData("KalibrasiAlat", "KalibrasiAlat");
    console.log(`[${time}] ✅ Tarik data Google Sheets selesai`);
}

cron.schedule('0 */6 * * *', pullData, { timezone: 'Asia/Jakarta' });

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello from callib-app"
    })
});

require('./app/routes')(app);
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})