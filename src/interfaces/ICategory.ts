interface ICategory {
    categoryId: number;
    merchantId: number;
    name: string;
    categoryType: string;
    position: number;
    isDisabled: number;
    isDeleted: number;
    isShowSignInApp: boolean;
    parentId: number;
    warehouseCategoryId: number;
    isSubCategory: boolean;
    parentName: string;
}

export default ICategory;
