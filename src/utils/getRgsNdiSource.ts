import portscanner from "portscanner"
import { RGSsource, NDIsource } from "../types/interfaces"

export function getRgsNdiSource(rgsPorts: number[], rgsSourceList: RGSsource[]): Promise<NDIsource | undefined> {
    return new Promise((resolve, reject) => {
        let activeSource: RGSsource | undefined
        portscanner.findAPortInUse(rgsPorts)
            .then((port: number) => {
                console.log('RGS Port ' + port + ' is active');
                activeSource = rgsSourceList.find((source: RGSsource) => {
                    return source.port === port
                })
                resolve(activeSource?.NDIsource)
            })
            .catch((error) => {
                console.log('No RGS port is active')
                reject(error)
            })
    })
}