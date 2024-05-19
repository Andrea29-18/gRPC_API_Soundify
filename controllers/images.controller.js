const { Image } = require('../models');
let self = {};

// GET: api/images
self.getAll = async function(req, res) {
    try {
        let data = await Image.findAll({attributes: ['id', 'name', 'path', 'type', 'createdAt', 'updatedAt']});
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// GET: api/images/:id
self.get = async function(req, res) {
    try {
        let id = req.params.id;
        let data = await Image.findByPk(id, {attributes: ['id', 'name', 'path', 'type', 'createdAt', 'updatedAt']});
        if (data) {
            return res.status(200).json(data);
        } else {
            return res.status(404).send();
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

// POST: api/images
self.create = async function(req, res) {
    try {
        let data = await Image.create({
            name: req.body.name,
            path: req.body.path,
            type: req.body.type
        });
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// PUT: api/images/:id
self.update = async function(req, res) {
    try {
        let id = req.params.id;
        let body = req.body;
        let data = await Image.update(body, { where: { id: id } });
        if (data[0] == 0) {
            return res.status(404).send();
        } else {
            return res.status(204).send();
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

// DELETE: api/images/:id
self.delete = async function(req, res) {
    try {
        let id = req.params.id;
        let data = await Image.findByPk(id, {
            attributes: ['id', 'name', 'path', 'type', 'createdAt', 'updatedAt']
        });
        if (!data) {
            return res.status(404).send();
        }

        await Image.destroy({ where: { id: id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).send();
    }
};

module.exports = self;
