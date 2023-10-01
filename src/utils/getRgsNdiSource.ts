import portscanner from "portscanner"
import { RGSsource, NDIsource } from "../types/interfaces"

export function getRgsNdiSource(rgsPorts: number[], rgsSourceList: RGSsource[]): Promise<NDIsource | undefined> {
    return new Promise((resolve, reject) => {
        console.log('Checking current RGS source');
        let newSource: RGSsource | undefined
        portscanner.findAPortInUse(rgsPorts)
            .then((port: number) => {
                console.log('Port ' + port + ' is in use');
                newSource = rgsSourceList.find((source: RGSsource) => {
                    return source.port === port
                })
                resolve(newSource?.NDIsource)
            })
            .catch((error) => {
                console.log('Error finding port in use');
                reject(error)
            })
    })
}