import React, { useState, useEffect } from 'react';

import LabelTextarea from '../../utils/LabelTextarea';
import LabelInput from '../../utils/LabelInput'

import '../../../styles/defs/EquipmentDefaults.css';
import Button from '../../utils/Button';


export default function EquipmentDefaults() {
    let [ data, setData ] = useState(null);
    let [ hiddenSlots, setHiddenSlots ] = useState([])
    let [ weaponSlot, setWeaponSlot ] = useState('');
    let [ offhandSlot, setOffhandSlot ] = useState('');
    let [ hiddenOffset, setHiddenOffset ] = useState([]);
    let [ hiddenWeapon, setHiddenWeapon ] = useState([]);

    function setSlot(set, value) {
        if(isNaN(value)) {
            console.error('Slot must be a number');
            return;
        }
        set(value);
    }

    function save() {
        try {
            hiddenSlots = hiddenSlots.map(slot => {
                if(isNaN(slot)) throw Error('Non-Number in hiddenSlots');
                return Number(slot);
            });
            hiddenOffset = hiddenOffset.map(slot => {
                if(isNaN(slot)) throw Error('Non-Number in hiddenOffset');
                return Number(slot);
            });
            hiddenWeapon = hiddenWeapon.map(slot => {
                if(isNaN(slot)) throw Error('Non-Number in hiddenWeapon');
                return Number(slot);
            });
            if(isNaN(weaponSlot)) throw Error('Weapon slot must be a number');
            if(isNaN(offhandSlot)) throw Error('Offhand slot must be a number');
            weaponSlot = Number(weaponSlot);
            offhandSlot = Number(offhandSlot);
            let data = {
                hidden: hiddenSlots,
                hiddenAnimationOffhandSlots: hiddenOffset,
                hiddenAnimationWeaponSlots: hiddenWeapon,
                weaponSlot,
                offhandSlot
            }
            setData(data);
            api.file.save('/defaults/equipment.json', JSON.stringify(data, null, 4));
            console.log('saved');
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        api.file.get('/defaults/equipment.json', 'equip-defaults', (_, data) => setData(JSON.parse(data)));
    }, []);

    useEffect(() => {
        if(!data) return;
        setHiddenSlots(data.hidden);
        setWeaponSlot(data.weaponSlot);
        setOffhandSlot(data.offhandSlot);
        setHiddenOffset(data.hiddenAnimationOffhandSlots);
        setHiddenWeapon(data.hiddenAnimationWeaponSlots);
    }, [ data ]);
    if(!data) return <></>;
    return (
        <div className='equipment-defaults-container'>
            <LabelTextarea
                title='Hidden Equipment Slots'
                className='long-input m-top-1'
                value={hiddenSlots.join(', ')}
                setState={(value) => setHiddenSlots(value.split(', ?'))}
            />
            <div className='weapon-slots m-top-1'>
                <div className='weapon-slot'>
                    <LabelInput
                        title='Weapon Slot'
                        centerTitle={true}
                        value={weaponSlot}
                        setState={(value) => setSlot(setWeaponSlot, value)}
                    />
                </div>
                <div className='offhand-slot'>
                    <LabelInput
                        title='Offhand Slot'
                        centerTitle={true}
                        value={offhandSlot}
                        setState={(value) => setSlot(setOffhandSlot, value)}
                    />
                </div>
            </div>
            <LabelTextarea
                title='Hidden Animation Weapon Slots'
                className='long-input m-top-1'
                value={hiddenWeapon.join(', ')}
                setState={(value) => setHiddenWeapon(value.split(', ?'))}
            />
            <LabelTextarea
                title='Hidden Animation Offset Slots'
                className='long-input m-top-1'
                value={hiddenOffset.join(', ')}
                setState={(value) => setHiddenOffset(value.split(', ?'))}
            />
            <Button
                title='Save'
                className='save-btn'
                onClick={save}
            />
        </div>
    );
}
