<p align="left">
  <img src="https://img.shields.io/badge/status-working-brightgreen" alt="Status Badge" />
  <img src="https://img.shields.io/npm/v/keydrop_tool.svg" alt="npm version">
  <img src="https://img.shields.io/npm/dt/keydrop_tool.svg" alt="npm downloads">
  <img src="https://img.shields.io/npm/l/keydrop_tool.svg" alt="npm license">
</p>

</p>


# KeyDrop_Tool (Key-drop scripting)

KeyDrop_Tool is a set of scripts designed to interact with Key-Drop.com, enabling users to automate various tasks with ease and efficiency. It offers functionalities such as opening free cases, joining giveaways and claiming Golden Codes, all while navigating through the site's security measures. Keydrop_Tool sets a new standard for functionality in the realm of online botting tools.
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Requirements
To use KeyDrop_Tool, you need to have the following installed:

### 1. **Node.js and npm**
- **Node.js**: Puppeteer is a Node.js library, so you'll need Node.js installed on your system. You can download it from the [official Node.js website](https://nodejs.org/).
- **npm**: This is the Node package manager, which comes with Node.js. You'll use npm to install Puppeteer.

*After installing, you can check if Node.js and npm are correctly installed by running these commands in your terminal:*

```bash
node -v
npm -v
```

*Once you have Node.js and npm, you can install Puppeteer with npm. Open a terminal and run:*
```bash
npm install puppeteer
```
### 2. **Google chrome**

You need Google Chrome on your system for creating and saving user profiles. By specifying your Chrome user data directory in Puppeteer, you can make it use your saved profiles, including cookies and login credentials, which can be helpful for automation tasks.

You can download Google Chrome from the [official Google Chrome website](https://www.google.com/chrome/)

## Installation
Install KeyDrop_Tool easily using npm:

```bash
npm pack keydrop-tool #npm install sometimes fails, to ensure the installation user npm pack instead.
```
## Configuration

Before using Keydrop_Tool, you need to Set up chrome profiles and adjust the three Node.js scripts provided. Modify the path of your Chrome user data directory to point to your specific user profile location.

### Creating a Chrome Profile

**You need to manually create as many Chrome profiles as Keydrop accounts you want to use. This ensures that each account has a unique browser environment.**
To create a new Chrome profile:

- Open Google Chrome and click on the profile icon in the upper-right corner of the browser window.
- Select Add at the bottom of the menu to create a new profile.
- Follow the prompts to set up your profile name and icon.
- Once created, Chrome will save a separate profile folder for each user under the path, should be something like: C:\\Users\\yourName\\AppData\\Local\\Google\\Chrome\\User Data. Each new profile will be in a subfolder named Profile 1, Profile 2, and so on.

### Adjusting Node.js files
After creating these profiles, you can specify the path of your chrome profiles in the pupeteer argument part of your Node.js, for example:

```javascript
'--user-data-dir=C:\\Users\\YOURNAME\\AppData\\Local\\Google\\Chrome\\User Data' // The path should look something like this
```
### Adjusting the Number of Profiles
By default, the scripts are configured to handle 70 profiles. If you have fewer or more profiles, you need to adjust this number in each script to match the number of KeyDrop accounts you want to automate.

How to adjust the number of profiles:
- Open each of the following scripts: dailyCase_script.js, giveaways_script.js, and goldenCodes_script.js.
- In each script, find the following line:
```javascript
for (let i = 1; i <= 70; i++) {
```
- Change the number 70 to the number of profiles you want to automate.


## Usage

Here’s a quick guide to get started with Keydrop_Tool:

### 1. **Redeem Golden Codes**

To use the script for redeeming golden codes on multiple accounts, simply run the `redeemGoldenCodes_script.js` file. It will prompt you for a golden code, then apply it across 70 profiles:

```javascript
node redeemGoldenCodes_script.js
```
When prompted, enter the golden code:
```javascript
Enter GC: your_golden_code_here
```
The script will open each profile, apply the code, and display the result for each profile. Profiles with more than 1400 coins will have cases opened automatically.

---
### 2. Claim Daily Cases
To automate claiming daily cases, run the `dailyCase_script.js` file. It iterates over 70 profiles, attempts to claim a free daily case on Keydrop, and logs the success or failure for each account:
```javascript
node dailyCase_script.js
```
This script will simulate human interaction with the daily case button on Keydrop for each profile. It’s useful for regularly claiming daily cases without manual effort.

---
### 3. Join Giveaways
To join a specific giveaway across multiple profiles, run the `giveaways_script.js` file. When you run this script, it will prompt you for the giveaway link, then access it with each eligible profile and attempt to join.
```javascript
node giveaways_script.js
```
When prompted, enter the giveaway link:
```javascript
Link: your_giveaway_link_here
```
This script will shuffle the profiles and attempt to join the giveaway for each one, logging the outcome for each attempt.

---
## Contributing
Contributions to KeyDrop_Tool are welcome! Please read the GitHub contributing guidelines to get started.                                                     
Since I wont be updating it anymore, this version of KeyDrop_Tool will get outdated.

## License
KeyDrop_Tool is MIT licensed, as found in the LICENSE file.


---

*Note: KeyDrop_Tool is developed and maintained by lluiscom. This project is not affiliated with Key-Drop.com. Use KeyDrop_Tool responsibly and in compliance with the website's terms of service.*
