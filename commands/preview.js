const { Command } = require('commander');
const { startServer } = require('../lib/server');
const { run } = require('../lib/invoke'); // Corrected to use run function from invoke.js

const previewCommand = new Command('preview')
    .description('Preview your project');

previewCommand
    .command('serve')
    .description('Start the preview server')
    .action(() => {
        startServer();
    });

previewCommand
    .action(async () => { // Updated to use async/await
        try {
            let input = '';
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', chunk => {
                input += chunk;
            });
            process.stdin.on('end', async () => {
                try {
                    const result = await run({ stdin: input }); // Pass stdin input to run function
                    console.log(result);
                } catch (error) {
                    console.error('Error:', error);
                }
            });
            process.stdin.resume();
        } catch (error) {
            console.error('Error:', error);
        }
    });

module.exports = previewCommand;
