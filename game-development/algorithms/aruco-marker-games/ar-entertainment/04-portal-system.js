/** Portal System - Markers act as portals between game worlds */
var PortalSystem = pc.createScript('portalSystem');
PortalSystem.attributes.add('portalMarkerIDs', { type: 'number', array: true, default: [10, 11, 12, 13] });
PortalSystem.prototype.initialize = function() {
    this.portals = {};
    this.player = null;
    this.activePortal = null;
};
PortalSystem.prototype.createPortal = function(markerId, pose) {
    if (!this.portals[markerId]) {
        const portal = new pc.Entity('Portal_' + markerId);
        this.entity.addChild(portal);
        portal.addComponent('model', { type: 'torus' });
        portal.setLocalScale(0.5, 0.5, 0.05);
        this.portals[markerId] = portal;
    }
    this.portals[markerId].setPosition(pose.position);
    this.portals[markerId].setRotation(pose.rotation);
};
PortalSystem.prototype.teleportPlayer = function(fromPortalId, toPortalId) {
    const targetPortal = this.portals[toPortalId];
    if (this.player && targetPortal) {
        this.player.setPosition(targetPortal.getPosition());
        console.log('Teleported from', fromPortalId, 'to', toPortalId);
    }
};
