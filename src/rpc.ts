import * as cheerio from "cheerio";
import axios from "axios";

import { Client } from "discord-rpc";
import activity from "./activity";

export default class RPC {
    private clientId = "990951326844321792";
    private disconnected = false;
    private rpc = new Client({ transport: "ipc" });
    private instance!: this;
    private current_info = 0;

    constructor() {
        if (this.instance) {
            return this.instance;
        }
        this.login();
    }

    private async login() {
        while (true) {
            try {
                this.rpc = new Client({ transport: "ipc" });
                await this.rpc.login({ clientId: this.clientId });
                this.rpc.on("disconnected", () => {
                    this.disconnected = true;
                });
                break;
            } catch (error: any) {
                await this.sleep(5000);
            }
        }
        while (true) {
            await this.changeActivity();
        }
    }

    private async changeActivity() {
        while (true) {
            if (this.disconnected) {
                this.disconnected = false;
                await this.login();
            }
            try {
                activity.state = (await this.getOrcСasualties())[
                    this.current_info
                ];
                this.current_info++;
                if (this.current_info > 12) {
                    this.current_info = 0;
                }
                await this.rpc.setActivity(activity);
                await this.sleep(10_000);
            } catch (error: any) {}
        }
    }

    private async getOrcСasualties() {
        let $ = cheerio.load(
            (
                await axios.get(
                    "https://index.minfin.com.ua/ua/russian-invading/casualties/"
                )
            ).data
        );
        let casualties = Array.from(
            $("li.gold > div.casualties > div > ul > li")
        );
        let lastDay: string[] = [];
        for (let i = 0; i <= 12; i++) {
            lastDay.push(cheerio.load(casualties[i]).text());
        }
        return lastDay;
    }

    private async sleep(time: number) {
        return new Promise<void>((resolve) =>
            setTimeout(() => {
                resolve();
            }, time)
        );
    }
}
