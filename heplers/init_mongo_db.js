const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: "auth",
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log("---", err.message));

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log(`MongoDB connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
