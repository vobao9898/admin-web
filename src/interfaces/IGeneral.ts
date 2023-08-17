import IAddress from "./IAddress";
import IBusinessAddress from "./IBusinessAddress";

interface IGeneral {
    generalId: number;
    status: number;
    legalBusinessName: string;
    doBusinessName: string;
    tax: string;
    address: string;
    city: string;
    stateId: number;
    zip: string;
    phoneBusiness: string;
    emailContact: string;
    firstName: string;
    lastName: string;
    title: string;
    phoneContact: string;
    merchantId: number;
    dbaAddress: IAddress;
    codePhoneContact: string;
    codePhoneBusiness: string;
    businessAddress: IBusinessAddress;
    reviewLink: string;
    sendReviewLinkOption: string;
    latitude: string;
    longitude: string;
}

export default IGeneral;
