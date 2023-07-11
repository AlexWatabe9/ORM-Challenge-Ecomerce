const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET all categories
router.get('/', async (req, res) => {
  try {
    // Find all categories
    const categories = await Category.findAll({
      include: [Product], 
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET a single category by ID
router.get('/:id', async (req, res) => {
  try {
    // Find one category by its `id` value
    const category = await Category.findByPk(req.params.id, {
      include: [Product], // Include associated Products
    });
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CREATE a new category
router.post('/', async (req, res) => {
  try {
    // Create a new category
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE a category by ID
router.put('/:id', async (req, res) => {
  try {
    // Update a category by its `id` value
    const updatedCategory = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedCategory[0] === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE a category by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete a category by its `id` value
    const deletedCategory = await Category.destroy({
      where: { id: req.params.id },
    });
    if (deletedCategory === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
