import { Listener } from "gcommands";
import statusCheck from "../modules/status_checker.js";
import updateChecker from "../modules/update_checker.js";

new Listener({
    name: 'ready',
    event: 'ready',
    run: (client) => {
        statusCheck(client);
        updateChecker();
    }
})