import IState from "interfaces/IState";
import IStateSuggestion from "interfaces/IStateSuggestion";
import StateRepository from "repositories/StateRepository";
import { handleResponseError } from "utils";

const StateService = {
    get: async (): Promise<IState[]> => {
        try {
            const response = await StateRepository.get();
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getSuggestionByZipCode: async (zipCode: string): Promise<IStateSuggestion> => {
        try {
            const response = await StateRepository.getSuggestionByZipCode(zipCode);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default StateService;
