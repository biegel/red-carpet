const env = require('node-env-file')
env('./.env')
const twilio = require('twilio')
const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN

const twilioClient = new twilio(accountSid, authToken)

module.exports = {
  sendMMS: (number, gifUrl) => {
    console.log(`sending ${gifUrl} to ${number}`)
    const twilioNumber = process.env.TWILIO_NUMBER
    return twilioClient.messages.create({
      body: "HAPPY PRIDE!",
      from: twilioNumber,
      mediaUrl: gifUrl,
      to: number
    })
  }
}
