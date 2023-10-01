import { RGSsource } from "../types/interfaces"
import fs from 'fs'

export function readRGSList(RGS_LIST_FILENAME: string): RGSsource[] {
    const rgsHostList: RGSsource[] = JSON.parse(fs.readFileSync(RGS_LIST_FILENAME, 'utf8'))
    if (!rgsHostList) {
        console.log('No host list found, exiting')
        process.exit(1)
    }
    console.log("RGS Hosts list: ", rgsHostList)
    return rgsHostList
}