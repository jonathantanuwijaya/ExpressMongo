const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_PORT,
    MONGO_IP,
    REDIS_PORT,
    REDIS_URL,
    SESSION_SECRET
} = require("./config/config");
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const session = require('express-session');
const redis = require('redis');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

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

connectWithRetry();
app.use(session({
    store: new RedisStore({
        client: redisClient
    }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}))
app.use(express.json());
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send(`<h2>Hi There </h2>`)
})
app.listen(port, () => {
    console.log(`listening on ${port}`);
})