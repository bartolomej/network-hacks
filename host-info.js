const {getHostIp, error} = require('./utils');

(async function () {
  const netInterface = process.argv[2] || 'en0';
  const {ip, mask} = await getHostIp(netInterface);
  process.stdout.write(`IP: ${ip}\nMASK: ${mask}\n`);
})().catch(e => error(e.message));
