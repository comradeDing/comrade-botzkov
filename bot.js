const { Client, Attachment } = require('discord.js');
var auth = require('./auth.json');

const numToArmsPosters = 30;
const client = new Client();
const myName = 'Comrade Botzkov';
var stfu = false;

client.on('ready', () => {
    console.log('Comrade Botzkov, reporting for duty.');
});

client.on('voiceStateUpdate', (oldMember, newMember) => {

    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    if(oldUserChannel === undefined && newUserChannel !== undefined) {

        console.log('Comrade %s connected to %s', newMember.user.username, newUserChannel.name);

        if(!newUserChannel.connection) {
            newUserChannel.join()
                .catch(console.error);
        }
        
        if(!stfu)
            newUserChannel.connection.playFile('./sound/anthem-clip.mp3');

        console.log('Number of members in %s: %d', 
            newUserChannel.name, 
            newUserChannel.members.size);

    } else if (newUserChannel === undefined) {
        
        console.log('Comrade %s disconnected from %s', oldMember.user.username, oldUserChannel.name);

        if(oldUserChannel.members.size < 2) {
            oldUserChannel.leave();
        }

        if(oldUserChannel.connection && !stfu)
            oldUserChannel.connection.playFile('./sound/taps-clip.mp3');
    }
});

client.on('message', message => {

    var args = verifyMessage(message);
    if(!args) return;
    
    simpleLog(message, args[0]);

    switch (args[0]) {
        case 'ping':
            message.channel.send('pong');
        break;
        case 'letsGo':
            let img;
            if(args.length > 1)
                img = randomImage();
            else
                img = image(args[1]);

            message.channel.send('@everyone FOR THE MOTHERLAND, COMRADES, TO ARMS', img);        

            client.voiceConnections.forEach(connection => {
                connection.playFile('./sound/ura.mp3');
            });
        break;
        case 'ura':
            message.channel.send(randomImage());
            client.voiceConnections.forEach(connection => {
                connection.playFile('./sound/ura.mp3');
            });
        break;
        case 'stfu':
            message.channel.send(`As you wish, comrade ${message.author} ...`);
            stfu = true;
        break;
        case 'speak':
            message.channel.send('Yes, comrade!');
            stfu = false;
        break;
    }
});

function simpleLog(message, arg) {
    console.log(`${message.author.username} - ${arg} - ${myName}`);
}

function verifyMessage(message) {
    if(!message) return;

    // if not a bot command, fuck off
    if(message.content.substr(0,1) != '!') return;

    // split into args
    var args = message.content.substr(1).split(' ');
    
    if(args.length < 1) return;

    return args;
}

function randomImage() {
    num = randomInt(numToArmsPosters);
    return new Attachment(`./img/to-arms/${num}.png`);
}

function image(num) {
    if(!num || num < 1 || num > numToArmsPosters) num = 18;
    return new Attachment(`./img/to-arms/${num}.png`);
}

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max - 1)) + 1;
}

client.login(auth.token);