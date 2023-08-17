import axiosClient from "api/axiosClient";
import { HTTP_STATUS_CODES } from "contants";
import IAdminUser from "interfaces/IAdminUser";
import IApprovedRequest from "interfaces/IApprovedRequest";
import IMerchant from "interfaces/IMerchant";
import IPaging from "interfaces/IPaging";
import IPendingRequest from "interfaces/IPendingRequest";

const RequestManagementRepository = {
    get: (page: number, row: number, key: string, status: string, sortType?: string, sortValue?: string): Promise<IPaging<IPendingRequest>> => {
        const params = {
            page,
            row,
            key: key || "",
            status,
            sortType,
            sortValue,
        };
        const url = `/Merchant/pending`;
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params }).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getPendingById: async (id: number): Promise<IMerchant> => {
        try {
            const resp: any = await axiosClient.get(`/Merchant/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (status: any, id: number): Promise<string> => {
        try {
            const url = `/Merchant/updateStatus/${id}`;
            const params = {
                ...status,
            };
            const resp: any = await axiosClient.put(url, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getApproveds: async (page: number, row: number, approvedBy: number, key: string): Promise<IPaging<IApprovedRequest>> => {
        try {
            const url = `/Merchant/search`;
            const params = {
                page,
                row,
                approvedBy: approvedBy || 0,
                key: key || "",
            };
            const resp: any = await axiosClient.get(url, { params });
            if (resp && (resp.codeNumber === HTTP_STATUS_CODES.OK || resp.codeNumber === HTTP_STATUS_CODES.NOTFOUND)) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getUsers: (page: string, row: string, fullTextSearch: string, status: number, isGetBrief: boolean): Promise<IPaging<IAdminUser>> => {
        const url = `/AdminUser`;
        const params = {
            page: page || "1",
            row: row || "10",
            key: fullTextSearch || "",
            isDisabled: status,
            isGetBrief: isGetBrief || false,
        };
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params }).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getRejecteds: (page: number, row: number, status: number, key: string): Promise<IPaging<IApprovedRequest>> => {
        const url = `/Merchant/reject`;
        const params = {
            page,
            row,
            rejectedBy: status || 0,
            key: key || "",
        };
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params }).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    deleteRejected: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.delete(`/Merchant/delete/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    revert: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/Merchant/restorepending/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    rejectPending: async (reason: string, merchantId: number): Promise<void> => {
        try {
            const url = `/Merchant/reject/${merchantId}`;
            const params = {
                merchantId,
                path: "/app/merchants/pending",
                reason,
            };
            const resp: any = await axiosClient.put(url, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    acceptPending: async (data: any, merchantId: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/Merchant/approve/${merchantId}`, data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getState: (): Promise<void> => {
        const url = `/State`;
        return new Promise((resolve, reject) => {
            axiosClient.get(url).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    editPending: async (payload: any, merchantId: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/Merchant/${merchantId}`, payload);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    editReject: async (params: any, merchantId: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/general/${merchantId}`, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default RequestManagementRepository;
