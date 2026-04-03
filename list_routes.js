const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path + layer.route.path));
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path + (layer.regexp.source.replace('^', '').replace('\\/?(?=\\/|$)', ''))));
  } else if (layer.method) {
    console.log('%s %s', layer.method.toUpperCase(), path);
  }
}

app._router.stack.forEach(print.bind(null, ''));
