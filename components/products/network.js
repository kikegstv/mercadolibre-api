

import express from 'express';
import axios from 'axios';
import { success, error } from '../../network/response.js';
import { getProducts, getProductDetail } from './controller.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const responseMeLi = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${req.query.q}`);
        const responseBody = responseMeLi && await getProducts(responseMeLi.data);

        success(req, res, responseBody, 201)
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const responseDetail = await axios.get(`https://api.mercadolibre.com/items/${req.params.id}`);
        const responseDescription = await axios.get(`https://api.mercadolibre.com/items/${req.params.id}/description`);
        const responseBody = responseDetail && await getProductDetail(responseDetail.data, responseDescription.data);

        const { productDetail, categories } = responseBody

        success(req, res, {productDetail, categories }, 201)
    } catch (err) {
        console.log(err);
    }
});

router.post('/', (req, res) => {

    getProducts(req.body.id);

    if (req.query.error === "ok") {

        error(req, res, 'Error simulado', 400);

    } else {

        success(req, res, 'Message list', 201)

    }

});

export default router;