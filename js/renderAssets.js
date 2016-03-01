window.GalaxyMapRenderAssets = (function() {
    var materialColors = {
        unselectedColor: 0xffffff,
        hoverColor: 0xffff00,
        routeSelectionColor: 0xff69b4,
        yellowColor: 0xffff00,
        greenColor: 0x008000,
        redColor: 0xff0000,
        pinkColor: 0xff69b4
    }

    var materials = {
        hoverMaterial: new THREE.MeshLambertMaterial({ color: materialColors.hoverColor, shading: THREE.FlatShading }),
        routeSelectionMaterial: new THREE.MeshLambertMaterial({ color: materialColors.routeSelectionColor, shading: THREE.FlatShading }),
        unselectedMaterial: new THREE.MeshLambertMaterial({ color: materialColors.unselectedColor, shading: THREE.FlatShading }),
        heatmapMaterial: new THREE.MeshLambertMaterial({ color: materialColors.redColor, shading: THREE.SmoothShading })
    }
    materials.heatmapMaterial.opacity = 0.7;
    materials.heatmapMaterial.transparent = true;

    return {
        materials: materials,
        materialColors: materialColors
    }
})();