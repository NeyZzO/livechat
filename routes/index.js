import express, { Router } from "express";
import { checkIn } from "../controllers/protectionMiddleware.js";
import path from "path";
const index = Router();

index.use(express.static('static'))
index.get('/', checkIn, async (req, res) => {
    const {username, uuid, certified, rank} = req.user;
    res.status(200).render('index', {avatar: `/profile/avatar/${req.user.uuid}`, username, uuid, certified, rank});
});

export default index;