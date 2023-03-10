import axios from "axios";

function getProducts(responseMeLi) {

    return new Promise((resolve, reject) => {
        if (responseMeLi) {
            //console.log(responseMeLi.results);
            const body = getProductList(responseMeLi);
            resolve(body);
            console.log(body);
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
            const body = getItemDetail(responseDetail, responseDescription)
            //console.log(body);
            resolve(body)
        } else {
            reject('La operación falló.');
        }
    });
}

async function getItemDetail(responseDetail, responseDescription) {
    const categoriesList = await axios.get(`https://api.mercadolibre.com/categories/${responseDetail.category_id}`);
    const categories = getTextCategories(categoriesList.data)
    console.log(categories);
    const currency = await getCurrency(responseDetail.currency_id)
    //console.log(currency);
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
    //console.log(itemList);
    return itemList;
}

async function getCurrency(id) {
    //console.log(id);
    const currency = await axios.get(`https://api.mercadolibre.com/currencies/${id}`);
    //console.log(currency);
    return currency.data;
}

async function getCategories(filters) {
    const categoriesFilter = filters.filter((item) => item.name === 'Categorías')
    let categories = (filters.length === 0) ? await getAvailableCategories(categoriesFilter) : await getAvailableCategories(categoriesFilter);
    console.log(categories);
    return categories;
}

function getFilterCategories(categories) {
    console.log("Filter categories");
    let availableCategories = [];
    //console.log(availableCategories);
    categories[0].values[0].path_from_root.forEach((item) => {
        availableCategories.push(item.id)
    });
    //console.log(availableCategories);
    return availableCategories;
}

async function getAvailableCategories(categories) {
    const categoriesData = await categories;
    console.log("asdasdsad");
    return categoriesData[0].values;
}


async function getCategoriesNameList(items) {
    //console.log('FILTERS', items);

    const categoriesList = await getCategories(items);
    console.log('CATEGORIES LIST: ', categoriesList);
    console.log('CATEGORIES LIST BOOLEAN : ', categoriesList.length > 1);

    let maxResultItem;
    //console.log(maxResultItem);
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
    console.log('maxResultItem ', maxResultItem);

    const categoryDetail = (maxResultItem) ? await axios.get(`https://api.mercadolibre.com/categories/${maxResultItem.id}`) : await axios.get(`https://api.mercadolibre.com/categories/${categoriesList[0].id}`);
    console.log(categoryDetail.data);

    return getTextCategories(categoryDetail.data);
}

function getTextCategories(categories) {
    console.log("CATEGORIES, ", categories);
    let categoryList = [];
    categories.path_from_root.forEach((item) => {
        categoryList.push(item.name);
    });
    return categoryList;
}



function isAvailableFilters(responseMeLi) {
    //console.log(responseMeLi.filters.length === 0);
    return responseMeLi.filters.length === 0 ? true : false
}

export { getProducts, getProductDetail };