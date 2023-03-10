import axios from "axios";

function getProducts(responseMeLi) {

    return new Promise((resolve, reject) => {
        if (responseMeLi) {
            const body = getProductList(responseMeLi);
            resolve(body);
        } else {
            reject('La operación falló.');
        }
    });
}

async function getProductList(responseMeli) {
    const body = {
        author: {
            name: 'Enrique',
            lastname: 'Garcia'
        },
        categories: await getCategoriesNameList(isAvailableFilters(responseMeli) ? responseMeli.available_filters : responseMeli.filters),
        items: await getItems(responseMeli.results)
    }

    return body;
}

function getProductDetail(responseDetail, responseDescription) {

    return new Promise((resolve, reject) => {

        if (responseDetail && responseDescription) {
            const body = getItemDetail(responseDetail, responseDescription);
            resolve(body)
        } else {
            reject('La operación falló.');
        }
    });
}

async function getItemDetail(responseDetail, responseDescription) {
    const categoriesList = await axios.get(`https://api.mercadolibre.com/categories/${responseDetail.category_id}`);
    const categories = getTextCategories(categoriesList.data)
    const currency = await getCurrency(responseDetail.currency_id);
    const productDetail = {
        author: {
            name: 'Enrique',
            lastname: 'Garcia'
        },
        item: {
            id: responseDetail.id,
            title: responseDetail.title,
            price: {
                currency: currency && currency.symbol,
                amount: responseDetail.price,
                decimals: currency && currency.decimal_places
            },
        },
        picture: responseDetail.thumbnail,
        condition: responseDetail.condition,
        free_shipping: responseDetail.shipping.free_shipping,
        sold_quantity: responseDetail.sold_quantity,
        description: responseDescription.plain_text
    }
    return { productDetail, categories };
}

async function getItems(items) {
    let itemList = [];
    for (let i = 0; i <= 3; i++) {
        const currency = await getCurrency(items[i].currency_id);
        itemList.push({
            id: items[i].id,
            title: items[i].title,
            price: {
                currency: currency.symbol,
                amount: items[i].price,
                decimals: currency.decimal_places
            },
            picture: items[i].thumbnail,
            condition: items[i].condition,
            free_shipping: items[i].shipping.free_shipping
        })
    }
    return itemList;
}

async function getCurrency(id) {
    const currency = await axios.get(`https://api.mercadolibre.com/currencies/${id}`);
    return currency.data;
}

async function getCategories(filters) {
    const categoriesFilter = filters.filter((item) => item.name === 'Categorías')
    let categories = (filters.length === 0) ? await getAvailableCategories(categoriesFilter) : await getAvailableCategories(categoriesFilter);
    return categories;
}

function getFilterCategories(categories) {
    let availableCategories = [];
    categories[0].values[0].path_from_root.forEach((item) => {
        availableCategories.push(item.id)
    });
    return availableCategories;
}

async function getAvailableCategories(categories) {
    const categoriesData = await categories;
    return categoriesData[0].values;
}


async function getCategoriesNameList(items) {
    const categoriesList = await getCategories(items);

    let maxResultItem;
    if (categoriesList.length > 1) {
        for (let i = 0; i < categoriesList.length; i++) {
            const currentItem = categoriesList[i];

            if (!maxResultItem) {
                maxResultItem = currentItem;

            } else if (currentItem.results > maxResultItem.results) {
                maxResultItem = currentItem;
            }
        }
    }

    const categoryDetail = (maxResultItem) ? await axios.get(`https://api.mercadolibre.com/categories/${maxResultItem.id}`) : await axios.get(`https://api.mercadolibre.com/categories/${categoriesList[0].id}`);

    return getTextCategories(categoryDetail.data);
}

function getTextCategories(categories) {
    let categoryList = [];
    categories.path_from_root.forEach((item) => {
        categoryList.push(item.name);
    });
    return categoryList;
}



function isAvailableFilters(responseMeLi) {
    return responseMeLi.filters.length === 0 ? true : false
}

export { getProducts, getProductDetail };