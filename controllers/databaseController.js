import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

class Database {
    static con = null;
    static startDatabase() {
        const {DB_USER, DB_PASS, DB_PORT, DB_DIALECT, DB_NAME, DB_HOST} = process.env;
        try {
            this.con = new Sequelize(
                `${DB_DIALECT}://${DB_USER}:${DB_PASS}@${DB_HOST}${DB_PORT != null?':' + DB_PORT:''}/${DB_NAME}`, {logging: false}
            );
            console.log("Connexion à la base de données établie avec succès.");
        } catch (err) {
            console.error("Erreur lors de la connexion à la base de données");
            console.error(err.message);
        }
    }

    static getCon() {
        return this.con;
    }

    static async testConnection() {
        try {
            await this.con.authenticate();
            return true;
        } catch (err) {
            console.error("Erreur lors de la connection à la base de données");
            console.log(err.message);
        } finally {
            return false;
        }
    }
}

export default Database;
