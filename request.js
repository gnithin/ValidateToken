var https=require("https");
var http=require("http");
exports.getHTTPResponse=function (options,callback){
	var protocol=options.port===443 ? https:http;
	var req=protocol.request(options, function(res){
		res.on('data',function(chunk){
			callback(false,chunk);
		});
	});
	req.on('error',function(e){
		console.log("problem with http request "+ e.message);
		callback(true,null);
	});
	req.end();
}
