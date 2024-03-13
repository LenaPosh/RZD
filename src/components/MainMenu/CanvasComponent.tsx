import React, { useEffect, useRef, useState } from 'react';
import {Application, Assets, Graphics, Sprite, Texture} from 'pixi.js';
import imagePlan from './canvas.png';

interface Point {
    x: number;
    y: number;
}

const CanvasComponent = () => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [app, setApp] = useState<Application | null>(null);
    const graphicsRef = useRef<Graphics | null>(null);

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
        if (!app) return;

        const background = app.stage.children[0] as Sprite;
        let startPoint: Point | null = null;
        let isDrawing = false;

        const onPointerDown = (event: any) => {
            const { x, y } = event.data.global;
            startPoint = { x, y };
            isDrawing = true;
        };
        const onPointerMove = (event: any) => {
            if (!startPoint || !isDrawing || !graphicsRef.current) return;

            const { x, y } = event.data.global;
            const width = x - startPoint.x;
            const height = y - startPoint.y;

            graphicsRef.current.clear();
            graphicsRef.current.stroke({width: 2, color: 0xFF0000});
            graphicsRef.current.rect(startPoint.x, startPoint.y, width, height);
        };

        const onPointerUp = (event: any) => {
            if (!startPoint || !graphicsRef.current) return;

            isDrawing = false;
            startPoint = null;
        }


        background.on('pointerdown', onPointerDown);
        background.on('pointermove', onPointerMove)
        background.on('pointerup', onPointerUp);

        return () => {
            background.off('pointerdown', onPointerDown);
            background.off('pointermove', onPointerMove)
            background.off('pointerup', onPointerUp);
        };
    }, [app]);

    return <div ref={canvasRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
};

export default CanvasComponent;


// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {Application, Graphics, Sprite, Assets, Rectangle, Texture} from 'pixi.js';
// import imagePlan from './canvas.png';
//
// const CanvasComponent = () => {
//     const canvasRef = useRef<HTMLDivElement>(null);
//     const [newApp, setNewApp] = useState<Application | null>(null);
//     const initializedRef = useRef(false);
//     const [rectangles, setRectangles] = useState<Rectangle[]>([]);
//
//     useEffect(() => {
//         if (!initializedRef.current) {
//             initializedRef.current = true;
//             console.log('Инициализация PIXI app');
//             const initApp = async () => {
//                 const app = new Application();
//
//                 await app.init({
//                     // background: 0x1099bb,
//                     resizeTo: window,
//                     autoStart: false,
//                 })
//                 if (canvasRef.current) {
//                     canvasRef.current.appendChild(app.canvas);
//                 }
//
//                 await Assets.load(imagePlan);
//                 const texture = Texture.from(imagePlan);
//                 // const texture = await Assets.load(imagePlan);
//                 const background = new Sprite(texture);
//                 background.width = app.screen.width;
//                 background.height = app.screen.height;
//                 app.stage.addChild(background);
//
//                 app.stage.interactive = true;
//                 app.renderer.render(app.stage);
//
//                 setNewApp(app);
//             };
//
//             initApp();
//
//             return () => newApp?.destroy(true);
//         }
//     }, []);
//
//     useEffect(() => {
//         if (newApp) {
//             newApp.stage.on('click', (event) => {
//                 const { x, y } = event.data.global;
//                 const width = 100;
//                 const height = 100;
//                 const rect = new Rectangle(x, y, width, height);
//                 setRectangles([...rectangles, rect]);
//
//                 const graphics = new Graphics();
//                 graphics
//                     .rect(rect.x, rect.y, rect.width, rect.height)
//                     .stroke({width: 2, color: 0xFF0000});
//                 newApp.stage.addChild(graphics);
//                 newApp.renderer.render(newApp.stage);
//             });
//         }
//     }, [newApp, rectangles]);
//
//     return (
//         <>
//             <div ref={canvasRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
//         </>
//
//     )
// };
//
// export default CanvasComponent;




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
