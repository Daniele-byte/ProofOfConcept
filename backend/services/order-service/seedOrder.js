const mongoose = require('mongoose');
const Orders = require('./models/orderModel');
require('dotenv').config();


const orders = [
    {
      orderId: 'ORD-1',
      userId: 'USER-001',
      cartItems: [
        {
          productId: 'PROD-123',
          name: 'T-shirt',
          quantity: 2,
          price: 25.0
        },
        {
          productId: 'PROD-456',
          name: 'Jeans',
          quantity: 1,
          price: 50.0
        }
      ],
      status: 'creato',
      subTotal: 100.0, // Subtotale senza la spedizione
      shippingCost: 20.0, // Costo di spedizione
      totalAmount: 120.0, // Subtotale + Spedizione
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      orderId: 'ORD-2',
      userId: 'USER-002',
      cartItems: [
        {
          productId: 'PROD-789',
          name: 'Sweater',
          quantity: 1,
          price: 40.0
        }
      ],
      status: 'creato',
      subTotal: 40.0,
      shippingCost: 15.0,
      totalAmount: 55.0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      orderId: 'ORD-3',
      userId: 'USER-003',
      cartItems: [
        {
          productId: 'PROD-101',
          name: 'Shoes',
          quantity: 1,
          price: 80.0
        }
      ],
      status: 'creato',
      subTotal: 80.0,
      shippingCost: 10.0,
      totalAmount: 90.0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      orderId: 'ORD-4',
      userId: 'USER-004',
      cartItems: [
        {
          productId: 'PROD-202',
          name: 'Bag',
          quantity: 1,
          price: 120.0
        }
      ],
      status: 'evaso',
      subTotal: 120.0,
      shippingCost: 25.0,
      totalAmount: 145.0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

const seedOrders = async () => {
    try {
        await mongoose.connect(process.env.ORDER_SERVICE_MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log('Connesso a MongoDB');

        await Orders.deleteMany(); // Pulisce il database prima di inserire i dati
        await Orders.insertMany(orders);

        console.log('Ordini inseriti con successo');
        mongoose.connection.close();
    } catch (error) {
        console.error('Errore durante l\'inserimento degli ordini di spedizione:', error);
    }
};

seedOrders();
