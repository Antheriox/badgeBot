const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Updated for Discord.js v14+
const fs = require('fs');
const path = require('path');

// File to store scheduled pings
const scheduleFile = path.join(__dirname, 'schedules.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('20days')
        .setDescription('Pings you after 20 days'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const timestamp = Date.now();
        const pingTime = timestamp + 20 * 24 * 60 * 60 * 1000; // 20 days in milliseconds

        // Load or create schedule file
        let schedules = {};
        if (fs.existsSync(scheduleFile)) {
            schedules = JSON.parse(fs.readFileSync(scheduleFile, 'utf8'));
        }

        // Save the schedule
        schedules[userId] = pingTime;
        fs.writeFileSync(scheduleFile, JSON.stringify(schedules, null, 4), 'utf8');

        // Confirm to the user
        await interaction.reply({
            content: `I'll ping you here in 20 days!`,
            flags: 64 // Equivalent to ephemeral
        });

        // Schedule the ping (in-memory for demonstration)
        setTimeout(async () => {
            try {
                const user = await interaction.client.users.fetch(userId);
                if (user) {
                    const embed = new EmbedBuilder()
                        .setTitle('20 Days Later...')
                        .setDescription(`Hey <@${user.id}>, 20 days have passed! use the command again to schedule another ping. <#${interaction.channel.id}>`)
                        .setColor('#FFD700');
                    await user.send({ embeds: [embed] });
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }, pingTime - Date.now());
    }
};
