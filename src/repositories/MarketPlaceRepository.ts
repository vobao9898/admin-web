import axiosClient from "api/axiosClient";
import IMarketPlace from "interfaces/IMarketPlace";
import IPaging from "interfaces/IPaging";
import { HTTP_STATUS_CODES } from "contants";

const MarketPlaceRepository = {
    get: async (page: number, row: number, status?: string, keyword?: string): Promise<IPaging<IMarketPlace>> => {
        let url = `MarketPlace/search?page=${page}&row=${row}`;

        if (status) {
            url += `&isDisabled=${status}`;
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
    update: async (data: Partial<IMarketPlace>): Promise<string> => {
        try {
            const resp: any = await axiosClient.post("/MarketPlace", data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    create: async (data: Partial<IMarketPlace>): Promise<string> => {
        try {
            const resp: any = await axiosClient.post("/MarketPlace", data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default MarketPlaceRepository;
