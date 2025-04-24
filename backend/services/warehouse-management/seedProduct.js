const mongoose = require('mongoose');
const Product = require('./models/productModels'); // Aggiusta il percorso in base alla tua struttura

/* Script di riempimento di 18 prodotti */
const products = [
  {
    id: 1,
    name: 'iPhone 16 Pro',
    price: 1339,
    image: [
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-card-40-iphone16prohero-202409?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1725567335931",
      "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_144642500?x=536&y=402&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=536&ey=402&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=536&cdy=402",
      "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_144642501?x=536&y=402&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=536&ey=402&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=536&cdy=402",
      "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_144642502?x=1800&y=1800&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=1800&ey=1800&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=1800&cdy=1800"
    ],
    qty: 181
  },
  {
    id: 2,
    name: 'iPhone 16',
    price: 979,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-card-40-iphone16hero-202409?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1723234230295'],
    qty: 192
  },
  {
    id: 3,
    name: 'iPhone 15',
    price: 879,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-card-40-iphone15hero-202309?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1693086290559'],
    qty: 102
  },
  {
    id: 4,
    name: 'MacBook Air 13"',
    price: 1529,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-card-40-macbook-air-202410?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1731974970795'],
    qty: 98
  },
  {
    id: 5,
    name: 'MacBook Pro 14"',
    price: 2399,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-card-40-macbookpro-14-16-202410?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1731974949535'],
    qty: 89
  },
  {
    id: 6,
    name: 'iPad Pro 11"',
    price: 1069,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-card-40-pro-202405?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1713920820026'],
    qty: 105
  },
  {
    id: 7,
    name: 'iPad Air 11"',
    price: 719,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-card-40-air-202405?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1713920820139'],
    qty: 190
  },
  {
    id: 8,
    name: 'iPad mini',
    price: 609,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-card-40-ipad-mini-202410?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1727281366305'],
    qty: 200
  },
  {
    id: 9,
    name: 'Apple Watch Series 10',
    price: 459,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-card-40-s10-202409?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1724168059157'],
    qty: 450
  },
  {
    id: 10,
    name: 'Apple Watch Ultra 2',
    price: 909,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-card-40-ultra2-202409_GEO_IT?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1725113866531'],
    qty: 192
  },
  {
    id: 11,
    name: 'Apple Watch SE',
    price: 259,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-card-40-se-202409?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1724168056018'],
    qty: 112
  },
  {
    id: 12,
    name: 'AirPods Pro (2ª generazione)',
    price: 299,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-pro-2-hero-select-202409_FV1?wid=976&hei=916&fmt=jpeg&qlt=90&.v=1725492499003'],
    qty: 543
  },
  {
    id: 13,
    name: 'AirPods 4',
    price: 149,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-4-anc-select-202409_FV1?wid=976&hei=916&fmt=jpeg&qlt=90&.v=1725502554118'],
    qty: 340
  },
  {
    id: 14,
    name: 'AirPods 4 con cancellazione attiva del rumore',
    price: 199,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-4-anc-select-202409_FV1?wid=976&hei=916&fmt=jpeg&qlt=90&.v=1725502554118'],
    qty: 321
  },
  {
    id: 15,
    name: 'iMac 24"',
    price: 1549,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/imac-blue-selection-hero-202410?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1730232515462'],
    qty: 328
  },
  {
    id: 16,
    name: 'Mac mini',
    price: 819,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-card-40-mac-mini-202410?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1731974953743'],
    qty: 310
  },
  {
    id: 17,
    name: 'Apple TV 4K (Wi-Fi)',
    price: 169,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=1076&hei=1070&fmt=jpeg&qlt=90&.v=1664896361408'],
    qty: 980
  },
  {
    id: 18,
    name: 'Apple TV 4K (Wi-Fi + Ethernet)',
    price: 189,
    image: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=1076&hei=1070&fmt=jpeg&qlt=90&.v=1664896361408'],
    qty: 970
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect('mongodb://mongodb-warehouse:27017/warehouseService', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
      })
      .then(() => {
        console.log('Connesso a MongoDB');
      })
      .catch((error) => {
        console.error('Errore di connessione a MongoDB:', error);
      });

    for (const product of products) {
        const createdProduct = await Product.create({
          name: product.name,
          price: product.price,
          image: product.image,
          qty: product.qty
        });
        console.log(`Prodotto ${createdProduct.name} creato!`);
    }
  } catch (error) {
    console.error('Errore durante l\'inserimento dei prodotti:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedProducts();
