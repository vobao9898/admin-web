import PrincipalRepository from "repositories/PrincipalRepository";
import IPaging from "interfaces/IPaging";
import IState from "interfaces/IState";
import IPrincipal from "interfaces/IPrincipal";
import IMerchant from "interfaces/IMerchant";
import { handleResponseError } from "utils";

const PrincipalService = {
    get: async (page: number, row: number, status: number, keyword?: string, sortValue?: string, sortType?: "asc" | "desc"): Promise<IPaging<IPrincipal>> => {
        try {
            const response = await PrincipalRepository.get(page, row, status, keyword, sortValue, sortType);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    getById: async (id: number): Promise<IPrincipal> => {
        try {
            const response = await PrincipalRepository.getById(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    getState: async (): Promise<IState[]> => {
        try {
            const response = await PrincipalRepository.getState();
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    exportPrincipalById: async (id: number): Promise<string> => {
        try {
            const response = await PrincipalRepository.exportPrincipalById(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    create: async (data: Partial<IPrincipal>): Promise<number> => {
        try {
            const response = await PrincipalRepository.create(data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getMerchants: async (id: number, page: number, row: number, status: string, merchantType: string, isTest: boolean | string): Promise<IPaging<IMerchant>> => {
        try {
            const response = await PrincipalRepository.getMerchants(id, page, row, status, merchantType, isTest);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    getPrincipalByKey: async (key: "email" | "ssn", value: string): Promise<IPrincipal> => {
        try {
            const response = await PrincipalRepository.getPrincipalByKey(key, value);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    update: async (id: number, data: Partial<IPrincipal>): Promise<string> => {
        try {
            const response = await PrincipalRepository.update(id, data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    briefPrincipal: async (merchantId: number, keyword: string): Promise<IPrincipal[]> => {
        try {
            const response = await PrincipalRepository.briefPrincipal(merchantId, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default PrincipalService;
