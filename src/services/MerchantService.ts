import { ISort } from "features/Merchants/Merchants";
import { handleResponseError } from "utils";
import MerchantRepository from "repositories/MerchantRepository";
import IPaging from "interfaces/IPaging";
import IMerchant from "interfaces/IMerchant";
import IActivities from "interfaces/IActivities";
import ICreateMerchant from "features/Merchants/Create/ICreateMerchant";
import IDevice from "interfaces/IDevice";
import IBusinessBank from "interfaces/IBusinessBanks";
import IInvoice from "interfaces/IInvoice";
import IGiftCard from "interfaces/IGiftCard";
import IGiftCardGeneral from "interfaces/IGiftCardGeneral";
import IExtra from "interfaces/IExtra";
import IProduct from "interfaces/IProduct";
import ICategory from "interfaces/ICategory";
import IService from "interfaces/IService";
import ISubscription from "interfaces/ISubscription";
import IStaff from "interfaces/IStaff";
import IPortalLink from "interfaces/IPortalLink";
import ICallerLink from "interfaces/ICallerLink";
import IGiftCardLog from "interfaces/IGiftCardLog";
import IBasicList from "interfaces/IBasicList";

const MerchantService = {
    get: async (page: number, row: number, sort: ISort, status: string, merchantType: string, isTest: string, keyword?: string): Promise<IPaging<IMerchant>> => {
        try {
            const response = await MerchantRepository.get(page, row, sort, status, merchantType, isTest, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    export: async (status: string, merchantType: string, isTest: string): Promise<string> => {
        try {
            const response = await MerchantRepository.export(status, merchantType, isTest);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    create: async (data: ICreateMerchant): Promise<string> => {
        try {
            const response = await MerchantRepository.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    getActivities: async (id: number, page: number, row: number): Promise<IPaging<IActivities>> => {
        try {
            const response = await MerchantRepository.getActivities(id, page, row);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getMerchantById: async (id: number): Promise<IMerchant> => {
        try {
            const response = await MerchantRepository.getMerchantById(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    generatePortalLink: async (id: number): Promise<IPortalLink> => {
        try {
            const response = await MerchantRepository.generatePortalLink(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    generateCallerLink: async (id: number): Promise<ICallerLink> => {
        try {
            const response = await MerchantRepository.generateCallerLink(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    generateBookingLink: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.generateBookingLink(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    downloadCustomerTemplate: async (): Promise<Blob> => {
        try {
            const response = await MerchantRepository.downloadCustomerTemplate();
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    updateBank: async (id: number, data: Partial<IBusinessBank>) => {
        try {
            const response = await MerchantRepository.updateBank(id, data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    editSetting: async (values: any, id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.editSetting(values, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    inactiveSetting: async (values: string, id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.inactiveSetting(values, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    activeSetting: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.activeSetting(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getDevice: async (id: number): Promise<IDevice[]> => {
        try {
            const response = await MerchantRepository.getDevice(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    putDevice: async (data: IDevice[], id: number): Promise<IDevice[]> => {
        try {
            const response = await MerchantRepository.putDevice(data, id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getInvoiceById: async (id: number, page: number, row: number, timeRange: string, custom: any, status: string, payment: string, keyword?: string): Promise<IPaging<IInvoice>> => {
        try {
            const response = await MerchantRepository.getInvoiceById(id, page, row, timeRange, custom, status, payment, keyword);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getCheckoutById: async (id: number, merchantId: number): Promise<IInvoice> => {
        try {
            const response = await MerchantRepository.getCheckoutById(id, merchantId);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    putRefundInvoice: async (id: number): Promise<void> => {
        try {
            const response = await MerchantRepository.putRefundInvoice(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getGiftCard: async (id: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IGiftCard>> => {
        try {
            const response = await MerchantRepository.getGiftCard(id, page, row, sortValue, sortType, keyword);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getGiftCardGeneral: async (id: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IGiftCardGeneral>> => {
        try {
            const response = await MerchantRepository.getGiftCardGeneral(id, page, row, sortValue, sortType, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getExportGiftCard: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.getExportGiftCard(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getInfoGeneralById: async (id: number): Promise<IGiftCardLog[]> => {
        try {
            const response = await MerchantRepository.getInfoGeneralById(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    basicList: async (): Promise<IBasicList[]> => {
        try {
            const response = await MerchantRepository.basicList();
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    postGiftCardGeneral: async (value: any): Promise<string> => {
        try {
            const response = await MerchantRepository.postGiftCardGeneral(value);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getExtra: async (id: number, page?: number, row?: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IExtra>> => {
        try {
            const response = await MerchantRepository.getExtra(id, page, row, sortValue, sortType, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getExportExtra: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.getExportExtra(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    archiveExtra: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.archiveExtra(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    restoreExtra: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.restoreExtra(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    deleteExtra: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.deleteExtra(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    editExtra: async (payload: any, id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.editExtra(payload, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getProduct: async (id: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IProduct>> => {
        try {
            const response = await MerchantRepository.getProduct(id, page, row, sortValue, sortType, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    productGetById: async (id: number, page: number, row: number): Promise<IProduct> => {
        try {
            const response = await MerchantRepository.productGetById(id, page, row);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    archiveProduct: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.archiveProduct(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    restoreProduct: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.restoreProduct(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getCategories: async ({
        id,
        page,
        row,
        status,
        type,
        sortValue,
        sortType,
        isGetBrief,
        keyword,
        isSubCategory,
    }: {
        id: number;
        page: number;
        row: number;
        status?: number;
        type?: string;
        sortValue?: string;
        sortType?: "asc" | "desc";
        isGetBrief?: boolean;
        keyword?: string;
        isSubCategory?: number;
    }): Promise<IPaging<ICategory>> => {
        try {
            const response = await MerchantRepository.getCategory(id, page, row, status, type, sortValue, sortType, isGetBrief, keyword, isSubCategory);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getCategory: async (
        id: number,
        page: number,
        row: number,
        status?: number,
        type?: string,
        sortValue?: string,
        sortType?: "asc" | "desc",
        isGetBrief?: boolean,
        keyword?: string,
        isSubCategory?: number
    ): Promise<IPaging<ICategory>> => {
        try {
            const response = await MerchantRepository.getCategory(id, page, row, status, type, sortValue, sortType, isGetBrief, keyword, isSubCategory);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    editProduct: async (params: any, id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.editProduct(params, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    createProduct: async (params: any): Promise<string> => {
        try {
            const response = await MerchantRepository.createProduct(params);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getService: async (id: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IService>> => {
        try {
            const response = await MerchantRepository.getService(id, page, row, sortValue, sortType, keyword);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getExportService: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.getExportService(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    archiveService: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.archiveService(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    restoreService: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.restoreService(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    deleteService: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.deleteService(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getSubscription: async (id: number): Promise<ISubscription> => {
        try {
            const response = await MerchantRepository.getSubscription(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getPackage: async (id: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc"): Promise<IPaging<ISubscription>> => {
        try {
            const response = await MerchantRepository.getPackage(id, page, row, sortValue, sortType);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getExportSubscription: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.getExportSubscription(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getExportCategory: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.getExportCategory(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    archiveCategory: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.archiveCategory(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    restoreCategory: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.restoreCategory(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    deleteCategory: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.deleteCategory(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getStaff: async (id: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IStaff>> => {
        try {
            const response = await MerchantRepository.getStaff(id, page, row, sortValue, sortType, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    archiveStaff: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.archiveStaff(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    restoreStaff: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.restoreStaff(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getStaffById: async (id: number, merchantId: number): Promise<IStaff> => {
        try {
            const response = await MerchantRepository.getStaffById(id, merchantId);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    changePrincipal: async (merchantId: number, newPrincipalId: number, currentPrincipalId?: number) => {
        try {
            const response = await MerchantRepository.changePrincipal(merchantId, newPrincipalId, currentPrincipalId);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    editCategory: async (params: any, id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.editCategory(params, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    createCategory: async (params: any): Promise<string> => {
        try {
            const response = await MerchantRepository.createCategory(params);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    editSubscription: async (payload: any, id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.editSubscription(payload, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    editService: async (params: any, id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.editService(params, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    createService: async (params: any): Promise<string> => {
        try {
            const response = await MerchantRepository.createService(params);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    updateGeneral: async (generalId: number, payload: any): Promise<string> => {
        try {
            const response = await MerchantRepository.updateGeneral(generalId, payload);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    editGeneralStaff: async (params: any, id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.editGeneralStaff(params, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getPin: async (merchantId: number, staffId: number, pincode: string): Promise<void> => {
        try {
            const response = await MerchantRepository.getPin(merchantId, staffId, pincode);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    addNewStaff: async (params: any): Promise<string> => {
        try {
            const response = await MerchantRepository.addNewStaff(params);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    exportSettlement: async (id: number, params: any): Promise<string> => {
        try {
            const response = await MerchantRepository.exportSettlement(id, params);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    deleteMerchant: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.deleteMerchant(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    cloneMerchant: async (id: number): Promise<string> => {
        try {
            const response = await MerchantRepository.cloneMerchant(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default MerchantService;
