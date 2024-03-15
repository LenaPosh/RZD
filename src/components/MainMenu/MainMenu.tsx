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
import {ComplexContainer, TreeNode, TreeText, TreeIcon, TreeChildren, StyledCircleGreenSVG, StyledCircleFioletEmptySVG, TreeGroupContainer, Button, ButtonsContainer} from "./styleTree";
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



// const TREE_DATA_URL = "";





const Tree: React.FC<TreeProps> = ({

                                       data,
                                       level = 0,
                                       onFloorClick,
                                       activeFloorId,
                                       isParentActive,
                                       activeIds,
                                       renderActions
                                   }) => {

    // console.log("Рендер узла:", data.id, "Активные ID:", activeIds);
    const [collapsed, setCollapsed] = React.useState(true);
    const isPseudoElement = data.isPseudoElement || level > 1;
    const hasChildren = !isPseudoElement && !!data.children && data.children.length > 0;

    const handleToggle = () => {
        const isZoneOrPseudoElement = !data.isFloor && (data.isPseudoElement || level > 1);

        if (data.isFloor || isZoneOrPseudoElement) {
            onFloorClick(data.id, data);
        }
        setCollapsed(!collapsed);
    };
    // console.log(data.name, data.isPseudoElement);

    const handleArrowClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setCollapsed(!collapsed);
        onFloorClick(data.id, data);
    };
    return (
        <ComplexContainer>
            <TreeGroupContainer $isActive={activeIds.includes(data.id)}>
            {/*<TreeGroupContainer*/}
            {/*    isActive={*/}
            {/*        activeIds.includes(data.id) ||*/}
            {/*        activeIds.some(id => data.children?.some(child => child.id === id))*/}
            {/*    }*/}
            {/*>*/}
                <TreeNode
                    isFloor={data.isFloor}
                    level={level}
                    onClick={handleToggle}
                    $isActive={activeIds.includes(data.id)}
                    isParentActive={isParentActive || activeIds.includes(data.id)}
                    activeIds={activeIds}
                    onFloorClick={onFloorClick}
                >
                    {level > 0 && !data.isFloor && (level === 1 ? <StyledCircleGreenSVG/> : <StyledCircleFioletEmptySVG/>)}
                    <div style={{ flex: 1 }}>
                        <TreeText
                            level={level}
                            isFloor={data.isFloor}
                            isParentActive={isParentActive}
                            activeIds={activeIds}
                            onFloorClick={onFloorClick}
                        >
                            {data.name}
                        </TreeText>
                        {data.isPseudoElement && renderActions && renderActions(data)}
                    </div>
                    <TreeIcon hasChildren={hasChildren} onClick={handleArrowClick}>
                        {hasChildren && !isPseudoElement && (collapsed ? <ArrowUpSVG /> : <ArrowDownSVG />)}
                    </TreeIcon>
                </TreeNode>

                {!collapsed && data.children && (
                    <TreeChildren collapsed={collapsed}>
                        {data.children.map((child) => (
                            <Tree
                                key={child.id}
                                data={child}
                                level={level + 1}
                                onFloorClick={onFloorClick}
                                activeFloorId={activeFloorId}
                                isParentActive={isParentActive || data.id === activeFloorId}
                                activeIds={activeIds}
                                renderActions={renderActions}
                            />
                        ))}

                    </TreeChildren>
                )}
            </TreeGroupContainer>

        </ComplexContainer>

    );
};

export interface ZoneData {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    id: number;
    name?: string;
    zoneId?: number | null;
}

const MainMenu = () => {
    const [activeFloor, setActiveFloor] = useState<number | string | null>(null);
    // const [complexData, setComplexData] = useState<ComplexData | null>(null);
    const [activeIds, setActiveIds] = useState<(number | string)[]>([]);
    const [isDrawingMode, setIsDrawingMode] = useState(false)
    const [activeNode, setActiveNode] = useState<TreeNodeData | null>(null);
    const [currentZoneData, setCurrentZoneData] = useState<ZoneData | null>(null);
    const [rectangles, setRectangles] = useState<ZoneData[]>([]);
    const [activeZoneId, setActiveZoneId] = useState<number | null>(null);
    const [, setSelectedZoneName] = useState<string | null>(null);
    const [currentZoneName, setCurrentZoneName] = useState<string | null>(null);


    const handleFloorClick = (floorId: number | string, node?: TreeNodeData): void => {
        setActiveFloor(floorId);
        setActiveNode(node ? node : null);

        let newActiveIds = [floorId];
        if (node && node.children && node.children.length > 0) {
            newActiveIds = newActiveIds.concat(findAllChildrenIds(node));
        }
        setActiveIds(newActiveIds);

        const zone = rectangles.find(rect => rect.zoneId === floorId);
        if (zone) {
            setActiveZoneId(zone.id);
        } else {
            setActiveZoneId(null);
        }
        if (node) {
            handlePlaceZone(node.name);
        }
    };



    const handleTempRectangleChange = (newRect: ZoneData | null) => {
        setCurrentZoneData(newRect);
    };


    const handlePlaceZone = (zoneName: string) => {
        setIsDrawingMode(true);
        setCurrentZoneName(zoneName);
    };


    const handleSaveZone = () => {
        if (currentZoneData && currentZoneName) {
            const newZone = {
                ...currentZoneData,
                name: currentZoneName
            };
            const updatedZones = [...rectangles, newZone];
            localStorage.setItem('savedZones', JSON.stringify(updatedZones));
            setRectangles(updatedZones);
            setCurrentZoneData(null);
            setCurrentZoneName(null);
        }
    };



    useEffect(() => {
        console.log("Loading saved zones from localStorage");
        const savedZones = JSON.parse(localStorage.getItem('savedZones') || '[]');
        setRectangles(savedZones);
    }, []);

    const handleZoneClick = (zoneId: number | null) => {
        const zone = zoneId !== null ? rectangles.find(rect => rect.id === zoneId) : null;
        if (zone) {
            setSelectedZoneName(zone.name ?? null);
            setActiveZoneId(zone.id);
            console.log("Selected zone name:", zone.name);
        } else {
            setSelectedZoneName(null);
            setActiveZoneId(null);
            console.log("No selected zone name");
        }
        console.log("Zone clicked with ID:", zoneId);
    };





    const findAllChildrenIds = (node: TreeNodeData, ids: (number | string)[] = []): (number | string)[] => {

        ids.push(node.id);
        node.children?.forEach(child => findAllChildrenIds(child, ids));
        return ids;

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
                            {
                                id: 13,
                                name: 'Зона #398: Земля под вокзал дальнего следования',
                                isPseudoElement: true,
                                isFloor: false,
                                children: []
                            },
                            {
                                id: 14,
                                name: 'Зона #398: Земля под вокзал дальнего следования',
                                isPseudoElement: true,
                                isFloor: false,
                                children: []
                            },
                        ],
                    },

                ],
            },
            {
                id: 4,
                name: 'Здание #300: Вокзал пригородного сообщения',
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

    // const [complexData, setComplexData] = useState<ComplexData | null>(null);
    // const fetchComplexData = async () => {
    //     try {
    //         const response = await fetch(TREE_DATA_URL);
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         const data = await response.json();
    //         setComplexData(data);
    //     } catch (error) {
    //         console.error("There was a problem fetching complex data:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchComplexData();
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
                        <Tree
                            data={treeData}
                            level={0}
                            onFloorClick={handleFloorClick}
                            activeFloorId={activeFloor}
                            isParentActive={false}
                            activeIds={activeIds}

                            renderActions={(node) => {
                                // console.log("Активный узел:", activeNode);
                                // console.log("Текущий узел:", node);
                                return (
                                    node.id === activeNode?.id ? (
                                        <ButtonsContainer>
                                            <Button onClick={() => handlePlaceZone(node.name)}>Разместить зону</Button>
                                            <Button onClick={handleSaveZone}>Сохранить</Button>

                                        </ButtonsContainer>
                                    ) : null
                                );
                            }}


                        />
                        {/*{complexData ? <Tree data={complexData} /> : "Loading..."}*/}

                    </Sidebar>
                    <MapAndInfoWrapper>
                        <SearchIDContainer>
                            <SearchInput placeholder="Поиск по ID" />
                        </SearchIDContainer>

                        <CanvasComponent
                            onZoneClick={handleZoneClick}
                            activeZoneId={activeZoneId}
                            rectangles={rectangles}
                            setRectangles={setRectangles}
                            onTempRectangleChange={handleTempRectangleChange}
                            isDrawingMode={isDrawingMode}

                        />



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
