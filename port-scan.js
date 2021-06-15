const { getHostIp, getOpenPorts, error } = require('./utils');

(async function () {
  const service = process.argv[2];
  const {
    ip,
    mask
  } = await getHostIp();
  const hosts = await getOpenPorts(ip, mask);
  const hostsWithOpenPorts = hosts
    .filter(e => e.ports.some(port =>
      port.status === 'open' && (service ? port.service === 'ftp' : true)
    ))
  hostsWithOpenPorts.forEach(host => {
    const openPorts = host.ports.map(p => `${p.port}: ${p.service}/${p.protocol}`).join(', ');
    process.stdout.write(`${host.ip} has ${host.ports.length} open ports (${openPorts})\n`)
  })
  process.stdout.write(`\n${hostsWithOpenPorts.length} hosts total\n`)
}()).catch(e => error(e.message))
