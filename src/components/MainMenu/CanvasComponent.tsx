import React, { useEffect, useRef, useState } from 'react';
import {Application, Assets, Graphics, Sprite, Texture} from 'pixi.js';
import imagePlan from '../icons/vokzal1 - ID-1.png';
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
    onSelectedZoneNameChange: (newName: string) => void;
    isDeleteMode: boolean;
    // resetCurrentZoneData: () => void;
    // resetSelectedZoneName: () => void;
    hoveredZoneId: number | null;
    activeMapId: number | null;
    activeMapUrl: string;
    isHighlightActive: boolean;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
    rectangles,
    setRectangles,
    onTempRectangleChange,
    onZoneClick,
    activeZoneId,
    isDrawingMode,
    setActiveZoneId,
    setActiveIds,
    selectedZoneName,
    onSelectedZoneNameChange,
    isDeleteMode,
    hoveredZoneId,
    // activeMapId,
    activeMapUrl,
    isHighlightActive
    }) => {

    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [app, setApp] = useState<Application | null>(null);
    const graphicsRef = useRef<Graphics | null>(null);
    const backgroundRef = useRef<Sprite | null>(null);
    const [selectedRectangle, setSelectedRectangle] = useState<RectangleData | null>(null);

    const [, setDrawingZoneId] = useState<number | null>(null);
    const startPointRef = useRef<Point | null>(null);
    const currentRectangleRef = useRef<Graphics | null>(null);
    const isDeleteModeRef = useRef(isDeleteMode);
    // const [isResizingMode, setIsResizingMode] = useState(false);
    // const resizingStartPoint = useRef<Point | null>(null);

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
            console.log("PixiJS App initialized");

        })();
        return () => {
            if (app) {
                app.destroy(true);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        isDeleteModeRef.current = isDeleteMode;
        console.log(`Delete mode is now ${isDeleteMode ? 'ON' : 'OFF'}.`);
    }, [isDeleteMode]);

    useEffect(() => {
        const currentBackground = backgroundRef.current;

        if (!app || !currentBackground) return;

        const background = currentBackground;

        const onPointerDown = (event: any) => {
            const existingRectangle = rectangles.find(rect => rect.zoneId === activeZoneId);
            if (existingRectangle || !isDrawingMode) {
                return;
            }

            const { x, y } = event.data.global;
            startPointRef.current = { x, y };
            currentRectangleRef.current = new Graphics();
            app.stage.addChild(currentRectangleRef.current);
            console.log(`Pointer down at (${x}, ${y}). Is drawing mode? ${isDrawingMode}`);
            setDrawingZoneId(activeZoneId);
        };

        const onPointerMove = (event: any) => {
            if (!startPointRef.current || !currentRectangleRef.current) {
                return;
            }
            const { x, y } = event.data.global;

            const width = x - startPointRef.current.x;
            const height = y - startPointRef.current.y;

            currentRectangleRef.current.clear();
            currentRectangleRef.current.stroke({width: 3, color: 0xFF0000});
            currentRectangleRef.current.rect(startPointRef.current.x, startPointRef.current.y, width, height);
        };

        let lastId = rectangles.reduce((max, rect) => Math.max(max, rect.id || 0), 0);

        const generateUniqueId = () => {
            lastId += 1;
            return lastId;
        };

        const onPointerUp = (event: any) => {
            if (!startPointRef.current || !currentRectangleRef.current) {
                return;
            }
            const fillColor = rectangles.length % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(143, 255, 0, 0.2)';

            const newRect: ZoneData = {
                x: startPointRef.current.x,
                y: startPointRef.current.y,
                width: event.data.global.x - startPointRef.current.x,
                height: event.data.global.y - startPointRef.current.y,
                id: generateUniqueId(),
                zoneId: activeZoneId,
                name: selectedZoneName ?? "Новая зона",
                color: fillColor,
            };
            // console.log(`Pointer up. Rectangle created: `, newRect);
            onTempRectangleChange(newRect);

            startPointRef.current = null;
            currentRectangleRef.current = null;

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

    // useEffect(() => {
    //     if (!app) return;
    //
    //     rectangles.forEach((rect, index) => {
    //         let zoneGraphics = new Graphics();
    //         zoneGraphics.label = `zone_${rect.id}`;
    //
    //         if (!zoneGraphics) {
    //             zoneGraphics = new Graphics();
    //             zoneGraphics.label = `zone_${rect.id}`;
    //             app.stage.addChild(zoneGraphics);
    //         }
    //
    //         zoneGraphics.clear();
    //         zoneGraphics.interactive = true;
    //
    //         const isActive = rect.id === activeZoneId;
    //
    //         const fillColor = index % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(143, 255, 0, 0.2)';
    //         const fillAlpha = isActive ? 0.5 : 0.3;
    //
    //         zoneGraphics.stroke({color: 0xFF0000, alpha: 1});
    //         zoneGraphics.fill(fillColor, fillAlpha);
    //         zoneGraphics.rect(rect.x, rect.y, rect.width, rect.height);
    //         zoneGraphics.fill();
    //
    //         zoneGraphics.on('pointerdown', () => {
    //             if (isDeleteModeRef.current) {
    //                 removeRectangleById(rect.id);
    //             } else {
    //                 setActiveZoneId(rect.id);
    //                 onZoneClick(rect.id);
    //             }
    //         });
    //     });
    //
    // }, [app, rectangles, isDeleteModeRef.current]);



    //
    // useEffect(() => {
    //     if (drawingZoneId !== null) {
    //         setActiveZoneId(drawingZoneId);
    //         setActiveIds([drawingZoneId]);
    //     }
    // }, [drawingZoneId, setActiveZoneId, setActiveIds]);



    const removeRectangleById = (rectId: number) => {
        // console.log(`Attempting to remove rectangle with ID: ${rectId}`);

        if (!app) {
            // console.log("App is not initialized");
            return;
        }


        const graphicsToRemove = app.stage.children.find(child => child.label === `zone_${rectId}`);
        if (graphicsToRemove) {
            app.stage.removeChild(graphicsToRemove);
            // console.log(`Removed rectangle with ID: ${rectId} from the stage.`);
        }

        const updatedRectangles = rectangles.filter(rect => {
            const toKeep = rect.id !== rectId;
            console.log(`Filtering rect ID: ${rect.id}, Keep: ${toKeep}`);
            return toKeep;
        });
        setRectangles(prevRectangles => prevRectangles.filter(rect => String(rect.id) !== String(rectId)));

        localStorage.setItem('savedZones', JSON.stringify(updatedRectangles));
    };

    useEffect(() => {

        localStorage.setItem('savedZones', JSON.stringify(rectangles));

    }, [rectangles]);


    useEffect(() => {
        if (!app) return;
        // console.log("Начало useEffect, isDeleteMode:", isDeleteMode);
        rectangles.forEach((rect, index) => {
            let zoneGraphics = app.stage.children.find(c => c.label === `zone_${rect.id}`) as Graphics;

            if (!zoneGraphics && app && app.stage) {
                zoneGraphics = new Graphics();
                zoneGraphics.label = `zone_${rect.id}`;
                app.stage.addChild(zoneGraphics);
                zoneGraphics.interactive = true;


                const handleSelect = () => {
                    if (!isDeleteModeRef.current) {
                        setActiveZoneId(rect.id);
                        setActiveIds([rect.zoneId].filter((id): id is number => id !== null && id !== undefined));
                        const currentZone = rectangles.find(r => r.id === rect.id);
                        onSelectedZoneNameChange(currentZone?.name ?? "Неизвестная зона");
                    }
                };

                // zoneGraphics.off('pointerdown');

                zoneGraphics.on('pointerdown', () => {
                    console.log(`Clicked on rectangle with ID: ${rect.id}, isDeleteModeRef.current at click:`, isDeleteModeRef.current);
                    if (isDeleteModeRef.current) {
                        console.log(`Removing rectangle with ID: ${rect.id}`);
                        removeRectangleById(rect.id);
                        return;
                    }
                    handleSelect();
                });
                // app.stage.addChild(zoneGraphics);
            }

            const isActive = rect.id === activeZoneId;

            zoneGraphics.clear();
            if (rect.id === activeZoneId) {
                zoneGraphics.stroke({ width: 3, color: 0xFF0000, alpha: 1 });
            } else {
                zoneGraphics.stroke({width: 2, color: 0x000000, alpha: 1});
            }

            const fillColor = index % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(143, 255, 0, 0.2)';
            const strokeColor = fillColor === 'rgba(0, 0, 0, 0.1)' ? 0x808080 : 0x00FF00;

            zoneGraphics.fill({color: fillColor});
            zoneGraphics.stroke({ width: 3, color: strokeColor, alpha: 1 });
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
                color: activeRect.color || 'rgba(0, 0, 0, 0.1)'
            };
            setSelectedRectangle(rectWithDefinedColor);
        } else {
            setSelectedRectangle(null);
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app, rectangles, activeZoneId, onZoneClick,  setActiveIds, setActiveZoneId, onSelectedZoneNameChange, isDeleteMode]);

    // function isInResizeZone(x: number, y: number, rect: ZoneData): boolean {
    //     const zoneSize = 10;
    //     const inXZone = x > (rect.x + rect.width - zoneSize) && x < (rect.x + rect.width);
    //     const inYZone = y > (rect.y + rect.height - zoneSize) && y < (rect.y + rect.height);
    //     return inXZone && inYZone;
    // }
    //
    //
    // function handleRectanglePointerDown(event: any, rect: any) {
    //     const { x, y } = event.data.global;
    //     if (isInResizeZone(x, y, rect)) {
    //         setIsResizingMode(true);
    //         resizingStartPoint.current = { x, y };
    //         setActiveZoneId(rect.id);
    //     }
    // }
    //
    // function handlePointerMove(event: any) {
    //     if (!isResizingMode || !resizingStartPoint.current || activeZoneId == null) return;
    //
    //     const { x, y } = event.data.global;
    //     const dx = x - resizingStartPoint.current.x;
    //     const dy = y - resizingStartPoint.current.y;
    //
    //     const newRectangles = rectangles.map(rect => {
    //         if (rect.id !== activeZoneId) return rect;
    //         return { ...rect, width: rect.width + dx, height: rect.height + dy };
    //     });
    //     setRectangles(newRectangles);
    //     resizingStartPoint.current = { x, y };
    // }
    //
    // function handlePointerUp() {
    //     if (!isResizingMode) return;
    //     setIsResizingMode(false);
    //     resizingStartPoint.current = null;
    // }

    interface ZoneGraphics {
        graphics: Graphics;
        width: number
        height: number;
        x: number;
        y: number;
        zoneId: number;
    }

    const zonesGraphics = [
        { zoneId: 2, graphics: new Graphics(), width: 8, height: 3, x: 680, y: 170 },
        { zoneId: 3, graphics: new Graphics(), width: 2, height: 1.7, x: 1150, y: 10 },
        { zoneId: 4, graphics: new Graphics(), width: 1.8, height: 1, x: 1050, y: 29 },
    ];


    const findGraphicsByZoneId = (zoneId: number) => {
        // console.log(`Ищем графику для зоны с ID: ${zoneId}`);
        return zonesGraphics.find(zoneGraphic => {
            const found = zoneGraphic.zoneId === zoneId;
            console.log(`Зона ${zoneGraphic.zoneId} ${found ? 'найдена' : 'не найдена'}`);
            return found;
        });
    };

    const scale = 51;

    const highlightZone = (zoneGraphic: ZoneGraphics, highlight: boolean): void => {
        // console.log(`Подсветка зоны с ID: ${zoneGraphic.zoneId}, состояние подсветки: ${highlight}`);
        const { graphics, width, height, x, y } = zoneGraphic;

        if (app && app.stage && !app.stage.children.includes(graphics)) {
            app.stage.addChild(graphics);
        }

        graphics.clear();

        graphics.stroke({ color: highlight ? 0xFF0000 : 0x000000, alpha: 1});

        const fillColor = highlight ? 0xFF0000 : 0xCCCCCC;
        const fillAlpha = highlight ? 0.2 : 0.3;
        graphics
            .fill({color: fillColor, alpha:fillAlpha})
            .rect(x, y, width * scale, height * scale)
            .fill();

        // console.log(`Зона ${zoneId} подсвечена`);

        if (app) {
            app.renderer.render(app.stage);
        }
    };



    const resetHighlight = () => {
        console.log('Сброс подсветки для всех зон');
        zonesGraphics.forEach(zoneGraphic => {
            const { graphics, zoneId } = zoneGraphic;

            console.log(`Сбрасываем подсветку для зоны с ID: ${zoneId}`);
            graphics.clear();
            if (app && app.stage && app.stage.children.includes(graphics)) {
                app.stage.removeChild(graphics);
            }


        });
        if (app && app.stage) {
            app.renderer.render(app.stage);
        }
    };


    useEffect(() => {
        if (hoveredZoneId && isHighlightActive) {
            const zoneToHighlight = findGraphicsByZoneId(hoveredZoneId);
            if (zoneToHighlight) {
                highlightZone(zoneToHighlight, true);
            }
        } else {
            resetHighlight();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hoveredZoneId, isHighlightActive]);


    useEffect(() => {

        if (app) {
            console.log('Добавление графических объектов на app.stage');
            zonesGraphics.forEach(zoneGraphic => {
                if (!app.stage.children.includes(zoneGraphic.graphics)) {
                    app.stage.addChild(zoneGraphic.graphics);
                }
            });

            app.renderer.render(app.stage);
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app]);

    useEffect(() => {
        // console.log(`isHighlightActive changed to ${isHighlightActive}. Will ${isHighlightActive ? 'highlight' : 'reset'} zones.`);
        if (!isHighlightActive) {
            resetHighlight();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHighlightActive, app]);


    useEffect(() => {
        if (!app || !activeMapUrl) return;

        // resetHighlight();

        if (backgroundRef.current) {
            app.stage.removeChild(backgroundRef.current);
            backgroundRef.current.destroy();
        }
        // console.log(`Active map URL changed to ${activeMapUrl}. Will reset highlight and load new background.`);
        Assets.load(activeMapUrl).then(() => {
            const texture = Texture.from(activeMapUrl);
            const background = new Sprite(texture);
            background.width = app.screen.width;
            background.height = app.screen.height;
            background.interactive = true;
            app.stage.addChildAt(background, 0);
            backgroundRef.current = background;



            const newGraphics = new Graphics();
            app.stage.addChild(newGraphics);
            graphicsRef.current = newGraphics;


        });
        app.stage.removeChildren();
    }, [app, activeMapUrl]);





    return (
        <>
            <div ref={canvasRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
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


