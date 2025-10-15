const express = require('express');
const app = express();


const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// const { sheetsReader } = require('./app/utils/');

// async function main() {
//     await sheetsReader.fetchData("KalibrasiAlat", "KalibrasiAlat");
// }

// main();

require('./app/routes')(app);
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})