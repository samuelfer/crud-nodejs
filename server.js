const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

let products = [];

fs.readFile('products.json', 'utf-8', (err, data) => {
    if (err) {
        console.log(err)
    } else {
        products = JSON.parse(data);
    }
});

app.post('/products', (request, response) => {
    const { name, price, quantity } = request.body;
    const productId = products.length + 1;

    const product = {
        id: productId.toString(),
        name,
        price,
        quantity
    }

    products.push(product);

    productFile();
    
    return response.json(products);
});

app.get('/products', (request, response) => {
    return response.json({
        data: products
    });
});

app.get('/products/:id', (request, response) => {
    const { id } = request.params;
    const product = products.find((product) => product.id === id);
    
    if (!product) {
        return response.json({
            message: 'Not found'
        })
    }
    return response.json(product);
});

app.put('/products/:id', (request, response) => {
    const { id } = request.params;
    const { name, price, quantity } = request.body;

    const productIndex = products.findIndex((product) => product.id === id);
    
    products[productIndex] = {
        ...products[productIndex],
        name,
        price,
        quantity
    }
    productFile();
    return response.json({ message: 'Product updated with success' });

});

app.delete('/products/:id', (request, response) => {
    const { id } = request.params;

    const productIndex = products.findIndex((product) => product.id === id);
    
    products.splice(productIndex, 1);

    productFile();

    return response.json({ message: 'Product removed with success' });
});

function productFile() {
    fs.writeFile('products.json', JSON.stringify(products), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Product inserted');
        }
    });
}

app.listen(8000, () => console.log('Server started in port 8000'));