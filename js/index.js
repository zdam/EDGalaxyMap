            // Handler for .ready() called.            
            $(function () {

                $("#btnClearRoute").click(function () {
                    clearRoute();
                });

                $("#btnShortestRoute").click(function () {
                    var maxDist = $('#maxJumpDistance').val();
                    megaShortestRoute(maxDist);
                });

                $("#btnDistanceDump").click(function () {
                    var distances = distanceTextDump();
                    $("#txtDistances").show();
                    $("#txtDistances").val(distances);
                    $("#btnDistanceDump").hide();
                });

                $("#ddlSystemsHidden").change(function (e) {
                    var systemName = e.val;
                    applySelectionToSystem(selectionInfo, systemName, routeSelectionMaterial);
                });

                $('.tabButton').click(function () {
                    handleTabClick($(this).attr('id'));
                });

                $('#chkShowOnlyRouteSystems').click(function () {
                    showOnlyRouteSystems($(this).is(':checked'));
                });

                $('#btnGlobalHeatmap').click(function () {
                	toggleGlobalHeatmapDisplay();
                });

                $('#btnRares').click(function () {
                	toggleRaresDisplay();
                });

                $('#btnDisplayFileRoute').click(function () {
                    displayFileRoute();
                });

                $('#btnSaveFileRoute').click(function () {
                    saveFileRoute();
                });

                document.getElementById('logFile').addEventListener('change', handleLogFileSelect, false);

                handleTabClick('tabButtonPlan');

                init();
                animate();

            });

            // Todo list
            // Done. Enable selection of a system
            // Done. Enable selection of 2 systems, then display distance between them
            // Done. Add dropdowns to allow selection of systems

            // Switch to use EDStarCoordinator API to return list of systems within a sphere of current system
            // Only display those items within sphere
            // DONE POINTCLOUD:Or try generate a point cloud for a larger (all?) amount of items, and then switch to generating spheres + names within some radius
            // DONE: WILL def need to use a point cloud
            // Need to be able to make camera focus on a selected item
            // The selected item being your current system, which it obtains from the NetLog (just use another program to get that info??)

            var windowOffset = 300; // this must match the css width values above in #left and #right

            var resolvedSystems = [];
            var xyzData = [];
            var lines = [];
			var container, stats;
			var camera, controls, scene, renderer;			
			var projector, mouse = { x: 0, y: 0 };


			var selectionInfo = {
                currentIntersectingObject: {},
                routeSelections: [],
                currentRoute: []
			};

			var scale = 10;
			var unselectedColor = 0xffffff;
			var hoverColor = 0xffff00;
			var routeSelectionColor = 0xff69b4;
			var yellowColor = 0xffff00;
			var greenColor = 0x008000;
			var redColor = 0xff0000;
			var pinkColor = 0xff69b4;
			var unselectedMaterial = new THREE.MeshLambertMaterial({ color: unselectedColor, shading: THREE.FlatShading });
			var heatmapMaterial = new THREE.MeshLambertMaterial({ color: redColor, shading: THREE.SmoothShading });
			heatmapMaterial.opacity = 0.7;
			heatmapMaterial.transparent = true;
			var hoverMaterial = new THREE.MeshLambertMaterial({ color: hoverColor, shading: THREE.FlatShading });
			var routeSelectionMaterial = new THREE.MeshLambertMaterial({ color: routeSelectionColor, shading: THREE.FlatShading });
			var plainSphereGeometry = new THREE.SphereGeometry(3,4,4);
			var heatmapSphereGeometryMap = {};
			var heatmapSphereMaterialMap = {};

			var keyboard = new KeyboardState();
			var ctrlPressed = false;
			var shiftPressed = false;

			var globalHeatmapVisible = false;
			var raresVisible = false;

            var currentFileSystems = [];

			function displayFileRoute() {
			    _.each(currentFileSystems, function (o) {
			        ensureProximalObjectsCreated(o, 30);
			    });

			    drawLinesForShortestPath(currentFileSystems);

			}

            function saveFileRoute() {

            }

            function handleLogFileSelect(evt) {
                var files = evt.target.files;
                
                var f = files[0];
                
                var reader = new FileReader();
                 
                // Closure to capture the file information.
                reader.onload = (function(e) {
                    var allText = reader.result;

                    var systems = [];
                    var lines = allText.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        if (line.indexOf('} System') == 9) {
                            var p1 = line.indexOf('(');
                            var p2 = line.indexOf(')');
                            var systemName = line.substring(p1 + 1, p2);
                            if (systems.length == 0 || systems[systems.length - 1] != systemName) {
                                systems.push(systemName);
                            }
                        }

                    }
                    currentFileSystems = systems;
                    $("#txtFileRoutes").val(systems.join('\n'));

                    // todo extract the systems out and store them in local storage
                    // if no systems found let the user know they need to turn on verbose logging
                });
                
                // Read in the image file as a data URL.
                reader.readAsText(f);
            }

			function handleTabClick(tabId) {
			    var tabPanels = $('.tabPanel');

			    var panelId = tabId.replace('tabButton', 'tabPanel');
			    tabPanels.hide();
			    $('#' + panelId).show();
			}

			function init() {

				xyzData = readXyzData();

				scene = new THREE.Scene();
                				
				initCamera(scene);
				initScene(scene);
				
				addSysInfoPointCloudToScene(scene, xyzData);
				initControls(camera);
				initRenderer();
				initHandlers();
				
				$('#ddlSystemsHidden').select2({
                    width: 300,
				    placeholder: 'Select a System',
				    minimumInputLength: 2,
				    query: function (query) {
				        var sorted = _.sortBy(xyzData, function (o) { return o.system; });
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
			}

			function animate() {
			    requestAnimationFrame(animate);
			    update();
			    render();
			    controls.update();
			}

			function initCamera(scene) {
			    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
			    scene.add(camera);

			    camera.position.z = 600;
			    camera.position.y = 700;
			    camera.position.x = -100;

			    camera.lookAt(scene.position);    
			}

			//function addSysInfoToDropDown(sysInfo, ddl) {
			//    var sorted = _.sortBy(sysInfo, function (o) { return o.system; });

			//    $.each(sorted, function (index, value) {
			//        $(ddl).append($('<option/>', { value: value.system, text: value.system }));
			//    });
			//}

			function generatePointCloudGeometry( color, sysInfo ){

				var geometry = new THREE.BufferGeometry();
				var numPoints = sysInfo.length;

				var positions = new Float32Array( numPoints*3 );
				var colors = new Float32Array( numPoints*3 );

				for( var i = 0; i < sysInfo.length; i++ ) {

					var u = 1;
					var v = 1;
					var x = (sysInfo[i].x) * scale;
					var y = (sysInfo[i].y) * scale;
					var z = (sysInfo[i].z) * scale;

					positions[ i ] = x;
					positions[ i + 1 ] = y;
					positions[ i + 2 ] = z;
					
					colors[ i ] = color.r;
					colors[ i + 1 ] = color.r;
					colors[ i + 2 ] = color.r;					

				}

				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
				geometry.computeBoundingBox();

				return geometry;
			}

			function addSysInfoPointCloudToScene(scene, sysInfo) {
				var geometry = generatePointCloudGeometry(new THREE.Color( 1,0,0 ), sysInfo);
				var material = new THREE.PointCloudMaterial( { size: 0.05, vertexColors: THREE.VertexColors } );
				var pointcloud = new THREE.PointCloud( geometry, material );

				pointcloud.scale.set(1,1,1);
				pointcloud.position.set(0,0,0);
				scene.add(pointcloud); 		

			}

			function addSysInfoToScene(scene, sysInfo) {			    

			    var maxItems = sysInfo.length;
			    //var maxItems = 100; // limiting the number of fully rendered items

			    for (var i = 0; i < maxItems; i++) {

			    	addSingleSystemToScene(scene, sysInfo[i]);			        
			    }
			}

			function toggleRaresDisplay() {
					raresVisible = !raresVisible;
			        $.each(rares, function (index, value) {
			        	if (raresVisible) {
			        		ensureProximalObjectsCreated(value, 1);
			        	}
			        	renderRaresInfo(value, raresVisible);
			        });
			        //updateHeatmapTable(fakeHeatmapData, globalHeatmapVisible);
			        
			}

			function renderRaresInfo(info, makeVisible) {			

				var raresGeometry = new THREE.SphereGeometry(30,8,8);
				var raresMaterial = new THREE.MeshLambertMaterial({ color: pinkColor, shading: THREE.SmoothShading });
				raresMaterial.opacity = 0.5;
				raresMaterial.transparent = true;
				
				var foundInData = _.find(xyzData, function(o) { return o.system == info});
				if (foundInData) {
		            var foundInScene = findSystemInScene(info.name, 'raresSphere');
		            if (foundInScene != null) {
		                foundInScene.visible = makeVisible;
		            } else {
		                addSphere(scene, foundInData, 'raresSphere', raresGeometry, raresMaterial);
		            }
				}
			}

			function toggleGlobalHeatmapDisplay() {
					globalHeatmapVisible = !globalHeatmapVisible;
			        $.each(fakeHeatmapData, function (index, value) {
			        	if (globalHeatmapVisible) {
			        		ensureProximalObjectsCreated(value.name, 1);
			        	}
			        	renderHeatmapInfo(value, globalHeatmapVisible);
			        });
			        updateHeatmapTable(fakeHeatmapData, globalHeatmapVisible);
			        
			}

			function renderHeatmapInfo(info, makeVisible) {			

				var heatmapGeometry = getHeatmapSphereGeometry(info.marker.radius * getRadiusModifier(info.marker.radius, info.marker.visits));
				var heatmapMaterial = getHeatmapSphereMaterial(info.marker.visits);
				var foundInData = _.find(xyzData, function(o) { return o.system == info.name});
				if (foundInData) {
		            var foundInScene = findSystemInScene(info.name, 'heatmapSphere');
		            if (foundInScene != null) {
		                foundInScene.visible = makeVisible;
		            } else {
		            	addSphere(scene, foundInData, 'heatmapSphere', heatmapGeometry, heatmapMaterial)
		            }
				}
			}

			function getHeatmapSphereGeometry(radius) {
				var existing = _.find(heatmapSphereGeometryMap, function(o){ return o.radius == radius});
				if (existing)
					return existing;
				var newby = new THREE.SphereGeometry(radius,8,8);
				heatmapSphereGeometryMap[radius] = newby;
				return newby;
			}

			function getHeatmapSphereMaterial(visits) {
				var visitsColor = getColorForHeatmapVisits(visits);
				var existing = _.find(heatmapSphereMaterialMap, function(o){ return o.visitsColor == visitsColor});
				if (existing)
					return existing;
				var cloned = heatmapMaterial.clone();
				cloned.setValues({color:visitsColor});
				heatmapSphereMaterialMap[visitsColor] = cloned;
				return cloned;
			}

			var maxRadius = 100;
			var minRadius = 40;
			var minVisits = 1;
			var yellowCutoff = 10;
			var redCutoff = 90;

			function getColorForHeatmapVisits(visits) {

				if (visits >= redCutoff)
					return redColor;
				if (visits >= yellowCutoff && visits < redCutoff)
					return yellowColor;
				
				return greenColor;
			}

			function getRadiusModifier(radius, visits) {
				if (visits >= redCutoff)
					return 2.5;
				if (visits >= yellowCutoff && visits < redCutoff)
					return 1.2;
				
				return 1.8;
			}

			function addSphere(scene, singleSystem, sphereType, sphereGeometry, sphereMaterial) {

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
			}

			function addText(scene, singleSystem, sisterMesh) {

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

				    var material = unselectedMaterial;

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
			}

			function addSingleSystemToScene(scene, singleSystem) {

				var mesh = addSphere(scene, singleSystem, 'sphere', plainSphereGeometry, unselectedMaterial);

				addText(scene, singleSystem, mesh);
			}

			function initScene(scene) {
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

			    // initialize object to perform world/screen calculations
			    projector = new THREE.Projector();

			}

			function initControls(camera) {
			    //initTrackballControls(camera);
			    initOrbitControls(camera);
			}

			function initTrackballControls(camera) {
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
			}

			function initOrbitControls(camera) {
			    controls = new THREE.OrbitControls(camera);
			    controls.damping = 0.2;
			    controls.addEventListener('change', render);
			}

			function initRenderer() {
			    container = document.getElementById('renderContainer');

			    renderer = new THREE.WebGLRenderer({ antialias: false });			    
			    renderer.setSize(container.offsetWidth, window.innerHeight);
			    
			    container.appendChild(renderer.domElement);

			    stats = new Stats();
			    stats.domElement.style.position = 'absolute';
			    stats.domElement.style.top = '0px';
			    stats.domElement.style.right = '0px';
			    stats.domElement.style.zIndex = 100;
			    container.appendChild(stats.domElement);
			}

			function initHandlers() {
			    // when the mouse moves, call the given function
			    document.addEventListener('mousemove', onDocumentMouseMove, false);
			    document.addEventListener('mousedown', onDocumentMouseDown, false);

			    window.addEventListener('resize', onWindowResize, false);
			}

			function onDocumentMouseDown(event) {		    
			    
			    handlePossibleSelection();
			}

			function onDocumentMouseMove(event) {
			    // the following line would stop any other event handler from firing
			    // (such as the mouse's TrackballControls)
			    // event.preventDefault();

			    // update the mouse variable
			    //mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			    //mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                		    

			    mouse.x = (((event.clientX - windowOffset) / container.offsetWidth)) * 2 - 1;
			    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			    
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				//controls.handleResize();
			}

			function update() {

			    keyboard.update();

			    ctrlPressed = keyboard.pressed("ctrl");
			    shiftPressed = keyboard.pressed("shift");


			    setColor(selectionInfo.currentIntersectingObject, unselectedMaterial);

			    $.each(selectionInfo.routeSelections, function (index, value) {
			        setColor(selectionInfo.routeSelections[index], routeSelectionMaterial);
			    });

			    $.each(scene.children, function (index, value) {
			        if (value.meshType == 'text') {
                        // This will force the text to always face the viewer, but I am not sure I like it
			            //value.lookAt(camera.position);
			        }
			    });

			    newIntersectingObject = firstIntersectingObject();

			    if (newIntersectingObject) {
			        // set the hover color for the object the person has moused over
			        setColor(newIntersectingObject, hoverMaterial);
			        selectionInfo.currentIntersectingObject = newIntersectingObject;

			    } else {
			        selectionInfo.currentIntersectingObject = null;
			    }
			}

			function firstIntersectingObject() {
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
			}

			function showOnlyRouteSystems(show) {
			    if (show) {
			        $.each(scene.children, function (index, value) {
			            if ((value.meshType && (value.meshType == 'sphere' || value.meshType == 'text'))) {
			                value.visible = false;
			            }
			        });

			        $.each(selectionInfo.currentRoute, function (index, value) {
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
			}

            function applySelectionToSystem(selectionInfo, systemName, selectionMaterial) {
            	ensureProximalObjectsCreated(systemName, 30);
                selectSceneObject(selectionInfo, systemName, selectionMaterial);
                displayDistance();                
            }

            function ensureProximalObjectsCreated(systemName, radius) {
				
            	var current = _.find(xyzData, function(o){ return o.system == systemName});	
            	
            	if (current) {
	            	var sphere = new THREE.Sphere(new THREE.Vector3(current.x, current.y, current.z), radius);

	            	$.each(xyzData, function(index, value) {
	            		if (sphere.containsPoint(new THREE.Vector3(value.x,value.y,value.z))) {
	            			var foundInScene = findSystemInScene(value.system, 'sphere');
	            			if (foundInScene == null) {
	            				resolvedSystems.push(value);
								addSingleSystemToScene(scene, value);
	            			} else {
	            			    foundInScene.visible = true;
	            			    var text = findSystemInScene(value.system, 'text');
	            			    text.visible = true;
	            			}
	            		}
	            	});            		
            	}
            }

            function displayRoute() {
                var totalRoute = '';
                $.each(selectionInfo.routeSelections, function (index, value) {
                    totalRoute += selectionInfo.routeSelections[index].sysInfo.system + ' -> ';
                });

                var trimmed = totalRoute.substring(0, totalRoute.length - 4);
                $('#labelRoute').text(trimmed);
            }

            function displayDistance() {
                
                var totalDistance = 0;
                $.each(selectionInfo.routeSelections, function (index, value) {
                    if (selectionInfo.routeSelections.length > 1 && index < selectionInfo.routeSelections.length-1) {
                        var d = calculateDistance(selectionInfo.routeSelections[index].sysInfo, selectionInfo.routeSelections[index + 1].sysInfo);
                        totalDistance += +d;
                    }
                });

                $('#labelTotalDistance').text(totalDistance.toFixed(2));
            }

            function updateRouteTable(routeInfo) {
                if (routeInfo == null) {
                    $("#routeTable").empty();
                } else {
                    for (var i = 0; i < routeInfo.paths.length; i++) {
                        var dist = i == routeInfo.paths.length-1 ? 'Done!' : routeInfo.distances[i];
                        $('#routeTable').append('<li>' + routeInfo.paths[i] + '...  ' + dist + '</li>');
                    }
                }
            }

            function updateHeatmapTable(heatmapData, makeVisible) {
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

            function megaShortestRoute(maxJumpDistance) {

                for (var i = 0; i < selectionInfo.routeSelections.length - 1; i++) {
                    var start = selectionInfo.routeSelections[i];
                    var end = selectionInfo.routeSelections[i+1];

                    ensureSystemsInPathArePopulated(start, end);
                    findShortestRoute(maxJumpDistance, start, end);
                }
            }

            function ensureSystemsInPathArePopulated(start, end) {

                var endpointReached = false;

                var destVec = new THREE.Vector3(end.x, end.y, end.z);

                var currentPathCentre = start.sysInfo;                

                while (!endpointReached) {
                    var sphere = new THREE.Sphere(new THREE.Vector3(currentPathCentre.x, currentPathCentre.y, currentPathCentre.z), 40);
                    var currentSystemsInScene = getSystemsInScene();
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
            }

            function findShortestRoute(maxJumpDistance, start, end) {

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
		            updateRouteTable(routeInfo);
	            } else {
    	            $('#labelInfo').text('Cannot make this trip');
    	            $('#labelTotalDistance').text("");
	            }

            }

            function calcShortestRoute(maxJumpDistance, start, end) {

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
                        drawLinesForShortestPath(shortestPath);
                        selectionInfo.currentRoute = shortestPath;
                        return { paths: shortestPath, distances: distances };
                    } else {
                    	return null;
                    }
                }
            }

            function drawLinesForShortestPath(shortestPath) {
                // experimental line drawing
                var material = new THREE.LineBasicMaterial({
                    color: 0xff69b4
                });

                for (var i = 0; i < shortestPath.length - 1; i++) {
                    var geometry = new THREE.Geometry();                    

                    for (var j = 0; j < scene.children.length; j++) {
                        if (scene.children[j].meshType && scene.children[j].meshType == 'sphere' && scene.children[j].sysInfo.system == shortestPath[i]) {
                            geometry.vertices.push(scene.children[j].position);
                        }
                    }

                    for (var k = 0; k < scene.children.length; k++) {
                        if (scene.children[k].meshType && scene.children[k].meshType == 'sphere' && scene.children[k].sysInfo.system == shortestPath[i + 1]) {
                            geometry.vertices.push(scene.children[k].position);
                        }
                    }

                    var line = new THREE.Line(geometry, material);
                    line.meshType = 'line';
                    scene.add(line);
                }
            }

            function getDistancesForShortestRoute(distanceDump, shortestPath) {
                var distances = [];
                for (var i = 0; i < shortestPath.length-1; i++) {
                    for (var j = 0; j < distanceDump.length; j++) {
                        if (distanceDump[j].systemFrom == shortestPath[i] && distanceDump[j].systemTo == shortestPath[i+1]) {
                            distances.push(distanceDump[j].distance);
                            break;
                        }
                    }
                }
                return distances;
            }

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
            }

            function distanceDumper(systemsToProcess) {
                var dump = [];                

                for (var i = 0; i < systemsToProcess.length; i++) {
                    for (var j = 0; j < systemsToProcess.length; j++) {
                        var d = calculateDistance(systemsToProcess[i], systemsToProcess[j]);
                        dump.push({ "systemFrom": systemsToProcess[i].system, "systemTo": systemsToProcess[j].system, "distance": d.toFixed(2) });
                    }
                }
                return dump;
            }

            function distanceTextDump() {
                var distanceDump = distanceDumper(resolvedSystems);
                var dump = '';

                for (var i = 0; i < distanceDump.length; i++) {
                    dump += distanceDump[i].systemFrom + ',' + distanceDump[i].systemTo + ',' + distanceDump[i].distance + '\n';
                }
                return dump;
            }

            function getSystemsInScene() {
                var toReturn = [];
                $.each(scene.children, function (index, value) {
                    if (value.meshType == 'sphere') {
                        toReturn.push(value);                        
                    }
                });
                return toReturn;
            }

            function findSystemInScene(systemName, meshType) {
            	var toReturn = null;
				$.each(scene.children, function (index, value) {
                    if (value.meshType == meshType && value.sysInfo.system == systemName) {
                        toReturn = value;
                        return false;
                    }
                });
                return toReturn;            	
            }

            function selectSceneObject(selectionInfo, systemName, selectionMaterial) {
            	var found = findSystemInScene(systemName, 'sphere');
            	if (found != null) {
            		setSelectionObject(selectionInfo, found, selectionMaterial);
            	}                
            }

            function setSelectionObject(selectionInfo, object, material) {
                selectionInfo.routeSelections.push(object);
                setColor(selectionInfo.routeSelections[selectionInfo.routeSelections.length-1], material);
            }

            function clearRoute() {
                $.each(selectionInfo.routeSelections, function (index, value) {
                    unsetColor(selectionInfo.routeSelections[index]);   
                });
                $.each(scene.children, function (index, value) {
                    if (value.meshType == 'line') {
                        //scene.remove(value);                        
                        value.visible = false;
                    }
                });
                selectionInfo.routeSelections = [];
                selectionInfo.currentRoute = [];
                $('#labelInfo').text('');
                $('#labelTotalDistance').text('');
                updateRouteTable(null);
            }

            function handlePossibleSelection() {
                if (selectionInfo.currentIntersectingObject && selectionInfo.currentIntersectingObject.visible) {
                    var systemName = selectionInfo.currentIntersectingObject.sysInfo.system;

                    if (shiftPressed) {

                    } else {
                        applySelectionToSystem(selectionInfo, systemName, routeSelectionMaterial);
                        syncDropDown('#ddlSystemsHidden', systemName);
                    }
                }
            }

            function syncDropDown(dropDownName, systemName) {
                //$(dropDownName).val(systemName);
                //$(dropDownName).select2("data", [{id: systemName, text: systemName}]);
            }			

			function render() {

				renderer.render( scene, camera );
				stats.update();
			}

			function readXyzData() {

			    var sysInfo = [];

                // handle data already in galactic xyz co-ords			    
			    for (var i = 0; i < eddb.length; i++) {
			        var parts = eddb[i];
		            var newSysInfo = { "system": parts.name, "station": "", "x": +parts.x, "y": +parts.y, "z": +parts.z };
		            sysInfo.push(newSysInfo);
			    }

			    return sysInfo;
			}


			function calculateDistance(first, second) {
			    // d = sqrt((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2)
			    if (first && second) {
			        var d = Math.sqrt(((first.x - second.x) * (first.x - second.x)) + ((first.y - second.y) * (first.y - second.y)) + ((first.z - second.z) * (first.z - second.z)));
			        return d;
			    }
			    return 0;
			}

			function setColor(mesh, material) {
			    if (mesh && mesh.material) {			        
			        mesh.material = material;
			        if (mesh.sisterMesh)
			        	mesh.sisterMesh.material = mesh.material;
			    }
			}

			function unsetColor(mesh) {
			    if (mesh && mesh.material) {
			        mesh.material = unselectedMaterial;
			        if (mesh.sisterMesh)
			        	mesh.sisterMesh.material = mesh.material;
			    }
			}

			function makeTextSprite(message, parameters) {
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
			    var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false});//, alignment: spriteAlignment });
			    var sprite = new THREE.Sprite(spriteMaterial);
			    sprite.scale.set(100, 50, 1.0);
			    return sprite;
			}

			// function for drawing rounded rectangles
			function roundRect(ctx, x, y, w, h, r) {
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
			}