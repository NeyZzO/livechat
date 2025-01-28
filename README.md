# Live Chat application

A simple livechat application like whatsapp

Unfinished project, maybe one day I'll finish it.

Requirements:
- NodeJS
- npm
- [MailHog](https://github.com/mailhog/MailHog) To simulate mail sending
- SQL Database (mariadb, postgresql) ideally Mariadb 

How to run:
Create a database according to your .env
Run `npm install` to install all dependencies
If you use postgresql, you'll need to install the driver: `npm i postgres`
Run `npm start` to start the server
It'll create all the tables by itself in the database.


It uses:
- [Sequelize](https://sequelize.org/) as its ORM (Object Relationnal Mapping)
- [express](https://expressjs.com) as its HTTP Server (Not served over HTTPS as it's not meant for production)
- [socket.io](https://socket.io/) for real time communication
- [EJS](https://ejs.co) as its templating engine

If you want to disable email verification, you'll need to go in file `models/User.js` and modify line 32 from `defaultValue: false` to `defaultValue: true`