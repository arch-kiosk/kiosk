export type AnyDict = {
    [key: string]: any
}

export type ApiResultKioskQueryDescriptionUI={
    [key:string]: AnyDict
}


export interface ApiResultKioskQueryDescription {
    id: string
    type: string
    name: string
    description: string
    ui: ApiResultKioskQueryDescriptionUI
}

export interface KioskQueryInstance extends ApiResultKioskQueryDescription {
    uid: string
}
