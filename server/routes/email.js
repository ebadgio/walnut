const express = require('express');
const Community = require('../models/models').Community;
const router = express.Router();

const apiKey = 'key-06c1dc31d2ca5286b37ef0e4bef7ecfc';
const DOMAIN = 'www.walnutnetwork.com';
const mailgun = require('mailgun-js')({ apiKey: apiKey, domain: DOMAIN });

// const nodemailer =  require('nodemailer');

// const transporter = nodemailer.createTransport('smtps://walnutreg@gmail.com:' + encodeURIComponent('acro355123') + '@smtp.gmail.com:465');

router.post('/community/invites', (req, res) => {
  const emails = req.body.newMembers;
  const id = req.body.communityID;
  const link = 'www.walnutnetwork.com/login?code=';
  const start = id.substr(21, 24);
  const end = id.substr(0, 3);
  let letters;
  let status;
  let code;

  Community.findById(id)
  .then((comm) => {
    letters = comm.title.substr(0, 2);
    status = comm.status[0];
    code = start + '_' + letters + '_' + status + '_' + end;

    emails.forEach((email) => {
      console.log('email', email);

      const data = {
        from: 'Walnut <noreply@walnutnetwork.com>',
        to: email,
        subject: 'You have been summoned to join a new community on Walnut',
        text: 'Testing some Mailgun awesomness!',
        html: '<a href=' + link + code + '>' + link + code + '</a><p>Alternatively join using this code once logged in:' + code + '</p>'
      };

      mailgun.messages().send(data, (error, body) => {
        if (error) {
          console.log('error in sending mail', error);
        } else {
          console.log('success in sending mail', body);
        }
      });
    });

    res.json({ succes: true });
  });
});


module.exports = router;
