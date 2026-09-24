const fs = require('fs');
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

const sites = ['dialerbot', 'encova', 'crowdwave', 'greenman', 'mmsc', 'automark', 'codebypass', 'techwebninja', 'otpfire'];

sites.forEach(slug => {
  const regex = new RegExp('(slug: "' + slug + '"[\\\\s\\\\S]*?liveLink: ".*?",\\\\s*)images: \\\\[\\\\]');
  appJsx = appJsx.replace(regex, '$1images: ["/' + slug + '.png"]');
});

fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
