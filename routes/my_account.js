let express = require('express');
let router = express.Router();

router.get('/myaccount', (req, res, err) => {

    if (err) {
        console.log(err)
    }
   res.render('myaccount')
});

module.exports = router;



