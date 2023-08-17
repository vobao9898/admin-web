import axiosClient from "api/axiosClient";
import ISetting from "interfaces/ISetting";
import { HTTP_STATUS_CODES } from "contants";

const SettingRepository = {
    get: async (): Promise<ISetting> => {
        try {
            const resp: any = await axiosClient.get(`AdminSetting/maintenance/`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                const setting = {
                    ...resp.data,
                    value: resp?.data?.value?.toString().toLowerCase() === "false" ? false : true,
                };
                return setting;
            }
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    updateMaintenance: async (value: boolean): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/AdminSetting/maintenance?turnOn=${value}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            }
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default SettingRepository;
