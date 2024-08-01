import Pusher from 'pusher'
import bodyParser from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const pusher = new Pusher({
    appId: "1841406",
    key: "21f054cecc8f4861fa4b",
    secret: "0ea7d7324d455365f923",
    cluster: "ap2",
    useTLS: true
});


const app = express(morgan('combined').logger);
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('test'))
app.post("/pusher/user-auth", (req, res) => {
    const socketId = req.body.socket_id;
    if (!socketId) {
        return res.status(400).send({message: "socket_id is required"});
    }
    pusher.trigger(
        "botman",
        "on:message",
        {
            message: "hello world test",
        },
        {
            socket_id: socketId,
        }
    );
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
});

app.post('/pusher/send-sms', (req, res) => {
    pusher.trigger(
        "botman",
        "on:message",
        {
            message: "hello world test 1",
        },
        {}
    );
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
})

app.post("/pusher/auth", (req, res) => {
    const socketId = req.body.socket_id;
    if (!socketId) {
        return res.status(400).send({message: "socket_id is required"});
    }
    const channel = req.body.channel_name;
    const presenceData = {
        user_id: "unique_user_id",
        user_info: {
            name: "Mr Channels", twitter_id: "@pusher"
        },
    };
    // This authenticates every user. Don't do this in production!
    const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
    res.send(authResponse);
});

pusher.trigger('botman', 'on:message', {'message': 'hello world test'})

const port = process.env.PORT || 8888;
app.listen(port);
