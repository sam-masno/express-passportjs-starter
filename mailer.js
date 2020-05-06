const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(require('SENDGRID API KEY HERE').sendgridKey)

const mailService = async ( { to, text, subject, from, html }) => {
    //convert recipients objects array into array of just emails
    const msg = {
        to,
        from,
        subject,
        text,
        html
      };
      //try sending and return result
      try {
        const res = await sendgrid.sendMultiple(msg)
        return res
      } catch (error) {
        return error
      }
}
module.exports = mailService;