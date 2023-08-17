import { HTTP_STATUS_CODES } from "contants";
import axiosClient from "api/axiosClient";
import IConsumer from "interfaces/IConsumer";
import IPaging from "interfaces/IPaging";

const ConsumerRepository = {
    get: async (page: number, row: number, status: number, keyword?: string, sortValue?: string, sortType?: "asc" | "desc"): Promise<IPaging<IConsumer>> => {
        let url = `User?page=${page}&row=${row}&isVerify=${status}`;

        if (sortType && sortValue) {
            url = `${url}&sortValue=${sortValue}&sortType=${sortType}`;
        }

        if (keyword) {
            url += `&key=${keyword}`;
        }

        try {
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: number): Promise<IConsumer> => {
        try {
            const resp: any = await axiosClient.get(`User/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    editUser: async (userId: number, data: Partial<IConsumer>): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`User/update/${userId}`, data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    putArchive: async (reason: string, id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`User/delete/${id}`, { reason });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    putRestore: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`User/restore/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default ConsumerRepository;
