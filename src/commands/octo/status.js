import { Command, CommandType, Inhibitor } from 'gcommands';
import { MessageButton, MessageActionRow, MessageAttachment } from 'discord.js';
import { fetch } from 'undici';
import { setTimeout as delay } from 'node:timers/promises';
import config from '../../config.js';

new Command({
    name: 'status',
    description: 'Pravidelne posiela obrázky z printer cam',
    type: [ CommandType.SLASH ],
    inhibitors: [
        new Inhibitor.ChannelOnly({
            ids: [ config.discord.channelId ]
        }),
        new Inhibitor.UserOnly({
            ids: config.discord.userIds
        })
    ],
    run: async(ctx) => {
        const button = new MessageButton()
            .setStyle('SECONDARY')
            .setDisabled()
            .setCustomId('idk')
            .setLabel('Live for 30 sec');

        const row1 = new MessageActionRow()
            .setComponents(button);

        let buff = await (await fetch(config.octoprint.camera)).arrayBuffer();
    
        ctx.reply({
            content: `${config.emojis.success} - Live view has been spawned!`,
            ephemeral: true,
        });

        const attachment = new MessageAttachment(buff, 'shot.jpg');
        const message = await ctx.followUp({
            files: [ attachment ],
            components: [ row1 ]
        })
    
        await delay(2500);
    
        let time = 30;
        for (let i = 0; i < 11; i++) {
            time -= 2.5;
            buff = await (await fetch(config.octoprint.camera)).arrayBuffer();
    
            const attachment = new discord.MessageAttachment(buff, 'shot.jpg');
    
            button.setLabel(`Live for ${time} sec`);
    
            const row1 = new MessageActionRow()
                .setComponents(button);
    
            message.edit({
                files: [ attachment ],
                components: [ row1 ]
            });
    
            await delay(2500);
        }
    

        buff = await (await fetch(config.octoprint.camera)).arrayBuffer();
        const attachment2 = new discord.MessageAttachment(buff, 'shot.jpg');
    
        button.setLabel('Offline...');
    
        const row2 = new MessageActionRow()
            .setComponents(button);
    
        message.edit({
            files: [ attachment2 ],
            components: [ row2 ],
        });
    }
})