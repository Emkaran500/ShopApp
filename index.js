const ROOT_PRODUCTS = document.createElement('div');
const ROOT_HEADER = document.createElement('div');
const ROOT_STORE_CARD = document.createElement('div');
const ROOT_LOADER = document.createElement('div');
const ROOT_ERROR = document.createElement('div');

ROOT_HEADER.classList.add('div-body');
ROOT_STORE_CARD.style.display = 'none';

class LocalStorageUtil
{
    constructor()
    {
        this.keyname = 'products';
    }

    getProducts()
    {
        const productsString = localStorage.getItem(this.keyname);
        if (productsString == null || productsString == '[]')
        {
            return new Array(0);
        }
        else if (productsString.length != 0)
        {
            return JSON.parse(productsString);
        }
    }

    putProducts(id)
    {
        let products = this.getProducts();
        let pushProduct = false;
        let changed = false;

        products.forEach(product => {
            if (product.id == id)
            {
                const position = products.map((product => product.id)).indexOf(id);
                console.log(position);
                products.splice(position, 1);

                const jsonProducts = JSON.stringify(products);

                localStorage.setItem('products', jsonProducts);
                changed = true;
            }
        });
        
        if (!changed)
        {
            products.push({id});
            products.sort((a, b) => 
            {
                if (a.id < b.id)
                {
                    return -1;
                }
                if (a.id > b.id)
                {
                    return 1;
                }
                return 0;
            });
            const jsonProducts = JSON.stringify(products);
            localStorage.setItem('products', jsonProducts);
            pushProduct = true;
        }
        return {pushProduct, products};
    }
}

class StoreCard
{
    handlerClear()
    {
        ROOT_STORE_CARD.textContent = '';
    }

    render()
    {
        this.handlerClear();
        const localStorageUtil = new LocalStorageUtil();
        const storedProducts = localStorageUtil.getProducts();
        const htmlCatalog = document.createElement('div');
        htmlCatalog.classList.add('products-stored');
        const sumCatalog = document.createElement('div');
        sumCatalog.classList.add('div-stored');
        const sum = document.createElement('span');
        sumCatalog.textContent = 'All products sum: ';
        sum.textContent = '0';
        
        CATALOG.forEach(product => {
            storedProducts.forEach(storedProduct => {
                if (product.id == storedProduct.id)
                {
                    const productBody = document.createElement('div');
                    productBody.classList.add('product-body');
                    const productHtml = document.createElement('div');
                    productHtml.classList.add('product-stored');
                    const fields = Object.keys(product);
                    const showedFields = [fields[0], fields[1], fields[3]];

                    showedFields.forEach(field => {
                        const fieldHtml = document.createElement('span');
                        fieldHtml.classList.add('span-stored');
                        fieldHtml.textContent = field + ': ';
                        const fieldValue = document.createElement('span');
                        fieldValue.classList.add('span-stored');
                        fieldValue.textContent = product[field];
                        fieldHtml.appendChild(fieldValue);
                        if (field == 'id')
                        {
                            fieldHtml.classList.add('product-id');
                            fieldValue.classList.add('stored-id');
                        }
                        productHtml.appendChild(fieldHtml);
                    });
                    const deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('button-delete');
                    deleteBtn.textContent = 'Delete product';
                    productHtml.appendChild(deleteBtn);
                    productBody.appendChild(productHtml);
                    htmlCatalog.appendChild(productBody);
                    sum.textContent = String(Number(sum.textContent) + Number(product.price));
                }
            });
        });
        ROOT_STORE_CARD.appendChild(htmlCatalog);
        sumCatalog.appendChild(sum);
        ROOT_STORE_CARD.appendChild(sumCatalog);
        document.body.appendChild(ROOT_STORE_CARD);
    }
}

class Header
{
    handlerOpenStoreCardPage()
    {
        const storeCardPage = new StoreCard();
        storeCardPage.render();
    }

    render(count)
    {
        const headerAuto = document.createElement('div');;
        headerAuto.classList.add('div-margin');
        const productsWrapper = document.createElement('div');
        productsWrapper.classList.add('div-top');
        const productsBtn = document.createElement('button');
        productsBtn.classList.add('button-top');
        productsBtn.textContent = 'Products';
        const numOfProducts = document.createElement('div');
        numOfProducts.classList.add('div-top');
        numOfProducts.textContent = count;
        const basketBtn = document.createElement('button');
        basketBtn.classList.add('button-top');
        basketBtn.textContent = 'Basket';
        numOfProducts.appendChild(basketBtn);
        productsWrapper.appendChild(productsBtn);
        headerAuto.appendChild(productsWrapper);
        headerAuto.appendChild(numOfProducts);
        ROOT_HEADER.textContent = '';
        ROOT_HEADER.appendChild(headerAuto);
        if (document.body.contains(ROOT_HEADER))
        {
            document.body.removeChild(ROOT_HEADER);            
        }
        document.body.prepend(ROOT_HEADER);
    }
}

class Products
{
    classNameActive;
    labelAdd;
    labelRemove;

    constructor()
    {
        this.classNameActive = 'product-square';
        this.labelAdd = 'Add to basket';
        this.labelRemove = 'Delete from basket';
    }

    handlerSetLocalStorage(element, id)
    {
        const localStorageUtil = new LocalStorageUtil();
        const obj = localStorageUtil.putProducts(id);
        const productBtn = element.querySelector('button');
        productBtn.textContent = (obj.pushProduct ? this.labelRemove : this.labelAdd);
        obj.pushProduct ? productBtn.classList.add('product-in-store') : productBtn.classList.remove('product-in-store');
        const headerPage = new Header();
        headerPage.render(obj.products.length);
        const basketPage = new StoreCard();
        basketPage.render();
    }

    render()
    {
        const localStorageUtil = new LocalStorageUtil();
        const storedProducts = localStorageUtil.getProducts();

        const htmlCatalog = document.createElement('div');
        htmlCatalog.classList.add('div-margin');
        htmlCatalog.classList.add('div-products');

        CATALOG.forEach(product => {
                const productHtml = document.createElement('div');
                productHtml.classList.add(this.classNameActive);
                const fields = Object.keys(product);
                const showedFields = [fields[0], fields[1], fields[2], fields[3], fields[5]];

                showedFields.forEach(showedField => {
                    const fieldHtml = document.createElement('div');
                    fieldHtml.classList.add('product-item');
                    const fieldValue = document.createElement('span');
                    switch (showedField) {
                        case 'id':
                            fieldValue.textContent = product[showedField];
                            fieldValue.classList.add('product-id');
                            break;
                        case 'price':
                            fieldValue.textContent = product[showedField] + '$';
                            fieldValue.classList.add('product-price');
                            break;
                            case 'rating':
                                fieldValue.textContent = product[showedField] + '*';
                                fieldValue.classList.add('product-rating');
                                break;
                            case 'title':
                                fieldValue.classList.add('product-title');
                        default:
                            fieldValue.textContent = product[showedField];
                            break;
                    }
                    fieldHtml.appendChild(fieldValue);
                    productHtml.appendChild(fieldHtml);
                });
                const addBtn = document.createElement('button');
                addBtn.classList.add('product-button');
                const positions = storedProducts.map((product => product.id));

                if (storedProducts.length != 0)
                {
                    for (let i = 0; i < positions.length; i++) 
                    {
                        if (product.id == positions[i])
                        {
                            addBtn.textContent = this.labelRemove;
                            addBtn.classList.add('product-in-store');
                            break;
                        }
                        else
                        {
                            addBtn.textContent = this.labelAdd;
                        }              
                    }
                }
                else
                {
                    addBtn.textContent = this.labelAdd;
                }
                productHtml.appendChild(addBtn);
                htmlCatalog.appendChild(productHtml);
        });

        ROOT_PRODUCTS.textContent = '';
        ROOT_PRODUCTS.appendChild(htmlCatalog);
        document.body.appendChild(ROOT_PRODUCTS);
    }
}

class Loader
{
    constructor()
    {
        this.loader = document.createElement('div');
    }

    render()
    {
        this.loader.classList.add('loader');
        ROOT_LOADER.appendChild(this.loader);
        document.body.appendChild(ROOT_LOADER);
    }

    remove()
    {
        ROOT_LOADER.removeChild(this.loader);
        document.body.removeChild(ROOT_LOADER);
    }
}

function render() 
{
    const localStorageUtil = new LocalStorageUtil();
    const productsStore = localStorageUtil.getProducts();
    
    const headerPage = new Header();
    headerPage.render(productsStore.length);
    const productsPage = new Products();
    productsPage.render();
    const basketPage = new StoreCard();
    basketPage.render();
    document.body.removeChild(ROOT_LOADER);
}

const loaderPage = new Loader();


let CATALOG = [];

fetch('https://dummyjson.com/products')
.then(res => res.json())
.then(data => data.products)
.then(products =>
    {
        loaderPage.render();
        CATALOG = products
        setTimeout(() => {
            render()
        }, 2000)
    })
    .catch(() => {
        // spinnerPage.handleClear()
        // errorPage.render()
    });

let freezeClick = false;
document.body.addEventListener('click', (e) =>
{
    const buttonName = e.target.textContent;
    if (e.target.tagName.toLowerCase() == 'button')
    {
        if (freezeClick)
        {
            return;
        }

        switch (buttonName) {
            case 'Basket':
                freezeClick = true;
                ROOT_PRODUCTS.style.display = 'none';
                ROOT_STORE_CARD.style.display = 'none';
                loaderPage.render();
                setTimeout(() => {
                    loaderPage.remove();
                    ROOT_PRODUCTS.style.display = 'none';
                    ROOT_STORE_CARD.style.display = 'block';
                    freezeClick = false;
                }, 2000)
                break;
            case 'Products':
                freezeClick = true;
                ROOT_PRODUCTS.style.display = 'none';
                ROOT_STORE_CARD.style.display = 'none';
                loaderPage.render();
                setTimeout(() => {
                    loaderPage.remove();
                    ROOT_STORE_CARD.style.display = 'none';
                    ROOT_PRODUCTS.style.display = 'block';
                    freezeClick = false;
                }, 2000)
                break;
            case 'Delete product':
                const localStorageUtil = new LocalStorageUtil();
                const node = e.target.parentNode.querySelector('.stored-id');
                localStorageUtil.putProducts(Number(node.textContent));
                render();
                break;
            default:
                const productsPage = new Products();
                productsPage.handlerSetLocalStorage(e.target.parentNode, Number(e.target.parentNode.querySelector('.product-id').textContent));
                break;
        }
    }
});

document.body.style.backgroundColor = 'cornflowerblue';