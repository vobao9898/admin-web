import IMarketPlace from "interfaces/IMarketPlace";
import IPaging from "interfaces/IPaging";
import MarketPlaceRepository from "repositories/MarketPlaceRepository";
import { handleResponseError } from "utils";

const MarketPlaceService = {
    get: async (page: number, row: number, status?: string, keyword?: string): Promise<IPaging<IMarketPlace>> => {
        try {
            const response = await MarketPlaceRepository.get(page, row, status, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    update: async (data: Partial<IMarketPlace>): Promise<string> => {
        try {
            const response = await MarketPlaceRepository.update(data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    create: async (data: Partial<IMarketPlace>): Promise<string> => {
        try {
            const response = await MarketPlaceRepository.create(data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default MarketPlaceService;
