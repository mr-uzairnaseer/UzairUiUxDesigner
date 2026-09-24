const puppeteer = require('puppeteer');

const sites = [
  { slug: 'dialerbot', url: 'https://dialerbot.online' },
  { slug: 'encova', url: 'https://encovasolutions.com' },
  { slug: 'crowdwave', url: 'https://crowdwave.eu/' },
  { slug: 'greenman', url: 'https://greenman-gbp.com/' },
  { slug: 'mmsc', url: 'https://www.mmsc.pk/' },
  { slug: 'automark', url: 'https://automarkagency.com/' },
  { slug: 'codebypass', url: 'https://codebypass.com' },
  { slug: 'techwebninja', url: 'https://techwebninja.com/' },
  { slug: 'otpfire', url: 'https://otpfire.com/' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const site of sites) {
    console.log('Capturing ' + site.url);
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.screenshot({ path: 'public/' + site.slug + '.png' });
      await page.close();
    } catch (e) {
      console.error('Failed to capture', site.url, e.message);
    }
  }
  await browser.close();
})();
