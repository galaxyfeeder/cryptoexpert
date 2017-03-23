let Alexa = require('alexa-sdk');
let request = require('request');

let custom_intent_handlers = {
    'GetExchangeIntent': function(){
        const currency1 = this.event.request.intent.slots.CurrencyA.value;
        const currency2 = this.event.request.intent.slots.CurrencyB.value;
        let intent = this;
        request('https://poloniex.com/public?command=returnTicker', function(error, response, body){
            const data = JSON.parse(body);
            intent.emit(':tell', 'I don\'t know any exchange between '+currency1+' and '+currency2+' yet. '+data['BTC_ETH'].last);
        });
    }
};

let built_in_intents_handlers = {
    'AMAZON.HelpIntent': function(){
        this.emit(':tell', 'I\'m the Crypto Expert you can ask me all about crypto currencies.');
    }
};

exports.handler = function(event, context, callback){
    let alexa = Alexa.handler(event, context);
    alexa.appId = 'amzn1.ask.skill.5ff34f18-d222-4e77-b4ca-601f981afa59';
    alexa.registerHandlers(custom_intent_handlers, built_in_intents_handlers);
    alexa.execute();
};
