const { Events } = require('discord.js');

const fs = require('fs');

// JSON dosyasını oku
const jsonData = fs.readFileSync('croxydb/croxydb.json');
const data = JSON.parse(jsonData);

// "uptime" alanındaki verileri topla
const uptimeData = data.uptime;
const allUptimeValues = uptimeData.filter(value => typeof value === 'string');

const axios = require('axios');

async function pingURL(url) {
  try {
    await axios.get(url)
      .then(tst => {
        console.log(`Pinged ${url} successfully!`);
      })
      .catch(err => {
        console.error(`Error pinging ${url}: ${err.message}`);
      })
  } catch (error) {
    console.error(`Error pinging ${url}: ${error.message}`);
  }
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute() {
    allUptimeValues.forEach(async (value) => {
      await pingURL(value)
    })
    setInterval(() => {
      allUptimeValues.forEach(async (value) => {
        await pingURL(value)
      })
    }, 150000);
	},
};