export const typeCast = <T>(data: string): T => {
    try {
        const parsed_data = JSON.parse(data);
        return parsed_data as T;
    } catch (error) {
        throw new Error(`Failed to parse config: ${error instanceof Error ? error.message : 'Unknown error'} [data]${data}`);
    }
}

// types
export type AppUrl = {
    __type: 'offline' | 'local' | 'preview' | 'prod' | string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [property: string]: any
}

export type V_CONFIG = {
    V_APP_URL: string
}
