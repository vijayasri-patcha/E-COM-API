import jwt from "jsonwebtoken";
import { ApplicationError } from "../error-handler/applicationError.js";

function jwtAuth(req, res, next) {

    // Get JWT from HttpOnly cookie
    const token = req.cookies.token;

    if (!token) {
        throw new ApplicationError("Unauthorized", 401);
    }

    try {

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("JWT Payload:", payload);

        req.userID = payload.userId;
        req.type = payload.type;

        next();

    } catch (err) {

        throw new ApplicationError(
            "Unauthorized",
            401
        );
    }
}

export default jwtAuth;