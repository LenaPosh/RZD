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
    onZoneClick: (zoneId: number | null) => void;
    activeZoneId: number | null;
    isDrawingMode: boolean;
}


const CanvasComponent: React.FC<CanvasComponentProps> = ({rectangles, setRectangles, onTempRectangleChange, onZoneClick, activeZoneId, isDrawingMode }) => {

    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [app, setApp] = useState<Application | null>(null);
    const graphicsRef = useRef<Graphics | null>(null);
    const backgroundRef = useRef<Sprite | null>(null);
    const [selectedRectangle, setSelectedRectangle] = useState<RectangleData | null>(null);

    const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);

    const handleClick = (zoneId: number | null) => {
        onZoneClick(zoneId);
    };

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
            if (!isDrawingMode) return;
            const zoneId = activeZoneId;
            const { x, y } = event.data.global;
            startPoint = { x, y };
            currentRectangle = new Graphics();
            app.stage.addChild(currentRectangle);
            handleClick(zoneId);
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

        let lastId = rectangles.reduce((max, rect) => Math.max(max, rect.id || 0), 0);

        const generateUniqueId = () => {
            lastId += 1;
            return lastId;
        };

        const onPointerUp = (event: any) => {
            if (!startPoint || !currentRectangle) return;

            const { x, y } = event.data.global;

            const newRect: ZoneData = {
                x: startPoint.x,
                y: startPoint.y,
                width: event.data.global.x - startPoint.x,
                height: event.data.global.y - startPoint.y,
                id: generateUniqueId(),
            };
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
    }, [app, isDrawingMode, rectangles]);

    useEffect(() => {
        const savedZones = JSON.parse(localStorage.getItem('savedZones') || '[]');
        setRectangles(savedZones);
    }, []);


    useEffect(() => {
        if (!app) return;

        rectangles.forEach((rect, index) => {
            let zoneGraphics = app.stage.children.find(c => c.label === `zone_${rect.id}`) as Graphics;

            if (!zoneGraphics) {
                zoneGraphics = new Graphics();
                zoneGraphics.label = `zone_${rect.id}`; // Используем label вместо name
                app.stage.addChild(zoneGraphics);
                zoneGraphics.interactive = true;
                zoneGraphics.on('pointerdown', () => {
                    console.log("Rectangle clicked with ID:", rect.id);

                    if (typeof rect.id === 'number') {
                        onZoneClick(rect.id);
                    } else {
                        console.error('ID зоны не определён или не является числом');
                    }
                });
            }

            const isActive = rect.id === activeZoneId;

             zoneGraphics.clear();

            zoneGraphics.fill(index % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(143, 255, 0, 0.2)', isActive ? 0.5 : 0.3);

            zoneGraphics.rect(rect.x, rect.y, rect.width, rect.height);
            zoneGraphics.fill();

            if (isActive) {
                zoneGraphics.stroke({ width: 5, color: 0x0000FF, alpha: 1 });
                zoneGraphics.rect(rect.x, rect.y, rect.width, rect.height);
            }
        });


        const activeRect = activeZoneId !== null ? rectangles.find(rect => rect.id === activeZoneId) : undefined;
        if (activeRect && activeRect.name) {
            setSelectedZoneName(activeRect.name);
            setSelectedRectangle(activeRect);
        } else {
            setSelectedZoneName(null);
            setSelectedRectangle(null);
        }


    }, [app, rectangles, activeZoneId, onZoneClick]);

    useEffect(() => {
        console.log("activeZoneId:", activeZoneId);
        console.log("rectangles:", rectangles);
        const activeRect = activeZoneId !== null ? rectangles.find(rect => rect.id === activeZoneId) : undefined;
        console.log("activeRect:", activeRect);
        if (activeRect && activeRect.name) {
            setSelectedZoneName(activeRect.name);
            setSelectedRectangle(activeRect);
            console.log("Selected zone name:", activeRect.name);
        } else {
            setSelectedZoneName(null);
            setSelectedRectangle(null);
            console.log("No selected zone name");
        }
    }, [activeZoneId, rectangles]);


    useEffect(() => {
        console.log("Active zone ID changed to:", activeZoneId);
    }, [activeZoneId]);



    return (
        <>
            <div ref={canvasRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
            {selectedRectangle && (
                <div style={{ position: 'absolute', top: `${selectedRectangle.y}px`, left: `${selectedRectangle.x}px` }}>
                    Выбранная зона: {selectedZoneName}
                </div>
            )}


        </>
        )


};

export default CanvasComponent;


