import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

export const sendActivationMail = async (email, activationLink) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Аккаунтты іске қосу ' + process.env.CLIENT_URL,
        text: '',
        html: `
        <div>
            <h1>Аккаунтты іске қосу үшін сілтемені басыңыз</h1>
            <a href="${process.env.API_URL}/user/activate/${activationLink}">Мені бас</a>
        </div>
        `,
    })
}
