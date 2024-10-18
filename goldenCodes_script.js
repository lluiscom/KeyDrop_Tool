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
const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/*
Function to append data to a CSV file.
This function takes an array of data (data) and the file name (filePath),
then adds a new line to the CSV file.
*/
function appendToCSV(data, filePath) {
    fs.appendFileSync(filePath, `${data.join(',')}\n`, (err) => {
        if (err) throw err;
    });
}

/*
Function to update the coin amount for a specific profile.
Reads the CSV file, finds the profile by ID, and updates the coin value
before overwriting the CSV file.
*/
async function updateCoins(profile, amount) {
    const csvFilePath = 'perfiles.csv';
    const lines = fs.readFileSync(csvFilePath, 'utf-8').split('\n');
    const updatedLines = lines.map(line => {
        const values = line.split(',');
        if (values[0] === profile.toString()) {
            values[2] = `"${amount}"`;
        }
        return values.join(',');
    });
    fs.writeFileSync(csvFilePath, updatedLines.join('\n'));
    return amount;
}

let profilesOver1400Coins = [];
let consoleOutput = '';

// Ask the user for the promo code and store the entered value
readline.question('Enter GC: ', async (promo_code) => {
    readline.close();

    const csvFilePath = 'perfiles.csv';
    // Create the CSV file with headers
    fs.writeFileSync(csvFilePath, 'Id,ProfileName,Coins,Value\n', (err) => {
        if (err) throw err;
    });

    /*
    Loop that opens 70 different user profiles on Keydrop.com using Puppeteer.
    Each profile opens with a specific profile directory to save individual settings.
    */
    for (let i = 1; i < 71; i++) {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--disable-gpu',
                '--window-size=1920,1080',
                '--start-maximized',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
                //HERE YOU NEED TO PUT YOUR CHROME PROFILES DATA CARPET LOCATION, FOR EACH PROFILE YOU'LL HAVE ONE DIFFERENT DATA CARPET
                '--user-data-dir=C:\\Users\\yourName\\AppData\\Local\\Google\\Chrome\\User Data', //The location should look like something like this
                '--force-device-scale-factor=1.5',
                `--profile-directory=Profile ${i}`
            ]
        });

        const page = await browser.newPage();
        // Navigate to the URL with the promo code
        const url = `https://key-drop.com/en/?goldenCode=${promo_code}`;
        await page.goto(url);

        const randomDelays = Math.floor(Math.random() * (250 - 120 + 1)) + 120;

        // Search for and click the "Apply" button to apply the promo code
        const [button] = await page.$x("//button[contains(., 'Apply')]");
        if (button) {
            await button.click();
        } else {
            console.log('\x1b[41m\x1b[37mError: The "Apply" button was not found\x1b[0m');
            await browser.close();
            continue;
        }

        // Wait a bit and simulate an action to close the browser
        await page.waitForTimeout(randomDelays);
        await page.keyboard.press('Escape');
        const profileSelector = '.hidden.flex-col.gap-3.md\\:flex';
        await page.waitForSelector(profileSelector, { visible: true });

        // Get the profile name from the page
        const profileName = await page.evaluate((sel) => {
            const profileElement = document.querySelector(sel);
            return profileElement ? profileElement.innerText : 'Profile name not found';
        }, profileSelector);

        // Get the profile's value, representing the balance
        const value = await page.evaluate(() => {
            const valueElement = document.querySelector('.text-sm.font-bold.tabular-nums.text-pink-200');
            return valueElement ? valueElement.innerText : 'No value';
        });

        // Check for any error in the "Apply" button
        const error = await page.evaluate(() => {
            const errorButton = document.evaluate("//button[contains(., 'Apply')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (errorButton) {
                return 'error';
            } else {
                const errorMsg = document.querySelector('.absolute.left-0.right-0.top-full.mt-2.rounded-lg.bg-\\[\\#231111\\].px-3.py-2.text-xs.text-giveaway-challenger');
                const errorMsgText = errorMsg ? errorMsg.innerText : null;
                return errorMsgText;
            }
        });

        // Get the user's coin balance
        const coins = await page.evaluate(() => {
            const coinSpan = document.querySelector('span[data-testid="header-account-gold-balance"]');
            return coinSpan ? parseInt(coinSpan.innerText.replace(/,/g, '')) : 0;
        });

        if (coins > 1400) {
            profilesOver1400Coins.push({ profile: i, coins });
        }

        const formattedProfileName = profileName.padEnd(15);
        const formattedCoins = `\x1b[33m${coins} coins\x1b[0m`.padEnd(18);
        const formattedValue = `\x1b[38;5;177mValue: ${value}\x1b[0m`;

        // Append the data to the CSV file
        appendToCSV([i, `"${profileName}"`, `"${coins}"`, `"${value}"`], csvFilePath);

        // Display the profile status in the console
        let outputLine = '';
        if (error) {
            outputLine = `${error.padEnd(5)} - Profile ${i} processed - Profile Name: ${profileName.replace(/\d+/g, '')} ------- ${formattedCoins} - ${formattedValue}\n`;
        } else {
            outputLine = `Activated - Profile ${i.toString().padStart(2, ' ')} processed - Profile Name: ${profileName.replace(/\d+/g, '')} - ${formattedCoins} - ${formattedValue}\n`;
        }

        console.log(outputLine);
        consoleOutput += outputLine;
        await browser.close();
    }

    /*
    Second loop for profiles with more than 1400 coins.
    Opens a specific case on the site and displays the prize value.
    */
    console.log("\n==Opening Cases==");
    for (const { profile, coins } of profilesOver1400Coins) {
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--disable-gpu',
                '--window-size=1920,1080',
                '--start-maximized',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
                '--user-data-dir=C:\\Users\\lluis\\AppData\\Local\\Google\\Chrome\\User Data',
                `--profile-directory=Profile ${profile}`
            ]
        });

        const page = await browser.newPage();
        await page.goto('https://key-drop.com/en/skins/category/amethyst-light');
        await page.waitForTimeout(Math.floor(Math.random() * (500 - 250 + 1)) + 250);
        await page.waitForSelector('button[data-testid="case-open-btn"]');
        await page.click('button[data-testid="case-open-btn"]');
        await page.waitForTimeout(Math.floor(Math.random() * (999 - 499 + 1)) + 499);
        await page.click('button[data-testid="case-open-btn"]');
        await page.waitForSelector('span[data-testid="after-open-sell-items-price-on-btn"]');
        
        // Get the prize value
        const priceValue = await page.$eval('.z-10.col-start-1.row-start-2.w-full.self-end.justify-self-start.p-3.font-semibold.uppercase.leading-tight.md\\:row-start-1.md\\:p-5.css-1ncd2oa', element => {
            const textContent = element.textContent;
            const match = textContent.match(/^[^$]+/);
            return match ? match[0].trim() : 'Price not found';
        });

        const itemPrice = await page.$eval('[data-testid="case-roll-won-item-price"]', element => element.textContent);
        console.log(`Profile ${profile}: \x1b[32m${priceValue}\x1b[0m\t\x1b[38;5;177m${itemPrice}\x1b[0m`);
        const updatedCoins = await updateCoins(profile, coins - 1400);
        await page.waitForTimeout(Math.floor(Math.random() * (1000 - 650 + 1)) + 650);
        await browser.close();
    }
    console.log("==END==");
});
