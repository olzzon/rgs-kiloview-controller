import kiloviewNDI from "kiloview-ndi";
import { NDIsource } from "../types/interfaces";

export async function setNDISource(currentNdiSource: NDIsource, converter: kiloviewNDI) {
    console.log(' NDI source changed to ' + currentNdiSource?.name + ' at ' + currentNdiSource?.url);
    await converter.decoderCurrentSetUrl(currentNdiSource.name, currentNdiSource.url);
}
