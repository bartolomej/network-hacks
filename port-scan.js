const { getHostIp, getOpenPorts, error } = require('./utils');

(async function () {
  let service = process.argv[2];
  if (!service) {
    console.log("No network service specified as argument 1, defaulting to tcp");
    service = "tcp"; 
  }
  const {
    ip,
    mask
  } = await getHostIp();
  const hosts = await getOpenPorts(ip, mask);
  const hostsWithOpenPorts = hosts
    .filter(e => e.ports.some(port =>
      port.status === 'open' && (service ? port.service === 'ftp' : true)
    ))
  console.log(`Found ${hostsWithOpenPorts.length} hosts with open ${service} ports`);
  hostsWithOpenPorts.forEach(host => {
    const openPorts = host.ports.map(p => `${p.port}: ${p.service}/${p.protocol}`).join(', ');
    process.stdout.write(`${host.ip} has ${host.ports.length} open ports (${openPorts})\n`)
  })
  process.stdout.write(`\n${hostsWithOpenPorts.length} hosts total\n`)
}()).catch(e => error(e.message))
