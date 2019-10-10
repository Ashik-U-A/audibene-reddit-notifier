const mail = require("@sendgrid/mail");
mail.setApiKey(process.env.SENDGRID_API_KEY);

export class MailService {
    public static sendMessage(message_details: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }) {
        console.log("Sending Mail to : " + message_details.to);
        mail.send(message_details);
    }
}
