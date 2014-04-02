var fs=require('fs');
var LOG_PATH='./logs';





var dateFormat =function(date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMSs]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    case '%s': m = date[utc + 'Milliseconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
}
var filename=LOG_PATH + "/" + "monitor" + dateFormat(new Date(),"%Y-%m",false) + ".log";
var filenameErr=LOG_PATH + "/" + "monitor" + dateFormat(new Date(),"%Y-%m",false) + ".error.log";

var gettime=function(){
	return dateFormat(new Date(),"%Y-%m-%d %H:%M:%S.%s",false)
}

var fileAppend=function(msg,callback)
{
	fs.appendFile(filename,msg+"\n",callback);
}


var fileErrAppend=function(msg,callback)
{
	fs.appendFile(filenameErr,msg+"\n",callback);
}

var logger={
	error:function(error,callback)
	{
		var message=gettime()+"\t[ERROR]\t" + error;
		console.error(message);
		fileAppend(message,function(){
			fileErrAppend(message,callback)
		});
	},
	info:function(msg,callback)
	{
		var message=gettime() +"\t[INFO]\t" + msg
		console.info(message);
		fileAppend(message,callback);
	},
	log:function(msg,callback)
	{
		var message=gettime()+"\t[LOG]\t" + msg;
		console.log(message);
		fileAppend(message,callback);
	}
}


exports.logger=logger;
