import express from 'express';
import { Community } from '../models/models';
const router = express.Router();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport('smtps://walnutreg@gmail.com:' + encodeURIComponent('acro355123') + '@smtp.gmail.com:465');

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

    nodemailer.createTestAccount((err, account) => {
      emails.forEach((email) => {
          // setup email data with unicode symbols

        console.log('email', email);
        const mailOptions = {
          from: '"Walnut" <walnutreg@gmail.com>', // sender address
          to: email, // list of receivers
          subject: 'You have been summoned to join a new community on Walnut', // Subject line
          text: 'Hello world?', // plain text body
          html: '<a href=' + link + code + '>' + link + code + '</a><p>here is your code:' + code + '</p>' // html body
        };
          // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log('error on email send', error);
          }
          console.log('success on email', info.messageId, info);
        });
      });
      console.log('code', code);
      res.json({succes: true});
    });
  });
});


module.exports = router;
