import passport from "passport";
import { isValidString } from "../../utils/utils";
import { getchats } from "./Handler";
import { log } from "util";


const jwtAuthenticate = passport.authenticate("jwt", { session: false });

export default router => {
    router.post('/chats', jwtAuthenticate, (req, res) => {
        const chatlist = req.body.chatlist;
        getchats(chatlist).then(r => {
            res.status(r.statusCode).json({
                success: true,
                data: r.data,
                message: r.message
            });
        }).catch(err => {
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message
            });
        });
    });
};
