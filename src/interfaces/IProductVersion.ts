interface IProductVersion {
    id: number;
    productId: number;
    label: string;
    quantity: number;
    tempQuantity: number;
    costPrice: string;
    price: string;
    fileId: number;
    description: string;
    sku: string;
    barCode: string;
    oldQuantity: number;
    warehouseProductQuantityId: number;
    needToOrder: number;
    attributeIds: number[];
    imageUrl: string;
}

export default IProductVersion;
