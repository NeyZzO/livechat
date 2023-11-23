import express, { Router } from "express";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import path from 'path';
import { checkIn } from "../controllers/protectionMiddleware.js";
import serveFavicon from "serve-favicon";
import randomColor from "randomcolor";
import random from "random";
import helmet from "helmet";
import multer from "multer";

const profile = Router();
profile.use(serveFavicon(path.resolve("static/wa.png")));
profile.use(express.static(path.resolve("static")));
profile.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://cdn.socket.io/', "https://code.jquery.com", "'unsafe-inline'", "https://cdn.tailwindcss.com", 'https://cdn.jsdelivr.net/'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com/', 'fonts.googleapis.com', 'https://cdn.jsdelivr.net', 'https://cdn.jsdelivr.net/'],
            imgSrc: ["'self'", "https://cdn.dribbble.com/", "https://api.dicebear.com/", "data:"]
        }
    }
}));

const storage = multer.diskStorage({
    destination: 'storage/avatars/',
    filename: (req, file, callback) => {
        const extname = path.extname(file.originalname);
        const newFilename = `${req.user.uuid}${extname}`;
        callback(null, newFilename)
    }
})
const upload = multer({storage: storage})

profile.get('/', checkIn, async (req, res) =>{
    const {username, email, rank, profilePicture, uuid, certified} = req.user;
    res.render('profile/profile.ejs', {username, email, rank, profilePicture, uuid, certified})
})
profile.get('/avatar/:uuid', async (req, res)=> {
    const uuid = req.params.uuid;
    const user = await User.findOne({ where: {uuid: uuid} });
    const profile = await UserProfile.findOne({where: {uuid: uuid}});
    console.log(profile)
    if (user == null) return res.status(404).send({status: 404, message: "Cannot find user with uuid " + uuid});
    if (profile == null) return res.sendFile(path.resolve(`storage/avatars/default-user.png`))
    res.sendFile(path.resolve(`storage/avatars/${user.profilePicture}`));
})

profile.get('/create', checkIn, async (req, res) => {
    const profile = await UserProfile.findOne({where: {uuid: req.session.uuid}});
    const user = req.user;
    if (profile) return res.redirect('/');
    console.log()
    res.render('profile/creator', {randomppic: `https://api.dicebear.com/7.x/croodles/svg?seed=${randSeed(random.int(1, 100))}&backgroundColor=${randomColor().replace('#', "")}`})
})


profile.get('/picture/random', checkIn, async (req, res) => res.json(`https://api.dicebear.com/7.x/croodles/svg?seed=${randSeed(random.int(1, 100))}&backgroundColor=${randomColor().replace('#', "")}`));

profile.post('/create', checkIn, upload.single('profilePicture'), async (req, res) => {
    console.log(req.body);
    res.status(200).send('ok')
})

function randSeed(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export default profile;