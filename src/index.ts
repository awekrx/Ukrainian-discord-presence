import path from "path";
import { app, Menu, Tray } from "electron";
import RPC from "./rpc";

if (require("electron-squirrel-startup")) {
    app.quit();
}

let tray: any = null;
let contextMenu: any = null;

function exit() {
    app.quit();
    process.exit();
}

app.on("ready", () => {
    tray = new Tray(path.dirname(__dirname) + "/images/logo.png");
    contextMenu = Menu.buildFromTemplate([
        { label: "Вийти", type: "normal", click: exit },
    ]);
    tray.setToolTip("Українська активність Discord");
    tray.setContextMenu(contextMenu);
    new RPC();
});
