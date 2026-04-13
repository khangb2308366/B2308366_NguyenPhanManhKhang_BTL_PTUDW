require("dotenv").config(); 
const app = require("./app");
const { connectDB } = require("./config/index");

async function start() {
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    });
}

start();