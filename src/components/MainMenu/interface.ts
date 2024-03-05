export interface TreeNodeData {
    id: number;
    name: string;
    isPseudoElement?: boolean;
    children?: TreeNodeData[];
}

export interface TreeNodeProps {
    isChild?: boolean;
    level: number;
}

export interface TreeIconProps {
    hasChildren: boolean;
}

export interface TreeChildrenProps {
    collapsed?: boolean;
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
