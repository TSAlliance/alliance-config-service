import axios, { AxiosError, AxiosResponse } from "axios";
import { existsSync, writeFile } from "fs";

export type Protocol = "http" | "https"
export interface ConfigClientConfig {
    protocol: Protocol;
    host: string;
    port: number;
    path: string;
    auth: { serviceId: string, serviceClientId?: string, serviceClientSecret?: string };
}

export interface Service {
    id: string;
    title: string;
    clientId?: string;
    clientSecret?: string;
}

export class ConfigResult {
    public id: string;
    public service: Service;
    public scheme: Record<string, any> = {};
    public version: number = 1;

    public async save() {
        if(!!window) {
            // NodeJS Application
            writeFile("./config-" + this.service.id + ".json", JSON.stringify(this), { encoding: "utf-8", mode: "w+" }, () => {})
        } else {
            // Browser Application -> save in localStorage
            if(localStorage) {
                localStorage.setItem("config-" + this.service.id, JSON.stringify(this));
            } else {
                console.warn("Could not save configuration. Your browser does not support 'localStorage'.");
            }
        }
    }
}

export class ConfigResolver<T> {
    private _config: ConfigClientConfig;

    public useConfig(config: ConfigClientConfig) {
        this._config = config;
    }

    public fetchOrCached(): Promise<T> {
        if(existsSync())
    }

    public fetch(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            axios.get(this.getFullUrl(), {
                headers: {
                    "Authorization": ((!!window) ? "FE " : "BE ") + this._config.auth.serviceId,
                    "TS-ClientId": (!!window) ? this._config.auth.serviceClientId : undefined,
                    "TS-ClientSecret": (!!window) ? this._config.auth.serviceClientSecret : undefined
                }
            }).catch((response: AxiosResponse) => {
                if(response.status == 200) {
                    resolve(response.data)
                } else {
                    reject(response);
                }
            }).catch((error: AxiosError) => {
                if(error.response) {
                    reject(error.response);
                } else {
                    reject(error)
                }
            })
        })
    }

    private getFullUrl(): string {
        return this._config.protocol + "://" + this._config.host + ":" + this._config.port + "/" + this._config.path;
    }

}