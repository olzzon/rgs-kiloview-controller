import kiloviewNDI from "kiloview-ndi"

import { NDIsource, RGSsource } from "./types/interfaces"
import { extractRuntimeArg } from "./utils/extractRuntimeArgs"
import { getRgsNdiSource } from "./utils/getRgsNdiSource"
import { readRGSList } from "./utils/readRGSList"
import { setNDISource } from "./utils/setNDISource"
import { clearNDISource } from "./utils/clearNdiSource"

const IP_ADDRESS = extractRuntimeArg('ip') || '192.168.1.168'
const USER = extractRuntimeArg('user') || 'admin'
const PASSWORD = extractRuntimeArg('password') || 'Admin12345678'
const RGS_LIST_FILENAME = extractRuntimeArg('rgshostlist') || './sourcelist.json'

let currentNdiSource: NDIsource = {name: '', url: ''}
const rgsSourceList: RGSsource[] = readRGSList(RGS_LIST_FILENAME)
const rgsPorts: number[] = rgsSourceList.map((source) => {
    return source.port
})

console.log('Connecting to Kiloview on ip: ', IP_ADDRESS);
const converter = new kiloviewNDI(IP_ADDRESS, USER, PASSWORD);

console.log('Switching Kiloview to decoder mode');
converter.modeSwitch('decoder')
    .then(async () => {
        console.log('setting up source selection timer');
        setInterval(async () => {
            try {
                let newSource: NDIsource | undefined = await getRgsNdiSource(rgsPorts, rgsSourceList);

                if (newSource && newSource.url !== currentNdiSource?.url) {
                    currentNdiSource = newSource
                    setNDISource(currentNdiSource, converter);
                }
            }
            catch (err) {
                if (currentNdiSource) {
                    currentNdiSource = undefined
                    clearNDISource(converter)
                }
            }
        },
            3000
        );
    })
    .catch(() => {
        console.log('Error connecting to Kiloview');
    })
