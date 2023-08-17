import React, { useReducer } from "react";
import GlobalContext from "./GlobalContext";
import { initialState, reducer } from "./Reducer";

export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <GlobalContext.Provider value={[state, dispatch]}>{children}</GlobalContext.Provider>;
}
