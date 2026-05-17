import mongoose from "mongoose";

// Renamed from 'connetDB' to 'connectDB'
const connectDB = async () => {
  try {
    // Add logging for a pending connection
    mongoose.connection.on("connecting", () => console.log("DATABASE Connecting..."));
    mongoose.connection.on("connected", () => console.log("DATABASE Connected"));
    mongoose.connection.on("error", (err) => console.log("DATABASE Connection Error: ", err));
    mongoose.connection.on("disconnected", () => console.log("DATABASE Disconnected"));

    // Attempt the connection
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
    
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    // Exit process with failure code if connection fails
    process.exit(1);
  }
};

// Export corrected function name
export default connectDB;