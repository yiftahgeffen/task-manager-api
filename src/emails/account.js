const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRIP_API_KEY)


const sendWelcomeEmail = (userEmail, username) => {
    sgMail.send({
        to: userEmail,
        from: userEmail,
        subject: 'Hello from your Task App',
        text: 'Hi ' + username + ' and Welcome to our Task App'
    })
}

const sendCancellationEmail = (userEmail, username) => {
    sgMail.send({
        to: userEmail,
        from: userEmail,
        subject: 'Goodby from your Task App',
        text: 'Hi ' + username + ' , we are sorry to see you go, please feel free to tell us what we can improve'
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}