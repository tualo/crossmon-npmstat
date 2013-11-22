var registry = new require('npm-stats')();

function setup(config,callback){
	
	if (typeof config['scale']=='undefined'){
		config['scale'] = 1;
	}
	if (typeof config['downloads_the_last_days']=='undefined'){
		config['downloads_the_last_days'] = 1;
	}
	if (typeof config['downloads']=='undefined'){
		config['downloads'] = [];
	}
	var readline = require('readline');
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
	rl.question("How many days should the query look back? (currently "+config['downloads_the_last_days']+") ", function(answer) {
		if (isNaN(answer)){
			rl.close();
			console.log('wrong input');
			callback({code:0},config);
			return;
		}
		config['downloads_the_last_days'] = answer*1;
		_setup(config,rl,{cmd:'help'},callback);
	});
		
}
function _text(str,length,fill){
	if (!fill) fill = ' ';
	while(str.length<length){
		str+=fill;
	}
	return str;
}
function _setup(config,rl,opt,callback){
	console.log('');
	var help = [
		'Now you can setup the npm packages that you want to monitor.',
		'Following commands are allowed: ',
		"\thelp\tprint this help",
		"\tlist\tshow the current configured list",
		"\tadd\tadd an entry",
		"\tremove\tremoving an entry",
		"\tsave\tsave the current settings and exit",
		"\texit\texit without saving"
	];
	var lines = [];
	switch (opt.cmd){
		case 'help':
			lines = help;
			break;
		case 'list':
			lines.push(' '+_text('',27,'-')+' ');
			lines.push('|'+_text(' NPM Package',25)+'|');
			lines.push(' '+_text('',27,'-')+' ');
			for(var i in config.downloads){
				
				lines.push('|'+_text(' '+config.downloads[i],25)+'|');
			}
			lines.push(' '+_text('',27,'-')+' ');
			break;
	}
	console.log(lines.join("\n"));
	rl.question('> ',function(answer) {
		switch(answer){
			case 'exit':
				rl.close();
				callback({code:0},config);
				break;
			case 'save':
				rl.close();
				callback(null,config);
				break;
			case 'list':
				_setup(config,rl,{cmd:'list'},callback);
				break;
			case 'remove':
				rl.question('package to remove> ',function(answer) {
					var new_list = []; 
					for(var i in config.downloads){
						if (config.downloads[i]!=answer){
							new_list.push(config.downloads[i]);
						}
					}
					config.downloads = new_list;
					_setup(config,rl,{cmd:'list'},callback);
				});
			case 'add':
				rl.question('package to add> ',function(title) {
					config.downloads.push(title);
					_setup(config,rl,{cmd:'list'},callback);
				});
				break;
			default:
				_setup(config,rl,{cmd:'help'},callback);
				break;
		}
	});
}


// sending data to the storage server over socket
// this function will be called from crossmon-collect frequently
function monitor(socket,config){
	if (typeof config['scale']=='undefined'){
		config['scale'] = 1;
	}
	if (typeof config['downloads']=='undefined'){
		config['downloads'] = [];
	}
	
	if (typeof config['downloads_the_last_days']=='undefined'){
		config['downloads_the_last_days'] = 3;
	}
	
	 
	collect(config,function(items){
		for(var i in items){
			var item = items[i];
			socket.emit('put', item);
		}
	});
	
}

// testing the config
// this function will be called from crossmon-collect testing modul function/ command
function test(config){
	if (typeof config['scale']=='undefined'){
		config['scale'] = 1;
	}
	if (typeof config['downloads']=='undefined'){
		config['downloads'] = [];
	}
	
	if (typeof config['downloads_the_last_days']=='undefined'){
		config['downloads_the_last_days'] = 3;
	}
	
	collect(config,function(items){
		console.log(items);
	});
	
}


// main part collecting the data
function collect(config,cb){
	
	var timestamp = Math.round(new Date().getTime()); // JS Timestamp
	scale = config['scale'];
	
	var items = [];
	_collect(config.downloads,0,items,cb,config);
}

function _collect(list,index,items,cb,config){
	if (index<list.length){
		
		
		var cm = new registry.module(list[index]);
		
		var x = cm.downloads({
			since: ( (new Date()).getTime() - (config.downloads_the_last_days * 60 * 60 * 24 * 1000) )
		},function(err,res){
			
			if (!err){
				for(var i in res){
					var timestamp = (new Date(res[i].date)).getTime();
					var item = { 
						program: 'npmstat',
						tag: list[index],
						time: timestamp,
						value: res[i].value
					};
					items.push(item);
				}
			}
			index++;
			_collect(list,index,items,cb,config);
		});
	}else{
		cb(items);
	}
}
module.exports.monitor=monitor;
module.exports.test=test;
module.exports.setup=setup;
module.exports.minintervall=1 * 60 * 60 * 24 * 1000; // only one time per day!
