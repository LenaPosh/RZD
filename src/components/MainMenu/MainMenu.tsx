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
    SearchIDContainer
} from "./style";
import { ReactComponent as ArrowDownSVG } from '../icons/arrowDown.svg';
import {TreeNodeData, TreeProps} from "./interface";
import {ComplexContainer, TreeNode, TreeText, TreeIcon, TreeChildren, StyledCircleGreenSVG, StyledCircleFioletEmptySVG} from "./styleTree";
import {BriefInfoText, BriefInfoTitle, BriefInfoContainer, MapAndInfoWrapper, InfoAndLegendWrapper, MapContainer, SearchLegendSVG, BriefInfoContent} from "./styleMapAndInfo";
import {BriefInfoProps, BriefInfoData} from './interface'
import {ComplexData} from "./interface";
import { ReactComponent as TwoDSVG } from '../icons/2D.svg';
import { ReactComponent as ThreeDSVG } from '../icons/3D.svg';
import { ReactComponent as PlusSVG } from '../icons/plus.svg';
import { ReactComponent as MinusSVG } from '../icons/minus.svg';
import { ReactComponent as DistanceSVG } from '../icons/distance.svg';
import styled from "styled-components";

const BRIEF_INFO_URL = "";
const TREE_DATA_URL = "";

const ZoomContainer = styled.div`
  position: absolute;
  top: 10px; 
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F5F5F7;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
`;

const ModeSwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 210px;
  right: 10px;
`;

const IconWrapper = styled.div`
  cursor: pointer;
`;

const BriefInfo: React.FC<BriefInfoProps> = ({ info }) => {
    return (
        <BriefInfoContainer>
            <BriefInfoTitle>Краткая справка по выделенным зонам</BriefInfoTitle>
            <BriefInfoContent>
                {info ? (
                    <>
                        <BriefInfoText>Зоны: {info.zoneNumbers}</BriefInfoText>
                        <BriefInfoText>Тип: {info.type}</BriefInfoText>
                        <BriefInfoText>Статус: {info.status}</BriefInfoText>
                        <BriefInfoText>Измеритель: {info.measurement}</BriefInfoText>
                        <BriefInfoText>Единицы измерения: {info.measurementUnit}</BriefInfoText>
                        <BriefInfoText>Подразделение-пользователь: {info.userCategory}</BriefInfoText>
                    </>
                ) : (
                    <div style={{ flex: 1 }}></div>
                )}
            </BriefInfoContent>

        </BriefInfoContainer>
    );
};

const TreeGroupContainer = styled.div<{ isActive: boolean }>`
  border-radius: 5px;
  background-color: ${(props) => (props.isActive ? 'white' : 'transparent')};
  padding: 5px;
`;


const Tree: React.FC<TreeProps> = ({ data, level = 0, onFloorClick, activeFloorId, isParentActive, activeIds }) => {
    console.log("Рендер узла:", data.id, "Активные ID:", activeIds);
    const [collapsed, setCollapsed] = React.useState(true);
    const isPseudoElement = data.isPseudoElement || level > 1;
    const hasChildren = !isPseudoElement && !!data.children && data.children.length > 0;

    const handleToggle = () => {
        if (data.isFloor) {
            onFloorClick(data.id, data);
        }
        setCollapsed(!collapsed);
    };

    const handleArrowClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setCollapsed(!collapsed);
        onFloorClick(data.id, data);
    };



    return (

        <ComplexContainer>
            <TreeGroupContainer isActive={activeIds.includes(data.id)}>
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
                    isActive={activeIds.includes(data.id)}
                    isParentActive={isParentActive || activeIds.includes(data.id)}
                    activeIds={activeIds}
                    onFloorClick={onFloorClick}
                >
                    {level > 0 && !data.isFloor && (level === 1 ? <StyledCircleGreenSVG/> : <StyledCircleFioletEmptySVG/>)}
                    <TreeText
                        level={level}
                        isFloor={data.isFloor}
                        isParentActive={isParentActive}
                        activeIds={activeIds}
                        onFloorClick={onFloorClick}
                    >
                        {data.name}
                    </TreeText>
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
                            />
                        ))}

                    </TreeChildren>
                )}
            </TreeGroupContainer>

        </ComplexContainer>

    );
};


const MainMenu = () => {
    const [activeFloor, setActiveFloor] = useState<number | string | null>(null);
    const [activeIds, setActiveIds] = useState<(number | string)[]>([]);

    const handleFloorClick = (floorId: number | string, node?: TreeNodeData): void => {
        setActiveFloor(floorId);

        let newActiveIds = [floorId];
        if (node && node.children && node.children.length > 0) {
            newActiveIds = newActiveIds.concat(findAllChildrenIds(node));
        }
        setActiveIds(newActiveIds);
    };




    const findAllChildrenIds = (node: TreeNodeData, ids: (number | string)[] = []): (number | string)[] => {

        console.log(`Добавление ID узла: ${node.id}. Текущий список ID:`, ids);
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
                                isFloor: false,
                                children: []
                            },
                            {
                                id: 14,
                                name: 'Зона #2',
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
                                isFloor: false,
                                children: []
                            },
                            {
                                id: 14,
                                name: 'Зона #398: Земля под вокзал дальнего следования',
                                isFloor: false,
                                children: []
                            },
                        ],
                    },

                    {
                        id: 8,
                        name: 'Подэлемент 2 участка #1',
                        isFloor: false,
                        children: []
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
                        isFloor: false,
                        children: []
                    },
                    {
                        id: 12,
                        name: 'Подэлемент 3 участка #1',
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
                        />
                        {/*{complexData ? <Tree data={complexData} /> : "Loading..."}*/}

                    </Sidebar>
                    <MapAndInfoWrapper>
                        <SearchIDContainer>
                            <SearchInput placeholder="Поиск по ID" />
                        </SearchIDContainer>
                        <MapContainer>

                        </MapContainer>
                        <InfoAndLegendWrapper>
                            <BriefInfo info={briefInfo}/>
                            <SearchLegendSVG/>
                        </InfoAndLegendWrapper>


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
