import kiloviewNDI from "kiloview-ndi";
import { NDIsource } from "../types/interfaces";

export async function setNDISource(currentNdiSource: NDIsource, converter: kiloviewNDI) {
    console.log('Setting NDI source');
    await converter.decoderCurrentSetUrl(currentNdiSource.name, currentNdiSource.url);
}
