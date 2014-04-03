


var http=require('http'),
	https=require('https'),
	url=require('url'),
	logger=require('./flat_log').logger,
	Mailer=require('./mailer').Mailer;
	config=require('./config').config


var urls=config.urls;
var mailer=new Mailer(config.mail.service,
		config.mail.receiver,
		config.mail.sender,
		config.mail.username,
		config.mail.password);

logger.log("=================START UP-TIME MONOTOR v0.0.1 ===================")

var execCounter=0;
var endAsync=function(){
	execCounter++;
	if(execCounter>=urls.length)
	{
		logger.log("================= END UP-TIME MONOTOR v0.0.1 ===================",function(){
			process.exit();
		})
		
	}
}

var getRequest=function(options,callback){
	var protocol=options.protocol;

	if(protocol=="http:")
		return http.request(options,callback)
	else if(protocol=="https:")
		return https.request(options,callback)
	else
		throw Error("protocol " + protocol + "is not supported");
}

var errorHandler=function(message){
	message=(new Date()).toString()+":"+message;

	mailer.sendMail("UP-TIME MONITOR Alert",message,
		function(error)
		{
			logger.error("failed to send email due to: "+error,function(){
				endAsync();
			});				
		},function()
		{
			logger.log("alert email sent",function(){
				endAsync();
			})
			
		})
}

urls.forEach(function(item){
	var starttime=new Date().getTime();
	var options=url.parse(item)
	if(options.protocol=="https:")
	{
		options["rejectUnauthorized"]=config.strict;//ignore the ssl error issue
	}
	request=getRequest(options,function(res){
		var timeframe=new Date().getTime()-starttime;

		if(res.statusCode=="200"||res.statusCode=="302")
		{
			logger.log(item + " ... " + res.statusCode + " in " + timeframe + "ms",endAsync);
		}else
		{
			logger.error(item + " not available ... " + res.statusCode + " in " + timeframe + "ms",function(){
				errorHandler(item + " not available ... " + res.statusCode + " in " + timeframe + "ms");
			});
		}
		
	});
	request.on('error',function(e){
		var timeframe=new Date().getTime()-starttime;
		logger.error(item + " not available ..." +e.message + " in " + timeframe + "ms",function(){
			errorHandler(item + " not available ..." +e.message + " in " + timeframe + "ms");
		});
	})
	request.end();

})

request.end();
