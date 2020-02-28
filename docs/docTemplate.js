
const BufferList = require('bl');

module.exports = {
  preExampleConfig: new BufferList(`
---
title: Configuring Tari Applications
---

Tari can be configured using either CLI arguments, environment variables or (preferably) with a configuration file. CLI 
arguments take priority over environment variables, which in turn take priority over the configuration file settings.

If no user preferences are given, the default configuration value is used.

\`\`\`toml
[tari]
mode_timeout = 500
\`\`\`

## Config File

Tari can be configured using a [TOML](https://github.com/toml-lang/toml) file. The file can be generated using the 
[Tari Config Generator]. To start tari applications with a config file, the file needs to be located in:

  * Windows: \`%UserProfile%\\AppData\\Roaming\\Tari\\config.toml\`
  * Linux: \`~/.tari/config.toml\`
  * macOS: \`$HOME/.tari/config.toml\`

To use a custom path run \`$ tari_base_node --config-file path/to/config.toml\`.

## Default config.toml

The following is a representation of a configuration file with all default values.

\`\`\`toml`),
  postExampleConfig: new BufferList('\n```\n'),
  preConfigDoc: new BufferList(`
## Presets

The following preset configurations can be selected in the [Tari Config Generator]:
  * \`tcp/ip\`: Uses a standard TCP/IP port to connect to the network. Your IP address will be known by your peers. The control port must be open in your firewall to accept incoming connections. This setting will not work for mobile phones.
  * \`tor\`: uses TOR 
  * \`socks5\`: uses TOR via a Socks 5 proxy on the same machine

[Tari Config Generator]: https://config.tari.com/

`),
  postConfigDoc: new BufferList(``)
};
