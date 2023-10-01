export interface NDIsource {
    name: string,
    url: string
}

export interface RGSsource {
    port: number,
    NDIsource: NDIsource
}