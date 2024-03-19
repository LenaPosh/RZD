import React, { useEffect, useRef, useState } from 'react';
import {Application, Assets, Graphics, Sprite, Texture} from 'pixi.js';
import imagePlan from '../icons/home.jpg';
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
    color?: string;
}

interface CanvasComponentProps {
    rectangles: ZoneData[];
    setRectangles: React.Dispatch<React.SetStateAction<ZoneData[]>>;
    onTempRectangleChange: (newRect: ZoneData | null) => void;
    onZoneClick: (zoneId: number | null) => void;
    activeZoneId: number | null;
    isDrawingMode: boolean;
    setActiveZoneId: React.Dispatch<React.SetStateAction<number | null>>;
    setActiveIds: React.Dispatch<React.SetStateAction<Array<number | string>>>;
    selectedZoneName: string | null;
}


const CanvasComponent: React.FC<CanvasComponentProps> = ({rectangles, setRectangles, onTempRectangleChange, onZoneClick, activeZoneId, isDrawingMode,   setActiveZoneId,
                                                             setActiveIds, selectedZoneName }) => {

    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [app, setApp] = useState<Application | null>(null);
    const graphicsRef = useRef<Graphics | null>(null);
    const backgroundRef = useRef<Sprite | null>(null);
    const [selectedRectangle, setSelectedRectangle] = useState<RectangleData | null>(null);

    const [drawingZoneId, setDrawingZoneId] = useState<number | null>(null);

    useEffect(() => {
        const newApp = new Application();

        (async () => {
            await newApp.init({
                width: 1280,
                height: 500,
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
        console.log("PixiJS Application has been initialized.");
        return () => {
            if (app) {
                app.destroy(true);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    useEffect(() => {
        const currentBackground = backgroundRef.current;
        // const handleClick = (zoneId: number | null) => {
        //     onZoneClick(zoneId);
        // };
        if (!app || !currentBackground) return;

        const background = currentBackground;
        let startPoint: Point | null = null;
        let currentRectangle: Graphics | null = null;

        const onPointerDown = (event: any) => {
            console.log("onPointerDown", { x: event.data.global.x, y: event.data.global.y });
            const existingRectangle = rectangles.find(rect => rect.zoneId === activeZoneId);

            if (existingRectangle || !isDrawingMode) {
                console.log(`Рисование в зоне ${activeZoneId} запрещено.`);
                return;
            }

            const { x, y } = event.data.global;
            startPoint = { x, y };
            currentRectangle = new Graphics();
            app.stage.addChild(currentRectangle);
            setDrawingZoneId(activeZoneId);
            console.log(`Начало рисования в точке (${x}, ${y}) с activeZoneId: ${activeZoneId}`);
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
            console.log("onPointerUp", { x: event.data.global.x, y: event.data.global.y });

            if (!startPoint || !currentRectangle) return;
            const fillColor = rectangles.length % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(143, 255, 0, 0.2)';

            const newRect: ZoneData = {
                x: startPoint.x,
                y: startPoint.y,
                width: event.data.global.x - startPoint.x,
                height: event.data.global.y - startPoint.y,
                id: generateUniqueId(),
                zoneId: activeZoneId,
                name: selectedZoneName ?? "Новая зона",
                color: fillColor,
            };
            onTempRectangleChange(newRect);
            console.log(`Pointer up with newRect:`, newRect);
            setRectangles([...rectangles, newRect]);

            startPoint = null;
            currentRectangle = null;
            if (newRect && typeof newRect.zoneId === 'number') {
                setRectangles([...rectangles, newRect]);
                setDrawingZoneId(null);
            }
        };

        background.on('pointerdown', onPointerDown);
        background.on('pointermove', onPointerMove)
        background.on('pointerup', onPointerUp);

        return () => {
            if (app && currentBackground) {
                currentBackground.off('pointerdown', onPointerDown);
                currentBackground.off('pointermove', onPointerMove);
                currentBackground.off('pointerup', onPointerUp);
            }
        };
    }, [app, isDrawingMode, rectangles, activeZoneId, onTempRectangleChange, onZoneClick, setRectangles, selectedZoneName]);

    useEffect(() => {
        const savedZones = JSON.parse(localStorage.getItem('savedZones') || '[]');
        setRectangles(savedZones);
    }, [setRectangles]);

    useEffect(() => {
        if (drawingZoneId !== null) {
            setActiveZoneId(drawingZoneId);
            setActiveIds([drawingZoneId]);
        }
    }, [drawingZoneId, setActiveZoneId, setActiveIds]);


    useEffect(() => {
        if (!app) return;

        rectangles.forEach((rect, index) => {
            let zoneGraphics = app.stage.children.find(c => c.label === `zone_${rect.id}`) as Graphics;

            if (!zoneGraphics && app && app.stage) {
                zoneGraphics = new Graphics();
                zoneGraphics.label = `zone_${rect.id}`;
                app.stage.addChild(zoneGraphics);
                zoneGraphics.interactive = true;
                zoneGraphics.on('pointerdown', () => {
                    setActiveZoneId(rect.id);
                    if (typeof rect.zoneId === 'number') {
                        setActiveIds([rect.zoneId]);
                    }
                });
            }

            const isActive = rect.id === activeZoneId;


            zoneGraphics.clear();
            if (rect.id === activeZoneId) {
                zoneGraphics.stroke({ width: 3, color: 0xFF0000, alpha: 1 });
            } else {
                zoneGraphics.stroke({width: 2, color: 0x000000, alpha: 1});
            }

            zoneGraphics.fill(index % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(143, 255, 0, 0.2)', isActive ? 0.5 : 0.3);
            zoneGraphics.stroke({ width: 3, color: 0xFF0000, alpha: 1 });
            zoneGraphics.rect(rect.x, rect.y, rect.width, rect.height);
            // zoneGraphics.fill();

            if (isActive) {
                zoneGraphics.stroke({ width: 5, color: 0x0000FF, alpha: 1 });
                zoneGraphics.rect(rect.x, rect.y, rect.width, rect.height);
            }
        });

        const activeRect = activeZoneId !== null ? rectangles.find(rect => rect.id === activeZoneId) : undefined;
        if (activeRect && activeRect.name) {
            const rectWithDefinedColor: RectangleData = {
                ...activeRect,
                color: activeRect.color || 'defaultColor'
            };
            setSelectedRectangle(rectWithDefinedColor);
        } else {
            setSelectedRectangle(null);
        }


    }, [app, rectangles, activeZoneId, onZoneClick, setActiveIds, setActiveZoneId]);

    useEffect(() => {
        console.log("activeZoneId:", activeZoneId);
        console.log("rectangles:", rectangles);
        const activeRect = activeZoneId !== null ? rectangles.find(rect => rect.id === activeZoneId) : undefined;
        console.log("activeRect:", activeRect);

        if (activeRect && activeRect.name) {
            const rectData: RectangleData = {
                ...activeRect,
                color: activeRect.color || 'defaultColor'
            };
            setSelectedRectangle(rectData);
        } else {
            setSelectedRectangle(null);
        }
    }, [activeZoneId, rectangles]);




    return (
        <>
            <div ref={canvasRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
            {selectedRectangle && selectedZoneName && (
                <div style={{
                    position: 'absolute',
                    top: `${selectedRectangle.y - 3}px`,
                    alignContent: `${selectedRectangle.x}px`,
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    padding: '3px',
                    pointerEvents: 'none',
                }}>
                    {selectedZoneName}
                </div>
            )}


        </>
        )


};

export default CanvasComponent;


