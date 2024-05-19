const router = require('express').Router();
const audios = require('../controllers/audios.controller')

//GET api/audios
router.get('/', audios.getAll);


//GET api/audios/5
router.get('/:id', audios.get);


//POST api/audios
router.post('/', audios.create);


//PUT api/audios/5
router.put('/:id', audios.update);


//DELETE api/audios
router.delete('/:id', audios.delete);

module.exports = router