import { fetch } from 'undici';
import config from '../config.js';

export default async () => {
  const data = await fetch(`${config.octoprint.url}/api/printer/tool`, {
    headers: {
      'X-Api-Key': config.octoprint.token,
      'Content-Type': 'application/json',
    },
  });

  return data.json();
};
