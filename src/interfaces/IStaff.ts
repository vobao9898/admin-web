import IProductSalaries from "./IProductSalaries";
import ISalaries from "./ISalaries";
import ITipFees from "./ITipFees";
import IWorkingTimes from "./IWorkingTimes";

interface IStaff {
    staffId: number;
    workingStatus: number;
    firstName: string;
    email: string;
    phone: string;
    pin: string;
    address: string;
    city: string;
    stateId: number;
    lastName: string;
    displayName: string;
    fileId: number;
    isActive: boolean;
    isVisible: boolean;
    isDeleted: number;
    isDisabled: number;
    zip: string;
    cashPercent: string;
    colorCode: string;
    birthdate: string;
    gender: string;
    position: number;
    roleName: string;
    orderNumber: number;
    tipFees: ITipFees;
    salaries: ISalaries;
    productSalaries: IProductSalaries;
    workingTimes: IWorkingTimes;
    imageUrl: string;
    isNextAvailableStaff: number;
    merchantId: number;
    stateName: string;
    nextTimeAvailable: string;
    driverLicense: string;
    ssn: string;
    professionalLicense: string;
    isAvailableNow: boolean;
    codePhone: number;
    socialSecurityNumber: string;
    categories: categories[];
}

interface categories {
    id: number;
    categoryId: number;
    selected: boolean;
    name: string;
    staffServices: StaffService[];
    createdDate: string;
    createdBy: number;
    modifiedDate: string;
    modifiedBy: number;
}

export interface StaffService {
    id: number;
    serviceId: number;
    selected: boolean;
    name: string;
    imageUrl: string;
    categoryId: number;
    createdDate: string;
    createdBy: number;
    modifiedDate: string;
    modifiedBy: number;
}

export default IStaff;
