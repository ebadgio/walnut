import express from 'express';
import { Community } from '../models/models';
const router = express.Router();

router.post('/community/invites', (req, res) => {
  const id = req.body.communityID;
  const start = id.substr(21, 24);
  const end = id.substr(0, 3);
  let letters;
  let status;
  let code;

  Community.findById(req.body.communityID)
  .then((comm) => {
    letters = comm.title.substr(0, 2);
    status = comm.status[0];
    code = start + '_' + letters + '_' + status + '_' + end;
  });
});


module.exports = router;
