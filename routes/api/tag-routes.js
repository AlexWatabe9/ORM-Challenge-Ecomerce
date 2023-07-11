const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// get all tags
router.get('/', async (req, res) => {
  try {
    // find all tags
    // be sure to include its associated Product data
    const allTags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.json(allTags);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one tag
router.get('/:id', async (req, res) => {
  try {
    // find a single tag by its `id`
    // be sure to include its associated Product data
    const oneTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });
    if (!oneTag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json(oneTag);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new tag
router.post('/', async (req, res) => {
  try {
    // create a new tag
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update tag
router.put('/:id', async (req, res) => {
  try {
    // update a tag's name by its `id` value
    const [rowsUpdated] = await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    if (rowsUpdated === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json({ message: 'Tag updated successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete tag
router.delete('/:id', async (req, res) => {
  try {
    // delete a tag by its `id` value
    const rowsDeleted = await Tag.destroy({
      where: { id: req.params.id },
    });
    if (rowsDeleted === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
