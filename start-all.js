const { exec } = require("child_process");
const path = require("path");

// Paths to your backend and frontend folders
const backendPath = path.join(__dirname, "backend");
const frontendPath = path.join(__dirname, "factifyai");

// --- Start Backend ---
console.log("🚀 Starting Flask backend...");
exec(`start cmd /k "cd /d ${backendPath} && python app.py"`, (error) => {
  if (error) {
    console.error("Backend startup error:", error);
  }
});

// --- Start Frontend ---
console.log("🚀 Starting Next.js frontend...");
exec(`start cmd /k "cd /d ${frontendPath} && npm run dev"`, (error) => {
  if (error) {
    console.error("Frontend startup error:", error);
  }
});

console.log("🔥 Both servers are now launching...");
console.log("👉 Frontend:  http://localhost:3000");
console.log("👉 Backend:   http://localhost:5000/analyze");
