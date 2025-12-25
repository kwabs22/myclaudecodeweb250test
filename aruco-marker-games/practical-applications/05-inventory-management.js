/** Inventory Management - AR warehouse and stock tracking */
var InventoryManagement = pc.createScript('inventoryManagement');

InventoryManagement.attributes.add('itemMarkerIDs', {
    type: 'number',
    array: true,
    default: [615, 616, 617, 618, 619],
    description: 'Item markers'
});

InventoryManagement.prototype.initialize = function() {
    this.items = {};
    this.inventory = {};
    this.totalValue = 0;
};

InventoryManagement.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.itemMarkerIDs.includes(markerId)) {
        this.scanItem(markerId, pose);
    }
};

InventoryManagement.prototype.scanItem = function(markerId, pose) {
    if (!this.inventory[markerId]) {
        this.inventory[markerId] = {
            id: markerId,
            name: 'Item_' + markerId,
            quantity: 1,
            position: pose.position.clone(),
            lastSeen: Date.now()
        };
        console.log('New item scanned:', markerId);
    } else {
        this.inventory[markerId].quantity++;
        this.inventory[markerId].lastSeen = Date.now();
        console.log('Item updated:', markerId, '- Qty:', this.inventory[markerId].quantity);
    }

    this.createItemVisual(markerId, pose);
};

InventoryManagement.prototype.createItemVisual = function(markerId, pose) {
    if (this.items[markerId]) return;

    const item = new pc.Entity('Item_' + markerId);
    this.entity.addChild(item);

    item.addComponent('model', { type: 'box' });
    item.setPosition(pose.position);
    item.setLocalScale(0.05, 0.05, 0.05);

    this.items[markerId] = item;
};

InventoryManagement.prototype.getInventoryReport = function() {
    console.log('Inventory Report:');
    console.log('Total Items:', Object.keys(this.inventory).length);

    Object.values(this.inventory).forEach(item => {
        console.log('-', item.name, '- Qty:', item.quantity);
    });
};
