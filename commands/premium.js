const { Colors, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const fs = require("fs")
const db = require("croxydb")
const config = require("../config.json")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium')
        .setDescription('Admin yönetim komutudur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('ver')
                .setDescription('Premium rolü verirsiniz.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Kullanıcıyı belirtiniz.')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('al')
                .setDescription('Premium rolünü alırsınız.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Kullanıcıyı belirtiniz.')
                        .setRequired(true))
        ),
    async execute(client, interaction) {
        if (interaction.options.getSubcommand() === 'ver') {
            const user = interaction.options.getUser('user');
            const id = user.id
            const member = interaction.guild.members.cache.get(id)
            if (member) {
                const silindi = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Rol Verildi!")
                    .setDescription(`Başarıyla **${member.user.tag}** kullanıcısına Premium rolü verildi!`)
                    .setFooter({ text: 'Utiric Uptime' })
                    .setTimestamp()
                member.roles.add(config.premiumrole)
                interaction.reply({ embeds: [silindi], ephemeral: true })
             }
        }
        if (interaction.options.getSubcommand() === 'al') {
            const user = interaction.options.getUser('user');
            const id = user.id
            const member = interaction.guild.members.cache.get(id)
            if (member) {
                const silindi = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Rol Alındı!")
                    .setDescription(`Başarıyla **${member.user.tag}** kullanıcısından Premium rolü alındı!`)
                    .setFooter({ text: 'Utiric Uptime' })
                    .setTimestamp()
                member.roles.remove(config.premiumrole)
                interaction.reply({ embeds: [silindi], ephemeral: true })
             }
        }
    },
        
};
