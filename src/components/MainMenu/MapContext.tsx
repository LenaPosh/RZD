import React from "react";


interface MapContextType {
    isMapActive: boolean;
    setIsMapActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapContext = React.createContext<MapContextType | undefined>(undefined);
export const MapProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isMapActive, setIsMapActive] = React.useState<boolean>(false);

    const value = { isMapActive, setIsMapActive };

    return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = () => {
    const context = React.useContext(MapContext);
    if (context === undefined) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
};
