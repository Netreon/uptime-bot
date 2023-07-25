const { Colors, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const fs = require("fs")
const db = require("croxydb")
const config = require("../config.json")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin yönetim komutudur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('sil')
                .setDescription('Belirttiğiniz linki listeden siler.')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('Linki belirtiniz.')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ekle')
                .setDescription('Belirttiğiniz kişinin adına link ekler.')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('Linki belirtiniz.')
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription("Kullanıcıyı belirtiniz.")
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sıfırla')
                .setDescription('Tüm linkleri siler.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('görüntüle')
                .setDescription('Tüm linkleri görüntüler.')
        ),
    async execute(client, interaction) {
        const logkanal = client.channels.cache.get(config.logKanal)
        if (interaction.options.getSubcommand() === 'sil') {
            const link = interaction.options.getString('link');
            if (link) {
                const zatenyok = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle("Link Mevcut Değil!")
                    .setDescription(`${link} linki kayıtlardan bulunamadı.`)
                    .setFooter({ text: 'Utiric Uptime' })
                const silindi = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Link Silindi!")
                    .setDescription(`Başarıyla ${link} linki uptime listesinden silindi!`)
                    .setFooter({ text: 'Utiric Uptime' })

                const jsonData = fs.readFileSync('croxydb/croxydb.json');
                const data = JSON.parse(jsonData);

                const uptimeData = data.uptime;
                const allUptimeValues = uptimeData.filter(value => typeof value === 'string');

                if (allUptimeValues.includes(link)) {
                    db.unpush("uptime", link);
                        const uptimeCount = await db.fetch("uptime").length
                        const linkEmbed3 = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle("Bir Link Silindi!")
                        .setDescription(`Aşağıda link ile ilgili bilgiler bulunuyor.`)
                        .addFields(
                            { name: 'Silen', value: `${interaction.user.toString()}`, inline: true},
                            { name: 'Toplam', value: `${uptimeCount}`, inline: true},
                            { name: 'Link', value: `${link}`, inline: true},
                            { name: 'NOT', value: `Bu link bir yetkili tarafından silinmiştir. Ayrıca link sadece uptime listesinden silinmiştir, yani uptime edilmez fakat kullanıcıda ekli gözükür.`, inline: false},
                        )
                        .setFooter({ text: 'Utiric Uptime' })
                        logkanal.send({ embeds: [linkEmbed3] })
                        interaction.reply({ embeds: [silindi], ephemeral: true })
                        .catch(err => {
                            interaction.user.send({ embeds: [silindi] })
                                .catch((errrr) => {
                                    console.log("Mesaj gönderilemedi: " + interaction.user.username)
                                })
                        })
                } else {
                    interaction.reply({ embeds: [zatenyok], ephemeral: true })
                    .catch(err => {
                        interaction.user.send({ embeds: [zatenyok] })
                            .catch((errrr) => {
                                console.log("Mesaj gönderilemedi: " + interaction.user.username)
                            })
                    })
                }
             }
        }
        if (interaction.options.getSubcommand() === 'görüntüle') {
            const links = await db.fetch("uptime")
            if (links.length > 0) {
                const goster = new EmbedBuilder()
				.setColor(Colors.Blue)
				.setTitle("Kayıtlı Linkler")
				.setDescription("🔗 " + links.join('\n🔗 '))
				.setFooter({ text: 'Utiric Uptime' })
				interaction.reply({ embeds: [goster], ephemeral: true })
				.catch(err => {
					interaction.user.send({ embeds: [goster] })
						.catch((errrr) => {
							console.log("Mesaj gönderilemedi: " + interaction.user.username)
						})
				})
            } else {
                const zatenyok = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Kayıt Bulunamadı")
                .setDescription(`Sisteme kayıtlı hiçbir link bulunamadı.`)
                .setFooter({ text: 'Utiric Uptime' })
                interaction.reply({ embeds: [zatenyok], ephemeral: true })
            }
        }
        if (interaction.options.getSubcommand() === 'sıfırla') {
            await db.deleteAll()
            await db.set("uptime", "sıfırlanıyor")
            await db.push("uptime", "sıfırlanıyor")
            await db.unpush("uptime", "sıfırlanıyor")
            const goster = new EmbedBuilder()
				.setColor(Colors.Green)
				.setTitle("Başarılı")
				.setDescription("Tüm linkler silindi.")
				.setFooter({ text: 'Utiric Uptime' })
			interaction.reply({ embeds: [goster], ephemeral: true })
            const linkEmbed3 = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("Tüm Linkler Silindi!")
            .setDescription(`Tüm linkler, ${interaction.user.toString()} kullanıcısı tarafından silindi.`)
            .setFooter({ text: 'Utiric Uptime' })
            logkanal.send({ embeds: [linkEmbed3] })
        }
        if (interaction.options.getSubcommand() === 'ekle') {
            const userId = interaction.options.getUser('user').id;
            const link = interaction.options.getString('link');
            if (db.has("uptimeu" + userId)) {
                const uptimelinks = await db.fetch("uptime")
                if (!uptimelinks.includes(link)) {
                    db.push("uptime", link);
                    db.push("uptimeu" + userId, link)
                    const goster = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Başarılı")
                    .setDescription(`${link} linki ${interaction.options.getUser("user").toString()} (${userId}) kullanıcısına eklendi.`)
                    .setFooter({ text: 'Utiric Uptime' })
                    interaction.reply({ embeds: [goster], ephemeral: true })
                    const linkEmbed3 = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Bir Link Eklendi!")
                    .setDescription(`Aşağıda link ile ilgili bilgiler bulunuyor.`)
                    .addFields(
                        { name: 'Ekleyen', value: `${interaction.user.toString()}`, inline: true},
                        { name: 'Eklenen', value: `${interaction.options.getUser("user").toString()}`, inline: true},
                        { name: 'Toplam', value: `${db.fetch("uptimeu" + userId).length}`, inline: true},
                        { name: 'Link', value: `${link}`, inline: true},
                        { name: 'NOT', value: `Bu link bir yetkili tarafından eklenmiştir.`, inline: false},
                    )
                    .setFooter({ text: 'Utiric Uptime' })
                    logkanal.send({ embeds: [linkEmbed3] })
                } else {
                    const goster = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle("Başarısız")
                    .setDescription(`${link} linki zaten uptime ediliyor.`)
                    .setFooter({ text: 'Utiric Uptime' })
                    interaction.reply({ embeds: [goster], ephemeral: true })
                }
            } else {
                await db.set("uptimeu" + userId, link)
                await db.push("uptimeu" + userId, link)
                const goster = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle("Başarılı")
                .setDescription(`${link} linki ${interaction.options.getUser("user").toString()} (${userId}) kullanıcısına eklendi.`)
                .setFooter({ text: 'Utiric Uptime' })
                interaction.reply({ embeds: [goster], ephemeral: true })
                const linkEmbed3 = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle("Bir Link Eklendi!")
                .setDescription(`Aşağıda link ile ilgili bilgiler bulunuyor.`)
                .addFields(
                    { name: 'Ekleyen', value: `${interaction.user.toString()}`, inline: true},
                    { name: 'Eklenen', value: `${interaction.options.getUser("user").toString()}`, inline: true},
                    { name: 'Toplam', value: `${db.fetch("uptimeu" + userId).length}`, inline: true},
                    { name: 'Link', value: `${link}`, inline: true},
                    { name: 'NOT', value: `Bu link bir yetkili tarafından eklenmiştir.`, inline: false},
                )
                .setFooter({ text: 'Utiric Uptime' })
                logkanal.send({ embeds: [linkEmbed3] })
            }
        }
    },
        
};
