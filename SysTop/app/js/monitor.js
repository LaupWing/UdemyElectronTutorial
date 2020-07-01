const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

setInterval(() => {
    cpu.usage()
        .then(info=>{
            document.getElementById('cpu-usage').innerText = info + '%';
        });
    cpu.free()
        .then(info=>{
            document.getElementById('cpu-free').innerText = info + '%';
        });
    document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());
}, 2000);

// Set Model
document.getElementById('cpu-model').innerText = cpu.model();
document.getElementById('comp-name').innerText = os.hostname();
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;
mem
    .info()
    .then(info=>{
        document.getElementById('mem-total').innerText = info.totalMemMb;
    });

function secondsToDhms(seconds){
    seconds = +seconds
    const d = Math.floor(seconds/(3600 *24));
    const h = Math.floor((seconds%(3600 *24))/3600);
    const m = Math.floor((seconds%3600 *24)/60);
    const s = Math.floor(seconds%60);
    return `${d}d, ${h}h, ${m}m, ${s}s,`
}