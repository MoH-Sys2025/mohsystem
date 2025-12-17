import React, { createContext, useContext, useState } from "react";

const SelectedWorkerContext = createContext(null);

export function SelectedMOHDataProvider({ children }) {
    const [selectedMOHData, setSelectedMOHData] = useState(null);

    return (
        <SelectedWorkerContext.Provider value={{ selectedMOHData, setSelectedMOHData }}>
            {children}
        </SelectedWorkerContext.Provider>
    );
}

export function useSelectedMOHData() {
    return useContext(SelectedWorkerContext);
}
