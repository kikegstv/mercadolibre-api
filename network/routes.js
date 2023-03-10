import products from './../components/products/network.js';

const routes = function (server) {
    server.use('/api/items', products);
}

export { routes };
