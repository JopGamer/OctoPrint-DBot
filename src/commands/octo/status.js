//* Eslint-disable no-new no-await-in-loop */

import { setTimeout as delay } from 'node:timers/promises';
import { MessageButton, MessageActionRow, MessageAttachment } from 'discord.js';
import { Command, CommandType, Inhibitor } from 'gcommands';
import { fetch } from 'undici';
import config from '../../config.js';

new Command({
  name: 'status',
  description: 'Pravidelne posiela obrázky z printer cam',
  type: [CommandType.SLASH],
  inhibitors: [
    new Inhibitor.ChannelOnly({
      ids: [config.discord.channelId],
    }),
    new Inhibitor.UserOnly({
      ids: config.discord.userIds,
    }),
  ],
  run: async ctx => {
    const button = new MessageButton()
      .setStyle('SECONDARY')
      .setDisabled()
      .setCustomId('idk')
      .setLabel('Live for 30 sec');

    const row1 = new MessageActionRow().setComponents(button);

    let buff = await (await fetch(config.octoprint.camera)).arrayBuffer();

    await ctx.reply({
      content: `${config.emojis.success} - Live view has been spawned!`,
      ephemeral: true,
    });

    const attachment = new MessageAttachment(buff, 'shot.jpg');
    const message = await ctx.followUp({
      files: [attachment],
      components: [row1],
    });

    await delay(2500);

    let time = 30;
    for (let i = 0; i < 11; i++) {
      time -= 2.5;
      buff = await (await fetch(config.octoprint.camera)).arrayBuffer();

      const attachment2 = new MessageAttachment(buff, 'shot.jpg');

      button.setLabel(`Live for ${time} sec`);

      const row2 = new MessageActionRow().setComponents(button);

      message.edit({
        files: [attachment2],
        components: [row2],
      });

      await delay(2500);
    }

    buff = await (await fetch(config.octoprint.camera)).arrayBuffer();
    const attachment3 = new MessageAttachment(buff, 'shot.jpg');

    button.setLabel('Offline...');

    const row3 = new MessageActionRow().setComponents(button);

    message.edit({
      files: [attachment3],
      components: [row3],
    });
  },
});
