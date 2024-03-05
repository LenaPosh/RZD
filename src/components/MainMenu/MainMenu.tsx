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
import {TreeNodeData} from "./interface";
import {ComplexContainer, TreeNode, TreeText, TreeIcon, TreeChildren, StyledCircleGreenSVG, StyledCircleFioletEmptySVG} from "./styleTree";
import {BriefInfoText, BriefInfoTitle, BriefInfoContainer, MapAndInfoWrapper, InfoAndLegendWrapper, MapContainer, SearchLegendSVG, BriefInfoContent} from "./styleMapAndInfo";
import {BriefInfoProps, BriefInfoData} from './interface'
import {ComplexData} from "./interface";

const BRIEF_INFO_URL = "";
const TREE_DATA_URL = "";

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




const Tree: React.FC<{ data: TreeNodeData; level?: number }> = ({ data, level = 0 }) => {
    const [collapsed, setCollapsed] = React.useState(true);
    const isPseudoElement = data.isPseudoElement || level > 1;
    const hasChildren = !isPseudoElement && !!data.children && data.children.length > 0;

    return (
        <ComplexContainer>
            <TreeNode onClick={() => hasChildren && setCollapsed(!collapsed)} level={level}>
                {level > 0 && (level === 1 ? <StyledCircleGreenSVG/> : <StyledCircleFioletEmptySVG/>)}
                <TreeText level={level}>{data.name}</TreeText>
                <TreeIcon hasChildren={hasChildren}>
                    {hasChildren && !isPseudoElement && (collapsed ? <ArrowUpSVG /> : <ArrowDownSVG />)}
                </TreeIcon>

            </TreeNode>
            {!collapsed && data.children && (
                <TreeChildren collapsed={collapsed}>
                    {data.children.map((child) => (
                        <Tree key={child.id} data={child} level={level + 1} />
                    ))}
                </TreeChildren>
            )}
        </ComplexContainer>
    );
};


const MainMenu = () => {
    // const treeData = {
    //     id: 1,
    //     name: 'Комплекс #2: Киевский вокзал (внеклассный)',
    //     children: [
    //         {
    //             id: 2,
    //             name: 'Земельный участок #5275: Земельный участок Киевского вокзала',
    //             children: [
    //                 {
    //                     id: 5,
    //                     name: 'Зона #398: Земля под вокзал дальнего следования',
    //                     isPseudoElement: true,
    //                     children: []
    //                 },
    //                 {
    //                     id: 6,
    //                     name: 'Подэлемент 2 участка #1',
    //                     children: []
    //                 },
    //
    //             ],
    //         },
    //         {
    //             id: 3,
    //             name: 'Здание #300: Вокзал дальнего сообщения',
    //             children: [
    //                 {
    //                     id: 7,
    //                     name: 'Зона #398: Земля под вокзал дальнего следования',
    //                     isPseudoElement: true,
    //                     children: []
    //                 },
    //                 {
    //                     id: 8,
    //                     name: 'Подэлемент 2 участка #1',
    //                     children: []
    //                 },
    //                 {
    //                     id: 9,
    //                     name: 'Подэлемент 3 участка #1',
    //                     children: []
    //                 },
    //             ],
    //         },
    //         {
    //             id: 4,
    //             name: 'Здание #300: Вокзал пригородного сообщения',
    //             children: [
    //                 {
    //                     id: 10,
    //                     name: 'Зона #398: Земля под вокзал дальнего следования',
    //                     isPseudoElement: true,
    //                     children: []
    //                 },
    //                 {
    //                     id: 11,
    //                     name: 'Подэлемент 2 участка #1',
    //                     children: []
    //                 },
    //                 {
    //                     id: 12,
    //                     name: 'Подэлемент 3 участка #1',
    //                     children: []
    //                 },
    //             ],
    //         },
    //     ],
    // };

    const [briefInfo, setBriefInfo] = React.useState<BriefInfoData | null>(null);
    const fetchBriefInfo = async () => {

        const response = await fetch(BRIEF_INFO_URL);
        const data = await response.json();
        setBriefInfo(data);
    };

    React.useEffect(() => {
        fetchBriefInfo();
    }, []);

    const [complexData, setComplexData] = useState<ComplexData | null>(null);
    const fetchComplexData = async () => {
        try {
            const response = await fetch(TREE_DATA_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setComplexData(data);
        } catch (error) {
            console.error("There was a problem fetching complex data:", error);
        }
    };

    useEffect(() => {
        fetchComplexData();
    }, []);

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
                        {/*<Tree data={treeData} />*/}
                        {complexData ? <Tree data={complexData} /> : "Loading..."}

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



                </Content>
            </Layout>
        </>
    );
};

export default MainMenu;
