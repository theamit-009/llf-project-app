var express = require('express');
var router = express.Router();

/* GET users listing. */
/* router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
 */

router.get('/login',(request, response) => response.send('login'));

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
