var os = require('os');
var disk = require('diskusage');

// OS and Process uptime (in sec)
exports.uptime = function(callback){
	callback({"uptime": os.uptime(), "process": process.uptime()});
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
		
		callback(usage);
	}, 1000 );
};

// memory
exports.memoryUsage = function(callback){
	var usage = {"total": os.totalmem(), "free": os.freemem(), "used": os.totalmem()-os.freemem(), "usage": (os.totalmem()-os.freemem())/os.totalmem()}
	callback(usage);
}

// disk
exports.diskUsage = function(callback){
	var ret = null;
	disk.check('/data', function(err, info) {
		var usage = {"total": info.total, "free": info.free, "available": info.available, "used": info.total - info.available, "usage": (info.total - info.available)/info.total}
		callback(usage);
	});
}

/*
HELPER FUNCTIONS
*/

// Calculate total cpu times
function getCpuTotal(cpu){
	return cpu.times.user+cpu.times.nice+cpu.times.sys+cpu.times.irq+cpu.times.idle;
};