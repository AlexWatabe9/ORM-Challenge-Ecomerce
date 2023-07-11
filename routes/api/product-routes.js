const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    // find all products
    // be sure to include its associated Category and Tag data
    const allProducts = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag },
        { model: ProductTag },
      ],
    });
    res.json(allProducts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    // find a single product by its `id`
    // be sure to include its associated Category and Tag data
    const oneProduct = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag },
        { model: ProductTag },
      ],
    });
    if (!oneProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(oneProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    /* req.body should look like this...
      {
        product_name: "Basketball",
        price: 200.00,
        stock: 3,
        tagIds: [1, 2, 3, 4]
      }
    */

    // create a new product
    const newProduct = await Product.create(req.body);

    // if there are product tags, create the necessary associations
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });

      // bulk create the associations in the ProductTag model
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // respond with the newly created product
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// update product
router.put("/:id", async (req, res) => {
  try {
    // update product data
    const [rowsUpdated] = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    // figure out which ones to remove
    const tagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions in parallel
    await Promise.all([
      // remove tags that are no longer associated with the product
      ProductTag.destroy({ where: { id: tagsToRemove } }),

      // create new associations for the newly added tags
      ProductTag.bulkCreate(newProductTags),
    ]);

    // respond with a success message
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// delete product
router.delete("/:id", async (req, res) => {
  try {
    // delete one product by its `id` value
    const rowsDeleted = await Product.destroy({
      where: { id: req.params.id },
    });

    // check if any rows were deleted
    if (rowsDeleted === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // respond with a success message
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

