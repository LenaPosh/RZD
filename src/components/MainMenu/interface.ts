import React from "react";

export interface TreeNodeData {
    id: number | string;
    name: string;
    isPseudoElement?: boolean;
    isFloor: boolean;
    level?: number;
    children?: TreeNodeData[];
}

export interface TreeNodeProps {
    isChild?: boolean;
    $level: number;
    $onFloorClick: (floorId: number | string, node?: TreeNodeData) => void;
    $isActive?: boolean;
    $isParentActive: boolean;
    $activeIds: (number | string)[];
    $isFloor: boolean;
}

export interface TreeIconProps {
    $hasChildren: boolean;
}

export interface TreeChildrenProps {
    $collapsed?: boolean;
}

export interface TreeProps {
    data: TreeNodeData;
    level?: number;
    onFloorClick: (floorId: number | string, node?: TreeNodeData) => void;
    activeFloorId: number | string | null;
    isParentActive: boolean;
    activeIds: (number | string)[];
    renderActions: (node: TreeNodeData) => React.ReactNode;
    activeZoneId: number | null;
    onZoneHover: (zoneId: number | null) => void;
    onNavigateToZone?: (zoneId: number) => void;
    // collapsedNodes: {[key: number | string]: boolean};
    // setCollapsedNodes: React.Dispatch<React.SetStateAction<{[key: number | string]: boolean}>>;
    setActiveFloor: (floorId: number | string | null) => void;
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


export interface ZoneData {
    id: number;
    name: string;
    status: string;
    type: string;
    squareMeters: number;
    userCategory: string;
}
