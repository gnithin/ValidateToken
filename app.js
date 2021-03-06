var express=require("express");
var app=express();
var request=require("./request");

var timeStamp=function(){var date=new Date();return ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)+' '+('0'+date.getDate()).slice(-2)+'/'+('0'+(date.getMonth()+1)).slice(-2)+'/'+date.getFullYear()+':  ';};
var write=function(str){console.log(timeStamp()+str)};

app.configure(function(){
	app.use(function(req,res,next){
		write(req.method+req.url);
		next();
	});
});

var USER_INFO_PATH='/oauth2/v1/userinfo?alt=json&access_token=';
var TOKEN_INFO_PATH='/oauth2/v1/tokeninfo?access_token=';
var HOST_PATH='www.googleapis.com';

app.get("/",function(req,res){
	/**
		Obtain the tokens from the get Parameter.
	*/
	var tokenId=req.query.tokenId;
	var tokenInfo=req.query.tokenInfo;
	if(tokenId != undefined){
		write("TokenId :"+tokenId);
		/**
			Make an HTTPRequest to the specific URL (depending on tokenInfo parameter.), with the token.
			Define the CallBack function for HTTPRequest.
		*/
		var requiredPath= (tokenInfo != undefined && tokenInfo === 'true')? TOKEN_INFO_PATH : USER_INFO_PATH;
		var options={
			host: HOST_PATH,
			port: 443,			//Its HTTPS
			path: requiredPath+tokenId,
			method: 'GET'
		};
		res.set('Content-Type', 'text/plain');
		request.getHTTPResponse(options,function(err,data){
			var displayContent;
			if(err===true){
				displayContent="Error in obtaining Data";				
			}
			else{
				var obj={};
				obj=JSON.parse(data);
				if("error" in obj){
					displayContent="Token Invalid";
				}
				else{
					write("Token Valid");
					displayContent=JSON.stringify(obj);
				}
			}
			write(displayContent);
			res.end(displayContent);
		});
	}
	else{
		res.end("Token Undefined");
	}
});
app.get("*",function(req,res){
	res.end("Invalid Page");
});
app.listen(9000);
write("Server Started");
write("listening to port 9000");
