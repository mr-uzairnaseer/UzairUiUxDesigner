const fs = require('fs');
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = "I'm currently looking for internship and junior developer roles in Flutter, frontend, and UI/UX. If you've got a screen that needs designing or an app that needs building, I'd love to hear from you.";
const replaceStr = "I'm currently looking for full-time UI/UX Designer roles and freelance design projects. If you've got a user journey that needs refining or a digital product that needs a beautiful, intuitive interface, I'd love to hear from you.";

appJsx = appJsx.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
