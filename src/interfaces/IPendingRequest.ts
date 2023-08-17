import IBusinessBank from "./IBusinessBanks";
import IGeneral from "./IGeneral";
import IPrincipal from "./IPrincipal";

interface IPendingRequest {
    merchantId: number;
    email: string;
    isDisabled: number;
    phone: string;
    createdDate: string;
    businessName: string;
    status: number;
    principals: IPrincipal[];
    general: IGeneral;
    businessBank: IBusinessBank;
}

export default IPendingRequest;
