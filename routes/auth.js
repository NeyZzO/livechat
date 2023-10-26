import express, { Router } from "express";
import { checkPassword, hashPassword } from "../controllers/hashController.js";
import User from "../models/User.js";
import VerificationToken from "../models/VerificationToken.js";
import crypto from "crypto";
import MailController from "../controllers/mailController.js";

const auth = new Router();
auth.use(express.static("static"));

auth.get("/login", async (req, res) => {
    console.log(req.logout);
    res.render("login");
});

auth.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const rememberMe = req.body.rememberMe;
    if (username == undefined || password == undefined) return res.status(422).send({error: "Password or username", message: "Invalid fields (undefined)"})
    if (!(typeof rememberMe === "boolean") && rememberMe != null) return res.status(422).send({ error: "Rememberme", message: "Invalid fields (wrong type (must be boolean))" })
    if (username == "") {
        return res.status(422).send({ error: "username", message: "You must specify a username." });
    } else if (username.includes(" ")) {
        return res.status(422).send({ error: "username", message: "Username can't contain spaces." });
    } else if (password == "") {
        return res.status(422).send({error: "password", message: "You must specify a password."});
    } else if (password.includes(" ")) {
        return res.status(422).send({error: "password", message: "Password can't contain spaces."});
    }
    const user =
        (await User.findOne({ where: { email: username } })) ||
        (await User.findOne({ where: { username: username } }));
    if (user == null)
        return res.status(404).send({ message: "User not found" });
    const test = await checkPassword(password, user.password);
    if (!test) return res.status(403).send({ message: "Invalid password" });
    if (!user.emailVerified) return res.status(403).send({message: "You must first verify your email"})
    // set session data and redirect to dashboard
    req.session.uuid = user.uuid;
    if (rememberMe) req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    console.log(`${user.email} logged in`);
    res.status(200).send({message: "logged in", loggedin: true})
});

// Registering
auth.get('/register', (req, res) => {
    res.render('register')
})

auth.post('/register', async (req, res) => {
    let {username, email, password, repassword} = req.body;
    username = username.toLowerCase(); 
    console.table(req.body);
    if (username == "") {
        return res.status(422).send({ error: "username", message: "You must specify a username." });
    } else if (username.includes(" ")) {
        return res.status(422).send({ error: "username", message: "Username can't contain spaces." });
    } else if (!(/^[A-Za-z0-9._]+$/.test(username))) {
        return res.status(422).send({ error: "username", message: "Username can't contain special characters." });
    } else if (username.length > 16) {
        return res.status(422).send({ error: "username", message: "Username length should be less than 16." });
    } else if (email == "") {
        return res.status(422).send({ error: "email", message: "You must specify a valid email." });
    } else if (!isEmailValid(email)) {
        return res.status(422).send({ error: "email", message: "Invalid email format." });
    } else if (password == ""){
        return res.status(422).send({ error: "password", message: "You must specify a password." });
    } else if (password.includes(" ")) {
        return res.status(422).send({ error: "password", message: "Password can't contain spaces." });
    } else if (password.length <= 8) {
        return res.status(422).send({ error: "password", message: "Password must be at least 8 chars." });
    } else if (!/[A-Z]/.test(password)) {
        return res.status(422).send({ error: "password", message: "Password must contain a uppercase character." });
    } else if (!/[!@#$%^&*(),~.?":{}|<>]/.test(password)) {
        return res.status(422).send({ error: "password", message: "Password must contain at least 1 special character." });
    } else if (!/\d/.test(password)) {
        return res.status(422).send({ error: "password", message: "Password must contain at least 1 number." });
    } else if (repassword == "") {
        return res.status(422).send({ error: "passwordretype", message: "You must retype your password." });
    } else if (repassword != password) {
        return res.status(422).send({ error: "passwordretype", message: "Passwords doesn't match." });
    }

    const existing = {
        username: await User.findAndCountAll({where: {username: username}}),
        email: await User.findAndCountAll({where: {email: email}}),
    }

    if (existing.username.count > 0) return res.status(422).send({ error: "username", message: "Username already taken." });
    if (existing.email.count > 0) return res.status(422).send({ error: "email", message: "Email already taken." });
    const hashedPass = await hashPassword(password);
    const user = await User.create({
        username: username,
        email: email,
        password: hashedPass
    });

    var tk = "";
    while(true){
        tk = crypto.randomBytes(32).toString('hex')
        const exists = await VerificationToken.findAndCountAll({where: {token: tk}});
        if(exists.count == 0){
            break;
        }
    }
    const verToken = await VerificationToken.create({
        token: tk,
        uuid: user.uuid
    });

    MailController.sendVerificationMail(verToken.token, username, email);

    console.log("Created new user with uuid : " + user.uuid);
    res.status(201).send({message: "User created", username, email})
})

auth.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout = true;
        res.redirect('/auth/login');
    })
})

function isEmailValid(email) {
    // Utilisez une expression régulière pour valider l'email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
}

export default auth;
