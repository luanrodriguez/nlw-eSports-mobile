export interface GameParams {
    banner: string,
    title: string,
    id: string
}

export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: undefined,
            game: GameParams
        }
    }
}