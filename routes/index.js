var express = require('express');
var router = express.Router();

router.get("/greeting", (req, res) => {
  var resolvedLng = req.resolvedLanguage;
  const response = req.t("greeting");
  res.status(200).json({
    response,
    resolvedLng,
    lang: req.i18n.language,
  });
});


router.get('/no-message', (req, res) => {
    const response = req.t('foo');
    res.status(200);
    res.send(response);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
