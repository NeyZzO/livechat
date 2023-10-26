import { Router } from "express";
import User from "../models/User.js";
import path from 'path';
import { checkIn } from "../controllers/protectionMiddleware.js";

const profile = Router();

profile.get('/', checkIn, async (req, res) =>{
    const {username, email, rank, profilePicture, uuid} = req.user;
    res.render('profile/profile.ejs', {username, email, rank, profilePicture, uuid})
})
profile.get('/avatar/:uuid', async (req, res)=> {
    const uuid = req.params.uuid;
    const user = await User.findOne({ where: {uuid: uuid} });
    console.log(user)
    if (user == null) return res.status(404).send({status: 404, message: "Cannot find user with uuid " + uuid});
    res.sendFile(path.resolve(`storage/avatars/${user.profilePicture}`));
})


export default profile;