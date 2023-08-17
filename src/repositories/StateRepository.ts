import axiosClient from "api/axiosClient";
import IState from "interfaces/IState";
import IStateSuggestion from "interfaces/IStateSuggestion";
import { HTTP_STATUS_CODES } from "contants";

const StateRepository = {
    get: async (): Promise<IState[]> => {
        try {
            const resp: any = await axiosClient.get(`State`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    getSuggestionByZipCode: async (zipCode: string): Promise<IStateSuggestion> => {
        try {
            const resp: any = await axiosClient.get(`State/getcityandstatebyzipcode?zipcode=${zipCode}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default StateRepository;
