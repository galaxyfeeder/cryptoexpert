let Alexa = require('alexa-sdk');
let request = require('request');

const name_to_dim = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'xem': 'XEM',
    'litecoin': 'LTC',
    'euro': 'EUR',
    'pound': 'GBP',
    'dollar': 'USD'
};

const dim_to_name = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'XEM': 'nem',
    'LTC': 'litecoin',
    'EUR': 'euro',
    'GBP': 'pound',
    'USD': 'dollar'
};

const normal_currencies = [
    'EUR', 'GBP', 'USD'
];

const supported_in_gdax = [
    'BTC_EUR',
    'BTC_GBP',
    'BTC_USD',
    'ETH_USD',
    'LTC_USD',
    'BTC_LTC',
    'BTC_ETH'
];

function get_data(currency1, currency2, callback){
    const currency_pair_a = name_to_dim[currency1]+'_'+name_to_dim[currency2];
    const currency_pair_b = name_to_dim[currency2]+'_'+name_to_dim[currency1];
    const currency_pair_c = currency1.toUpperCase()+'_'+name_to_dim[currency2];
    const currency_pair_d = currency2.toUpperCase()+'_'+name_to_dim[currency1];
    const currency_pair_e = name_to_dim[currency1]+'_'+currency2.toUpperCase();
    const currency_pair_f = name_to_dim[currency2]+'_'+currency1.toUpperCase();
    const currency_pair_g = currency1.toUpperCase()+'_'+currency2.toUpperCase();
    const currency_pair_h = currency2.toUpperCase()+'_'+currency1.toUpperCase();
    if(normal_currencies.indexOf(currency1.toUpperCase()) > 0 || normal_currencies.indexOf(currency2.toUpperCase()) > 0 ||
       normal_currencies.indexOf(name_to_dim[currency1]) > 0 ||  normal_currencies.indexOf(name_to_dim[currency2]) > 0){
        // gdax
        let pair;
        if(supported_in_gdax.indexOf(currency_pair_a) > 0) pair = currency_pair_a;
        else if(supported_in_gdax.indexOf(currency_pair_b) > 0) pair = currency_pair_b;
        else if(supported_in_gdax.indexOf(currency_pair_c) > 0) pair = currency_pair_c;
        else if(supported_in_gdax.indexOf(currency_pair_d) > 0) pair = currency_pair_d;
        else if(supported_in_gdax.indexOf(currency_pair_e) > 0) pair = currency_pair_e;
        else if(supported_in_gdax.indexOf(currency_pair_f) > 0) pair = currency_pair_f;
        else if(supported_in_gdax.indexOf(currency_pair_g) > 0) pair = currency_pair_g;
        else if(supported_in_gdax.indexOf(currency_pair_h) > 0) pair = currency_pair_h;
        else callback(new Error('Currency pair not found.'), undefined);
        const options = {
            url: 'https://api.gdax.com/products/'+pair.replace('_', '-')+'/ticker',
            headers: {
                'User-Agent': 'cryptoexpert'
            }
        };
        request(options, (error, response, body) => {
            if(error) callback(error, undefined);
            else {
                const data = JSON.parse(body);
                callback(undefined, dim_to_name[pair.split('_')[0]], dim_to_name[pair.split('_')[1]], data['price']);
            }
        });
    }else{
        //poloniex
        request('https://poloniex.com/public?command=returnTicker', (error, response, body) => {
            if(error) callback(error, undefined);
            else {
                const data = JSON.parse(body);
                if(data[currency_pair_a]) callback(undefined, dim_to_name[currency_pair_a.split('_')[0]], dim_to_name[currency_pair_a.split('_')[1]], data[currency_pair_a].last);
                else if(data[currency_pair_b]) callback(undefined, dim_to_name[currency_pair_b.split('_')[0]], dim_to_name[currency_pair_b.split('_')[1]], data[currency_pair_b].last);
                else if(data[currency_pair_c]) callback(undefined, dim_to_name[currency_pair_c.split('_')[0]], dim_to_name[currency_pair_c.split('_')[1]], data[currency_pair_c].last);
                else if(data[currency_pair_d]) callback(undefined, dim_to_name[currency_pair_d.split('_')[0]], dim_to_name[currency_pair_d.split('_')[1]], data[currency_pair_d].last);
                else if(data[currency_pair_e]) callback(undefined, dim_to_name[currency_pair_e.split('_')[0]], dim_to_name[currency_pair_e.split('_')[1]], data[currency_pair_e].last);
                else if(data[currency_pair_f]) callback(undefined, dim_to_name[currency_pair_f.split('_')[0]], dim_to_name[currency_pair_f.split('_')[1]], data[currency_pair_f].last);
                else if(data[currency_pair_g]) callback(undefined, dim_to_name[currency_pair_g.split('_')[0]], dim_to_name[currency_pair_g.split('_')[1]], data[currency_pair_g].last);
                else if(data[currency_pair_h]) callback(undefined, dim_to_name[currency_pair_h.split('_')[0]], dim_to_name[currency_pair_h.split('_')[1]], data[currency_pair_h].last);
                else callback(new Error('Currency pair not found.'), undefined);
            }
        });
    }
}

let custom_intent_handlers = {
    'GetExchangeIntent': function(){
        const currency1 = this.event.request.intent.slots.CurrencyA.value;
        const currency2 = this.event.request.intent.slots.CurrencyB.value;
        let intent = this;
        get_data(currency1, currency2, (error, currency1, currency2, exchange) => {
            if(error) intent.emit(':tell', 'Sorry, an internal error occurred. Try it later.');
            else intent.emit(':tell', 'The last exchange between '+currency1+' and '+currency2+' has been at '+parseFloat(exchange).toFixed(4)+'.');
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
