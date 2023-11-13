import { Router } from "express";
import User from "../models/User.js";
import path from 'path';
import { checkIn } from "../controllers/protectionMiddleware.js";
import serveFavicon from "serve-favicon";

const profile = Router();
profile.use(serveFavicon(path.resolve("static/wa.png")))

profile.get('/', checkIn, async (req, res) =>{
    const {username, email, rank, profilePicture, uuid, certified} = req.user;
    res.render('profile/profile.ejs', {username, email, rank, profilePicture, uuid, certified})
})
profile.get('/avatar/:uuid', async (req, res)=> {
    const uuid = req.params.uuid;
    const user = await User.findOne({ where: {uuid: uuid} });
    if (user == null) return res.status(404).send({status: 404, message: "Cannot find user with uuid " + uuid});
    res.sendFile(path.resolve(`storage/avatars/${user.profilePicture}`));
})


export default profile;