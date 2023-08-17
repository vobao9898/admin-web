import IAdminUser from "interfaces/IAdminUser";
import IApprovedRequest from "interfaces/IApprovedRequest";
import IMerchant from "interfaces/IMerchant";
import IPaging from "interfaces/IPaging";
import IPendingRequest from "interfaces/IPendingRequest";
import RequestManagementRepository from "repositories/RequestManagementRepository";
import { handleResponseError } from "utils";

const RequestManagementService = {
    get: async (page: number, row: number, key: string, status: string, sortType?: string, sortValue?: string): Promise<IPaging<IPendingRequest>> => {
        try {
            const response = await RequestManagementRepository.get(page, row, key, status, sortType, sortValue);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getPendingById: async (id: number): Promise<IMerchant> => {
        try {
            const response = await RequestManagementRepository.getPendingById(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    updateStatus: async (status: any, id: number): Promise<string> => {
        try {
            const response = await RequestManagementRepository.updateStatus(status, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getApproveds: async (page: number, row: number, approvedBy: number, key: string): Promise<IPaging<IApprovedRequest>> => {
        try {
            const response = await RequestManagementRepository.getApproveds(page, row, approvedBy, key);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getUsers: async (page: string, row: string, fullTextSearch: string, status: number, isGetBrief: boolean): Promise<IPaging<IAdminUser>> => {
        try {
            const response = await RequestManagementRepository.getUsers(page, row, fullTextSearch, status, isGetBrief);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getRejecteds: async (page: number, row: number, approvedBy: number, key: string): Promise<IPaging<IApprovedRequest>> => {
        try {
            const response = await RequestManagementRepository.getRejecteds(page, row, approvedBy, key);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    deleteRejected: async (id: number): Promise<string> => {
        try {
            const response = await RequestManagementRepository.deleteRejected(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    revert: async (id: number): Promise<string> => {
        try {
            const response = await RequestManagementRepository.revert(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    rejectPending: async (reasons: string, id: number): Promise<void> => {
        try {
            const response = await RequestManagementRepository.rejectPending(reasons, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    acceptPending: async (data: any, id: number): Promise<string> => {
        try {
            const response = await RequestManagementRepository.acceptPending(data, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getState: async (): Promise<void> => {
        try {
            const response = await RequestManagementRepository.getState();
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    editPending: async (payload: any, id: number): Promise<string> => {
        try {
            const response = await RequestManagementRepository.editPending(payload, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    editReject: async (params: any, id: number): Promise<string> => {
        try {
            const response = await RequestManagementRepository.editReject(params, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default RequestManagementService;
