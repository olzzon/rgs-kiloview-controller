
import kiloviewNDI from "kiloview-ndi"

const IP_ADDRESS = '192.168.1.201'
const USERNAME = 'admin'
const PASSWORD = 'admin'

interface NDIsource {
    name: string,
    url: string
}

let ndiSource: NDIsource = {
    name: 'test',
    url: '192.168.1.202:5900'
}

// Toggle between encoder/decoder
async function setupConnection(converter: kiloviewNDI) {
    console.log('Switching Kiloview to decoder mode');
    await converter.modeSwitch('decoder');
    setupSourceTimer(converter);
}

async function setupSourceTimer(converter: kiloviewNDI) {
    console.log('setting up source seleciton timer');
    setInterval(() => {
        let newSource: NDIsource = checkCurrentSource();
        if (newSource.url !== ndiSource.url) {
            ndiSource = { ...newSource }
            setNDISource(converter);
        }
        console.log('Checking for NDI source');
    },
        3000
    );
}

function checkCurrentSource(): NDIsource {
    console.log('Checking current RGS source');
    let currentSource = { ...ndiSource };
    return currentSource;
}

async function setNDISource(converter: kiloviewNDI) {
    console.log('Setting NDI source');
    await converter.decoderCurrentSetUrl(ndiSource.name, ndiSource.url);
}

console.log('Connecting to Kiloview on ip: ');
console.log(IP_ADDRESS);
const converter = new kiloviewNDI(IP_ADDRESS, USERNAME, PASSWORD);
converter.modeGet()
    .then(() => {
        setupConnection(converter);
    })
    .catch((error) => {
        console.log('Error getting Kiloview mode');
        //console.log(error);
    })

