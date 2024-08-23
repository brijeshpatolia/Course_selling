const jwtPassword = "secret";
const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const word = token.split(" ");
    const jwtToken = word[1];

    try {
        const decoded = jwt.verify(jwtToken, jwtPassword);
        const username = decoded.username;
        if (username) {
            next();
        } else {
            return res.status(401).json({
                msg: "Invalid credentials",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            msg: "Token is not valid",
        });
    }
}

module.exports = userMiddleware;
