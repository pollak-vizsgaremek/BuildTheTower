import jwt from "jsonwebtoken";
import User from "../types/User.js";

export function generateAccessToken(user) {

  let token = jwt.sign(
    {
      email: user.email,
      roles: user.role,
      type: "Bearer",
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: "HS256",
      issuer: "http://localhost:3300",
      expiresIn: 10 * 60 * 1000, // 10 perc
      subject: "" + user.id,
    },
  );

  return token;
}

function generateRandomString(length) {
  let res = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    res += characters.charAt(
      Math.floor(Math.random() * charactersLength),
    );
  }

  return res;
}

export function generateRefreshToken(user) {
  let refreshToken = jwt.sign(
    {
      value: generateRandomString(20),
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      subject: "" + user.id,
      algorithm: "HS256",
      issuer: "http://localhost:3300",
      expiresIn: 1 * 7 * 24 * 60 * 60 * 1000, // 1 hét
    },
  );

  return refreshToken;
}
