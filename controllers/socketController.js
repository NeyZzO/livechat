import {Server} from "socket.io";
import {Server as httpServer} from "node:http" 
class SocketController {
    static io /** @type {Server} */;
    /**
     * 
     * @param {httpServer} server 
     * @returns 
     */
    static StartSocket(server) {
        SocketController.io = new Server(server);
        return SocketController.io;
    }
    /**
     * 
     * @returns {Server}
     */
    static getIo() {
        return SocketController.io;
    }
}

export default SocketController;