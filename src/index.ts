import kiloviewNDI from "kiloview-ndi"

import { NDIsource, RGSsource } from "./types/interfaces"
import { extractArg } from "./utils/extractArgs"
import { getRgsNdiSource } from "./utils/getRgsNdiSource"
import { setNDISource } from "./utils/setNDISource"
import { readRGSList } from "./utils/readRGSList"

const IP_ADDRESS = extractArg('ip') || '192.168.1.201'
const USER = extractArg('user') || 'admin'
const PASSWORD = extractArg('password') || 'admin'
const RGS_LIST_FILENAME = extractArg('rgshostlist') || './sourcelist.json'

let currentNdiSource: NDIsource
const rgsSourceList: RGSsource[] = readRGSList(RGS_LIST_FILENAME)
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
    console.log('setting up source selection timer');
    setInterval(() => {
        let newSource: NDIsource | undefined = getRgsNdiSource(rgsPorts, rgsSourceList);
        if (newSource && newSource.url !== currentNdiSource.url) {
            console.log('NDI source is ' + currentNdiSource.name + ' at ' + currentNdiSource.url);
            currentNdiSource = { ...newSource }
            setNDISource(currentNdiSource, converter);
        }
    },
        3000
    );
}