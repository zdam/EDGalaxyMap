window.GalaxyMapSceneBuilder = (function (renderAssets) {

    var scale = 10;
    var plainSphereGeometry = new THREE.SphereGeometry(3, 4, 4);
    var scene;
    var galaxyData = [];
    var routeSelections = [];
    var currentRoute = [];
    var resolvedSystems = [];

    var projector = new THREE.Projector();
    var heatmapSphereGeometryMap = {};

    var galaxyData = function() {
        return galaxyData;
    };

    var sceneChildren = function() {
        return scene.children;
    };

    var addToScene = function(itemToAdd) {
        scene.add(itemToAdd)
    };

    var getHeatmapSphereGeometry = function (radius) {
        var existing = _.find(heatmapSphereGeometryMap, function (o) { return o.radius == radius });
        if (existing)
            return existing;
        var newby = new THREE.SphereGeometry(radius, 8, 8);
        heatmapSphereGeometryMap[radius] = newby;
        return newby;
    };

    var firstIntersectingObject = function (mouse, camera, scene) {
        // find intersections
        // create a Ray with origin at the mouse position and direction into the scene (camera direction)
        var vector = new THREE.Vector3(mouse.x, mouse.y, 1);

        projector.unprojectVector(vector, camera);
        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects(scene.children);

        // if there is one (or more) intersections
        if (intersects.length > 0) {
            // if the closest object intersected has is a system sphere or system text we return it
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].object.meshType == 'sphere' || intersects[i].object.meshType == 'text') {
                    return intersects[i].object;
                }
            }
        }
        return null;
    };

    var findShortestRouteBetweenTwoPoints = function(maxJumpDistance, start, end) {

        maxJumpDistance = +maxJumpDistance; // force to int
        var currentDistanceCheck = maxJumpDistance;
        var numberOfAttempts = 10;
        var found = false;

        var shortestRoute = null;
        for (var i = 0; i < numberOfAttempts; i++) {
            routeInfo = calcShortestRoute(currentDistanceCheck, start, end);
            if (routeInfo != null) {
                found = true;
                break;
            }
            currentDistanceCheck = maxJumpDistance + i;
        }

        if (found) {
            if (currentDistanceCheck != maxJumpDistance) {
                $('#labelInfo').text('Could not make trip with ' + maxJumpDistance + 'LY jump, but found a route with ' + currentDistanceCheck + 'LY jumps');
            } else {
                $('#labelInfo').text('Route found.');
            }
        } else {
            $('#labelInfo').text('Cannot make this trip');
            $('#labelTotalDistance').text("");
        }

        return routeInfo
    };

    var calcShortestRoute = function (maxJumpDistance, start, end) {

        if (start && end) {

            var distanceDump = distanceDumper(resolvedSystems);
            if (!maxJumpDistance) {
                maxJumpDistance = 7; // Max distance your ship can jump
            }

            var map = buildMap(distanceDump, +maxJumpDistance);

            var graph = new Graph(map);

            var shortestPath = graph.findShortestPath(start.sysInfo.system, end.sysInfo.system);

            if (shortestPath) {
                var distances = getDistancesForShortestRoute(distanceDump, shortestPath);                
                return { paths: shortestPath, distances: distances };
            } else {
                return null;
            }
        }
    };

    function getDistancesForShortestRoute(distanceDump, shortestPath) {
        var distances = [];
        for (var i = 0; i < shortestPath.length - 1; i++) {
            for (var j = 0; j < distanceDump.length; j++) {
                if (distanceDump[j].systemFrom == shortestPath[i] && distanceDump[j].systemTo == shortestPath[i + 1]) {
                    distances.push(distanceDump[j].distance);
                    break;
                }
            }
        }
        return distances;
    };

    function buildMap(distanceDump, maxJumpDistance) {
        var map = {};
        for (var i = 0; i < distanceDump.length; i++) {
            var dd = distanceDump[i];
            var from = dd.systemFrom;
            var to = dd.systemTo;
            var d = +dd.distance;

            if (d <= maxJumpDistance) {
                var obj = {};
                obj[to] = d
                var res = $.extend(true, map[from], obj);
                map[from] = res;
            }
        }
        return map;
    };

    var distanceDumper = function (systemsToProcess) {
        var dump = [];

        for (var i = 0; i < systemsToProcess.length; i++) {
            for (var j = 0; j < systemsToProcess.length; j++) {
                var d = calculateDistance(systemsToProcess[i], systemsToProcess[j]);
                dump.push({ "systemFrom": systemsToProcess[i].system, "systemTo": systemsToProcess[j].system, "distance": d.toFixed(2) });
            }
        }
        return dump;
    };

    var getSystemsInScene = function(scene) {
        var toReturn = [];
        $.each(scene.children, function(index, value) {
            if (value.meshType == 'sphere') {
                toReturn.push(value);
            }
        });
        return toReturn;
    };

    var findSystemInScene = function(systemName, meshType) {
        var toReturn = null;
        $.each(scene.children, function(index, value) {
            if (value.meshType == meshType && value.sysInfo.system == systemName) {
                toReturn = value;
                return false;
            }
        });
        return toReturn;
    };

    var calculateDistance = function (first, second) {
        // d = sqrt((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2)
        if (first && second) {
            var d = Math.sqrt(((first.x - second.x) * (first.x - second.x)) + ((first.y - second.y) * (first.y - second.y)) + ((first.z - second.z) * (first.z - second.z)));
            return d;
        }
        return 0;
    };

    var findShortestRouteAcrossRoutes = function (maxJumpDistance, routeSelections) {
        var routeInfo = null;
        var combinedRoutes = { paths: [], distances: []};
        for (var i = 0; i < routeSelections.length - 1; i++) {
            var start = routeSelections[i];
            var end = routeSelections[i + 1];

            ensureSystemsInPathArePopulated(start, end);
            routeInfo = findShortestRouteBetweenTwoPoints(maxJumpDistance, start, end);
            combinedRoutes.paths = combinedRoutes.paths.concat(routeInfo.paths);
            combinedRoutes.distances = combinedRoutes.distances.concat(routeInfo.distances);
        }        
        return combinedRoutes;
    };

    var ensureSystemsInPathArePopulated = function (start, end) {

        var endpointReached = false;
        var destVec = new THREE.Vector3(end.x, end.y, end.z);
        var currentPathCentre = start.sysInfo;

        while (!endpointReached) {
            var sphere = new THREE.Sphere(new THREE.Vector3(currentPathCentre.x, currentPathCentre.y, currentPathCentre.z), 40);
            var currentSystemsInScene = getSystemsInScene(scene);
            var currentSmallestDistance = 999999999;

            $.each(currentSystemsInScene, function (index, value) {
                var vec = new THREE.Vector3(value.sysInfo.x, value.sysInfo.y, value.sysInfo.z);

                if (sphere.containsPoint(vec)) {
                    var dist = vec.distanceTo(destVec);
                    if (dist < currentSmallestDistance) {
                        currentSmallestDistance = dist;
                        currentPathCentre = value.sysInfo;
                    }
                }
                if (sphere.containsPoint(destVec)) {
                    endpointReached = true;
                }
            });

            // Now we resolve a new set of systems around the selected one
            ensureProximalObjectsCreated(currentPathCentre.system, 30);
        }
    };

    var initScene = function() {
        galaxyData = readGalaxyData();
        scene = new THREE.Scene();

        // world
        var gridXZ = new THREE.GridHelper(1000, 200);
        gridXZ.setColors(new THREE.Color(0xf5f5f5), new THREE.Color(0xf5f5f5));
        gridXZ.position.set(0, 0, 0);
        scene.add(gridXZ);

        // lights
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        scene.add(light);

        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(-1, -1, -1);
        scene.add(light);

        light = new THREE.AmbientLight(0x222222);
        scene.add(light);

        addGalaxyPointCloudToScene();

        ensureProximalObjectsCreated('Sol', 10);

        return scene;
    };

    var addGalaxyPointCloudToScene = function() {
        var geometry = generatePointCloudGeometry(new THREE.Color(1, 0, 0), galaxyData);
        var material = new THREE.PointCloudMaterial({ size: 0.05, vertexColors: THREE.VertexColors });
        var pointcloud = new THREE.PointCloud(geometry, material);

        pointcloud.scale.set(1, 1, 1);
        pointcloud.position.set(0, 0, 0);
        scene.add(pointcloud);
    };

    var generatePointCloudGeometry = function (color, sysInfo) {

        var geometry = new THREE.BufferGeometry();
        var numPoints = sysInfo.length;

        var positions = new Float32Array(numPoints * 3);
        var colors = new Float32Array(numPoints * 3);

        for (var i = 0; i < sysInfo.length; i++) {

            var u = 1;
            var v = 1;
            var x = (sysInfo[i].x) * scale;
            var y = (sysInfo[i].y) * scale;
            var z = (sysInfo[i].z) * scale;

            positions[i] = x;
            positions[i + 1] = y;
            positions[i + 2] = z;

            colors[i] = color.r;
            colors[i + 1] = color.r;
            colors[i + 2] = color.r;

        }

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeBoundingBox();

        return geometry;
    };

    var addSysInfoToScene = function(sysInfo) {

        var maxItems = sysInfo.length;
        //var maxItems = 100; // limiting the number of fully rendered items

        for (var i = 0; i < maxItems; i++) {
            addSingleSystemToScene(sysInfo[i]);
        }
    };

    var addSphere = function(singleSystem, sphereType, sphereGeometry, sphereMaterial) {

        var mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        mesh.position.x = (singleSystem.x) * scale;
        mesh.position.y = (singleSystem.y) * scale;
        mesh.position.z = (singleSystem.z) * scale;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        mesh.meshType = sphereType;

        mesh.sysInfo = singleSystem;

        scene.add(mesh);

        return mesh;
    };

    var applySelectionToSystem = function(systemName) {
        ensureProximalObjectsCreated(systemName, 30);
        selectSceneObject(systemName);
        displayDistance();
    };

    var readGalaxyData = function() {

        var sysInfo = [];

        // handle data already in galactic xyz co-ords			    
        for (var i = 0; i < eddb.length; i++) {
            var parts = eddb[i];
            var newSysInfo = { "system": parts.name, "station": "", "x": +parts.x, "y": +parts.y, "z": +parts.z };
            sysInfo.push(newSysInfo);
        }
        return sysInfo;
    };

    var addText = function(singleSystem, sisterMesh) {

        var useBillboards = false;

        if (useBillboards) {
            // Billboard sprites for names. 
            var spritey = makeTextSprite(singleSystem.system,
            {
                fontsize: 32,
                fontface: "helvetiker",
                borderColor: { r: 0, g: 0, b: 255, a: 1.0 }
            });
            spritey.position.set(singleSystem.x * scale, singleSystem.y * scale, singleSystem.z * scale);
            spritey.sysInfo = singleSystem;
            scene.add(spritey);

        } else {

            var material = renderAssets.materials.unselectedMaterial;

            // real 3d objects for names
            var textOptions = {
                size: 10,
                height: 1,
                curveSegments: 2,
                font: 'helvetiker'
            };
            var label = new THREE.TextGeometry(singleSystem.system, textOptions);
            var labelMesh = new THREE.Mesh(label, material);
            labelMesh.position.x = (singleSystem.x) * scale;
            labelMesh.position.y = (singleSystem.y - 2) * scale;
            labelMesh.position.z = (singleSystem.z) * scale;
            labelMesh.updateMatrix();
            //labelMesh.matrixAutoUpdate = false;
            labelMesh.sysInfo = singleSystem;
            labelMesh.meshType = 'text';

            sisterMesh.sisterMesh = labelMesh;
            labelMesh.sisterMesh = sisterMesh;

            scene.add(labelMesh);
        }
    };

    var addSingleSystemToScene = function(singleSystem) {

        var mesh = addSphere(singleSystem, 'sphere', plainSphereGeometry, renderAssets.materials.unselectedMaterial);

        addText(singleSystem, mesh);
    };

    var displayDistance = function() {

        var totalDistance = 0;
        $.each(routeSelections, function(index, value) {
            if (routeSelections.length > 1 && index < routeSelections.length - 1) {
                var d = calculateDistance(routeSelections[index].sysInfo, routeSelections[index + 1].sysInfo);
                totalDistance += +d;
            }
        });

        $('#labelTotalDistance').text(totalDistance.toFixed(2));
    };

    var selectSceneObject = function(systemName) {
        var found = findSystemInScene(systemName, 'sphere');
        if (found != null) {
            setSelectionObject(found);
        }
    };

    var setSelectionObject = function(object) {
        routeSelections.push(object);        
        setColor(routeSelections[routeSelections.length - 1], renderAssets.materials.routeSelectionMaterial);
    };

    var setColor = function (mesh, material) {
        if (mesh && mesh.material) {
            mesh.material = material;
            if (mesh.sisterMesh)
                mesh.sisterMesh.material = mesh.material;
        }
    };

    var unsetColor = function (mesh) {
        if (mesh && mesh.material) {
            mesh.material = renderAssets.materials.unselectedMaterial;
            if (mesh.sisterMesh)
                mesh.sisterMesh.material = mesh.material;
        }
    };

    var getRoute = function () {
        var totalRoute = '';
        $.each(routeSelections, function (index, value) {
            totalRoute += routeSelections[index].sysInfo.system + ' -> ';
        });

        var trimmedRoute = totalRoute.substring(0, totalRoute.length - 4);
        return trimmedRoute;
    };

    var clearRoute = function() {
        $.each(routeSelections, function(index, value) {
            unsetColor(routeSelections[index]);
        });
        $.each(scene.children, function(index, value) {
            if (value.meshType == 'line') {
                //scene.remove(value);                        
                value.visible = false;
            }
        });
        routeSelections = [];
        currentRoute = [];
        $('#labelInfo').text('');
        $('#labelTotalDistance').text('');        
    };

    var showOnlyRouteSystems = function(show) {
        if (show) {
            $.each(scene.children, function (index, value) {
                if ((value.meshType && (value.meshType == 'sphere' || value.meshType == 'text'))) {
                    value.visible = false;
                }
            });

            $.each(currentRoute, function (index, value) {
                var foundInScene = findSystemInScene(value, 'sphere');
                if (foundInScene != null) {
                    foundInScene.visible = true;
                }
                foundInScene = findSystemInScene(value, 'text');
                if (foundInScene != null) {
                    foundInScene.visible = true;
                }
            });
        } else {
            $.each(scene.children, function (index, value) {
                if ((value.meshType && (value.meshType == 'sphere' || value.meshType == 'text'))) {
                    value.visible = true;
                }
            });
        }
    };

    var findShortestRoute = function(maxJumpDistance) {
        var routeInfo = findShortestRouteAcrossRoutes(maxJumpDistance, routeSelections);
        currentRoute = routeInfo.paths;
        return routeInfo;
    };

    var ensureProximalObjectsCreated = function (systemName, radius) {

        var current = _.find(galaxyData, function (o) { return o.system == systemName });

        if (current) {
            var sphere = new THREE.Sphere(new THREE.Vector3(current.x, current.y, current.z), radius);

            $.each(galaxyData, function (index, value) {
                if (sphere.containsPoint(new THREE.Vector3(value.x, value.y, value.z))) {
                    var foundInScene = findSystemInScene(value.system, 'sphere');
                    if (foundInScene == null) {
                        resolvedSystems.push(value);
                        addSingleSystemToScene(value);
                    } else {
                        foundInScene.visible = true;
                        var text = findSystemInScene(value.system, 'text');
                        text.visible = true;
                    }
                }
            });
        }
    };

    return {
        galaxyData: galaxyData,
        initScene: initScene,
        sceneChildren: sceneChildren,        
        addToScene: addToScene,
        addSphere: addSphere,
        applySelectionToSystem: applySelectionToSystem,
        setColor: setColor,
        findShortestRoute: findShortestRoute,
        findSystemInScene: findSystemInScene,
        routeSelections: routeSelections,
        ensureProximalObjectsCreated: ensureProximalObjectsCreated,
        firstIntersectingObject: firstIntersectingObject,
        getHeatmapSphereGeometry: getHeatmapSphereGeometry,        
        showOnlyRouteSystems: showOnlyRouteSystems,
        clearRoute: clearRoute,
        getRoute: getRoute
    }

})(window.GalaxyMapRenderAssets);