import express from "express";
import mongoose  from "mongoose";
import Messages  from "./dbmessages.js";
import Pusher from "pusher-js";
import Cors from "Cors";
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

const url = 'mongodb+srv://admin:saisum@2@cluster0.jpdjp.mongodb.net/mern-message?retryWrites=true&w=majority';

const pusher = new Pusher({
    appId: "1286311",
    key: "e72e1697df8110453703",
    secret: "29a7cf08be7eb9999803",
    cluster: "eu",
    useTLS: true
  });


const db = mongoose.connection

db.once('open',() => {
    console.log("DB connection connected");
    const msgCollection = db.collection('message connection contents')
    const changeStream = msgCollection.watch();

    changeStream.on("change",(change) => {
        console.log(change); 
        
        if (change.operationType == 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted', {
                name:messageDetails.user,
                message:messageDetails.message,
            });

        }

        else {
            console.log("ERROR  triggeing pusher");
        }
    });

});
mongoose.connect(url,
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

app.get("/", (req, res) => res.status(200).send("hello world"));

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data) 
        }
    });
});

app.listen(port, () => console.log('listen on localhost:${port}'));