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
// Importar el módulo fs para leer archivos
const fs = require('fs'); 

// Leer el archivo JSON para obtener el nombre de usuario
const config = JSON.parse(fs.readFileSync('user_config.json', 'utf-8'));
const userName = config.userName;
console.log(`Nombre de usuario cargado: ${userName}`); // Confirmar que el nombre se ha cargado correctamente

const puppeteer = require('puppeteer'); // Pupeteer is required in order to run the code
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// This initial function asks for the giveaway link
const askForLink = () => {
  return new Promise((resolve) => {
    readline.question('Link: ', (url) => {
      resolve(url);
      readline.close();
    });
  });
};

/* This function creates an array of profile numbers ranging from 1 to 70, ensuring each set of 10 numbers
is generated separately, then combines these sets into one 70-lenght array and shuffles each number randomly
IMPORTANT: This requires YOU to make some adjustments on the code (explained down below)        */

 /* Im using sets of 10 numbers each set, so a set represents 10 profiles (10 steam accounts). That's because I deposited the money required for the giveaways in sets/groups of 10 profiles
 so I could deposit sets on separated days (f.e. one set every day till they are all elegible for giveaways, this meant in my case deposition manually 10 accounts (1 set) per day).
 This was done to not have to deposit 70 times manually on a single day, which could be frustrating
 14 days after a set is renewed, it goes unelegible for participating in giveaways (page's rules) so it was easy to keep track of which set was still active and disable it (14 days after the deposit)
 changing its array lenght to 0, or depositing again the keep it renewed. */

const generateAndShuffleProfiles = () => {
  const profiles = [...Array.from({ length: 10 }, (_, i) => i +  1),  // Array contains 01-10   //Set elegibility ends xx-xx-2024 <-- Update it depending on your dates and keep track of it
                   
		    ...Array.from({ length: 10 }, (_, i) => i + 11),  // Array contains 11-20   //Set elegibility ends xx-xx-2024 <-- Update it depending on your dates and keep track of it
                   
		    ...Array.from({ length: 10 }, (_, i) => i + 21),  // Array contains 21-30   //Set elegibility ends xx-xx-2024 <-- Update it depending on your dates and keep track of it

                    ...Array.from({ length: 10 }, (_, i) => i + 31),  // Array contains 31-40   //Set elegibility ends xx-xx-2024 <-- Update it depending on your dates and keep track of it

                    ...Array.from({ length: 10 }, (_, i) => i + 41),  // Array contains 41-50   //Set elegibility ends xx-xx-2024 <-- Update it depending on your dates and keep track of it

                    ...Array.from({ length: 10 }, (_, i) => i + 51),  // Array contains 51-60   //Set elegibility ends xx-xx-2024 <-- Update it depending on your dates and keep track of it
                    // The array below is an example of a disabled set (lenght: 00)
		    ...Array.from({ length: 00 }, (_, i) => i + 61)]; // Array contains 61-70   //Set elegibility ends xx-xx-2024 <-- Update it depending on your dates and keep track of it

  return profiles.sort(() => Math.random() - 0.5); // All the eligible sets get sorted
};

(async () => {
  const url = await askForLink(); // The Script asks for a giveaway link
  const profilesToVisit = generateAndShuffleProfiles(); // profiles get generated and shuffeled

  while (profilesToVisit.length > 0) {
    const profileIndex = profilesToVisit.pop(); // Extracts one (random) profile number of the shuffeled array of 0-70 numbers. 
    
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
        //HERE YOU NEED TO PUT YOUR CHROME PROFILES DATA CARPET LOCATION, FOR EACH PROFILE YOU'LL HAVE ONE DIFFERENT DATA CARPET
        `--user-data-dir=C:\\Users\\${userName}\\AppData\\Local\\Google\\Chrome\\User Data`, //The location should look like something like this
        `--profile-directory=Profile ${profileIndex}`
      ]
    });

    // Start of execution flow for one profile:
    const page = await browser.newPage();
    await page.goto(url); // Redirects to specified URL 

    try {
      await page.waitForTimeout((Math.random() * (3000 - 2000 + 1)) + 2000); // Random timeout for simulating human interaction

      // Waits for the "JOIN GIVEAWAY" button to be displayed and ready to interact. Button is identified via CSS class. Once identified, it gets clicked
      const buttonSelector = '.button.mt-4.h-13.w-full.whitespace-normal.bg-gold.text-left.leading-none.text-navy-900.hover\\:bg-gold-400.disabled\\:bg-navy-400.disabled\\:text-navy-100';
      await page.waitForSelector(buttonSelector, { timeout: 5000 });
      await page.click(buttonSelector);

      // Depending on the outcome of the event, you'll get a feedback message: Joined/NOT joined with green/red color.
      console.log(`\x1b[42m\x1b[32m%s\x1b[0m - Perfil ${profileIndex} - Joined`, 'Éxito'); // Success message
      await page.waitForTimeout((Math.random() * (3000 - 2000 + 1)) + 2000); // Small random delay
    } catch (error) {
      console.log(`\x1b[41m\x1b[37m%s\x1b[0m - Perfil ${profileIndex} - NOT Joined`, 'Error'); // Error message
    }
    //End of execution flow for one random profile
    await browser.close();
  }
  // End of execution
  console.log('--END--');
})();
