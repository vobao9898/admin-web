import React from "react";
import { IState, IAction } from "./Reducer";

const ConfirmContext = React.createContext<[IState, React.Dispatch<IAction>] | null>(null);

export default ConfirmContext;
