import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

import RSMesh from '../../../../utils/models/RSMesh';

async function setupModels(scene, models) {

    if(!scene) return;

    scene.clear();

    for(let helper of models) {

        let component = helper.component;

        const geometry = new THREE.BoxGeometry(component.width, component.height);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.x = helper.getX() - 355;
        cube.position.y = -helper.getY() + 165;
        scene.add(cube);

        //let's do this...
        console.log({ type: component.modelType, id: component.modelId });

        let file = await api.file.getRaw(`/models/${component.modelId}.dat`);
        
        let mesh = new RSMesh(file);

        //grab model from server

        //decode into rsmesh
        //add mesh to scene
    }

}

export default React.forwardRef(({ style, width, height, components }, ref) => {

    let sceneRef = useRef();
    let cameraRef = useRef();
    let rendererRef = useRef();

    let requestRef = useRef();

    let animate = () => {
        requestRef.current = requestAnimationFrame(animate);

        let renderer = rendererRef.current;
        let scene = sceneRef.current;
        let camera = cameraRef.current;

        if(renderer === null || scene === null || camera === null) return;

        renderer.render(scene, camera);
    };

    useEffect(() => {
        let models = components.filter(helper => helper.component.type === 'MODEL');
        setupModels(sceneRef.current, models);
    }, [ components ]);

    useEffect(() => {

        let canvas = ref.current;

        let dpr = window.devicePixelRatio || 1;
        let rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        let scene = new THREE.Scene();
        let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);

        let renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(dpr);

        camera.position.z = 10;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(requestRef.current);
            rendererRef.current.clear();
        };

    }, []);

    return (
        <canvas ref={ref} style={style} />
    )
});
