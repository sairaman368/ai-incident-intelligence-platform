import {
    createContext,
    useContext,
    useMemo,
    useState,
    useCallback
} from "react";

const TimelineContext = createContext(null);

export function TimelineProvider({ children }) {

    const [refreshKey, setRefreshKey] = useState(0);

    const [latestIncident, setLatestIncident] = useState(null);

    const [lastUpdated, setLastUpdated] = useState(null);

    const publishIncident = useCallback((incident) => {

        setLatestIncident(incident);

        setLastUpdated(new Date());

        setRefreshKey((previous) => previous + 1);

    }, []);

    const refreshTimeline = useCallback(() => {

        setLastUpdated(new Date());

        setRefreshKey((previous) => previous + 1);

    }, []);

    const value = useMemo(() => ({

        refreshKey,

        latestIncident,

        lastUpdated,

        refreshTimeline,

        publishIncident

    }), [

        refreshKey,

        latestIncident,

        lastUpdated,

        refreshTimeline,

        publishIncident

    ]);

    return (

        <TimelineContext.Provider value={value}>

            {children}

        </TimelineContext.Provider>

    );

}

export function useTimeline() {

    const context = useContext(TimelineContext);

    if (!context) {

        throw new Error(
            "useTimeline must be used inside TimelineProvider."
        );

    }

    return context;

}