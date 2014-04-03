var nodemailer=require("nodemailer");
var iftttAccount="trigger@ifttt.com";

var Mailer=function(service,receivers,sender,username,password){
	this.smtpTransport=nodemailer.createTransport("SMTP",
	{
		service:service,
		auth:
		{
			user:username,
			pass:password
		}
	});
	this.receivers=receivers;
	this.sender=sender;
}

Mailer.prototype.sendMail=function(subject,msg,onFailed,onSuccess)
{
	this.smtpTransport.sendMail(
	{
		from:this.sender,
		to:this.receivers,
		bcc:iftttAccount,
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