import express, { Express, Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import mongoose, { Error } from "mongoose";
import router from "./router";

const app: Express = express();

app.set("view engine", "ejs");

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", router());

const server = http.createServer(app);

app.get("/", (req: Request, res: Response) => {
  //res.render("index", { text: "World" });
  //res.download("src/index.ts",);
});

app.use(express.static(__dirname));

server.listen(8080, () => {
  console.log("Server running in http://localhost:8080/");
});

const MONGO_URL = process.env.MONGODB_CONNECTION_STRING;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => {
  console.error(error);
});
