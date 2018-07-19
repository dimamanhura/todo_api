const models = require('../models');

module.exports = {
  addItem: async (req, res) => {
    try {
      const { title, completed } = req.body;
      const newItem = await models.Items.create({
        title, completed
      });

      res.json(newItem);
    } catch (err) {
      res.sendStatus(500).json(err);
    }
  },
  getItems: async (req, res) => {
    try {
      const offset = +req.query.offset || 0;
      const limit = +req.query.limit || 100000000000000000;
      const search = req.query.search || '';
      const completed = req.query.completed === 'true';

      const where = {
        title: new RegExp(search, 'i')
      };

      if (req.query.completed) {
        where.completed = completed;
      }

      const items = await models.Items.find(where)
        .sort({ created: -1 })
        .skip(offset)
        .limit(limit);

      res.json(items);
    } catch (err) {
      res.sendStatus(500).json(err);
    }
  },
  getItemById: async (req, res) => {
    try {
      const item = await models.Items.findById(req.params.id);

      res.json(item);
    } catch (err) {
      res.sendStatus(500).json(err);
    }
  },
  updateItem: async (req, res) => {
    try {
      const { title, completed } = req.body;
      const updatedItem = await models.Items.findOneAndUpdate({ _id: req.params.id }, {
        $set: { title, completed }
      }, { new: true });

      res.json(updatedItem);
    } catch (err) {
      res.sendStatus(500).json(err);
    }
  },
  deleteItem: async (req, res) => {
    try {
      const removedItem = await models.Items.remove({ _id: req.params.id });

      res.json(removedItem);
    } catch (err) {
      res.sendStatus(500).json(err);
    }
  },
};
