const { Client, GatewayIntentBits, Partials,ChannelType, AuditLogEvent, Events,PermissionsBitField: { Flags },EmbedBuilder } = require("discord.js")
const moment = require('moment');
const client = global.client = new Client({
    fetchAllMembers: true,
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials),
})

var RoleLogChannelID = "";
var SesLogChannelID = "";
var MesajLogChannelID = "";

if(!RoleLogChannelID || !SesLogChannelID || !MesajLogChannelID) return console.log("Kanal ID'lerini doldurmadınız!");


client.login("TOKEN").catch((err) => {console.log("Bot tokeni yanlış veya boş!")})

client.on(Events.ClientReady, () => {
    console.log("[MYS-BOT-SYSTEM] Bot is ready! 🚀")
})

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const guild = newMember.guild || oldMember.guild;

    // Eski ve yeni roller
    const oldRoles = oldMember.roles && oldMember.roles.cache;
    const newRoles = newMember.roles && newMember.roles.cache;

    const addedRoles = newRoles.filter((role) => !oldRoles || !oldRoles.has(role.id));


    const removedRoles = oldRoles.filter((role) => !newRoles || !newRoles.has(role.id));

    let logkanalı = guild.channels.cache.find(x => x.id == RoleLogChannelID);


    if (addedRoles.size > 0) {
        const firstAddedRole = addedRoles.first();

        try {
            const audit = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate });
            const log = audit.entries.first();
            const roleSetter = log.executor;

            if (roleSetter) {
                const embed = new EmbedBuilder()
                    .setDescription(`
  \`Rolü Alan Kullanıcı:\` ${newMember} - (${newMember.id})
  \`Rolü Veren Yetkili:\` <@${roleSetter.id}>
  \`Verilen Rol:\` <@&${firstAddedRole.id}>
  \`Rol Verilme Tarihi:\` ${moment(Date.now()).locale('tr').locale('tr').format('LLL')}
            `).setColor('Random')
                    .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })


                if (logkanalı) {
                    await logkanalı.send({ embeds: [embed] });
                }
            }
        } catch (err) {
            console.error('Denetim kaydı getirilirken bir hata oluştu:', err);
        }
    }

    if (removedRoles.size > 0) {
        const firstRemovedRole = removedRoles.first();

        try {
            const audit = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate });
            const log = audit.entries.first();
            const roleWithdrawer = log.executor;
            if (roleWithdrawer) {
                const embed = new EmbedBuilder()
                    .setDescription(`
  \`Rolü Geri Çekilen Kullanıcı:\` ${newMember} - (${newMember.id})
  \`Rolü Geri Çeken Yetkili:\` <@${roleWithdrawer.id}>
  \`Geri Çekilen Rol:\` <@&${firstRemovedRole.id}>
  \`Rol Geri Çekme Tarihi:\` ${moment(Date.now()).locale('tr').format('LLL')}
            `).setColor('Random')
                    .setAuthor({ name: `${newMember.guild.name}`, iconURL: newMember.guild.iconURL() })
                if (logkanalı) {
                    await logkanalı.send({ embeds: [embed] });
                }
            }
        } catch (err) {
            console.error('Denetim kaydı getirilirken bir hata oluştu:', err);
        }
    }
});

client.on(Events.MessageDelete, async (message) => {
    if (message.author.bot || message.channel.type === ChannelType.DM) return;
    if (message.author.bot) return;
    let silinenMesaj = message.guild.channels.cache.find(x => x.id == MesajLogChannelID)
    const embed = new EmbedBuilder()
        .setColor("Aqua")
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.avatarURL()
        })
        .addFields(
            { name: "Kullanıcı", value: `<@${message.author.id}>`, inline: true },
            { name: "Kanal Adı", value: `<#${message.channel.id}>`, inline: true },
            { name: "Silinen Mesaj", value: "```" + message.content + "```" }
        )
        .setThumbnail(message.author.avatarURL())
        .setFooter({ text: 'Mesaj Silindi.' })
        .setTimestamp();
    silinenMesaj.send({ embeds: [embed] });
})

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    let guncellenenMesaj = newMessage.guild.channels.cache.find(x => x.id == MesajLogChannelID)
    if (oldMessage.content === newMessage.content) return;
    let embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
            name: newMessage.author.username,
            iconURL: newMessage.author.avatarURL()
        })
        .addFields(
            { name: "Kullanıcı", value: `<@${newMessage.author.id}>`, inline: true },
            { name: "Kanal Adı", value: `<#${newMessage.channel.id}>`, inline: true },
            { name: "Eski Mesaj", value: "```" + oldMessage.content + "```" },
            { name: "Yeni Mesaj", value: "```" + newMessage.content + "```" },
        )

        .setThumbnail(newMessage.author.avatarURL())
        .setTimestamp()
        .setFooter({ text: 'Mesaj Düzenlendi' });

    guncellenenMesaj.send({ embeds: [embed] });
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    let log = newState.guild.channels.cache.find(x => x.id == SesLogChannelID)
    if (!log) return;
    let Mesaj;
    let Kanal;

    if (!oldState.channelId && newState.channelId) {
        Kanal = newState.channel;
        Mesaj = 'Ses Odasına Giriş Yaptı!';
        Embed(Mesaj,Kanal);
    }

    if (oldState.channelId && !newState.channelId) {
        Mesaj = 'Ses Odasından Ayrıldı!';
        Kanal = oldState.channel;
        Embed(Mesaj,Kanal);
    }
    //Sesli Kanalda
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        Mesaj = `Ses Kanalını Değiştirdi!\n${oldState.channel.name} => ${newState.channel.name}`;
        Embed(Mesaj,newState.channel);
    }
//##############################################################################################
    // SUNUCU DÜZEYİNDE SUSTURULMA VE SAĞIRLAŞTIRMA LOGU                                   #
//##############################################################################################
    let YtMesaj;
    let YetkiliTag;
    let YtKanal;

    const member = newState.member;
    if (!member) return;

    const guild = member.guild;
    //await guild.members.fetch();

    const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberUpdate });
    const entry = auditLogs.entries.first();

    if (!entry || !entry.executor) return;

    const executor = await guild.members.fetch(entry.executor.id);

    if (oldState.channelId && oldState.serverDeaf && !newState.serverDeaf) {
        YtMesaj = 'Sunucu Düzeyindeki Sağırlaştırmasını Kaldirdi!';
        YtKanal = newState.channel;
        YetkiliTag = `<@${executor.user.id}>`
        Embed2(YetkiliTag,YtKanal,YtMesaj);
    }
    
    if (oldState.channelId && oldState.serverMute && !newState.serverMute) {
        YtMesaj = 'Sunucu Düzeyindeki Susturulmasını Kaldirdi!';
        YtKanal = newState.channel;
        YetkiliTag = `<@${executor.user.id}>`
        Embed2(YetkiliTag,YtKanal,YtMesaj);
    }
    
    if (oldState.channelId && !oldState.serverDeaf && newState.serverDeaf) {
        YtMesaj = 'Sunucu Düzeyinde Sağırlaştırdı!';
        YtKanal = newState.channel;
        YetkiliTag = `<@${executor.user.id}>`
        Embed2(YetkiliTag,YtKanal,YtMesaj);
    }
    
    if (oldState.channelId && !oldState.serverMute && newState.serverMute) {
        YtMesaj = 'Sunucu Düzeyinde Mikrofonunu Kapattı!';
        YtKanal = newState.channel;
        YetkiliTag = `<@${executor.user.id}>`
        Embed2(YetkiliTag,YtKanal,YtMesaj);
    }


//##############################################################################################
    // SUNUCU DÜZEYİNDE SUSTURULMA VE SAĞIRLAŞTIRMA LOGU                                   #
//##############################################################################################

    if (oldState.channelId && oldState.selfMute && !newState.selfMute) {
        Kanal = newState.channel;
        Mesaj = 'Sesli Kanalda Mikrofonunu Açti!';
        Embed(Mesaj,Kanal);
    }

    if (oldState.channelId && !oldState.selfMute && newState.selfMute) {
        Kanal = newState.channel;
        Mesaj = 'Sesli Kanalda Mikrofonunu Kapattı!';
        Embed(Mesaj,Kanal);
    }
    
    if (oldState.channelId && oldState.selfDeaf && !newState.selfDeaf) {
        Mesaj = 'Sesli Kanalda Kendi Sağırlaştırmasını Kaldırdı!';
        Kanal = newState.channel;
        Embed(Mesaj,Kanal);
      }
  
      if (oldState.channelId && !oldState.selfDeaf && newState.selfDeaf) {
        Mesaj = 'Sesli Kanalda Kendini Sağırlaştırdı!';
        Kanal = newState.channel;
        Embed(Mesaj,Kanal);
      }
  
      if (oldState.channelId && oldState.streaming && !newState.streaming) {
        Mesaj = 'Sesli Kanalda Açtığı Yayını Kapattı!';
        Kanal = newState.channel;
        Embed(Mesaj,Kanal);
      }
  
      if (oldState.channelId && !oldState.streaming && newState.streaming) {
        Mesaj = 'Sesli Kanalda Yayın Açtı!';
        Kanal = newState.channel;
        Embed(Mesaj,Kanal);
      }
  
      if (oldState.channelId && oldState.selfVideo && !newState.selfVideo) {
        Mesaj = 'Sesli Kanalda Kamerasını Kapattı!';
        Kanal = newState.channel;
        Embed(Mesaj,Kanal);
      }
  
      if (oldState.channelId && !oldState.selfVideo && newState.selfVideo) {
        Mesaj = 'Sesli Kanalda Kamerasını Açtı!';
        Kanal = newState.channel;
        Embed(Mesaj,Kanal);
      }
    function Embed(Mesaj, Kanal) {
        const embed = new EmbedBuilder()
          .setColor("#008000")
          .setAuthor({
            name: "Ses Log",
            iconURL: newState.member.user.displayAvatarURL()
        })
        .addFields(
            { name: "Kullanıcı", value: `<@${newState.member.id}>`, inline: true },
            { name: "Kanal Adı", value: `${Kanal}`, inline: true },
            { name: "Olay", value: "```" + Mesaj + "```" }
        )
        .setTimestamp()
        .setThumbnail(newState.member.user.displayAvatarURL());
        log.send({ embeds: [embed] });
    }
    function Embed2(YetkiliTag, YtKanal, YtMesaj, ) {
        const embeds = new EmbedBuilder()
        .setColor("#008000")
        .setAuthor({
            name: "Ses Log",
            iconURL: newState.member.user.displayAvatarURL()
        })
        .addFields(
            { name: "Yetkili Bilgisi", value: `${YetkiliTag}`,inline: true},
            { name: "Kullanıcı", value: `<@${newState.member.id}>`, inline: true },
            { name: "Kanal Adı", value: `${YtKanal}`, inline: true },
            { name: "Olay", value: "```" + YtMesaj + "```" }
        )
        .setTimestamp()
        .setThumbnail(newState.member.user.displayAvatarURL());
        log.send({ embeds: [embeds] });
    }
})



process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
});