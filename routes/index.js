import express, { Router } from "express";
import { checkIn } from "../controllers/protectionMiddleware.js";
import path from "path";
import Message from "../models/Message.js";
import User from "../models/User.js";
const index = Router();

index.use(express.static("static"));
index.get("/", checkIn, async (req, res) => {
    const { username, uuid, certified, rank } = req.user;
    res.status(200).render("index", {
        avatar: `/profile/avatar/${req.user.uuid}`,
        username,
        uuid,
        certified,
        rank,
    });
});

index.post("/messages/conv/:id", checkIn, async (req, res) => {
    const id = req.params.id;
    if (id != 1) return res.status(404);
    const messages = [];
    const query = await Message.findAll({
        include: { model: User },
        order: [["createdAt", "DESC"]],
    });
    for (let i = query.length - 1; i >= 0; i--) {
        let msg = query[i];
        /*
            {conversation: 1, user: {uuid: user.uuid, username: user.username, rk: user.rank, 
                crt: user.certified}, content: msg, msgid: 1, date: new Date(msgData.createdAt), sid: socket.id}
        */
        messages.push({
            conversation: 1,
            user: {
                uuid: msg.User.uuid,
                username: msg.User.username,
                rk: msg.User.rank,
                crt: msg.User.certified,
            },
            msgid: msg.id,
            content: msg.content,
            date: new Date(msg.createdAt),
            self: msg.User.uuid == req.session.uuid,
        });
    }
    res.status(200).send(messages);
});

export default index;
