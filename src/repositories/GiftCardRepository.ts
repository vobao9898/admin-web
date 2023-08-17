import axiosClient from "api/axiosClient";
import IGiftCardTemplate from "interfaces/IGiftCardTemplate";
import IPaging from "interfaces/IPaging";
import { HTTP_STATUS_CODES } from "contants";

const GiftCardRepository = {
    get: async (page: number, row: number, fullTextSearch?: string): Promise<IPaging<IGiftCardTemplate>> => {
        let url = `GiftCardTemplate?page=${page}&row=${row}`;
        if (fullTextSearch) {
            url += `&key=${fullTextSearch}`;
        }

        try {
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    create: async (data: Partial<IGiftCardTemplate>): Promise<string> => {
        try {
            const resp: any = await axiosClient.post("/GiftCardTemplate", data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: Partial<IGiftCardTemplate>): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/GiftCardTemplate/${id}`, data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (type: string, id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`giftcardtemplate/${type}/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default GiftCardRepository;
