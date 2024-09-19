const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/config.env" });
const app = require(__dirname + "/app");
const mongoose = require("mongoose");

async function connectDB() {
  try {
    const DB = process.env.DB_CONNECTION_STRING.replace(
      "<password>",
      process.env.DB_PASSWORD
    );
    await mongoose.connect(DB);
    console.log("Successfully conect to db");
  } catch (err) {
    console.error("Error to connecr DB", err);
  }
}
connectDB();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server started at localHost ${port}`);
});
