
import kiloviewNDI from "kiloview-ndi"
import portscanner from "portscanner"
import fs from 'fs'
import { log } from "console"

const IP_ADDRESS = '192.168.1.201'
const USERNAME = 'admin'
const PASSWORD = 'admin'

interface NDIsource {
    name: string,
    url: string
}

let ndiSource: NDIsource

interface RGSsource {
    port: number,
    NDIsource: NDIsource
}

const rgsSourceList: RGSsource[] = JSON.parse(fs.readFileSync('./sourcelist.json', 'utf8'))
console.log(rgsSourceList)
const rgsPorts: number[] = rgsSourceList.map((source) => {
    return source.port
})

async function setupConnection(converter: kiloviewNDI) {
    console.log('Switching Kiloview to decoder mode');
    await converter.modeSwitch('decoder');
    setupSourceTimer(converter);
}

async function setupSourceTimer(converter: kiloviewNDI) {
    console.log('setting up source seleciton timer');
    setInterval(() => {
        let newSource: NDIsource = checkRgsSource();
        if (newSource.url !== ndiSource.url) {
            ndiSource = { ...newSource }
            setNDISource(converter);
        }
        console.log('Checking for NDI source');
    },
        3000
    );
}

function checkRgsSource(): NDIsource {
    let newSource: RGSsource;
    portscanner.findAPortInUse(rgsPorts,
    (err: Error, port: number) => {
        console.log('Port ' + port + ' is in use');
        newSource = rgsSourceList.find((source: RGSsource) => {
            return source.port === port
        })
    })
    console.log('Checking current RGS source');
    let currentSource = { ...ndiSource };
    return currentSource;
}

async function setNDISource(converter: kiloviewNDI) {
    console.log('Setting NDI source');
    await converter.decoderCurrentSetUrl(ndiSource.name, ndiSource.url);
}


console.log('Checking RGS connection :')
console.log(checkRgsSource())
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

