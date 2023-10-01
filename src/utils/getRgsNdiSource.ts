import portscanner from "portscanner"
import { RGSsource, NDIsource } from "../types/interfaces"

export function getRgsNdiSource(rgsPorts: number[], rgsSourceList: RGSsource[]): NDIsource | undefined {
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