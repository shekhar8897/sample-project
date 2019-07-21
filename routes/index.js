
let express = require('express');
let router = express.Router();

router.get('/', (req, res, err) => {
    
    if (err) {
        console.log(err)
    }
    res.render('home')
});

module.exports = router;



