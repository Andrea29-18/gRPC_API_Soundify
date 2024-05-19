const router = require('express').Router();
const images = require('../controllers/images.controller')

//GET api/images
router.get('/', images.getAll);


//GET api/images/5
router.get('/:id', images.get);


//POST api/images
router.post('/', images.create);


//PUT api/images/5
router.put('/:id', images.update);


//DELETE api/images
router.delete('/:id', images.delete);

module.exports = router