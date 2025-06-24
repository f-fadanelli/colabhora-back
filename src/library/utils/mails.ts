import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const sendEmail = async (receiverEmail: string[], subject: string, text: string) => {

    try {

        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        } as SMTPTransport.Options)

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: receiverEmail,
            subject: subject,
            text: text
        }

        const info = await transport.sendMail(mailOptions);

        if (info) {
            return { success: true, message: "Success" }
        }
        else {
            console.log(info)
            return { success: false, message: "Fail" }
        }
    }
    catch (err) {
        return { success: false, message: err }
    }
}
