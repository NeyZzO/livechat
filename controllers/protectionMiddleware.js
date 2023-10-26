import User from "../models/User.js"

export async function checkIn(req, res, next){
    if (!req.session.uuid) { return res.redirect('/auth/login')};
    const user = await User.findOne({where: {uuid: req.session.uuid}});
    if(user == null) {
        req.sessionErrorMessage = "Invalid session";
        res.redirect('/auth/login');
        return;
    }
    req.user = user;
    next();
}