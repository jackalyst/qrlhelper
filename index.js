const fs = require('fs');
const Discord = require("discord.js");
const grpc = require("grpc");
const qrlbase = grpc.load('qrlbase.proto');
const qrlConn = new qrlbase.qrl.Base('localhost:9009', grpc.credentials.createInsecure());
const qrlClient = [];

const node = {
	grpc:'localhost:9009'
}
var config = require('./env.json')[process.argv[2]];
const token = config['token'];
const client = new Discord.Client();


client.on('ready', () => {
	console.log('Loaded Discord.JS');
	
	// Do I really have to use base to download qrl.proto?
	// I'm assuming this is recommended.
	qrlConn.getNodeInfo({}, function(err, res) {
		if(err) {
			console.log('Nope')
		} else {
			console.log('Connected to gRPC.')

			fs.writeFile('qrl2.proto', res.grpcProto, function(err) {
				if(err) {
					console.log('Failed to download qrl2.proto');
				} else {
					const grpcObject = grpc.load('qrl2.proto');
					qrlClient.push('localhost:9009');
					qrlClient['localhost:9009'] = new grpcObject.qrl.PublicAPI('localhost:9009', grpc.credentials.createInsecure());
					console.log('qrlClient Loaded for localhost:9009')
					// callback(null, true)
				}
			})
		}
	})
});

client.on('message', message => {
	// Say "no" to bots
	if(message.author.bot) return;

	if(!new RegExp("^(give|get|steal)").test(message.content)) {
		return;
	}

	// give|get|steal 100 q|quanta address ots_key
	if(!new RegExp("^(give|get|steal) [0-9\.]{1,9} (quanta|q) Q([a-zA-Z0-9]){72}").test(message.content)) {
		message.channel.send("Sorry, incorrect command");
	}

    // bytes address_from = 1;                 // Transaction source address
    // bytes address_to = 2;                   // Transaction destination address
    // uint64 amount = 3;                      // Amount. It should be expressed in Shor
    // uint64 fee = 4;                         // Fee. It should be expressed in Shor
    // bytes xmss_pk = 5;                      // XMSS Public key
    // uint64 xmss_ots_index = 6;              // XMSS One time signature index


    // console.log(qrllib);

	// const cmd = message.content.split(' ');

	// const TransferCoins = {
	// 	address_from: '',
	// 	address_to: cmd[3],
	// 	amount: cmd[1] * 100000000,
	// 	fee:0,
	// 	xmss_pk: '', // Need to grab
	// 	xmss_ots_index: 1
	// }



});

client.login(token);