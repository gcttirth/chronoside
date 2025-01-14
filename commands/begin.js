const mysql = require('../modules/mysql.js');

module.exports.run = async(client, message, args) => {
    const prefix = client.config.prefix;
    storyMsg = {
        "embed": {
            "title": "The New Dawn",
            "description": "Blah Blah Blah...",
            "color": 16711680,
            "image": {
                "url": "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            },
            "fields": [{
                "name": "Enter your name to continue :",
                "value": '```' + prefix + 'name username```'
            }]
        }
    }

    classMsg = {
        "embed": {
            "title": "The Dragon Attacks",
            "description": "Blah Blah Blah...",
            "color": 16711680,
            "image": {
                "url": "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            },
            "fields": [{
                "name": "Situation!",
                "value": "React to choose class\n😛 Warrior\n🤔 Rouge"
            }]
        }
    }

    userID = message.author.id
    exist = await mysql.getUserData(userID, "id")

    if (exist === undefined) {
        await message.author.send(storyMsg)
        let nameMess = await message.author.dmChannel.awaitMessages(m => m.content.startsWith(`${prefix}name`), {
            maxMatches: 1,
            time: 30000,
            errors: ['time']
        });

        args = nameMess.first().content.slice(1).trim().split(/ +/g);
        await message.author.send(`Your name is ${args[1]}.`);
        let classMess = await message.author.send(classMsg);
        await classMess.react("😛");
        await classMess.react("🤔");

        let reactions = await classMess.createReactionCollector(r => r.emoji = ("😛" || "🤔") && r.users.size > 1, {
            max: 1,
            time: 12000,
            errors: ['time']
        });
        reactions.on('collect', async(reaction, reactions) => {
            let userClass;
            if (reaction.emoji.name === '😛' && reaction.count > 1) {
                await classMess.reply(`${args[1]} you are a warrior with id ${userID}`);
                userClass = "Warrior";
            } else if (reaction.emoji.name === '🤔' && reaction.count > 1) {
                await classMess.reply('you are a rouge.');
                userClass = "Rouge";
            }
            let infoEmbed = {
                "embed": {
                    "title": `${userClass}`,
                    "color": 16711680,
                    "thumbnail": {
                        "url": "https://media.discordapp.net/attachments/592199620231299088/594063795572178964/Character.png"
                    },
                    "author": {
                        "name": `${args[1]}'s profile`,
                        "url": ""
                    },
                    "fields": [{
                        "name": "Progress",
                        "value": `Level: 1\nXP: 0\nArea: CityA`,
                        "inline": true
                    }, {
                        "name": "Money",
                        "value": "<:Coin:593699122473730063>: 0"
                    }]
                }
            }

            let infoEmbedMsg = await classMess.channel.send(infoEmbed);
            mysql.addUser(userID, args[1], userClass, infoEmbedMsg.id);
        });
    } else {
        message.author.send("You have already begun your journey!");
    }
};

module.exports.help = {
    name: "begin",
    category: "User",
    description: "Begins your wonderful journey in the world of Erendiel.",
    usage: "begin"
};