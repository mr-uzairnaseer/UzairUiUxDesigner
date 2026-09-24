const fs = require('fs');
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

const descriptions = {
  dialerbot: "A comprehensive UI/UX design for DialerBot, an automated calling platform. Focused on clear data visualization and intuitive campaign management interfaces.",
  encova: "Designed the digital experience for Encova Solutions, highlighting their enterprise IT and business consulting services with a clean, professional aesthetic.",
  crowdwave: "Crafted intuitive web layouts for CrowdWave, a community-based crowd shipping platform, focusing on user engagement, trust, and accessible logistics design.",
  greenman: "Developed the brand identity and responsive web design for Greenman GBP, a specialized service provider, emphasizing environmental themes and clarity.",
  mmsc: "Revamped the digital platform for MMSC, focusing on clear navigation, modern aesthetics, and improved user journeys for their educational and medical resources.",
  automark: "Created a sleek, conversion-optimized design for AutoMark Agency with strong visual hierarchy, modern typography, and clear calls-to-action.",
  codebypass: "Designed a clean and efficient interface for CodeBypass, an online platform for development resources, prioritizing readability and quick access to tools.",
  techwebninja: "Delivered a full web design package for Tech Web Ninja, an agency specializing in web design, high-converting sales funnels, and CRM solutions.",
  otpfire: "Architected the user experience for OTPFire, a secure authentication service, prioritizing simplicity, trust signals, and a frictionless integration guide."
};

Object.entries(descriptions).forEach(([slug, desc]) => {
  const regex = new RegExp('(slug: "' + slug + '"[\\\\s\\\\S]*?desc: )".*?"');
  appJsx = appJsx.replace(regex, '$1"' + desc + '"');
});

fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
