const puppeteer = require('puppeteer');
const fs = require('fs');

// Get URL from environment variable, default to a placeholder if not set
const url = process.env.SCRAPE_URL || 'https://example.com';
const outputFile = 'scraped_data.json';

(async () => {
  console.log(`Starting scrape for URL: ${url}`);

  try {
    // Launch Puppeteer using the system-installed Chromium
    // Pass necessary flags for running in Docker/headless environments [cite: 13]
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium', // Path to Chromium installed via apt
      headless: true,
      args: [
        '--no-sandbox', // Required for running as root in Docker
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Prevent /dev/shm errors
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // Only if necessary, may impact stability
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' }); // Wait for network activity to cease
    console.log('Navigation complete.');

    // Extract data: page title and the text content of the first H1 tag [cite: 14]
    const data = await page.evaluate(() => {
      const title = document.title;
      const firstHeadingElement = document.querySelector('h1');
      const firstHeading = firstHeadingElement ? firstHeadingElement.textContent.trim() : 'No H1 found';
      return { title, firstHeading };
    });

    console.log('Data extracted:', data);

    await browser.close();
    console.log('Browser closed.');

    // Write data to JSON file [cite: 14]
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Scraped data saved to ${outputFile}`);

  } catch (error) {
    console.error(`Error during scraping: ${error.message}`);
    // Write an error structure to the output file so the Python app knows
    const errorData = { error: `Failed to scrape ${url}`, details: error.message };
     fs.writeFileSync(outputFile, JSON.stringify(errorData, null, 2), 'utf8');
    process.exit(1); // Exit with error code
  }
})();
