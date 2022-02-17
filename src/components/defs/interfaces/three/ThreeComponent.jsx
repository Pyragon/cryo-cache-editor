import React, { useEffect, useRef, useState } from 'react';

export default function ThreeComponent({ helper }) {

    let component = helper.component;

    let width = component.width;
    let height = component.height;
    let x = helper.getX();
    let y = helper.getY();

    let parent = helper.getParent();

    if (parent != null) {
        if (width > parent.component.width)
            width = parent.component.width;
        if (height > parent.component.height)
            height = parent.component.height;
        if (component.positionX < 0)
            component.positionX = 0;
        if (component.positionX + width > parent.component.width)
            component.positionX = parent.component.width - width;
        if (component.positionY < 0)
            component.positionY = 0;
        if (component.positionY + height > parent.component.height)
            component.positionY = parent.component.height - height;
    }

    //try and just return a plane element with width and height
    return (
        <mesh position={[0, 0, 0]}>
            <planeGeometry attach="geometry" args={[1, 1]} />
            <meshBasicMaterial attach="material" color='black' />
        </mesh>
    )

}
