import {
    checkVerification
} from './checkVerification.js';

export default async function(guild, bot, branch) {
    guild.members.fetch()
        .then(members => {
            members.forEach(member => checkVerification(member, bot, branch))
        })
}