import IDevice from "interfaces/IDevice";
import React, { useState, useEffect } from "react";
import { Spin, Form, Select } from "antd";
import MerchantService from "services/MerchantService";
import Button from "components/Button";
import Message from "components/Message";
interface IProps {
    merchantId: number;
}

const Device: React.FC<IProps> = ({ merchantId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    let [listData, setListData] = useState<IDevice[]>([]);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const data = await MerchantService.getDevice(merchantId);
                setListData(data);
            } catch (error) {}
        };
        if (merchantId) fetchData(merchantId);
    }, [merchantId]);

    const handleChangeTerminal = (e: string, id: number) => {
        listData = listData.map((i) => {
            if (i.terminalId === e && e !== "SUPPORT ONLY") i.terminalId = "";
            else if (i.id === id) i.terminalId = e;
            return i;
        });
        setListData(listData);
    };
    const listTerminal = [
        { value: "SUPPORT ONLY", label: "SUPPORT ONLY" },
        { value: "Terminal 1 (MAIN)", label: "Terminal 1 (MAIN)" },
    ];

    if (listTerminal.length === 2) {
        let i = 2;
        while (i <= 30) {
            listTerminal.push({ value: "Terminal " + i, label: "Terminal " + i });
            i++;
        }
    }

    const handleSaveDevice = async (e: IDevice[], id: number) => {
        setIsLoading(true);
        let flag = true;
        listData.map((i) => {
            if (!i?.terminalId) flag = false;
            return i;
        });

        if (flag) {
            await MerchantService.putDevice(e, id);
            const data = await MerchantService.getDevice(id);
            setListData(data);
        } else Message.error({ text: "Please choose terminal for all devices!" });

        setIsLoading(false);
    };

    return (
        <Spin spinning={isLoading}>
            <div className="font-bold text-lg mb-4 text-blue-500">Devices</div>
            {listData &&
                listData?.map((item, index) => (
                    <div key={index} className="w-full rounded-xl px-3 py-2 shadow-sm mb-3 border border-gray-100">
                        <div className="mb-3 text-gray-400">Device</div>
                        <div className=" mb-3 cursor-pointer flex justify-between">
                            <h3 className="text-sm w-3/4">{item?.deviceId}</h3>
                            <Form.Item
                                label="Terminal"
                                validateStatus={item?.terminalId ? "" : "error"}
                                help={item?.terminalId ? false : "Choose terminal for device!"}
                                hasFeedback
                                className="flex items-center w-1/4 justify-center device"
                            >
                                <Select
                                    value={item?.terminalId}
                                    onChange={(e) => handleChangeTerminal(e, item?.id)}
                                    className="mt-6 min-w-[200px]"
                                    size="large"
                                >
                                    {listTerminal.map((terminal, inx) => (
                                        <Select.Option value={terminal?.value} key={inx} className="w-full">
                                            <div className="min-w-[150px]">{terminal?.label}</div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                ))}
            {!isLoading && <Button title="Save" onClick={() => handleSaveDevice(listData, merchantId)} />}
        </Spin>
    );
};

export default Device;
