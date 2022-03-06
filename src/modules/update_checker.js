'use strict';

import { fetch } from 'undici';
import fs from 'fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import config from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async () => {
    const pkgJson = JSON.parse(await fs.readFile(`${__dirname}/../../package.json`, 'utf-8'));

    if (config.check_for_updates) {
        const data = await (await fetch('https://jopgamer.tk/octobot/updatecheck', {
            headers: {
                'X-API-Key': pkgJson.version,
                'Content-Type': 'application/json',
            },
        })).json();

        if (data.status === 1) {
            console.log('');
            console.log(`New update available: ${pkgJson.version} --> ${data.data.version}`);
            console.log('');
        }
    }
};
