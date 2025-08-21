const fs = require('fs')

//~~~~~~~~~~~ Settings Owner ~~~~~~~~~~~//
global.owner = "94726800969"
global.developer = "94726800969"
global.bot = ""
global.devname = "NIMESHA"
global.ownername = "NIMESHA"
global.botname = "NIMA-V5"
global.versisc = "2"
global.packname = "⎋NIMA-V5"
//~~~~~~~~~~~ Settings Sosmed ~~~~~~~~~~~//
global.linkwa = "https://wa.me/94726800969"
global.linkyt = "https://youtube.com/@nimaedition?si=k-p-6UVUdgz2jsPb"
global.linktt = "https://tiktok.com"
global.linktele = "https://t.me"

//~~~~~~~~~~~ Settings Bot ~~~~~~~~~~~//
global.prefix = [""]
global.autoRecording = false
global.autoTyping = false
global.autorecordtype = false
global.autoread = false
global.autobio = false
global.anti92 = false
global.owneroff = false
global.autoswview = true

//~~~~~~~~~~~ Settings Thumbnail ~~~~~~~~~~~//
global.thumbbot = "https://files.catbox.moe/w9lv7j.jpg"
global.thumbown = "https://files.catbox.moe/w9lv7j.jpg"

//~~~~~~~~~~~ Settings Channel ~~~~~~~~~~~//
global.idchannel = "120363419075720962@newsletter*"
global.channelname = "ーNIMA-V5 UPDATES"
global.channel = "hatsapp.com/channel/0029Vb68g1c3LdQLQDkbAQ3M"

//~~~~~~~~~~~ Settings Message ~~~~~~~~~~~//
global.mess = {
  developer: " `[ Developer හට පමණි!! ]` \n මේ feature එක developers හට පමණි!!",
  owner: " `[ ප්‍රධානියා හට පමණි!! ]` \n මේ feature එක ප්‍රධානියා හට පමණි!!",
  group: " `[ සමූහයක පමණි!! ]` \n මේ feature එක සමූහයක පමණි!!",
  private: " `[ පෞද්ගලිකව පමණි!! ]` \n මේ feature එක පෞද්ගලිකව පමණි!!",
  admin: " `[ ඇඩ්මින් හට පමණි!! ]` \n මේ feature එක ඇඩ්මින් හට පමණි!!",
  botadmin: " `[ නිමේෂ හට පමණි!! ]` \n මේ feature එක නිමේෂ හට පමණි!!",
  wait: " `[ රැඳීසිටින්න!! ]` \n රැඳීසිටින්න, loading...",
  error: " `[ අසාර්ථකයි!! ]` \n එය අසාර්ථක උණි!!",
  done: " `[ සාර්ථකයි!! ]` \n සේවාව සාර්ථකයි!!"
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
