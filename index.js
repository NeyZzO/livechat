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
import MailController from "./controllers/mailController.js";
import files from "./routes/static.js";
import index from "./routes/index.js";
import User from "./models/User.js";
import MessageController from "./controllers/messageController.js";
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
            scriptSrc: ["'self'", 'https://cdn.socket.io/', "https://code.jquery.com", "'unsafe-inline'", "https://cdn.tailwindcss.com", 'https://cdn.jsdelivr.net/'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com/', 'fonts.googleapis.com', 'https://cdn.jsdelivr.net', 'https://cdn.jsdelivr.net/'],
            imgSrc: ["'self'", "https://cdn.dribbble.com/"]
        }
    }
}));
app.use(serveFavicon(path.resolve('static/wa.png')));
app.use(morgan("combined"));
app.set("view engine", "ejs");
const sess = session({
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
})
app.use(sess)

io.engine.use(sess)

// Routeurs
app.use('/auth', auth);
app.use('/profile', profile);
app.use('/static/', files);
app.use('/', index)

MailController.startController();


io.on('connection', (socket) => {
    console.log("User with uuid : " + socket.request.session.uuid + " connected.");
    socket.on("disconnect", () => {
        console.log("A user disconnected")
    });

    socket.on("message", (msg) => new MessageController(io, socket, msg))
})

server.listen(3000, () => {
    console.log(chalk.green('Server started listening on port 3000'))
    setTerminalTitle("DagoChat")
})

function setTerminalTitle(title)
{
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}