import { ColorSource, FederatedPointerEvent, Graphics as _Graphics } from 'pixi.js';
import { DiagButton, IDiagBtnImage, IDiagButtonProps, getDiagBtnTintColor } from './Button';
import { useEffect, useState } from 'react';

// import { IBasePixiProps } from "type";

export interface IDiagSwitchProps extends IDiagButtonProps {

    downTiltColors: ColorSource[];
    active?: boolean;
    groupId?: string;
    groupActiveId?: string;
}

export const DiagSwitch = (props: IDiagSwitchProps) => {

    if (props.downTiltColors.length !== props.images.length) {
        throw new Error(`Not equal color's length.`);
    }

    const [active, setActive] = useState(props.active ? props.active : false);

    const tintColors = new Map<IDiagBtnImage, ColorSource>();
    for (let i = 0; i < props.images.length; ++i) {

        tintColors.set(props.images[i], props.downTiltColors[i]);
    }

    const onSwitch = (e: FederatedPointerEvent) => {

        // e.preventDefault();
        if (props.onClick) {
            props.onClick(e, !active ? 'active' : 'inactive');
        }
        setActive(!active);
    };

    useEffect(() => {

        if (props.groupActiveId === '') {

            setActive(false);
            
        } else if (props.groupActiveId !== props.groupId) {
        // if ((props.groupActiveId !== '') && (props.groupActiveId !== props.groupId)) {

            setActive(false);
        }        

    }, [props.groupActiveId]);

    const tint = (i: IDiagBtnImage): ColorSource => {

        if (active) {
            const c = tintColors.get(i);
            if (!c) {
                throw new Error(`Not found tint color!`);
            }

            return c;
        }

        return getDiagBtnTintColor(i);
    }

    return (
        <DiagButton {...props} onClick={onSwitch} onGetDiagBtnTintColor={tint}></DiagButton>
    );

}