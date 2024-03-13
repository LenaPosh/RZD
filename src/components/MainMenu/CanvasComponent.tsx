import React, { useEffect, useRef, useState } from 'react';
import {Application, Assets, Graphics, Sprite, Texture} from 'pixi.js';
import imagePlan from './canvas.png';

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

const CanvasComponent = () => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [app, setApp] = useState<Application | null>(null);
    const graphicsRef = useRef<Graphics | null>(null);
    const [rectangles, setRectangles] = useState<RectangleData[]>([])
    const backgroundRef = useRef<Sprite | null>(null);

    useEffect(() => {
        const newApp = new Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
        });

        (async () => {
            await newApp.init({
                width: window.innerWidth,
                height: window.innerHeight,
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
            currentRectangle.stroke({width: 2, color: 0xFF0000});
            currentRectangle.rect(startPoint.x, startPoint.y, width, height);
        };

        const onPointerUp = (event: any) => {
            if (!startPoint || !currentRectangle) return;

            const { x, y } = event.data.global;
            const width = x - startPoint.x;
            const height = y - startPoint.y;

            setRectangles([...rectangles, { x: startPoint.x, y: startPoint.y, width, height }]);
            startPoint = null;
            currentRectangle = null;
        }

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
        if (!app) return;

        if (graphicsRef.current) {
            graphicsRef.current.clear();
        } else {
            graphicsRef.current = new Graphics();
            app.stage.addChild(graphicsRef.current);
        }

        rectangles.forEach(rect => {
            graphicsRef.current?.stroke({width: 2, color: 0xFF0000}).rect(rect.x, rect.y, rect.width, rect.height);
        });
    }, [rectangles]);

    return <div ref={canvasRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
};

export default CanvasComponent;





//
// const addPoint = useCallback((event: any) => {
//     const { x, y } = event.data.global;
//
//     const distance = (x1: number, y1: number, x2: number, y2: number): number => {
//         return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
//     };
//
//     if (!isDrawing || points.length === 0) {
//         setIsDrawing(true);
//         setPoints((prevPoints) => [...prevPoints, x, y]);
//     } else {
//         const distanceToFirstPoint = distance(x, y, points[0], points[1]);
//         if (distanceToFirstPoint < 10 && points.length >= 6) {
//             setIsDrawing(false);
//             const newFigure = [...points, points[0], points[1]];
//             setCompletedFigures((prevFigures) => [...prevFigures, newFigure]);
//             setPoints([]);
//         } else {
//             setPoints((prevPoints) => [...prevPoints, x, y]);
//         }
//     }
// }, [points, isDrawing]);
//
//
// useEffect(() => {
//     if (newApp) {
//         const graphics = new Graphics();
//         graphics.clear();
//
//         completedFigures.forEach((figure) => {
//             graphics.stroke({ width: 2, color: 0x000000, alpha: 1 }).moveTo(figure[0], figure[1]);
//             for (let i = 2; i < figure.length; i += 2) {
//                 graphics.lineTo(figure[i], figure[i + 1]);
//             }
//             graphics.closePath();
//         });
//
//         if (isDrawing && points.length > 2) {
//             graphics.stroke({width:2, color: 0x000000, alpha: 1}).moveTo(points[0], points[1]);
//             for (let i = 2; i < points.length; i += 2) {
//                 graphics.lineTo(points[i], points[i + 1]);
//             }
//         }
//
//         points.forEach((point, index) => {
//             if (index % 2 === 0) {
//                 graphics.circle(point, points[index + 1], 2);
//             }
//         });
//
//         graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });
//         newApp.stage.addChild(graphics);
//     }
// }, [points, newApp, isDrawing, completedFigures]);
