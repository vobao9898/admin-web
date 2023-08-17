import ConsumerRepository from "repositories/ConsumerRepository";
import IPaging from "interfaces/IPaging";
import IConsumer from "interfaces/IConsumer";
import { handleResponseError } from "utils";

const ConsumerService = {
    get: async (page: number, row: number, status: number, keyword?: string, sortValue?: string, sortType?: "asc" | "desc"): Promise<IPaging<IConsumer>> => {
        try {
            const response = await ConsumerRepository.get(page, row, status, keyword, sortValue, sortType);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getById: async (id: number): Promise<IConsumer> => {
        try {
            const response = await ConsumerRepository.getById(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    editUser: async (userId: number, data: Partial<IConsumer>): Promise<string> => {
        try {
            const response = await ConsumerRepository.editUser(userId, data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    putArchive: async (data: string, id: number): Promise<string> => {
        try {
            const response = await ConsumerRepository.putArchive(data, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    putRestore: async (id: number): Promise<string> => {
        try {
            const response = await ConsumerRepository.putRestore(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default ConsumerService;
