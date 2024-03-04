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