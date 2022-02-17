import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import ComponentHelper from '../../../utils/component-helper';
import ComponentList from '../../../utils/component-list';

import * as THREE from 'three';
import ThreeCanvas from './three/ThreeCanvas';

function setup2DCanvas(canvas) {

    let dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    let context = canvas.getContext('2d');

    context.scale(dpr, dpr);

    context.clearRect(0, 0, canvas.width, canvas.height);
}

export default function Interface({ id }) {

    let canvas2D = useRef();
    let canvas3D = useRef();

    let [ components, setComponents ] = useState([]);

    useEffect(() => {

        ComponentList.components = {};

        setup2DCanvas(canvas2D.current);

        api.file.getAll(`/interfaces/${id}/components/`, 'components:'+id, async(_, data) => {
            let files = JSON.parse(data);
            
            let components = await Promise.all(files.map(async file => {
                let helper = new ComponentHelper(file);
                helper.setValues();
                if(file.spriteId !== -1)
                    await helper.loadSprite();
                return helper;
            }));

            buildCanvas(ComponentList.getOrdered(), canvas2D.current);
            setComponents(components);

        });

    }, [ id ]);

    let canvasStyle = {
        width: '782px',
        height: '400px',
        position: 'absolute',
        top: 0,
        left: 0,
    }

    return (
        <div className='interface-editor-container'>
            <div className='interface-editor-canvas-container'>
                <canvas ref={canvas2D} style={{...canvasStyle, zIndex: 0}}/>
                <ThreeCanvas ref={canvas3D} style={{...canvasStyle, zIndex: 1}} width={782} height={400} components={components}/>
            </div>
            <div>
            </div>
        </div>
    );
}

function buildCanvas(components, canvas) {
    for(let component of components)
        component.build(canvas);
}
