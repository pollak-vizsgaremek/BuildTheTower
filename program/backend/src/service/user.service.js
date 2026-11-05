import { User } from "../model/User.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";
import {
  encrypt,
  passwordCompare,
} from "../utils/passwordEncrypt.js";
import { removeData } from "../utils/removeData.js";


//TODO: Login, Register service function

export async function login(
  username,
  password,
) {
  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (!user) {
    return {
      msg: "Hibás felhasználónév vagy jelszó!",
      status: 401,
    };
  }

  if (
    !passwordCompare(password, user.get("password"))
  ) {
    return {
      msg: "Hibás felhasználónév vagy jelszó!",
      status: 401,
    };
  }

  return {
    msg: "Sikeres bejelentkezés!",
    status: 200,
    accessToken: generateAccessToken(
      user.get({ plain: true }),
    ),
    refreshToken: generateRefreshToken(
      user.get({ plain: true }),
    ),
  };
}

export async function register(user) {
  const encryptedPassword = encrypt(user.password);

  const result = await User.create({
    username: user.username,
    password: encryptedPassword,
    fullName: user.fullName,
    email: user.email,
    role: 2,
  });

  return {
    msg: "Sikeres regisztráció!",
    status: 201,
    accessToken: generateAccessToken(
      result.get({ plain: true }),
    ),
    refreshToken: generateRefreshToken(
      result.get({ plain: true }),
    ),
  };
}
