const fs = require('fs');
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = "Through my TCCI internship, I contributed to production oriented digital platforms and worked with complex requirements, dashboards, role based interfaces, and database driven systems.";
const replaceStr = "Through my MMSC internship, I contributed to production-oriented digital platforms and worked with complex user requirements, translating them into intuitive dashboards and engaging role-based interfaces.";

appJsx = appJsx.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
