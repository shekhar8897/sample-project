let express = require('express');
let router = express.Router();

router.get('/login', (req, res, err) => {

    if (err) {
        console.log(err)
    }
   res.render('login')
});

module.exports = router;



