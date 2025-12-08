import React, { createContext, useContext, useState } from "react";

const SelectedWorkerContext = createContext(null);

export function SelectedWorkerProvider({ children }) {
    const [selectedWorker, setSelectedWorker] = useState(null);

    return (
        <SelectedWorkerContext.Provider value={{ selectedWorker, setSelectedWorker }}>
            {children}
        </SelectedWorkerContext.Provider>
    );
}

export function useSelectedWorker() {
    return useContext(SelectedWorkerContext);
}
