const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {MONGO_USER, MONGO_PASSWORD, MONGO_PORT, MONGO_IP} = require("./config/config");
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`


const connectWithRetry = () => {
    mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    )
        .then(() => console.log(`Successfully connected to DB`))
        .catch((e) => {
            console.log(e)
            setTimeout(
                connectWithRetry, 5000
            );
        });
}

const port = process.env.PORT || 3000;
connectWithRetry();
app.get('/', (req, res) => {
    res.send(`<h2>Hi There :)</h2>`)
})
app.listen(port, () => {
    console.log(`listening on ${port}`);
})