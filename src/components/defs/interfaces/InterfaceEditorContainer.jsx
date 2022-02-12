import React, { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

export default function InterfaceEditorContainer({ id }) {
    let [ components, setComponents ] = useState([]);

    useEffect(() => {

        api.file.getMany(`/interfaces/${id}/components/`, 'interface-components', (_, data) => {
            console.log(data);
        });

    }, []);

    return (
        <Canvas />
    );
}
