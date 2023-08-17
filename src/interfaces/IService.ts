import IExtra from "./IExtra";

interface IService {
    serviceId: number;
    categoryId: number;
    merchantId: number;
    name: string;
    duration: number;
    openTime: number;
    secondTime: number;
    description: string;
    price: string;
    tax: string;
    discount: string;
    fileId: number;
    isDisabled: number;
    isDeleted: number;
    position: number;
    supplyFee: string;
    isCustomService: boolean;
    status: number;
    imageUrl: string;
    extras: IExtra[];
    totalExtra: number;
    categoryName: string;
    totalDuration: number;
}

export default IService;
