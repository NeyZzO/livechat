import Database from "./controllers/databaseController.js";
import { hashPassword } from "./controllers/hashController.js";
import User from "./models/User.js";
(async () => {
    // const db = Database.getCon();
    try {
        const username = process.argv[2];
        const email = process.argv[3]
        const pass = process.argv[4];
        console.log(username, email)
        const test = await User.findAndCountAll({where: {username: username}});
        const test2 = await User.findAndCountAll({where: {email: email}});
        if (test.count > 0 || test2 > 0) return console.log('Erreur, email ou username déja utilisé')
        let user = await User.create({
            username: username,
            email: email,
            password: await hashPassword(pass),
        })
        console.log("Succès", user)
        
    } catch (err){
        console.error(err)
    }
})();
