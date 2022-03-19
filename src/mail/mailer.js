const nodemailer = require('nodemailer');
const mailCred = require('./mailConfig');

let transporter = nodemailer.createTransport({
    host: mailCred.host,
    port: mailCred.port,
    secure: mailCred.secure,
    auth: {
        user: mailCred.user,
        pass: mailCred.password
    }
});

const mailNow = async function (from, to, subject, body) {
    const result = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: body
    });
    return result;
}

module.exports = mailNow;