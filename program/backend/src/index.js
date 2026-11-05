import e from "express";
import cors from "cors";
import { authRouter } from "./controller/auth.controller.js";
import "dotenv/config";
import { sequelize } from "./utils/database.js";

const app = e();

app.use(e.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

app.use("/api/v1/auth", authRouter);

app.listen(3300, async () => {
  try {
    await sequelize.sync({alter});
    console.log("Elindult!");
  } catch (error) {
    console.log(error);
  }
});
