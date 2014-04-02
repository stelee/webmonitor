var nodemailer=require("nodemailer");
var reciever="stephen.liy@gmail.com, trigger@ifttt.com"

var Mailer=function(username,password){
	this.smtpTransport=nodemailer.createTransport("SMTP",
	{
		service:"Hotmail",
		auth:
		{
			user:username,
			pass:password
		}
	});
}

Mailer.prototype.sendMail=function(subject,msg,onFailed,onSuccess)
{
	this.smtpTransport.sendMail(
	{
		from:"noreply@leesoft.ca",
		to:"stephen.liy@gmail.com",
		bcc:"trigger@ifttt.com",
		subject:subject,
		text:msg
	},function(error,response){
		if(error)
		{
			onFailed(error);
		}else
		{
			onSuccess(response);
		}
	})
}
exports.Mailer=Mailer;