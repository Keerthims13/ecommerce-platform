const app = require("./app");
require("dotenv").config();
require("./src/config/db"); 

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Visit http://localhost:${PORT}`);
  console.log(`\n🔌 API ready at http://localhost:${PORT}/api`);
  console.log(`Press Ctrl+C to stop the server\n`);
});

// Handle errors
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log("Please close the other server or use a different port");
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
