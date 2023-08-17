import IStaffSaleDetail from "./IStaffSaleDetail";

interface IStaffSale {
    staffId: number;
    position: number;
    name: string;
    sales: string;
    tax: string;
    tip: string;
    fee: string;
    return: string;
    shippingFee: string;
    total: string;
    details: IStaffSaleDetail[];
}

export default IStaffSale;
