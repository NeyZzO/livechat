import express, { Router } from "express";
import { checkPassword } from "../controllers/hashController.js";
import User from "../models/User.js";

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
    // set session data and redirect to dashboard
    req.session.uuid = user.uuid;
    if (rememberMe) req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    console.log(`${user.email} logged in`);
    res.status(200).send({message: "logged in", loggedin: true})
});

// Registering
auth.get('/register', async (req, res) => {
    res.render('register')
})

auth.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout = true;
        res.redirect('/auth/login');
    })
})

async function authenticate(user, pass) {}

export default auth;
