import SettingRepository from "repositories/SettingRepository";
import ISetting from "interfaces/ISetting";
import { handleResponseError } from "utils";

const SettingService = {
    get: async (): Promise<ISetting> => {
        try {
            const response = await SettingRepository.get();
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    updateMaintenance: async (value: boolean): Promise<string> => {
        try {
            const response = await SettingRepository.updateMaintenance(value);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default SettingService;
