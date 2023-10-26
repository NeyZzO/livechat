import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import chalk from "chalk";
import {Server} from "socket.io";
import {createServer} from "node:http";
import session from "express-session";
import auth from "./routes/auth.js";
import Database from "./controllers/databaseController.js";
import profile from "./routes/profile.js";
import MySQLStore from "express-mysql-session";
import dotenv from 'dotenv';
import serveFavicon from "serve-favicon";
import path from "path";
dotenv.config();
const mstore = MySQLStore(session);

const options = {
	host: process.env.DB_HOST,
    port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
};

const sessionStore = new mstore(options);

const app = express();
const server = createServer(app);
const io = new Server(server);
(async () => {
    await Database.startDatabase();
})();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("static"))
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://cdn.socket.io/', "https://code.jquery.com", "'unsafe-inline'"],
            styleSrc: ["'self'", 'https://cdnjs.cloudflare.com/', 'fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
        }
    }
}));
app.use(morgan("combined"));
app.set("view engine", "ejs");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "dagochat_session",
    store: sessionStore,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        domain: "localhost",
        sameSite: true,
    }
}))
app.use('/auth', auth);
app.use('/profile', profile);
app.use(serveFavicon(path.resolve('static/wa.png')));

app.get("/", (req, res) => {
    res.render("index");
})


io.on('connection', (socket) => {
    console.log("New user connected to socket");
    socket.on("disconnect", () => {
        console.log("A user disconnected")
    })
})
server.listen(3000, () => {
    console.log(chalk.green('Server started listening on port 3000'))
})