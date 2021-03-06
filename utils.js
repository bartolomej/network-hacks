const { exec } = require('child_process');
const { promisify } = require('util');
const hexToBin = require('hex-to-binary');

const execp = promisify(exec);

const ipAddressRegex = '([0-2]*[0-9]*[0-9]\\.){3}[0-2]*[0-9]*[0-9]';
const hexRegex = '0x([0-9]|[a-f])*';

async function getHostIp (netInterface = 'en0') {
  const {
    stdout,
    stderr,
    error
  } = await execp(`ifconfig ${netInterface}`);
  if (stderr || error) {
    throw new Error(stderr || error.message);
  }
  const en0InetMatch = stdout.match(new RegExp(`inet ${ipAddressRegex}`));
  const en0MaskMatch = stdout.match(new RegExp(`mask ${hexRegex}`));
  if (!en0InetMatch) {
    throw new Error(`Interface "${netInterface}" not found`)
  }
  const ip = en0InetMatch[0].split(" ")[1];
  const myHexMask = en0MaskMatch[0].split(" ")[1];
  const mask = hexToBin(myHexMask.split("x")[1]).split("").filter(e => e === '1').length;
  return { ip, mask };
}

async function getOpenPorts (ip, mask) {
  const {
    stdout,
    stderr,
    error
  } = await execp(`nmap ${ip}/${mask}`);
  if (stderr || error) {
    throw new Error(stderr || error.message);
  }
  // remove first line (Nmap scan report info line)
  const sections = stdout.substring(stdout.indexOf("\n") + 1, stdout.length).split("\n\n");
  // get report sections for each host
  return sections.slice(0, sections.length - 1).map(host => {
    const lines = host.split("\n");
    const ip = host.match(new RegExp(ipAddressRegex))[0];
    const hasOpenPorts = !/All .* scanned ports .* are closed/.test(host);
    if (hasOpenPorts) {
      const ports = lines.slice(4, lines.length).map(e => e.split(/ +/)).map(e => ({
        port: parseInt(e[0].split("/")[0]),
        protocol: e[0].split("/")[1],
        status: e[1],
        service: e[2]
      }));
      return { ip, ports }
    } else {
      return { ip, ports: [] }
    }
  })
}

function error (message) {
  process.stderr.write(`ERROR: ${message}\n`)
  process.exit(1)
}

module.exports = {
  getOpenPorts,
  getHostIp,
  error
}
