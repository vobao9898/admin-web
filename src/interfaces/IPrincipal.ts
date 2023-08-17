import IState from "./IState";
import IArrayOldData from "interfaces/IArrayOldData";

interface IPrincipal {
    principalId: number;
    status: number;
    firstName: string;
    lastName: string;
    title: string;
    ownerShip: number;
    homePhone: string;
    mobilePhone: string;
    yearAddress: string;
    ssn: string;
    birthDate: string;
    driverNumber: string;
    fileId: number;
    city: string;
    merchants: number;
    zip: string;
    codeHomePhone: number;
    codeMobilePhone: number;
    address: string;
    state: IState;
    stateId: number;
    email: string;
    imageUrl: string;
    stateIssuedName: string;
    stateIssued: number;
    arrayOldData: IArrayOldData[];
    yearAtThisAddress: string;
    driverLicense: string;
}

export default IPrincipal;
