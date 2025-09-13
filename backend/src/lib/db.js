import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected`);
  } catch (error) {
    console.log("Unable to connect to DB: ", error);
    process.exit(1); //exiting with failure
  }
};
