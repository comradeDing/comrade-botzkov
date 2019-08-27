var discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize discord bot
var bot = new discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function(user,userID,channelID,message,evt) {
    // Bot needs to know if it will execute command
    // Listen for messages that start with '!'
    if(message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to:channelID,
                    message: 'Pong!'
                });
            break;
        }
    }
})