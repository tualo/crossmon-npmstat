var registry = new require('npm-stats')();

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
			_collect(list,index,items,cb);
		});
	}else{
		cb(items);
	}
}
module.exports.monitor=monitor;
module.exports.test=test;
module.exports.minintervall=1 * 60 * 60 * 24 * 1000; // only one time per day!
