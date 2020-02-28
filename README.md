# Tari Config Generator

See demo at: [Tari Config Generator](https://config.tari.com/)

## Development

To update the list of fields, run `npm run generate-data`. This will parse the source-of-truth file
`src/tari.config.json` and save the result into `src/data.compiled.json`, which is the file used by Tari Config
Generator.
