import IProductVersion from "./IProductVersion";

interface IProduct {
    productId: number;
    name: string;
    description: string;
    sku: string;
    barCode: string;
    price: string;
    costPrice: string;
    minThreshold: number;
    maxThreshold: number;
    quantity: number;
    tempQuantity: number;
    categoryId: number;
    fileId: number;
    isDeleted: number;
    isDisabled: number;
    isRemind: number;
    position: number;
    visibility: string;
    createdDate: string;
    createdBy: number;
    modifiedBy: number;
    modifiedDate: string;
    warehouseProductId: number;
    needToOrder: number;
    imageUrl: string;
    priceRange: string;
    categoryName: string;
    isAdjust: boolean;
    quantities: IProductVersion[];
}

export default IProduct;
