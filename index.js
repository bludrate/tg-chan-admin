const KafkaClient = require('../tg-chan-kafka');
const Telegram = require('./telegram-bot');
//const userApi = require( './core/userAPI' );
const api = new Telegram({
    token: '758775143:AAGtr6Am0FiIfk8qtsBKn8K3KftOL70oic4',
    updates: {
        enabled: true
    }
});

new KafkaClient().then( kafkaClient => {
    kafkaClient.producer.then( producer => {
      api.on('message', message => {
        switch( message.text ) {
          case '/add':
            let channel;

            if ( message.text.indexOf('http') === 0 ) {
              channel = message.text;
            } else {
              channel = 'https://t.me/' + message.text;
            }

            producer.send([{
              topic: 'newChannel',
              messages: channel
            }], () => {
              api.sendMessage({
                chat_id: message.chat.id,
                text: 'Success'
              });
            });
            break;
          default:
            api.sendMessage({
              chat_id: message.chat.id,
              text: 'Wrong command'
            });
            break;
        }
    });
  } );
});
