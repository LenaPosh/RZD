import React, { useEffect, useRef, useState } from 'react';
import {Application, Assets, Graphics, Sprite, Texture} from 'pixi.js';
import imagePlan from './canvas.png';
import {ZoneData} from "./MainMenu";

interface Point {
    x: number;
    y: number;
}
interface RectangleData {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface CanvasComponentProps {
    rectangles: ZoneData[];
    setRectangles: React.Dispatch<React.SetStateAction<ZoneData[]>>;
    onTempRectangleChange: (newRect: ZoneData | null) => void;
    onZoneClick: (zoneId: number) => void;
}


const CanvasComponent: React.FC<CanvasComponentProps> = ({rectangles, setRectangles, onTempRectangleChange, onZoneClick }) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [app, setApp] = useState<Application | null>(null);
    const graphicsRef = useRef<Graphics | null>(null);
    const backgroundRef = useRef<Sprite | null>(null);


    useEffect(() => {
        const newApp = new Application();

        (async () => {
            await newApp.init({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x1099bb,
            });

            if (canvasRef.current) {
                canvasRef.current.appendChild(newApp.canvas);
            }

            await Assets.load(imagePlan);
            const texture = Texture.from(imagePlan);
            const background = new Sprite(texture);
            background.width = newApp.screen.width;
            background.height = newApp.screen.height;
            newApp.stage.addChild(background);

            background.interactive = true;

            graphicsRef.current = new Graphics();

            backgroundRef.current = background;

            newApp.stage.addChild(graphicsRef.current);

            setApp(newApp);
        })();

        return () => {
            if (app) {
                app.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (!app || !backgroundRef.current) return;

        const background = backgroundRef.current;
        let startPoint: Point | null = null;
        let currentRectangle: Graphics | null = null;

        const onPointerDown = (event: any) => {
            const { x, y } = event.data.global;
            startPoint = { x, y };
            currentRectangle = new Graphics();
            app.stage.addChild(currentRectangle);
        };
        const onPointerMove = (event: any) => {
            if (!startPoint || !currentRectangle) return;

            const { x, y } = event.data.global;
            const width = x - startPoint.x;
            const height = y - startPoint.y;

            currentRectangle.clear();
            currentRectangle.stroke({width: 3, color: 0xFF0000});
            currentRectangle.rect(startPoint.x, startPoint.y, width, height);
        };

        const onPointerUp = (event: any) => {
            if (!startPoint || !currentRectangle) return;

            const { x, y } = event.data.global;
            const width = x - startPoint.x;
            const height = y - startPoint.y;

            const newRect = { x: startPoint.x, y: startPoint.y, width, height };
            onTempRectangleChange(newRect);

            startPoint = null;
            currentRectangle = null;
        };


        background.on('pointerdown', onPointerDown);
        background.on('pointermove', onPointerMove)
        background.on('pointerup', onPointerUp);

        return () => {
            background.off('pointerdown', onPointerDown);
            background.off('pointermove', onPointerMove)
            background.off('pointerup', onPointerUp);
        };
    }, [app, rectangles]);

    useEffect(() => {
        const savedZones = JSON.parse(localStorage.getItem('savedZones') || '[]');
        setRectangles(savedZones);
    }, []);


    useEffect(() => {
        if (!app) return;

        graphicsRef.current?.clear();

        rectangles.forEach((rect, index) => {
            const zoneGraphics = new Graphics();

            zoneGraphics.rect(rect.x, rect.y, rect.width, rect.height).fill({
                color: index % 2 === 0 ? 0x008800 : 0x888888,
                alpha: 0.3
            });

            zoneGraphics.stroke({
                color: 0xFF0000,
                width: 3
            });

            zoneGraphics.interactive = true;

            zoneGraphics.on('pointerdown', () => {
                if (typeof rect.id === 'number') {
                    onZoneClick(rect.id);
                } else {
                    console.error('ID зоны не определен или не является числом');
                }
            });


            app.stage.addChild(zoneGraphics);
        });
    }, [app, rectangles, onZoneClick]);



    return <div ref={canvasRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
};

export default CanvasComponent;





