const router = require('express').Router();
const {
  getUsers, getUserById, editProfile, editAvatar, getUser,
} = require('../controllers/users');

const {
  getUserByIdCelebrate,
  editProfileCelebrate,
  editAvatarCelebrate,
} = require('../middlewares/reqValidation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserByIdCelebrate, getUserById);
router.patch('/me', editProfileCelebrate, editProfile);
router.patch('/me/avatar', editAvatarCelebrate, editAvatar);

module.exports = router;
