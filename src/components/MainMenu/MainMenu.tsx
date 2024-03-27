import React, {useEffect, useState} from 'react';
import {GlobalStyle} from "../TopMenu";
import { ReactComponent as ArrowUpSVG } from '../icons/arrowUp.svg';
import {
    Layout,
    Content,
    StyledBurgerSortSVG,
    SearchAndSortContainer,
    SearchInputContainer,
    SortInputContainer,
    SearchInput,
    SearchIcon,
    SortInput,
    ArrowIcon,
    Sidebar,
    SearchIDContainer, ZoomContainer, ModeSwitchContainer, IconWrapper
} from "./style";
import { ReactComponent as ArrowDownSVG } from '../icons/arrowDown.svg';
import {TreeNodeData, TreeProps} from "./interface";
import {
    ComplexContainer,
    TreeNode,
    TreeText,
    TreeIcon,
    TreeChildren,
    StyledCircleGreenSVG,
    StyledCircleVioletEmptySVG,
    TreeGroupContainer,
    Button,
    TreeTextContainer
} from "./styleTree";
import {MapAndInfoWrapper, InfoAndLegendWrapper, SearchLegendSVG} from "./styleMapAndInfo";
import {BriefInfoData} from './interface'
// import {ComplexData} from "./interface";
import { ReactComponent as TwoDSVG } from '../icons/2D.svg';
import { ReactComponent as ThreeDSVG } from '../icons/3D.svg';
import { ReactComponent as PlusSVG } from '../icons/plus.svg';
import { ReactComponent as MinusSVG } from '../icons/minus.svg';
import { ReactComponent as DistanceSVG } from '../icons/distance.svg';
import {BRIEF_INFO_URL} from "./BriefInfo";
import {BriefInfo} from "./BriefInfo";
import CanvasComponent from "./CanvasComponent";
// import axios from "axios";

import zoneDataImg from "./zoneData";
import {ReactComponent as ButtonGoSVG} from '../icons/buttonGo.svg'
import {ReactComponent as ButtonPlusSVG} from "../icons/buttonPlus.svg";
import {ReactComponent as ButtonSaveSVG} from "../icons/buttonSave.svg";
import {ReactComponent as ButtonEditSVG} from "../icons/buttonEdit.svg";


// const TREE_DATA_URL = "";

const Tree: React.FC<TreeProps> = React.memo(({
    data,
    level = 0,
    onFloorClick,
    activeFloorId,
    isParentActive,
    activeIds,
    activeZoneId,
    // renderActions,
    onZoneHover,
    onNavigateToZone,
    setActiveFloor, buttonGroup
    // onAdd, onEdit, onSave, onEditSave
    }) => {

    console.log("Рендер компонента Tree", { data, activeIds, activeZoneId });
    const [collapsed, setCollapsed] = React.useState(false);
    const isPseudoElement = data.isPseudoElement || level > 1;
    const hasChildren = !isPseudoElement && !!data.children && data.children.length > 0;
    const [isParentClicked, setIsParentClicked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [clickedChild, setClickedChild] = useState<number | null>(null);


    // const handleToggle = () => {
    //     const isZoneOrPseudoElement = !data.isFloor && (data.isPseudoElement || level > 1);
    //     if (data.isFloor || isZoneOrPseudoElement) {
    //         onFloorClick(data.id, data);
    //     }
    //     if (level === 1) {
    //         setIsParentClicked(!isParentClicked);
    //     }
    // };
    const handleToggle = () => {
        setCollapsed(!collapsed);

        if (level === 2) {
            setClickedChild(Number(data.id));
        } else if (level === 1) {
            setIsParentClicked(!isParentClicked);
            setClickedChild(null);
        }

        onFloorClick(data.id, data);
    };



    const handleArrowClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setCollapsed(!collapsed);

        if (level === 1) {
            setIsParentClicked(!collapsed);
        }
        onFloorClick(data.id, data);
    };

    const handleMouseEnter = (zoneId: number) => {
        console.log(`handleMouseEnter: ${zoneId}`, { hoveredId, isHovered });
        setHoveredId(zoneId);
        setIsHovered(true);
        if (activeZoneId !== zoneId) {
            onZoneHover(zoneId);
        }
    };

    const handleMouseLeave = () => {
        console.log("handleMouseLeave", { hoveredId, isHovered });
        setHoveredId(null);
        onZoneHover(null);
    };

    const containsActiveId = (node: TreeNodeData, activeIds: Array<number | string>): boolean => {

        if (activeIds.includes(node.id)) {
            console.log(`containsActiveId: ${node.id}`, { isActive: activeIds.includes(node.id) });
            return true;
        }
        if (node.children) {
            return node.children.some(child => containsActiveId(child, activeIds));
        }
        return false;
    };


    const checkIsParentOfActive = (nodeId: number | string, activeIds: Array<number | string>, currentNode: TreeNodeData): boolean => {

        const findNodeById = (node: TreeNodeData, id: number | string): TreeNodeData | null => {
            if (node.id === id) return node;
            if (node.children) {
                for (const child of node.children) {
                    const found = findNodeById(child, id);
                    if (found) return found;
                }
            }
            return null;
        };

        const node = findNodeById(currentNode, nodeId);
        const isParentActive = !!node && containsActiveId(node, activeIds);
        // console.log(`Is node ${nodeId} a parent of active node: ${isParentActive}`);
        return isParentActive;

    };

    const isParentOfActiveNode = checkIsParentOfActive(data.id, activeIds, data);

    const isChildNode = level === 2;
    console.log(`TreeText render: ${data.id}`, {
        backgroundColor: hoveredId === data.id ? 'rgba(255,255,255,0.8)' : 'transparent',
        isHovered: hoveredId === data.id,
    });
    return (
        <ComplexContainer>
            <TreeGroupContainer $isActive={activeIds.includes(data.id)  || data.id === activeZoneId}>

                <TreeNode
                    $isFloor={data.isFloor}
                    $level={level}
                    onClick={handleToggle}
                    $isActive={activeIds.includes(data.id)}
                    $activeIds={activeIds}
                    $onFloorClick={onFloorClick}
                    $isParentActive={isParentActive || isParentOfActiveNode}
                >
                    {level > 0 && !data.isFloor && (level === 1 ? <StyledCircleGreenSVG/> : <StyledCircleVioletEmptySVG/>)}
                    <div style={{ flex: 1 }}>
                        <TreeTextContainer>
                            <TreeText
                                $level={level}
                                $isFloor={data.isFloor}
                                $isParentActive={isParentActive}
                                $activeIds={activeIds}
                                $onFloorClick={onFloorClick}
                                onClick={handleToggle}
                                onMouseEnter={() => {
                                    handleMouseEnter(Number(data.id));
                                }}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    backgroundColor: hoveredId === data.id ? 'rgba(255,255,255,0.8)' : 'transparent',
                                    transition: 'background-color 0.3s ease',
                                }}
                            >

                                {data.name}
                            </TreeText>
                            {level === 1 && hasChildren && isParentClicked && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button onClick={() => {
                                        onNavigateToZone?.(Number(data.id));
                                    }}>
                                        <ButtonGoSVG/>
                                    </Button>
                                </div>
                            )}
                            {isChildNode && buttonGroup(data.id, clickedChild)}



                        </TreeTextContainer>


                        {data.isPseudoElement}
                    </div>
                    <TreeIcon $hasChildren={hasChildren} onClick={handleArrowClick}>
                        {hasChildren && !isPseudoElement && (collapsed ? <ArrowUpSVG /> : <ArrowDownSVG />)}
                    </TreeIcon>
                </TreeNode>

                {!collapsed && data.children && (
                    <TreeChildren $collapsed={collapsed}>
                        {data.children.map((child) => (
                            <Tree
                                key={child.id}
                                data={child}
                                level={level + 1}
                                onFloorClick={onFloorClick}
                                activeFloorId={activeFloorId}
                                isParentActive={isParentActive || isParentOfActiveNode}
                                activeIds={activeIds}
                                activeZoneId={activeZoneId}
                                onZoneHover={onZoneHover}
                                onNavigateToZone={onNavigateToZone}
                                setActiveFloor={setActiveFloor}
                                buttonGroup={buttonGroup}

                            />
                        ))}

                    </TreeChildren>
                )}
            </TreeGroupContainer>

        </ComplexContainer>

    );
});



export interface ZoneData {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    id: number;
    name?: string;
    zoneId?: number | null;
}

const MainMenu = () => {
    const [activeFloor, setActiveFloor] = useState<number | string | null>(null);
    // const [complexData, setComplexData] = useState<ComplexData | null>(null);
    const [activeIds, setActiveIds] = useState<(number | string)[]>([]);
    const [isDrawingMode, setIsDrawingMode] = useState(false)
    const [, setActiveNode] = useState<TreeNodeData | null>(null);
    const [currentZoneData, setCurrentZoneData] = useState<ZoneData | null>(null);
    const [rectangles, setRectangles] = useState<ZoneData[]>([]);
    const [activeZoneId, setActiveZoneId] = useState<number | null>(null);
    const [, setSelectedZoneName] = useState<string | null>(null);
    const [currentZoneName, setCurrentZoneName] = useState<string | null>(null);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);
    const [activeMapId, setActiveMapId] = useState<number | null>(null);
    const [activeMapUrl, setActiveMapUrl] = useState("");
    const [isHighlightActive, setIsHighlightActive] = useState(true);
    const [isSaveMode, setIsSaveMode] = useState(false);

    const findZoneRectangle = (zoneId: number | null) => {
        return rectangles.find(rect => rect.zoneId === zoneId);
    };

    const handleFloorClick = (floorId: number | string, node?: TreeNodeData): void => {
        setActiveFloor(floorId);
        setActiveNode(node ? node : null);

        if (node && node.children) {
            const isParentNode = typeof node.isFloor !== 'undefined' && !node.isFloor;

            if (isParentNode) {
                const childIds = node.children?.map(child => child.id) || [];
                setActiveIds([floorId, ...childIds]);
            }
        } else {
            setActiveIds(prevActiveIds => {
                const newActiveIds = prevActiveIds.includes(floorId)
                    ? prevActiveIds.filter(id => id !== floorId)
                    : [...prevActiveIds, floorId];
                return newActiveIds;
            });
        }

        if (node && node.isPseudoElement) {
            const numericFloorId = typeof floorId === 'string' ? parseInt(floorId, 10) : floorId;
            const zoneRectangle = findZoneRectangle(numericFloorId);

            if (zoneRectangle) {
                setActiveZoneId(zoneRectangle.id);
                setIsDrawingMode(false);
                setCurrentZoneName(zoneRectangle.name ?? null);
            } else {
                setActiveZoneId(numericFloorId);
                // setIsDrawingMode(true);
                setCurrentZoneName(node.name);
            }
        }
    };



    const handleZoneClick = (zoneId: number | null) => {
        const zoneRectangle = rectangles.find(rect => rect.zoneId === zoneId);
        if (zoneRectangle) {
            setActiveZoneId(zoneRectangle.id);
            setIsDrawingMode(false);
            setSelectedZoneName(zoneRectangle.name ?? "");
        } else {
            setActiveZoneId(null);
            setIsDrawingMode(true);
            setSelectedZoneName("");
        }
    };


    const handleTempRectangleChange = (newRect: ZoneData | null) => {
        setCurrentZoneData(newRect);
    };



    const handleSaveZone = (nodeId: number | string) => {
        // console.log('Вызов handleSaveZone');
        if (currentZoneData && currentZoneName) {
            const index = rectangles.findIndex(rect => rect.id === currentZoneData.id);
            let updatedZones;
            if (index !== -1) {
                updatedZones = [...rectangles];
                updatedZones[index] = { ...currentZoneData, name: currentZoneName };
            } else {
                updatedZones = [...rectangles, { ...currentZoneData, name: currentZoneName }];
            }

            localStorage.setItem('savedZones', JSON.stringify(updatedZones));
            setRectangles(updatedZones);
            // console.log('Зоны сохранены в localStorage');
            setCurrentZoneData(null);
            setSelectedZoneName(null);
            setActiveIds([]);
        } else {
            // console.log('Данные зоны или имя зоны отсутствуют');
        }
        setIsDrawingMode(false);
    };


    //
    // useEffect(() => {
    //     const savedZones = JSON.parse(localStorage.getItem('savedZones') || '[]');
    //     console.log("Loaded zones from localStorage", savedZones);
    //     setRectangles(savedZones);
    // }, []);

    const handleNavigateToZone = (zoneId: number | null) => {
        if (zoneId !== null && !activeIds.includes(zoneId)) {
            setActiveIds(prevActiveIds => [...prevActiveIds, zoneId]);
        }

        const zone = zoneDataImg.zones.find(z => z.id === zoneId);
        if (zone) {
            setActiveMapId(zone.id);
            setActiveMapUrl(zone.image);
            setIsHighlightActive(false);
        }

        setHoveredZoneId(null);
    };





    const handleSelectedZoneNameChange = (newName: string) => {
        setCurrentZoneName(newName);
    };




    const handleZoneHover = (zoneId: number | null) => {
        setHoveredZoneId(zoneId);
    };

    const handleStartDrawing = (nodeId: number | string) => {
        setIsDrawingMode(true);
    };
    //
    // useEffect(() => {
    //     if (isDrawingMode) {
    //         setIsDrawingStarted(true);
    //     }
    // }, [isDrawingMode]);



    useEffect(() => {
        console.log("Режим рисования изменен на:", isDrawingMode);
    }, [isDrawingMode]);


    const handleDeleteRectangle = (rectId: number | string) => {
        console.log(`Attempting to delete rectangle with ID: ${rectId}`);
        setRectangles(rectangles.filter(rect => rect.id !== rectId));
        setIsSaveMode(true);
    };


    const buttonGroup = (nodeId: number | string, clickedChild: number | string | null) => {
        console.log(`buttonGroup: nodeId=${nodeId}, clickedChild=${clickedChild}, isDrawingMode=${isDrawingMode}, isSaveMode=${isSaveMode}`);
        if (clickedChild === nodeId) {
            if (!isDrawingMode && !isSaveMode) {

                return (
                    <>
                        <Button onClick={() => handleStartDrawing(nodeId)}>
                            <ButtonPlusSVG />
                        </Button>
                        <Button onClick={() => handleDeleteRectangle(nodeId)}>
                            <ButtonEditSVG />
                        </Button>
                    </>
                );
            } else if (isDrawingMode || isSaveMode) {
                return (
                    <Button onClick={() => handleSaveZone(nodeId)}>
                        <ButtonSaveSVG />
                    </Button>
                );
            }
        }
        return null;
    };









    const treeData = {
        id: 1,
        name: 'Комплекс #2: Киевский вокзал (внеклассный)',
        isFloor: false,
        children: [
            {
                id: 2,
                name: 'Земельный участок #5275: Земельный участок Киевского вокзала',
                isFloor: false,
                children: [
                    {
                        id: 5,
                        name: 'Зона #398: Земля под вокзал дальнего следования',
                        isPseudoElement: true,
                        isFloor: false,
                        children: []
                    },
                    {
                        id: 6,
                        name: 'Подэлемент 2 участка #1',
                        isPseudoElement: true,
                        isFloor: false,
                        children: []
                    },

                ],
            },
            {
                id: 3,
                name: 'Здание #300: Вокзал дальнего сообщения',
                isFloor: false,
                children: [
                    {
                        id: 31,
                        name: 'Этаж 1',
                        isFloor: true,
                        children: [
                            {
                                id: 13,
                                name: 'Зона #1',
                                isPseudoElement: true,
                                isFloor: false,
                                children: []
                            },
                            {
                                id: 14,
                                name: 'Зона #2',
                                isPseudoElement: true,
                                isFloor: false,
                                children: []
                            },
                        ],
                    },
                    {
                        id: 32,
                        name: 'Этаж 2',
                        isFloor: true,
                        children: [
                            // {
                            //     id: 14,
                            //     name: 'Зона #398: Земля под вокзал дальнего следования',
                            //     isPseudoElement: true,
                            //     isFloor: false,
                            //     children: []
                            // },
                        ],
                    },

                ],
            },
            {
                id: 4,
                name: 'Здание #666: Вокзал пригородного сообщения',
                isFloor: false,
                children: [
                    {
                        id: 10,
                        name: 'Зона #398: Земля под вокзал дальнего следования',
                        isPseudoElement: true,
                        isFloor: false,
                        children: []
                    },
                    {
                        id: 11,
                        name: 'Подэлемент 2 участка #1',
                        isPseudoElement: true,
                        isFloor: false,
                        children: []
                    },
                    {
                        id: 12,
                        name: 'Подэлемент 3 участка #1',
                        isPseudoElement: true,
                        isFloor: false,
                        children: []
                    },
                ],
            },
        ],
    };

    const [briefInfo, setBriefInfo] = React.useState<BriefInfoData | null>(null);
    const fetchBriefInfo = async () => {
        const response = await fetch(BRIEF_INFO_URL);
        const data = await response.json();
        setBriefInfo(data);
    };

    React.useEffect(() => {
        fetchBriefInfo();
    }, []);

    // const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
    // const transformData = (serverData: TreeNodeData): TreeNodeData => {
    //     return {
    //         id: serverData.id,
    //         name: serverData.name,
    //         isFloor: serverData.isFloor,
    //         children: serverData.children?.map(child => ({
    //             id: child.id,
    //             name: child.name,
    //             isPseudoElement: child.isPseudoElement || false,
    //             isFloor: child.isFloor,
    //             children: child.children || []
    //         })) || []
    //     };
    // };
    //
    // const fetchTreeData = async (): Promise<TreeNodeData> => {
    //     try {
    //         const response = await axios.get<TreeNodeData>('https://dev.platformvim.org/api/create_tree?oject_id=1', {
    //             headers: {
    //                 'Accept': 'application/json',
    //             },
    //         });
    //         const rawData = response.data;
    //
    //         const transformNode = (node: any) => {
    //             if (node.isPseudoElement === undefined) {
    //                 node.isPseudoElement = false;
    //             }
    //
    //             if (node.children && node.children.length > 0) {
    //                 node.children = node.children.map(transformNode);
    //             }
    //
    //             return node;
    //         };
    //
    //         const transformedData = transformNode(rawData);
    //
    //         console.log("Преобразованные данные дерева:", transformedData);
    //         return transformedData;
    //     } catch (error) {
    //         console.error("Произошла ошибка при загрузке данных дерева:", error);
    //         throw error;
    //
    //     }
    // };
    //
    // useEffect(() => {
    //     fetchTreeData()
    //         .then(transformedData => {
    //             setTreeData(transformedData);
    //         })
    //         .catch(error => {
    //             console.error("Произошла ошибка при загрузке данных дерева:", error);
    //         });
    // }, []);



    const handleZoomIn = () => {
        console.log("Увеличить масштаб карты");
    };

    const handleZoomOut = () => {
        console.log("Уменьшить масштаб карты");
    };

    const handleSwitchTo2D = () => {
        console.log("Переключиться в 2D режим");
    };

    const handleSwitchTo3D = () => {
        console.log("Переключиться в 3D режим");
    };




    return (
        <>
            <GlobalStyle/>
            <Layout>
                <Content>
                    <Sidebar>
                        <SearchAndSortContainer>
                            <SearchInputContainer>
                                <SearchInput placeholder="Поиск" />
                                <SearchIcon />
                            </SearchInputContainer>
                            <SortInputContainer>
                                <SortInput placeholder="Сортировка" />
                                <ArrowIcon />
                            </SortInputContainer>
                            <StyledBurgerSortSVG />
                        </SearchAndSortContainer>
                        {/*{*/}
                        {/*    treeData ? (*/}
                                <Tree
                                    data={treeData}
                                    level={0}
                                    onFloorClick={handleFloorClick}
                                    activeFloorId={activeFloor}
                                    isParentActive={false}
                                    activeIds={activeIds}
                                    activeZoneId={activeZoneId}
                                    onZoneHover={handleZoneHover}
                                    onNavigateToZone={handleNavigateToZone}
                                    setActiveFloor={setActiveFloor}
                                    buttonGroup={buttonGroup}

                                />
                        {/*    ) : (*/}
                        {/*        "Loading..."*/}
                        {/*    )*/}
                        {/*}*/}

                    </Sidebar>
                    <MapAndInfoWrapper>
                        <SearchIDContainer>
                            <SearchInput placeholder="Поиск по ID" />
                        </SearchIDContainer>

                        {/*{activeMapId && (*/}
                        <CanvasComponent
                            onZoneClick={handleZoneClick}
                            activeZoneId={activeZoneId}
                            rectangles={rectangles}
                            setRectangles={setRectangles}
                            onTempRectangleChange={handleTempRectangleChange}
                            isDrawingMode={isDrawingMode}
                            setActiveIds={setActiveIds}
                            setActiveZoneId={setActiveZoneId}
                            selectedZoneName={currentZoneName}
                            onSelectedZoneNameChange={handleSelectedZoneNameChange}
                            isDeleteMode={isDeleteMode}
                            // resetCurrentZoneData={resetCurrentZoneData}
                            // resetSelectedZoneName={resetSelectedZoneName}
                            hoveredZoneId={hoveredZoneId}
                            activeMapId={activeMapId}
                            activeMapUrl={activeMapUrl}
                            isHighlightActive={isHighlightActive}


                        />
                        {/*)}*/}


                        <InfoAndLegendWrapper>
                            <BriefInfo info={briefInfo}/>
                            <SearchLegendSVG/>
                        </InfoAndLegendWrapper
                        >


                    </MapAndInfoWrapper>
                    <ZoomContainer>
                        <IconWrapper  onClick={handleZoomIn}>
                            <PlusSVG/>
                        </IconWrapper>
                        <IconWrapper onClick={handleZoomOut}>
                            <MinusSVG />
                        </IconWrapper>
                        <IconWrapper>
                            <DistanceSVG/>
                        </IconWrapper>

                    </ZoomContainer>

                    <ModeSwitchContainer>
                        <IconWrapper onClick={handleSwitchTo2D}>
                            <TwoDSVG />
                        </IconWrapper>
                        <IconWrapper onClick={handleSwitchTo3D}>
                            <ThreeDSVG />
                        </IconWrapper>

                    </ModeSwitchContainer>

                </Content>
            </Layout>
        </>
    );
};

export default MainMenu;
