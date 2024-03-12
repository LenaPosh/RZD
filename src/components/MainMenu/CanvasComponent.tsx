
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Application, Graphics, Sprite, Assets, Rectangle} from 'pixi.js';
import imagePlan from './canvas.png';

const CanvasComponent = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [newApp, setNewApp] = useState<Application | null>(null);
    const [points, setPoints] = useState<number[]>([]);
    const initializedRef = useRef(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [completedFigures, setCompletedFigures] = useState<number[][]>([]);
    // const [rectangles, setRectangles] = useState<Rectangle[]>([]);

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            console.log('Инициализация PIXI app');
            const initApp = async () => {
                const app = new Application();

                await app.init({
                    // background: 0x1099bb,
                    resizeTo: window,
                })
                if (canvasRef.current) {
                    canvasRef.current.appendChild(app.canvas);
                }

                const texture = await Assets.load(imagePlan);
                const background = new Sprite(texture);
                app.stage.addChild(background);

                app.stage.interactive = true;
                app.stage.on('pointerdown', addPoint);

                setNewApp(app);
            };

            initApp();

            return () => newApp?.destroy(true);
        }
    }, []);



    const addPoint = useCallback((event: any) => {
        const { x, y } = event.data.global;

        const distance = (x1: number, y1: number, x2: number, y2: number): number => {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        };

        if (!isDrawing || points.length === 0) {
            setIsDrawing(true);
            setPoints((prevPoints) => [...prevPoints, x, y]);
        } else {
            const distanceToFirstPoint = distance(x, y, points[0], points[1]);
            if (distanceToFirstPoint < 10 && points.length >= 6) {
                setIsDrawing(false);
                const newFigure = [...points, points[0], points[1]];
                setCompletedFigures((prevFigures) => [...prevFigures, newFigure]);
                setPoints([]);
            } else {
                setPoints((prevPoints) => [...prevPoints, x, y]);
            }
        }
    }, [points, isDrawing]);


    useEffect(() => {
        if (newApp) {
            const graphics = new Graphics();
            graphics.clear();

            completedFigures.forEach((figure) => {
                graphics.stroke({ width: 2, color: 0x000000, alpha: 1 }).moveTo(figure[0], figure[1]);
                for (let i = 2; i < figure.length; i += 2) {
                    graphics.lineTo(figure[i], figure[i + 1]);
                }
                graphics.closePath();
            });

            if (isDrawing && points.length > 2) {
                graphics.stroke({width:2, color: 0x000000, alpha: 1}).moveTo(points[0], points[1]);
                for (let i = 2; i < points.length; i += 2) {
                    graphics.lineTo(points[i], points[i + 1]);
                }
            }

            points.forEach((point, index) => {
                if (index % 2 === 0) {
                    graphics.circle(point, points[index + 1], 2);
                }
            });

            graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });
            newApp.stage.addChild(graphics);
        }
    }, [points, newApp, isDrawing, completedFigures]);


    return (
        <>
            <div ref={canvasRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
        </>

    )
};

export default CanvasComponent;
