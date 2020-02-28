const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const bl = require('bl');

function augment (data, extra) {
  const dataAugmented = Object.assign({}, data);
  const overwritten = [];

  for (const section in extra) {
    if (!(section in dataAugmented)) {
      dataAugmented[section] = extra[section];
      overwritten.push(section);
      continue;
    }

    for (const prop in extra[section]) {
      if (prop === 'section' || prop === 'description' || prop === 'condition') {
        dataAugmented[section][prop] = extra[section][prop];
        continue;
      }

      overwritten.push(`${section}.${prop}`);
      dataAugmented[section][prop] = {...dataAugmented[section][prop], ...extra[section][prop]};
    }
  }

  // Quick hack to retain the key order of tari.config.json
  // (make new object and insert tari.config.json props first)

  const dataAugmentedOrdered = {};

  overwritten.forEach(id => {
    if (!id.includes('.')) {
      dataAugmentedOrdered[id] = dataAugmented[id];
    } else {
      const [section, prop] = id.split('.');
      dataAugmentedOrdered[section] = dataAugmentedOrdered[section] || {};
      dataAugmentedOrdered[section][prop] = dataAugmented[section][prop];
    }
  });

  Object.keys(dataAugmented)
    .filter(section => !overwritten.includes(section))
    .forEach(section => {
      dataAugmentedOrdered[section] = dataAugmentedOrdered[section] || {};

      Object.keys(dataAugmented[section])
        .filter(prop => !overwritten.includes(`${section}.${prop}`))
        .forEach(prop => {
          dataAugmentedOrdered[section][prop] = dataAugmented[section][prop];
        });
    });

  return dataAugmentedOrdered;
}

function generateAugmentedData(extra) {
  return augment({}, extra);
}

async function fetchExtraData(){
  return JSON.parse(await fs.readFile(path.resolve(__dirname, '../src/tari.config.json'), 'UTF-8'));
}

if (!module.parent) {
  (async function () {
  // Make sure that config items with unrecognized default values
  // were set a default value in tari.config.json
    const dataAugmented = generateAugmentedData(await fetchExtraData());
  

    Object.keys(dataAugmented).forEach(section => {
      const undefinedDefaults = Object.keys(dataAugmented[section])
        .filter(prop => {
          const item = dataAugmented[section][prop];
          return typeof item === 'object' && typeof item.default === 'undefined';
        })
        .map(prop => `${section}.${prop}`);

      if (undefinedDefaults.length) {
        throw new Error(`Couldn't parse the default CLI value for the following config items: ${undefinedDefaults.join(', ')}. Please set a default value for them in tari.config.json.`);
      }
    });

  // Write to file

    await fs.writeFile(path.resolve(__dirname, '../src/data.compiled.json'), JSON.stringify(dataAugmented, null, 2));
  })().catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  module.exports = {
    fetchExtra: fetchExtraData,
    getData: generateAugmentedData
  };
}
