const fs = require('fs');
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

const sites = ['dialerbot', 'encova', 'crowdwave', 'greenman', 'mmsc', 'automark', 'codebypass', 'techwebninja', 'otpfire'];

let siteIndex = 0;
appJsx = appJsx.replace(/images: \[\]/g, () => {
  if (siteIndex < sites.length) {
    const replacement = 'images: ["/' + sites[siteIndex] + '.png"]';
    siteIndex++;
    return replacement;
  }
  return 'images: []';
});

fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
