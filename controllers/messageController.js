import { Server, Socket } from "socket.io";
import User from "../models/User.js";
import Message from "../models/Message.js";

class MessageController {
    /**
     *
     * @param {Server} io
     * @param {Socket} socket
     * @param {*} msg
     */
    constructor(io, socket, msg) {
        const uuid = socket.request.session.uuid;
        (async () => {
            const user = await User.findByPk(uuid);
            if (user == null || !user.uuid) {
                return socket.disconnect();
            };
            const msgData = await Message.create({uuid: uuid, content: msg});
            io.emit('message', {conversation: 1, user: {uuid: user.uuid, username: user.username, rk: user.rank, crt: user.certified}, content: msg, msgid: 1, date: new Date(msgData.createdAt), sid: socket.id});
        })();
    }

    edit(content) {
        this.content = content;
    }
}

export default MessageController;
