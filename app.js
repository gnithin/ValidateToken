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
app.get("/",function(req,res){
	var tokenId=req.query.tokenId;
	if(tokenId != undefined){
		write("TokenId :"+tokenId);
		var options={
			host: 'www.googleapis.com',
			port: 443,			//Its HTTPS
			path: '/oauth2/v1/userinfo?alt=json&access_token='+tokenId,
			method: 'GET'
		};
		request.getHTTPResponse(options,function(err,data){
			if(err===true){
				write("Error in obtaining Data");
			}
			else{
				var obj={};
				obj=JSON.parse(data);
				var displayContent;
				if("error" in obj){
					displayContent="Token Invalid";
					write(displayContent);
				}
				else{
					write("Token Valid");
					displayContent=JSON.stringify(obj);
					write(displayContent);
				}
				res.render('home.ejs',{
					layout:	false,
					locals: {"displayContent": displayContent}
				});
			}
		});
	}
	else{
		res.render('home.ejs',{
			layout:	false,
			locals: {"displayContent": "Token Undefined"}
		});
	}
});
app.get("*",function(req,res){
	res.render('invalid.ejs',{
		layout: false
	});
});
app.listen(9000);
write("Server Started");
write("listening to port 9000");
