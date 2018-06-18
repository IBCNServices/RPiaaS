var os = require('os');
var disk = require('diskusage');
var spawn = require('child_process').spawn;

// OS and Process uptime (in sec)
exports.uptime = function(callback){
	callback(null,{"uptime": os.uptime(), "process": process.uptime()});
};

exports.cpuTemp = function(callback){
	temp = spawn('cat', ['/sys/class/thermal/thermal_zone0/temp']);
	temp.stdout.on('data', function(data) {
		callback(null,{"temperature": data * 0.001});
	});
};

// cpu
exports.cpuUsage = function(callback){
	var start = os.cpus();

	setTimeout(function() { // Get CPUs again after 1 second and calculate difference
		var stop = os.cpus();
		var usage = [];
		for(i = 0; i<start.length; i++){
			var idle = stop[i].times.idle - start[i].times.idle;
			var total = getCpuTotal(stop[i]) - getCpuTotal(start[i]);
			usage[i] = {"model": stop[i].model,"speed":stop[i].speed,"usage": 1 - idle / total};
		}
		
		callback(null,usage);
	}, 1000 );
};

// memory
exports.memoryUsage = function(callback){
	var usage = {"total": os.totalmem(), "free": os.freemem(), "used": os.totalmem()-os.freemem(), "usage": (os.totalmem()-os.freemem())/os.totalmem()}
	callback(null,usage);
};

// disk
exports.diskUsage = function(callback){
	var ret = null;
	disk.check('/data', function(err, info) {
		var usage = {"total": info.total, "free": info.free, "available": info.available, "used": info.total - info.available, "usage": (info.total - info.available)/info.total}
		callback(null,usage);
	});
};

exports.all = function(callback){
	var info = {};
    // 1. Get uptime    
    exports.uptime(function(error,result){
        info.uptime = result;
        // 2. Get CPU Usage
        exports.cpuUsage(function(error,result){
            info.cpu = result;
            // 3. Get CPU temperature
            exports.cpuTemp(function(error,result){
                info.temp = {};
                info.temp.cpu = result;
                // 4. Get Memory Usage
                exports.memoryUsage(function(error, result){
                    info.memory = result;
                    // 4. Get disk usage
                    exports.diskUsage(function(error, result){
                        info.disk = result;
                        callback(null,info);
                    });
                });
            });
        });
    });
};

/*
HELPER FUNCTIONS
*/

// Calculate total cpu times
function getCpuTotal(cpu){
	return cpu.times.user+cpu.times.nice+cpu.times.sys+cpu.times.irq+cpu.times.idle;
};