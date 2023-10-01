import kiloviewNDI from "kiloview-ndi"
import portscanner from "portscanner"
import fs from 'fs'
import { extractArg } from "./utils/extractArgs"

const IP_ADDRESS = extractArg('ip') || '192.168.1.201'
const USER = extractArg('user') || 'admin'
const PASSWORD = extractArg('password') || 'admin'
const RGS_LIST = extractArg('rgshostlist') || './sourcelist.json'

interface NDIsource {
    name: string,
    url: string
}

let currentNdiSource: NDIsource

interface RGSsource {
    port: number,
    NDIsource: NDIsource
}

const rgsSourceList: RGSsource[] = JSON.parse(fs.readFileSync(RGS_LIST, 'utf8'))
if (!rgsSourceList) {
    console.log('No source list found, exiting')
    process.exit(1)
}
console.log("RGS Source list: ", rgsSourceList)

const rgsPorts: number[] = rgsSourceList.map((source) => {
    return source.port
})

console.log('Connecting to Kiloview on ip: ', IP_ADDRESS);
const converter = new kiloviewNDI(IP_ADDRESS, USER, PASSWORD);
converter.modeGet()
    .then(() => {
        setupConnection(converter);
    })
    .catch((error) => {
        console.log('Error connecting to Kiloview');
    })


async function setupConnection(converter: kiloviewNDI) {
    console.log('Switching Kiloview to decoder mode');
    await converter.modeSwitch('decoder');
    setupSourceTimer(converter);
}

async function setupSourceTimer(converter: kiloviewNDI) {
    console.log('setting up source seleciton timer');
    setInterval(() => {
        let newSource: NDIsource | undefined = getRgsSource();
        if (newSource && newSource.url !== currentNdiSource.url) {
            console.log('NDI source is ' + currentNdiSource.name + ' at ' + currentNdiSource.url);
            currentNdiSource = { ...newSource }
            setNDISource(converter);
        }
        console.log('Checking for NDI source');
    },
        3000
    );
}

function getRgsSource(): NDIsource | undefined {
    console.log('Checking current RGS source');
    let newSource: RGSsource | undefined
    portscanner.findAPortInUse(rgsPorts,
        (err: Error, port: number) => {
            console.log('Port ' + port + ' is in use');
            newSource = rgsSourceList.find((source: RGSsource) => {
                return source.port === port
            })
        })
    return newSource?.NDIsource;
}

async function setNDISource(converter: kiloviewNDI) {
    if (!currentNdiSource) return
    console.log('Setting NDI source');
    await converter.decoderCurrentSetUrl(currentNdiSource.name, currentNdiSource.url);
}
