import kiloviewNDI from "kiloview-ndi";

export async function clearNDISource(converter: kiloviewNDI) {
    console.log(' Setting Kiloview to Black output');
    await converter.decoderCurrentSetPreset(0)
}
