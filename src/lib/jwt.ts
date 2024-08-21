import jwt from "jsonwebtoken";
const generateToken = (payload: any, expiresIn: string = "10m") => {
    return jwt.sign(payload, process.env.JWT_SECRET || "mySecret", {
        expiresIn,
    });
};

const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET || "mySecret");
};

export { generateToken, verifyToken };
