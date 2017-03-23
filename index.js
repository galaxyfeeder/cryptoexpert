let Alexa = require('alexa-sdk');

let handlers = {
    'GetExchangeIntent': function(){
        this.emit(':tell', 'I don\'t know any exchange yet.');
    }
};

let built_in_intents = {
    
};

exports.handler = function(event, context, callback){
    let alexa = Alexa.handler(event, context);
    alexa.appId = 'amzn1.ask.skill.5ff34f18-d222-4e77-b4ca-601f981afa59';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
