# Tari Config Generator

See demo at: [Tari Config Generator](https://config.tari.com/)

## Development

To update the list of fields, run `npm run generate-data`. This will parse the command-line options and configuration
fields [from the  Tari repo](https://github.com/tari-project/tari/), apply the manual overwrites and extra information
of `src/data.extra.json` and save the result into `src/data.compiled.json`, which is the file used by Tari Config
Generator.
