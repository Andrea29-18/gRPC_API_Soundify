const { Audio } = require('../models');
let self = {};

// GET: api/audios
self.getAll = async function(req, res) {
    try {
        let data = await Audio.findAll({attributes: [['id', 'audioId'], 'name', 'path', 'createdAt', 'updatedAt']});
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// GET: api/audios/:id
self.get = async function(req, res) {
    try {
        let id = req.params.id;
        let data = await Audio.findByPk(id,{attributes: [['id', 'audioId'], 'name', 'path', 'createdAt', 'updatedAt']});
        if (data) {
            return res.status(200).json(data);
        } else {
            return res.status(404).send();
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

// POST: api/audios
self.create = async function(req, res) {
    try {
        let data = await Audio.create({
            name: req.body.name,
            path: req.body.path
        });
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// PUT: api/audios/:id
self.update = async function(req, res) {
    try {
        let id = req.params.id;
        let body = req.body;

        let data = await Audio.update(body, { where: { id: id } });
        if (data[0] == 0) {
            return res.status(404).send();
        } else {
            return res.status(204).send();
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

// DELETE: api/audios/:id
self.delete = async function(req, res) {
    try {
        let id = req.params.id;
        let data = await Audio.findByPk(id);
        if (!data) {
            return res.status(404).send();
        }
        
        await Audio.destroy({ where: { id: id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).send();
    }
};

module.exports = self;
