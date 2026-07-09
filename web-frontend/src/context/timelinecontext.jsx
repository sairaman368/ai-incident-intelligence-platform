import { createContext, useContext, useState } from "react";

const TimelineContext = createContext();

export function TimelineProvider({ children }) {
    const [refreshCounter, setRefreshCounter] = useState(0);

    const refreshTimeline = () => {
        setRefreshCounter((value) => value + 1);
    };

    return (
        <TimelineContext.Provider
            value={{
                refreshCounter,
                refreshTimeline,
            }}
        >
            {children}
        </TimelineContext.Provider>
    );
}

export function useTimeline() {
    return useContext(TimelineContext);
}