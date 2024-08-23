const jwt = require("jsonwebtoken");
const jwtPassword = "secret";

function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("Authorization header is missing");
        return res.status(401).json({
            msg: "Authorization header is missing",
        });
    }

    const tokenParts = authHeader.split(" ");
    
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        console.log("Invalid Authorization format");
        return res.status(401).json({
            msg: "Authorization format is Bearer <token>",
        });
    }

    const jwtToken = tokenParts[1];

    try {
        const decoded = jwt.verify(jwtToken, jwtPassword);
        const username = decoded.username;

        if (username) {
            req.user = decoded;  // Attach the decoded token to the request object
            next();
        } else {
            console.log("Invalid credentials");
            return res.status(401).json({
                msg: "Invalid credentials",
            });
        }
    } catch (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({
            msg: "Token is not valid",
        });
    }
}

module.exports = adminMiddleware;
