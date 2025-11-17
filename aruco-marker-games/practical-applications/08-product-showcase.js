/** Product Showcase - AR product demonstrations */
var ProductShowcase = pc.createScript('productShowcase');

ProductShowcase.attributes.add('productMarkerIDs', {
    type: 'number',
    array: true,
    default: [629, 630, 631],
    description: 'Product markers'
});

ProductShowcase.prototype.initialize = function() {
    this.products = {};

    this.productInfo = {
        629: { name: 'Product A', price: 99.99, features: ['Feature 1', 'Feature 2'] },
        630: { name: 'Product B', price: 149.99, features: ['Feature 1', 'Feature 2', 'Feature 3'] },
        631: { name: 'Product C', price: 199.99, features: ['Premium Feature 1', 'Premium Feature 2'] }
    };
};

ProductShowcase.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.productMarkerIDs.includes(markerId)) {
        this.showProduct(markerId, pose);
    }
};

ProductShowcase.prototype.showProduct = function(markerId, pose) {
    if (!this.products[markerId]) {
        this.createProduct(markerId);
    }

    this.products[markerId].entity.setPosition(pose.position);
    this.displayProductInfo(markerId);
};

ProductShowcase.prototype.createProduct = function(markerId) {
    const product = new pc.Entity('Product_' + markerId);
    this.entity.addChild(product);

    product.addComponent('model', { type: 'box' });
    product.setLocalScale(0.08, 0.08, 0.08);

    this.products[markerId] = {
        entity: product
    };
};

ProductShowcase.prototype.displayProductInfo = function(markerId) {
    const info = this.productInfo[markerId];
    console.log('Product:', info.name);
    console.log('Price: $' + info.price);
    console.log('Features:', info.features.join(', '));
};
