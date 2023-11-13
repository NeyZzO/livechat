import express, { Router } from "express";
import { checkPassword, hashPassword } from "../controllers/hashController.js";
import User from "../models/User.js";
import VerificationToken from "../models/VerificationToken.js";
import crypto from "crypto";
import MailController from "../controllers/mailController.js";
import {checkIn} from "../controllers/protectionMiddleware.js";

const auth = new Router();
auth.use(express.static("static"));

auth.get("/login", async (req, res) => {
    if (req.session.uuid) return res.redirect('/profile/');
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
    if (!test) return res.status(403).send({ type: "password", message: "Invalid password" });
    // set session data and redirect to dashboard
    req.session.uuid = user.uuid;
    if (rememberMe) req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    res.status(200).send({message: "logged in", loggedin: true})
});

// Registering
auth.get('/register', (req, res) => {
    if (req.session.uuid) return res.redirect('/profile/');
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
    res.status(201).send({message: "User created", username, email})
})

auth.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout = true;
        res.redirect('/auth/login');
    })
})

auth.get('/verify/:token', async (req, res) => {
    if (!req.session.uuid) { return res.redirect('/auth/login')};
    const user = await User.findOne({where: {uuid: req.session.uuid}});
    if(user == null) {
        req.sessionErrorMessage = "Invalid session";
        res.redirect('/auth/login');
        return;
    }
    if (user.emailVerified) return res.redirect('/profile');
    const token = req.params.token;
    const tk = await VerificationToken.findOne({where: {uuid: user.uuid}});
    if (tk == null) return res.redirect('/auth/error/invalidToken');
    if (tk.token != token) return res.redirect('/auth/error/invalidToken');
    tk.destroy();
    user.emailVerified = true;
    user.save();
    res.render('authError/emailSuccess')
})

auth.post('/resendEmail', async (req, res) => {
    if (!req.session.uuid) { return res.status(403).send('/auth/login')};
    const user = await User.findOne({where: {uuid: req.session.uuid}});
    if (user == null) return res.status(404).send("/auth/login");
    const vertoken = await VerificationToken.findOne({where: {uuid: req.session.uuid}});
    if (user.emailVerified) return res.status(409).send({error: "Email alredy verified"});
    if (vertoken != null ) vertoken.destroy();
    let tok = "";
    while(true){
        tok = crypto.randomBytes(32).toString('hex')
        const exists = await VerificationToken.findAndCountAll({where: {token: tok}});
        if(exists.count == 0){
            break;
        }
    }
    const tk = await VerificationToken.create({uuid: user.uuid, token: tok});
    MailController.sendVerificationMail(tok, user.username, user.email);
    res.status(201).send({message: "Mail sent successfully"});
})


auth.get("/erorr/:error", async (req, res) => {
    let error = req.params.error;
    switch (error) {
        case "emailverification":
            if (!req.session.uuid) return res.redirect('/auth/login');
            const user = await User.findByPk(req.session.uuid);
            if (user == null) return res.redirect('/auth/logout')
            if (user.emailVerified) return res.redirect("/profile");
            return res.render('authError/error', {heading: "Please verify your email", paragraph: "Check your inbox for the confirmation email. Also make sure to check the spams. If you don't see the mail, please click the link down below to resend email.", btn_text: "Resend email", btn_active: true, btn_action: "POST", btn_target:"/auth/resendEmail"});
            break;
        case "invalidToken":
            return res.render('authError/error', {heading: "Invalid token", paragraph: "The provided token is invalid, please click the button down below to recieve a new one", btn_text: "Resend email", btn_active: true, btn_action: "POST", btn_target:"/auth/resendEmail"});
            break;
        default:
            return res.redirect('/auth/login');
            break;
    }
})

function isEmailValid(email) {
    // Utilisez une expression régulière pour valider l'email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
}

export default auth;
