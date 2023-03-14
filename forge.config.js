const path = require('path');

module.exports = {
  packagerConfig: {
    icon: __dirname + '/images/logo.ico'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'UkrainianPresence',
        authors: 'awekrx',
        exe: 'Ukrainian Presence.exe',
        noMsi: true,
        optionsiconUrl: 'https://raw.githubusercontent.com/awekrx/Ukrainian-discord-presence/master/images/logo.ico',
        setupIcon: __dirname + '/images/logo.ico',
      },
    },
  ],
};
