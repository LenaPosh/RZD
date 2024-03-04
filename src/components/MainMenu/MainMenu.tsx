import React from 'react';
import {GlobalStyle} from "../TopMenu";
import { ReactComponent as ArrowUpSVG } from '../icons/arrowUp.svg';
import {Layout, Content, StyledBurgerSortSVG, SearchAndSortContainer, SearchInputContainer, SortInputContainer, SearchInput, SearchIcon, SortInput, ArrowIcon, Sidebar} from "./style";
import { ReactComponent as ArrowDownSVG } from '../icons/arrowDown.svg';
import {TreeNodeData} from "./interface";
import {ComplexContainer, TreeNode, TreeText, TreeIcon, TreeChildren, StyledCircleGreenSVG, StyledCircleFioletEmptySVG} from "./styleTree";
import {BriefInfoText, BriefInfoTitle, BriefInfoContainer, MapAndInfoWrapper, InfoAndLegendWrapper, MapContainer, SearchLegendSVG} from "./styleMapAndInfo";
import {BriefInfoProps, BriefInfoData} from './interface'

const BriefInfo: React.FC<BriefInfoProps> = ({ info }) => {
    return (
        <BriefInfoContainer>
            <BriefInfoTitle>Краткая справка по выделенным зонам</BriefInfoTitle>
            {info ? (
                <>
                    <BriefInfoText>Зоны: {info.zoneNumbers}</BriefInfoText>
                    <BriefInfoText>Тип: {info.type}</BriefInfoText>
                    <BriefInfoText>Статус: {info.status}</BriefInfoText>
                </>
            ) : (
                <div style={{ flex: 1 }}></div>
            )}
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
    const treeData = {
        id: 1,
        name: 'Комплекс #2: Киевский вокзал (внеклассный)',
        children: [
            {
                id: 2,
                name: 'Земельный участок #5275: Земельный участок Киевского вокзала',
                children: [
                    {
                        id: 5,
                        name: 'Зона #398: Земля под вокзал дальнего следования',
                        isPseudoElement: true,
                        children: []
                    },
                    {
                        id: 6,
                        name: 'Подэлемент 2 участка #1',
                        children: []
                    },

                ],
            },
            {
                id: 3,
                name: 'Здание #300: Вокзал дальнего сообщения',
                children: [
                    {
                        id: 7,
                        name: 'Зона #398: Земля под вокзал дальнего следования',
                        isPseudoElement: true,
                        children: []
                    },
                    {
                        id: 8,
                        name: 'Подэлемент 2 участка #1',
                        children: []
                    },
                    {
                        id: 9,
                        name: 'Подэлемент 3 участка #1',
                        children: []
                    },
                ],
            },
            {
                id: 4,
                name: 'Здание #300: Вокзал пригородного сообщения',
                children: [
                    {
                        id: 10,
                        name: 'Зона #398: Земля под вокзал дальнего следования',
                        isPseudoElement: true,
                        children: []
                    },
                    {
                        id: 11,
                        name: 'Подэлемент 2 участка #1',
                        children: []
                    },
                    {
                        id: 12,
                        name: 'Подэлемент 3 участка #1',
                        children: []
                    },
                ],
            },
        ],
    };

    const [briefInfo, setBriefInfo] = React.useState<BriefInfoData | null>(null);

    const fetchBriefInfo = async () => {

        const response = await fetch('url');
        const data = await response.json();
        setBriefInfo(data);
    };

    React.useEffect(() => {
        fetchBriefInfo();
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
                        <Tree data={treeData} />
                    </Sidebar>
                    <MapAndInfoWrapper>
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
