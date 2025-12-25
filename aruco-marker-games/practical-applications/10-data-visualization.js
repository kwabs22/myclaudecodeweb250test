/** Data Visualization - AR 3D data charts and graphs */
var DataVisualization = pc.createScript('dataVisualization');

DataVisualization.attributes.add('chartMarkerIDs', {
    type: 'number',
    array: true,
    default: [636, 637, 638],
    description: 'Chart type markers (bar, line, pie)'
});

DataVisualization.attributes.add('dataMarkerID', {
    type: 'number',
    default: 639,
    description: 'Data source marker'
});

DataVisualization.prototype.initialize = function() {
    this.charts = {};
    this.currentChart = null;
    this.data = [45, 67, 23, 89, 56];

    this.chartTypes = {
        636: 'bar',
        637: 'line',
        638: 'pie'
    };
};

DataVisualization.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.chartMarkerIDs.includes(markerId)) {
        this.showChart(markerId, pose);
    } else if (markerId === this.dataMarkerID) {
        this.updateData(pose);
    }
};

DataVisualization.prototype.showChart = function(markerId, pose) {
    const chartType = this.chartTypes[markerId];

    if (!this.charts[markerId]) {
        this.createChart(markerId, chartType);
    }

    this.charts[markerId].entity.setPosition(pose.position);
    this.currentChart = chartType;

    console.log('Displaying', chartType, 'chart');
};

DataVisualization.prototype.createChart = function(markerId, chartType) {
    const chart = new pc.Entity('Chart_' + chartType);
    this.entity.addChild(chart);

    if (chartType === 'bar') {
        this.createBarChart(chart);
    } else if (chartType === 'line') {
        this.createLineChart(chart);
    } else if (chartType === 'pie') {
        this.createPieChart(chart);
    }

    this.charts[markerId] = {
        entity: chart,
        type: chartType
    };
};

DataVisualization.prototype.createBarChart = function(parent) {
    this.data.forEach((value, index) => {
        const bar = new pc.Entity('Bar_' + index);
        parent.addChild(bar);

        bar.addComponent('model', { type: 'box' });
        const height = value / 100;
        bar.setLocalScale(0.03, height, 0.03);

        const x = (index - this.data.length / 2) * 0.04;
        bar.setLocalPosition(x, height / 2, 0);

        if (bar.model && bar.model.meshInstances[0]) {
            const color = new pc.Color(0.3, 0.6, 1);
            bar.model.meshInstances[0].material.diffuse = color;
            bar.model.meshInstances[0].material.update();
        }
    });
};

DataVisualization.prototype.createLineChart = function(parent) {
    this.data.forEach((value, index) => {
        const point = new pc.Entity('Point_' + index);
        parent.addChild(point);

        point.addComponent('model', { type: 'sphere' });
        point.setLocalScale(0.015, 0.015, 0.015);

        const x = (index - this.data.length / 2) * 0.04;
        const y = value / 100;
        point.setLocalPosition(x, y, 0);
    });
};

DataVisualization.prototype.createPieChart = function(parent) {
    const total = this.data.reduce((sum, val) => sum + val, 0);
    let currentAngle = 0;

    this.data.forEach((value, index) => {
        const slice = new pc.Entity('Slice_' + index);
        parent.addChild(slice);

        slice.addComponent('model', { type: 'cylinder' });
        slice.setLocalScale(0.08, 0.02, 0.08);

        const hue = (index / this.data.length) * 360;
        const color = this.hueToColor(hue);

        if (slice.model && slice.model.meshInstances[0]) {
            slice.model.meshInstances[0].material.diffuse = color;
            slice.model.meshInstances[0].material.update();
        }

        currentAngle += (value / total) * 360;
    });
};

DataVisualization.prototype.hueToColor = function(hue) {
    const h = hue / 360;
    const s = 0.7;
    const l = 0.6;

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = this.hue2rgb(p, q, h + 1/3);
    const g = this.hue2rgb(p, q, h);
    const b = this.hue2rgb(p, q, h - 1/3);

    return new pc.Color(r, g, b);
};

DataVisualization.prototype.hue2rgb = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
};

DataVisualization.prototype.updateData = function(pose) {
    // Update data based on marker interaction
    console.log('Data updated');
};

DataVisualization.prototype.setData = function(newData) {
    this.data = newData;
    console.log('New data set:', this.data);

    // Recreate current chart
    if (this.currentChart) {
        Object.values(this.charts).forEach(chart => {
            chart.entity.destroy();
        });
        this.charts = {};
    }
};
