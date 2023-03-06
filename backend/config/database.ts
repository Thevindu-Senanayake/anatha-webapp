import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose.set("strictQuery", false);

  mongoose
    .connect(process.env.DB_URI as string)
    .then((con) => {
      console.log(
        `MongoDB Database connected with host: ${con.connection.host}`
      );
    })
    .catch((error) => {
      console.log(`Failed to connect mongoDB \n ${error}`);
    });
};

export default connectDatabase;
