'use strict'

/** BOT LIKE InstagramV.1 **/
/** CODE By pangsitDc0de **/
/** Pangsitdc0de@outlook.com **/
/** NoMoneyNoLive - CrazyFriends404 - NewYear2k18 | AKAMSI.Pauwa **/
/** NOTE : RUN WITH M3K1 **/

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');

const User = [
    {
        type:'input',
        name:'username',
        message:'Username Lo',
	validate: function(value){
		if(!value) return 'Can\'t Empty';
		return true;
	}
    },
    {
        type:'password',
        name:'password',
        message:'Password Lo',
        mask:'*',
	validate: function(value){
		if(!value) return 'Can\'t Empty';
		return true;
	}
    },
    {
        type:'input',
        name:'sleep',
        message:'Berapa Menit (In MiliSeconds)',
        validate: function(value){
            value = value.match(/[0-9]/);
            if (value) return true;
            return 'Sabar MeK';
        }
    }
]

const Login = async function(User){

    /** Save Account **/
    const Device = new Client.Device(User.username);
    const Storage = new Client.CookieMemoryStorage();
    const session = new Client.Session(Device, Storage);

    try {
        await Client.Session.create(Device, Storage, User.username, User.password)
        const account = await session.getAccount();
        return Promise.resolve({session,account});
    } catch (err) {
        return Promise.reject(err);
    }

}

const Like = async function(session,media){
    try {
        if (media.params.hasLiked) {
           return chalk`{bold.blue Udah Ada}`;
        }
        await Client.Like.create(session, media.id);
        return chalk`{bold.green Topcer}`;
    } catch (err) {
        return chalk`{bold.red Mampos}`;
    }
}

const Excute = async function(User, sleep){
    try {
        console.log(chalk`\n{yellow [?] Sedang Login Mek ....}`);
        const doLogin = await Login(User);
        console.log(chalk`{green [+] Login Succsess mek}, {yellow Thanks Meme Script ....}`);
        const feed = new Client.Feed.Timeline(doLogin.session);
        var cursor;
        do {
            if (cursor) feed.setCursor(cursor);
            var media = await feed.get();
            media = _.chunk(media, 5);
            for (var i = 0; i < media.length; i++) {
                await Promise.all(media[i].map(async (media) => {
                    const doLike = await Like(doLogin.session, media);
                    console.log(chalk`${media.params.user.username} [{cyan ${media.id}}] => ${doLike}`);
                }))
                await console.log(chalk`{yellow [-] Delay For ${sleep} MiliSeconds}`);
                await delay(sleep);
            }
        } while(feed.isMoreAvailable());
    } catch (err) {
        console.log(err);
    }
}

console.log(chalk`
{bold BOT LIKE InstagramV.1}
{green NoMoneyNoLive - CrazyFriends404 - NewYear2k18 | AKAMSI.Pauwa}
{bold.red Code By pangsitdc0de | pangsitDx0de.outlook.com}
{bold /** NOTE : RUN WITH PM2 **/}
`);

inquirer.prompt(User)
    .then(answers => {
        Excute({
            username:answers.username,
            password:answers.password
        },answers.sleep);
    })
