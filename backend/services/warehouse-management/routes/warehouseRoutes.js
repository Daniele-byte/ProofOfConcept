const express = require('express');
const router = express.Router();
const Product = require('../models/productModels');
const { protect, adminOnly } = require('../middleware/productMiddleware');
const productController = require('../controllers/productController');

// Rotta per ottenere tutti i prodotti dal magazzino
router.get('/products', async (req, res) => {
  console.log('Prelevo i prodotti!!');
  try {
    // Ottieni tutti i prodotti dal database
    const products = await Product.find();
  //  console.log('Prodotti trovati:', products);  // Mostra effettivamente i prodotti
    if (products.length === 0) {
      return res.status(404).json({ message: 'Nessun prodotto trovato' });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
});

// Aggiungo endpoint per ottenere i dettagli del prodotto
router.get('/product/:id', async (req, res) => {
  const productId = req.params.id; // Ottieni l'ID del prodotto dalla URL
  try {
    const product = await Product.findById(productId); // Cerca il prodotto nel database

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' }); // Se il prodotto non esiste
    }

    res.json({ product }); // Restituisci i dettagli del prodotto
  } catch (error) {
    console.error('Errore nel recupero dei dettagli del prodotto:', error);
    res.status(500).json({ message: 'Errore nel recupero del prodotto' });
  }
});

// PATCH per aggiornare la quantità del prodotto
router.patch('/product/:productId/quantity', productController.updateProductQuantity);  

// DELETE per eliminare un prodotto
router.delete('/product/:productId', productController.deleteProductFromWarehouse);

module.exports = router;
