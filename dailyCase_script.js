/*
Check if Node.js and npm are installed
To install and use Puppeteer, you need to have Node.js and npm installed on your system.
You can check if they are already installed by running the following commands in the terminal:

    node -v
    npm -v

These commands will display the versions of Node.js and npm if they are installed.
If you don't have Node.js installed, you can download it from https://nodejs.org/

Once you have Node.js and npm installed, you can install Puppeteer using npm by running:
    
    npm install puppeteer

This command will install the latest version of Puppeteer and download a copy of Chromium 
that Puppeteer will use to run its functionalities.
*/

const puppeteer = require('puppeteer'); //Requires pupeteer

(async () => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  for (let i = 1; i < 71; i++) { // Iterates through 70 profiles, you can change it depending on how much accounts you have.
    const browser = await puppeteer.launch({
      headless: "new", // Uses the new headless implementation
      args: [          // Arguments to bypass KeyDrop's firewall
        '--disable-gpu',
        '--window-size=1920,1080',
        '--start-maximized',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
        //HERE YOU NEED TO PUT YOUR CHROME PROFILES DATA CARPET LOCATION, FOR EACH PROFILE YOU'LL HAVE ONE DIFFERENT DATA CARPET
        '--user-data-dir=C:\\Users\\yourName\\AppData\\Local\\Google\\Chrome\\User Data', //The location should look like something like this
        `--profile-directory=Profile ${i}` // Uses the profile number "i"
      ]
    });

    // Execution flow (pretty straightforward)
    const page = await browser.newPage();
    await page.goto('https://key-drop.com/en/daily-case');

    // Waits for the daily case button (identified via css class)
    try {
      await page.waitForSelector('span.button.button.button-light-green', { timeout: 5000 });
      await page.click('span.button.button.button-light-green');


     // Random time between 5000-7000ms to randomise interaction with the server
    const randomWaitTime = Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000;

    await page.waitForTimeout(randomWaitTime); 
    
    // Depending on the event outcome, you'll get a validating/error message with green/red color
      console.log('\x1b[42m\x1b[32m%s\x1b[0m - Case %d opened', 'Success', i);
    } catch (error) {
      console.log('\x1b[41m\x1b[37m%s\x1b[0m - Could not open the case %d', 'Error', i);
    }
    // Execution flow end for one profile
    await browser.close();
  }
    // end of execution
  console.log('--END--');
})();

