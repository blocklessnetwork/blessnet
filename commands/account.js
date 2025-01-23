const { Command } = require('commander');
const { v4: uuidv4 } = require('uuid');
const CONSTANTS = require('../lib/constants');
const fs = require('fs');
const path = require('path');
const os = require('os');

const accountCommand = new Command('account');

accountCommand
    .description('Manage your account')
    .action(() => {
        // Simulate checking login status
        const isLoggedIn = false; // Replace with actual login status check
        if (isLoggedIn) {
            console.log('You are logged in.');
        } else {
            console.log('You are not logged in.');
        }
    });

accountCommand
    .command('login')
    .description('Login to your account')
    .action(() => {
        const guid = uuidv4();
        console.log(`Please login at: ${CONSTANTS.authHost}/?lid=${guid}&clientid=${CONSTANTS.blessAuthClientId}`);

        const checkLoginStatus = async () => {
            try {
                const response = await fetch(`${CONSTANTS.authHost}/api/verify-activity`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        lid: guid,
                        clientid: CONSTANTS.blessAuthClientId
                    })
                });
                const text = await response.text();
                if (text.length === 0) {
                    return;
                }

                const data = JSON.parse(text); // Parse the response text as JSON
                if (data.token) {
                    console.log('Login successful!');
                    const blessnetDir = path.join(os.homedir(), '.blessnet');
                    if (!fs.existsSync(blessnetDir)) {
                        fs.mkdirSync(blessnetDir);
                    }
                    fs.writeFileSync(path.join(blessnetDir, 'auth_token'), data.token);
                    process.exit(0);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };

        const intervalId = setInterval(checkLoginStatus, 5000);
        setTimeout(() => {
            clearInterval(intervalId);
            console.log('Login check timed out.');
        }, 180000); // 3 minutes
    });

module.exports = accountCommand;
