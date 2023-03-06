import express from "express";
const app = express();

// middleware imports
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import errorMiddleware from "./middleware/errors";

// import routes
import auth from "./routes/auth";
import user from "./routes/user";
import order from "./routes/order";
import product from "./routes/product";

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(fileUpload());

app.use("/api/v1", auth);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", product);

// Middleware to handle errors
app.use(errorMiddleware);

export default app;
