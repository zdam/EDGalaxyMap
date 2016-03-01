window.GalaxyMapRenderer = (function (sceneBuilder, renderAssets) {

    var threeRenderer, stats;
    var heatmapSphereMaterialMap = {};

    var initRenderer = function (container) {

        threeRenderer = new THREE.WebGLRenderer({ antialias: false });
        threeRenderer.setSize(container.offsetWidth, window.innerHeight);

        container.appendChild(threeRenderer.domElement);

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.right = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild(stats.domElement);
    };

    var setSize = function (width, height) {
        threeRenderer.setSize(width, height);
    };

    var render = function (scene, camera) {
        threeRenderer.render(scene, camera);
        stats.update();
    };

    var renderUnselected = function(mesh) {
        sceneBuilder.setColor(mesh, renderAssets.materials.unselectedMaterial);
    };

    var renderRouteSelected = function(routeSelections) {
        $.each(routeSelections, function(index, value) {
            sceneBuilder.setColor(routeSelections[index], renderAssets.materials.routeSelectionMaterial);
        });
    };

    var renderHovered = function(mesh) {
        sceneBuilder.setColor(mesh, renderAssets.materials.hoverMaterial);
    };

    var renderRaresInfo = function (info, makeVisible, galaxyData) {

        var raresGeometry = new THREE.SphereGeometry(30, 8, 8);
        var raresMaterial = new THREE.MeshLambertMaterial({ color: renderAssets.materialColors.pinkColor, shading: THREE.SmoothShading });
        raresMaterial.opacity = 0.5;
        raresMaterial.transparent = true;

        var foundInData = _.find(galaxyData, function (o) { return o.system == info });
        if (foundInData) {
            var foundInScene = sceneBuilder.findSystemInScene(info.name, 'raresSphere');
            if (foundInScene != null) {
                foundInScene.visible = makeVisible;
            } else {
                sceneBuilder.addSphere(foundInData, 'raresSphere', raresGeometry, raresMaterial);
            }
        }
    };

    var renderHeatmapInfo = function (info, makeVisible, galaxyData) {
        var heatmapGeometry = sceneBuilder.getHeatmapSphereGeometry(info.marker.radius * getRadiusModifier(info.marker.radius, info.marker.visits));
        renderAssets.materials.heatmapMaterial = getHeatmapSphereMaterial(info.marker.visits);
        var foundInData = _.find(galaxyData, function (o) { return o.system == info.name });
        if (foundInData) {
            var foundInScene = sceneBuilder.findSystemInScene(info.name, 'heatmapSphere');
            if (foundInScene != null) {
                foundInScene.visible = makeVisible;
            } else {
                sceneBuilder.addSphere(foundInData, 'heatmapSphere', heatmapGeometry, renderAssets.materials.heatmapMaterial)
            }
        }
    }

    var getHeatmapSphereMaterial = function (visits) {
        var visitsColor = getColorForHeatmapVisits(visits);
        var existing = _.find(heatmapSphereMaterialMap, function (o) { return o.visitsColor == visitsColor });
        if (existing)
            return existing;
        var cloned = renderAssets.materials.heatmapMaterial.clone();
        cloned.setValues({ color: visitsColor });
        heatmapSphereMaterialMap[visitsColor] = cloned;
        return cloned;
    }
    
    var yellowCutoff = 10;
    var redCutoff = 90;

    var getColorForHeatmapVisits = function (visits) {

        if (visits >= redCutoff)
            return renderAssets.materialColors.redColor;
        if (visits >= yellowCutoff && visits < redCutoff)
            return renderAssets.materialColors.yellowColor;

        return renderAssets.materialColors.greenColor;
    }

    var getRadiusModifier = function (radius, visits) {
        if (visits >= redCutoff)
            return 2.5;
        if (visits >= yellowCutoff && visits < redCutoff)
            return 1.2;

        return 1.8;
    }

    var drawLinesForShortestPath = function(shortestPath) {
        // experimental line drawing
        var material = new THREE.LineBasicMaterial({ color: 0xff69b4 });

        var sceneChildren = sceneBuilder.sceneChildren();

        for (var i = 0; i < shortestPath.length - 1; i++) {
            var geometry = new THREE.Geometry();

            for (var j = 0; j < sceneChildren.length; j++) {
                if (sceneChildren[j].meshType && sceneChildren[j].meshType == 'sphere' && sceneChildren[j].sysInfo.system == shortestPath[i]) {
                    geometry.vertices.push(sceneChildren[j].position);
                }
            }

            for (var k = 0; k < sceneChildren.length; k++) {
                if (sceneChildren[k].meshType && sceneChildren[k].meshType == 'sphere' && sceneChildren[k].sysInfo.system == shortestPath[i + 1]) {
                    geometry.vertices.push(sceneChildren[k].position);
                }
            }

            var line = new THREE.Line(geometry, material);
            line.meshType = 'line';
            sceneBuilder.addToScene(line);
        }
    };

    var makeTextSprite = function(message, parameters) {
        if (parameters === undefined) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

        //var spriteAlignment = THREE.SpriteAlignment.topLeft;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText(message);
        var textWidth = metrics.width;

        // background color
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        //var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false, alignment: spriteAlignment });
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false }); //, alignment: spriteAlignment });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100, 50, 1.0);
        return sprite;
    };

    // function for drawing rounded rectangles
    var roundRect = function(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    return {
        initRenderer: initRenderer,
        drawLinesForShortestPath: drawLinesForShortestPath,
        render: render,
        renderUnselected: renderUnselected,
        renderRouteSelected: renderRouteSelected,
        renderHovered: renderHovered,
        renderHeatmapInfo: renderHeatmapInfo,
        renderRaresInfo: renderRaresInfo,
        setSize: setSize
    }

})(window.GalaxyMapSceneBuilder, window.GalaxyMapRenderAssets);