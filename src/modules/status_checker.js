import { setInterval } from 'node:timers';
import { MessageEmbed } from 'discord.js';
import bedInfo from './bed_info.js';
import jobInfo from './job_info.js';
import toolInfo from './tool_info.js';
import config from '../config.js';

let last_status;

export default client => {
  setInterval(async () => {
    const info = await jobInfo();
    const channel = client.channels.cache.find(ch => ch.id === config.discord.channelId);

    if (!last_status) return (last_status = info.state);
    if (last_status === info.state) return;

    if (last_status === 'Operational' && info.state === 'Printing') {
      const bed = await bedInfo();
      const tool = await toolInfo();

      const embed = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription(
          `Teplota podložky: **${bed.bed.actual.toFixed(1)}°C** | Teplota nástroja: **${tool.tool0.actual.toFixed(
            1,
          )}°C**`,
        );

      const msg = await channel.send({
        embeds: [embed],
      });

      const inter = setInterval(async () => {
        const bed = await bedInfo();
        const tool = await toolInfo();

        if (tool.tool0.actual.toFixed(0) === tool.tool0.target) {
          clearInterval(inter);

          const embed = new MessageEmbed()
            .setColor('YELLOW')
            .setDescription(
              `Teplota podložky: **${bed.bed.actual.toFixed(1)}°C** | Teplota nástroja: **${tool.tool0.actual.toFixed(
                1,
              )}°C**`,
            )
            .setTimestamp()
            .setFooter({ text: 'Bed a Tool sú nahriaté' });

          msg.edit({
            embeds: [embed],
          });
        } else {
          const embed = new MessageEmbed()
            .setColor('YELLOW')
            .setDescription(
              `Teplota podložky: **${bed.bed.actual.toFixed(1)}°C** | Teplota nástroja: **${tool.tool0.actual.toFixed(
                1,
              )}°C**`,
            );

          msg.edit({
            embeds: [embed],
          });
        }
      }, 2500);
    } else {
      const embed = new MessageEmbed().setColor('BLUE').setDescription(`Status tlačiarne: **${info.state}**`);

      channel.send({
        embeds: [embed],
      });
    }

    last_status = info.state;
  }, 2500);
};
