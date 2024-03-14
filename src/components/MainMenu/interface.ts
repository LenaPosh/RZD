import React from "react";

export interface TreeNodeData {
    id: number | string;
    name: string;
    isPseudoElement?: boolean;
    isFloor: boolean;
    children?: TreeNodeData[];

}

export interface TreeNodeProps {
    isChild?: boolean;
    level: number;
    onFloorClick: (floorId: number | string, node?: TreeNodeData) => void;
    $isActive?: boolean;
    isParentActive: boolean;
    activeIds: (number | string)[];
    isFloor: boolean;
}

export interface TreeIconProps {
    hasChildren: boolean;
}

export interface TreeChildrenProps {
    collapsed?: boolean;
}

export interface TreeProps {
    data: TreeNodeData;
    level?: number;
    onFloorClick: (floorId: number | string, node?: TreeNodeData) => void;
    activeFloorId: number | string | null;
    isParentActive: boolean;
    activeIds: (number | string)[];
    renderActions: (node: TreeNodeData) => React.ReactNode;
}



export interface BriefInfoData {
    zoneNumbers: string;
    type: string;
    status: string;
    measurement: string;
    measurementUnit: string;
    userCategory: string;
}

export interface BriefInfoProps {
    info: BriefInfoData | null;
}

export interface ComplexData {
    id: number;
    name: string;
    status: string;
    type: string;
    area: string;
    levels: LevelData[];
}

export interface LevelData {
    id: number;
    name: string;
    zones: ZoneData[];
}

export interface ZoneData {
    id: number;
    name: string;
    status: string;
    type: string;
    squareMeters: number;
    userCategory: string;
}
