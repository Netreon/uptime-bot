const { ShardingManager } = require('discord.js');
const ayarlar = require('./config.json');

const manager = new ShardingManager('./index.js', {
    shardCount: 'auto',
    token: ayarlar.token
});

manager.spawn();

manager.on('shardCreate', shard => {
    console.log(`Shard ${shard.id} başarıyla başlatıldı.`);
});
