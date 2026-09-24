const fs = require('fs');
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

// I need to add image mapping to App.jsx for the new slugs
// Actually I can just replace `images: []` with `images: ["/SLUG.png"]` for each project

appJsx = appJsx.replace(/images: \[\](,\s*\n\s*\},|\s*\n\s*\},\s*\n\s*\{.*slug:\s*"dialerbot")/g, (match, p1) => {
  // Wait, regex might be tricky. Let's just do a simple replacement for each
  return match;
});

const sites = ['dialerbot', 'encova', 'crowdwave', 'greenman', 'mmsc', 'automark', 'codebypass', 'techwebninja', 'otpfire'];

sites.forEach(slug => {
  appJsx = appJsx.replace(
    new RegExp(\`slug: "\${slug}"[\\\\s\\\\S]*?images: \\\\[\\\\]\`),
    (match) => match.replace('images: []', \`images: ["/\${slug}.png"]\`)
  );
});

fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
