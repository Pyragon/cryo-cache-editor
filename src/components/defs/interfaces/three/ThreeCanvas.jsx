import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import RSMesh from '../../../../utils/models/RSMesh';

async function setupModels(scene, models, meshes) {

    if(!scene) return;

    scene.clear();

    for(let helper of models) {

        let component = helper.component;

        const geometry = new THREE.BoxGeometry(component.width, component.height);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.x = helper.getX() - 355;
        cube.position.y = -helper.getY() + 165;
        meshes.push(cube);
        scene.add(cube);

        let file = await api.file.getRaw(`/models/${component.modelId}.dat`);
        
        let mesh = new RSMesh(file);

        let threeMesh = mesh.toThreeMesh(helper.component.height);

        threeMesh.position.x = helper.getX() - 355;
        // threeMesh.position.y = -helper.getY() + 165;
        threeMesh.scale.set(0.5, 0.5, 0.5);
        meshes.push(threeMesh);

        scene.add(threeMesh);
    }

}

export default React.forwardRef(({ style, width, height, components }, ref) => {

    let sceneRef = useRef();
    let cameraRef = useRef();
    let rendererRef = useRef();
    let meshRefs = useRef([]);
    let controlsRef = useRef();

    let requestRef = useRef();

    let animate = () => {
        requestRef.current = requestAnimationFrame(animate);

        let renderer = rendererRef.current;
        let scene = sceneRef.current;
        let camera = cameraRef.current;
        let meshes = meshRefs.current;
        let controls = controlsRef.current;

        if(renderer === null || scene === null || camera === null || meshes === null || controls === null) return;

        // for(let mesh of meshes)
        //     mesh.rotation.y += 0.01;
        controls.update();
        renderer.render(scene, camera);
    };

    useEffect(() => {
        let models = components.filter(helper => helper.component.type === 'MODEL');
        setupModels(sceneRef.current, models, meshRefs.current);
    }, [ components ]);

    useEffect(() => {

        let canvas = ref.current;

        let dpr = window.devicePixelRatio || 1;
        let rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        let scene = new THREE.Scene();
        // let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        let renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(dpr);

        camera.position.z = 270;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        //add large point light
        let light = new THREE.PointLight(0xffffff, 100, 0);
        light.position.set(50, 50, 50);
        scene.add(light);

        //add orbit controls
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        controlsRef.current = controls;

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
