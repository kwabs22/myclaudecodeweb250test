/** Presentation Tool - AR presentations and slides */
var PresentationTool = pc.createScript('presentationTool');

PresentationTool.attributes.add('slideMarkerIDs', {
    type: 'number',
    array: true,
    default: [620, 621, 622, 623, 624],
    description: 'Slide markers'
});

PresentationTool.prototype.initialize = function() {
    this.slides = {};
    this.currentSlide = 0;
    this.slideContents = [
        { title: 'Introduction', content: 'Welcome to AR Presentations' },
        { title: 'Features', content: 'Interactive 3D content in AR' },
        { title: 'Benefits', content: 'Engaging and immersive' },
        { title: 'Demo', content: 'Live demonstration' },
        { title: 'Conclusion', content: 'Thank you!' }
    ];
};

PresentationTool.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.slideMarkerIDs.includes(markerId)) {
        this.showSlide(markerId, pose);
    }
};

PresentationTool.prototype.showSlide = function(markerId, pose) {
    const slideIndex = this.slideMarkerIDs.indexOf(markerId);

    if (!this.slides[markerId]) {
        this.createSlide(markerId, slideIndex);
    }

    this.slides[markerId].entity.setPosition(pose.position);
    this.currentSlide = slideIndex;

    console.log('Slide', slideIndex + 1 + ':', this.slideContents[slideIndex].title);
};

PresentationTool.prototype.createSlide = function(markerId, index) {
    const slide = new pc.Entity('Slide_' + index);
    this.entity.addChild(slide);

    slide.addComponent('model', { type: 'box' });
    slide.setLocalScale(0.16, 0.12, 0.01);

    if (slide.model && slide.model.meshInstances[0]) {
        slide.model.meshInstances[0].material.diffuse = new pc.Color(1, 1, 1);
        slide.model.meshInstances[0].material.update();
    }

    this.slides[markerId] = {
        entity: slide,
        index: index
    };
};

PresentationTool.prototype.nextSlide = function() {
    this.currentSlide = (this.currentSlide + 1) % this.slideContents.length;
    console.log('Next slide:', this.slideContents[this.currentSlide].title);
};
