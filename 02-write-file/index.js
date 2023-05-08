const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

fs.open(filePath, 'a', (err) => {
    if (err) throw err;
});

function writeToFile(data) {
    fs.appendFile(filePath, data, (err) => {
        if (err) throw err;
    });
}

rl.setPrompt('Введите текст:');

rl.on('line', (input) => {
    if (input === 'exit') {
        console.log('\nВсего доброго!');
        process.exit(0);
    } else {
    writeToFile(input + '\n');
    rl.prompt();
    }
});

rl.on('SIGINT', () => {
    console.log('\nВсего доброго!');
    process.exit(0);
});

rl.prompt();







