window.GalaxyMapGui = (function (sceneBuilder, renderer) {

    var windowOffset = 300;
    var raresVisible = false;
    var globalHeatmapVisible = false;
    var mouse = { x: 0, y: 0 };
    var keyboard = new KeyboardState();
    var scene, camera, controls, container;
    var currentIntersectingObject = {};
   
    var init = function () {       
        container = document.getElementById('renderContainer');

        scene = sceneBuilder.initScene()
        renderer.initRenderer(container);

        initCamera(scene);
        initControls(camera);
        attachHandlers();
        animate();
    };

    var animate = function () {
        requestAnimationFrame(animate);
        update();
        render();
        controls.update();
    };

    var update = function () {

        keyboard.update();
        renderer.renderUnselected(currentIntersectingObject);
        renderer.renderRouteSelected(sceneBuilder.routeSelections);

        newIntersectingObject = sceneBuilder.firstIntersectingObject(mouse, camera, scene);

        if (newIntersectingObject) {
            // set the hover color for the object the person has moused over
            renderer.renderHovered(newIntersectingObject)
            currentIntersectingObject = newIntersectingObject;
        } else {
            currentIntersectingObject = null;
        }
    };

    var render = function () {
        renderer.render(scene, camera);
    }

    var attachHandlers = function() {

        $('.tabs-menu a').click(function (event) {
            event.preventDefault();
            handleTabClick($(this));
        });

        $("#btnClearRoute").click(function () {
            sceneBuilder.clearRoute();
            updateRouteTable(null);
        });

        $("#btnShortestRoute").click(function () {
            var maxJumpDistance = $('#maxJumpDistance').val();
            var routeInfo = sceneBuilder.findShortestRoute(maxJumpDistance);
            renderer.drawLinesForShortestPath(routeInfo.paths);
            updateRouteTable(routeInfo);
            $('#chkShowOnlyRouteSystems').prop('checked', true).change();
        });

        $('#chkShowOnlyRouteSystems').change(function () {
            sceneBuilder.showOnlyRouteSystems($(this).is(':checked'));
        });

        $('#btnRares').click(function () {
            toggleRaresDisplay();
        });

        $('#btnGlobalHeatmap').click(function () {
            toggleGlobalHeatmapDisplay();
        });

        $('#ddlSystemsHidden').select2({
            width: 300,
            placeholder: 'Select a System',
            minimumInputLength: 2,
            query: function (query) {
                var sorted = _.sortBy(sceneBuilder.galaxyData(), function (o) { return o.system; });
                var data = { results: [] };
                var queryTerm = query.term.toLowerCase();
                for (var i = 0; i < sorted.length; i++) {
                    var current = sorted[i].system;
                    if (current.toLowerCase().indexOf(queryTerm) == 0) {
                        data.results.push({ id: current, text: current });
                    }
                }
                query.callback(data);
            }
        });

        $("#ddlSystemsHidden").change(function (e) {
            var systemName = e.val;
            sceneBuilder.applySelectionToSystem(systemName);
        });

        // when the mouse moves, call the given function
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        window.addEventListener('resize', onWindowResize, false);

        $('#firstTab').click();        
    };

    var initCamera = function(scene) {
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
        scene.add(camera);

        camera.position.z = 600;
        camera.position.y = 700;
        camera.position.x = -100;

        camera.lookAt(scene.position);
    };

    var initControls = function(camera) {
        //initTrackballControls(camera);
        initOrbitControls(camera);
    };

    var initTrackballControls = function(camera) {
        controls = new THREE.TrackballControls(camera);

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];

        controls.addEventListener('change', render);
    };

    var initOrbitControls = function(camera) {
        controls = new THREE.OrbitControls(camera);
        controls.damping = 0.2;
        controls.addEventListener('change', render);
    }

    var handleTabClick = function(clickedTab) {
	
        clickedTab.parent().addClass("currentTab");
        clickedTab.parent().siblings().removeClass("currentTab");
        var tab = clickedTab.attr("href");
        $(".tab-content").not(tab).css("display", "none");
        //$(tab).fadeIn();
        $(tab).show();
    };

    var handlePossibleSelection = function() {
        if (currentIntersectingObject && currentIntersectingObject.visible) {
            var systemName = currentIntersectingObject.sysInfo.system;
            sceneBuilder.applySelectionToSystem(systemName);            
        }
    };

    var onDocumentMouseDown = function (event) {
        handlePossibleSelection();
    }

    var onDocumentMouseMove = function (event) {
        // the following line would stop any other event handler from firing
        // (such as the mouse's TrackballControls)
        // event.preventDefault();

        // update the mouse variable
        mouse.x = (((event.clientX - windowOffset) / container.offsetWidth)) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    }

    var onWindowResize = function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        //controls.handleResize();
    }
    
    var updateHeatmapTable = function (heatmapData, makeVisible) {
        if (!makeVisible) {
            $("#heatmapTable").empty();
        } else {
            $('#heatmapTable').append('<li>' + 'System' + '...  ' + 'Visits' + '</li>');
            for (var i = 0; i < heatmapData.length; i++) {
                var systemName = heatmapData[i].name;
                var visits = heatmapData[i].marker.visits;
                $('#heatmapTable').append('<li>' + systemName + '...  ' + visits + '</li>');
            }
        }
    }

    var updateRouteTable = function (routeInfo) {
        if (routeInfo == null) {
            $("#routeTable").empty();
        } else {
            for (var i = 0; i < routeInfo.paths.length; i++) {
                var dist = i == routeInfo.paths.length - 1 ? 'Done!' : routeInfo.distances[i];
                $('#routeTable').append('<li>' + routeInfo.paths[i] + '...  ' + dist + '</li>');
            }
        }
    };

    var toggleRaresDisplay = function() {
        raresVisible = !raresVisible;
        $.each(rares, function (index, value) {
            if (raresVisible) {
                sceneBuilder.ensureProximalObjectsCreated(value, 1);
            }
            renderer.renderRaresInfo(value, raresVisible, sceneBuilder.galaxyData());
        });
    };

    var toggleGlobalHeatmapDisplay = function () {
        globalHeatmapVisible = !globalHeatmapVisible;
        $.each(fakeHeatmapData, function (index, value) {
            if (globalHeatmapVisible) {
                sceneBuilder.ensureProximalObjectsCreated(value.name, 1);
            }
            renderer.renderHeatmapInfo(value, globalHeatmapVisible, sceneBuilder.galaxyData());
        });
        updateHeatmapTable(fakeHeatmapData, globalHeatmapVisible);
    }

    return {
        init: init
    }
})(window.GalaxyMapSceneBuilder, window.GalaxyMapRenderer);