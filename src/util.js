const fs = require('fs').promises;
const path = require('path');
const axios = require('axios').default;

const JSON_CONFIG_URL = "https://raw.githubusercontent.com/tari-project/tari/development/common/config/tari.config.json";
const PRESET_CONFIG_URL = "https://raw.githubusercontent.com/tari-project/tari/config/preset";

function mix (a, b) {
  if (typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) || Array.isArray(b)) {
    return typeof b === 'undefined' ? a : b;
  }

  Object.keys(a).forEach(key => {
    a[key] = mix(a[key], b[key]);
  });

  return a;
}

function clone (val) {
  return JSON.parse(JSON.stringify(val));
}

let data;

async function loadSource() {
  try {
    const response = await axios.get(JSON_CONFIG_URL);
    data = response.data;
  } catch (error) {
    console.error(`Could not fetch JSON config. Falling back to local copy. ${error}`);
    data = require('./tari.config'); //If this is called from the web we can't read the contents of the file with `fetchExtraData()`
  }
}

async function fetchPresets(presets) {
  try {
    const requests = presets.map(p => {
      let req = {responseType: 'text'};
      return axios.get(`${PRESET_CONFIG_URL}/${p}.toml`, req);
    });
    const response = await axios.all(requests);
    return response.map(res => res.data);
  } catch (error) {
    console.error(`Could not fetch presets config. ${error}`);
    return [];
  }
}

async function fetchExtraData() {
  return JSON.parse(await fs.readFile(path.resolve(__dirname, './tari.config.json'), 'UTF-8'));
}

export {mix, clone, loadSource, data, fetchExtraData, fetchPresets};
