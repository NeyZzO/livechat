import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

class MailController {
    static tra = null;

    static startController() {
        this.tra = nodemailer.createTransport({
            host: 'localhost', // MailHog fonctionne en local
            port: 1025, // Le port par défaut de MailHog
            ignoreTLS: true, // MailHog n'utilise pas TLS
        });
    }
    static transporter(){
        return this.tra;
    }
    /**
     * Function that sends a verification email with a unique token;
     * @param {string} target 
     * @returns {boolean} If the mail has been sent correctly
     */
    static sendVerificationMail(token, username, email) {
        const rawFile = fs.readFileSync(path.resolve('storage/emailsTemplates/verification.html'))
        let content = rawFile.toString().replace('[USERNAME]', username).replace('{TOKENHERE}', token);
        content = content.replace('{TOKENHERE}', token)
        content = content.replace('{TOKENHERE}', token)
        const mailOptions = {
            from: 'no-reply@dagochat.net', // L'adresse e-mail de l'expéditeur
            to: email, // L'adresse e-mail du destinataire
            subject: 'Please verify your email', // Sujet de l'e-mail
            html: content, // Contenu de l'e-mail au format texte
            // html: '<p>Bonjour, ceci est un e-mail de test envoyé depuis Node.js et MailHog.</p>', // Contenu de l'e-mail au format HTML
        };    
        console.log(content)
        this.tra.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
                return false;
            } else {
                return true;
            }
        });
    }
}


export default MailController