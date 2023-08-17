import IAdminUser from "./IAdminUser";
import IBusinessBank from "./IBusinessBanks";
import IGeneral from "./IGeneral";
import IPrincipal from "./IPrincipal";

interface IApprovedRequest {
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
    approvedDate: string;
    merchantCode: string;
    adminUser: IAdminUser;
}

export default IApprovedRequest;
