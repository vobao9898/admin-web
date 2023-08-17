import GiftCardRepository from "repositories/GiftCardRepository";
import IPaging from "interfaces/IPaging";
import IGiftCardTemplate from "interfaces/IGiftCardTemplate";
import { handleResponseError } from "utils";

const GiftCardService = {
    get: async (page: number, row: number, key?: string): Promise<IPaging<IGiftCardTemplate>> => {
        try {
            const response = await GiftCardRepository.get(page, row, key);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    update: async (id: number, data: Partial<IGiftCardTemplate>): Promise<string> => {
        try {
            const response = await GiftCardRepository.update(id, data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    create: async (data: Partial<IGiftCardTemplate>): Promise<string> => {
        try {
            const response = await GiftCardRepository.create(data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    updateStatus: async (value: string, id: number): Promise<string> => {
        try {
            const response = await GiftCardRepository.updateStatus(value, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default GiftCardService;
