const app = require("./app");
const connectDatabase = require("./config/database");

const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
	console.log(`ERROR: ${err.message}`);
	console.log("shutting down server due to uncaught exeption");
	process.exit(1);
});

// setting up config file
dotenv.config({ path: "backend/config/config.env" });

// connecting to database
connectDatabase();

// Setting up cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
	console.log(
		`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
	);
});

// handle unhadled promise rejection
process.on("unhandledRejection", (err) => {
	console.log(`ERROR: ${err.message}`);
	console.log(`shutting down the server due to unhandled promise rejection.`);
	server.close(() => {
		process.exit(1);
	});
});
