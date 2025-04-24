// productController.js
const Product = require('../models/productModels'); // Cambia il percorso se necessario

// Funzione per aggiornare la quantità
const updateProductQuantity = async (req, res) => {
    const { productId } = req.params;
    const { change } = req.body;
  
    try {
      // Trova il prodotto nel database
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Prodotto non trovato' });
      }
  
      // Modifica la quantità
      product.qty += change;
  
      // Salva il prodotto aggiornato
      const updatedProduct = await product.save();
  
      // Ritorna il prodotto aggiornato
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Errore durante l\'aggiornamento della quantità' });
    }
  };
  
  const deleteProductFromWarehouse = async (req, res) => {
    const { productId } = req.params;
  
    try {
      // Trova il prodotto nel database
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Prodotto non trovato' });
      }
  
      // Ritorna una risposta di conferma
      res.status(200).json({ message: 'Prodotto eliminato con successo' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Errore durante l\'eliminazione del prodotto' });
    }
  };
  
  // Esporta le funzioni
  module.exports = { updateProductQuantity, deleteProductFromWarehouse };
  