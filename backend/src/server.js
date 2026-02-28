import dotenv from "dotenv";
import connectDB from "./db/db-config.js";
import app from "./app.js";

// load environment variables
dotenv.config();

// connect to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  });

// app.get("/", (req, res) => {
//   res.send("Hello from the backend!");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
