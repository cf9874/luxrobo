import { useEffect, useState } from "react";
import { IDiagVec2, useZoomController } from "./Utils/Common";
import { IUseDiagMenuResult } from "type";
import { FederatedPointerEvent } from "pixi.js";

let cachedZoomInfo = { scale: 1 };
let cachedGridPos: IDiagVec2 = { x: 0, y: 0 };
let drag: boolean = false;
let lastGridPos: IDiagVec2 = { x: 0, y: 0 };

export const useDiagMenu = () : IUseDiagMenuResult => {

    const [gridPos, setGridPos] = useState({ x: 0, y: 0 });
    // const [dragGrid, _setDragGrid] = useState(false);

    const { zoomScale, setZoomScale, onZoomIn, onZoomOut, resetZoom } = useZoomController();

    const onResetView = () => {

        resetZoom();
        setZoomScale(1);
        setGridPos({ x: 0, y: 0 });
    };

    const onStartDragGrid = (e: FederatedPointerEvent) => {

        lastGridPos = { ...e.screen };
        drag = true;
    };

    const onDragGrid = (e: FederatedPointerEvent) => {

        if (!drag) {
          return;
        }

        // CAUTION : e.movemnet는 정수로만 떨어져, 소수점 유실로 오차 발생.
        const movement = { x: e.screenX - lastGridPos.x, y: e.screenY - lastGridPos.y };
    
        cachedGridPos.x = Math.min(0, cachedGridPos.x + movement.x);
        cachedGridPos.y = Math.min(0, cachedGridPos.y + movement.y);

        lastGridPos = { ...e.screen };

        setGridPos({ ...cachedGridPos });
    };

    const onEndDragGrid = (e: FederatedPointerEvent) => {

        drag = false;
    }

    useEffect(() => {

        cachedZoomInfo.scale = 1 / zoomScale;

    }, [zoomScale]);

    return {

        _internalProps: {
            gridPos,
            cachedGridPos,
            onStartDragGrid,
            onDragGrid,
            onEndDragGrid,
            zoomScale,
            cachedZoomInfo
        },

        setZoomIn: onZoomIn,
        setZoomOut: onZoomOut,
        resetView: onResetView
    };
}