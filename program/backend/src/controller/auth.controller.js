import { Router } from "express";
import {
  login,
  register,
} from "../service/user.service.ts";
import User from "../types/User.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json("A felhasználónév és jelszó kötelezőek!");
  }

  try {
    const data = await login(username, password);

    res.status(data.status).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const user = req.body;

    const data = await register(user);

    res.status(data.status).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
