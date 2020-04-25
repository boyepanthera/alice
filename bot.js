import {create} from '@open-wa/wa-automate';
import {RandomGreeting, greetings} from './injections';
let groupOne;
let groupTwo;

create().then((client) => start(client));

function start(client) {
  const greetingMessage = RandomGreeting();
  const greetingToClient = greetingMessage.substring(0, 1).toUpperCase() + greetingMessage.substring(1);
      client.onParticipantsChanged(
        "2349028320494-1587739102@g.us",
        (participantChangedEvent) => {
          if (participantChangedEvent.action === "add") {
            client.sendText(
              "2349028320494-1587739102@g.us",
              `
              Welcome! @${participantChangedEvent.who.substring(0, 13)}
              \nWe are glad to have you!
              `
            );
          }
        }
      );

  client.onAddedToGroup(
    chat=>{
      // console.log(chat)
          client.sendText(
            chat.id,
              `${greetingToClient}! everyone, I am *Gruki*
              \nI am very glad to be in this group *${chat.name}*,
              \nI hope I can contribute just like everyone to further move this group forward
              \n\nI am *Alice* forca *${chat.name}*🙌.
              `
          );  
        }
  )

  client.onMessage((message) => {
    // Response in private chat
    if (greetings.includes(message.body.toLowerCase())&& !message.chat.isGroup) {
        client.sendText(
            message.from, 
            `${greetingToClient}! *${message.sender.pushname}* I am Alice
            \nNice chatting with you privately, these are the ways I can help you.
            \n 1. Help you welcome participants into your group
            \n 2. Share your chat from one group to the other
            `
          );
    }

    // Response in public chat to share
    if (
      message.body.toLowerCase().substring(0,11) === "alice-share"
      &&
      message.chat.isGroup
    ) {
      client.sendText(
        message.from,
        `${greetingToClient}! *${message.sender.pushname}*
            \nRoger that!. Ready to sync your chats.
            \n
            `
      ).then( ()=> {
        groupOne = message.from;
        console.log(groupOne)
      }
      )
    }

    // Response in second public chat to copy
    if (
      message.body.toLowerCase().substring(0,10) === "alice-sync"
      &&
      message.chat.isGroup
    ) {
      client.sendText(
        message.from,
        `${greetingToClient}! *${message.sender.pushname}*
            \nRoger that!. will be syncing your chat over the two groups henceforth.
            \n
            `
      ).then( ()=> {
        groupTwo = message.from;
        console.log(groupOne, groupTwo)
      }
      )
    }

    // Response for sync messages once the two groups have been ascertained
    if(groupOne && groupTwo) {
      
      // Send message from groupOne to groupTwo
      if(message.body && message.chat.id === groupOne){
        client.sendText(
          groupTwo,
          `*${message.sender.pushname}* : ${message.body}`
        )
      }

      // send message from groupTwo to groupOne
      if(message.body && message.chat.id === groupTwo){
        client.sendText(groupOne, `*${message.sender.pushname}* : ${message.body}`);
      }

      // Stop the syncing
      if(message.body.toLowerCase().substring(0, 10)==='alice-stop' && message.chat.id === groupOne) {
        client.sendText(groupOne, 
          `Message Syncing Stopped`
          ).then(
            ()=>{
              groupOne = undefined
              groupTwo = undefined
          })
      }

    }
  });
}