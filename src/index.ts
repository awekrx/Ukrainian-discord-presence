import { app, Menu, Tray } from "electron"
import { Client } from "discord-rpc"
import cheerio from "cheerio"
import axios from "axios"


let tray: any = null
let contextMenu: any = null
let tickerInterval: any = null

const clientId = "990951326844321792";

const rpc = new Client({ transport: "ipc" });

function exit() {
    app.quit()
    process.exit()
}

app.on('ready', () => {
    tray = new Tray('./images/flag.png')
    contextMenu = Menu.buildFromTemplate([
        { label: 'Вийти', type: "normal", "click": exit },
    ])
    tray.setToolTip('Українська активність Discord')
    tray.setContextMenu(contextMenu)
})


const activity = {
    details: "💛Слава Україні💙",
    state: "",
    timestamps: {
        start: +new Date("2022-02-24T05:00:00"),
    },

    largeImageKey: "flag",
    largeImageText: "💛Слава Україні💙",
    smallImageKey: "gerb",
    smallImageText: "❤️Смерть москалям🖤",

    buttons: [
        {
            label: "Втрати",
            url: "https://index.minfin.com.ua/ua/russian-invading/casualties/",
        },
        {
            label: "Підтримати",
            url: "https://bank.gov.ua/ua/about/support-the-armed-forces",
        },
    ],

    instance: false,
};

async function getOrcСasualties() {
    let $ = cheerio.load((await axios.get("https://index.minfin.com.ua/ua/russian-invading/casualties/")).data);
    let casualties = Array.from($("li.gold > div.casualties > div > ul > li"));
    let lastday: string[] = [];
    for (let i = 0; i <= 12; i++) {
        lastday.push(cheerio.load(casualties[i]).text());
    }
    return lastday;
}

async function setActivity() {
    if (!rpc) {
        return;
    }
    let orcs = await getOrcСasualties();
    let i = 0;
    tickerInterval = setInterval(() => {
        activity.state = orcs[i];
        i++;
        if (i > 12) {
            i = 0;
        }
        rpc.setActivity(activity);
    }, 10e3);
}

rpc.on("ready", async () => {
    setActivity();

    setInterval(() => {
        if (tickerInterval) {
            clearInterval(tickerInterval);
        }
        setActivity();
    }, 360e3);
});

rpc.login({ clientId }).catch(console.error);
