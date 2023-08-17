import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import Button from "components/Button/Button";
import { RHFSelect, RHFTextField } from "components/Form";
import Spin from "components/Spin/Spin";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReportService from "services/ReportService";
import ISettlementAwait from "interfaces/ISettlementAwait";
import Message from "components/Message";

const BREAD_CRUMBS = [
    {
        name: "Report",
        path: "",
    },
    {
        name: "Batch",
        path: "/reports/merchant-batch-settlement",
    },
    {
        name: "Close Settlement",
        path: "",
    },
];

type FormInputs = {
    merchant: string;
    device: string;
    serialNumber: string | null | undefined;
};

interface IData {
    merchant: string;
    device: string;
    serialNumber: string | null | undefined;
}

interface IMerchant {
    merchantid: string;
    businessname: string;
}

interface IDevice {
    deviceId: any;
    terminalId: string;
}

interface ISelect {
    value: string;
    label: string;
}

const schema = yup.object({
    merchant: yup.string().required("This is a required field!"),
    device: yup.string().required("This is a required field!"),
    serialNumber: yup.string().notRequired(),
});

const CloseSettlement = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState<number>(0);
    const [currentObj, setCurrentObj] = useState<IData>();
    const [settlementWaiting, setSettlementWaiting] = useState<ISettlementAwait>();
    const [note, setNote] = useState<string>("");
    const [terminal, setTerminal] = useState<string>("");
    const [basics, setBasics] = useState<ISelect[]>([]);
    const [device, setDevice] = useState<ISelect[]>([]);

    const { control, watch, handleSubmit, setValue } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            merchant: "",
            device: "",
            serialNumber: "",
        },
    });

    const merchantVal = watch("merchant");
    const deviceVal = watch("device");

    useEffect(() => {
        const fetchDevice = async (id: string) => {
            const res: any = await ReportService.getDeviceMerchant(id);
            if (res) {
                const basics: ISelect[] = [];
                res.forEach((item: IDevice) => {
                    if (item.deviceId) {
                        basics.push({ value: item?.deviceId, label: item?.terminalId });
                    }
                });
                setDevice(basics);
                setValue("device", "");
            }
        };
        if (merchantVal) fetchDevice(merchantVal.toString());
    }, [merchantVal, setValue]);

    useEffect(() => {
        const fetchDevice = async (merchantId: string, deviceId: string) => {
            const res: any = await ReportService.getSsnByDevice(merchantId, deviceId);
            setValue("serialNumber", res);
            const dataTerminal = device.filter((item) => item.value === deviceVal);
            if (dataTerminal.length > 0) {
                setTerminal(dataTerminal[0].label);
            }
        };
        if (deviceVal && merchantVal) fetchDevice(merchantVal.toString(), deviceVal.toString());
    }, [deviceVal, merchantVal, setValue, device]);

    const getBasic = useCallback(async () => {
        const data: any = await ReportService.getBasic();
        const basics = data.map((item: IMerchant) => ({ value: item?.merchantid, label: item?.businessname }));
        setBasics(basics);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        getBasic();
    }, [getBasic]);

    const nextHandle = async (data: FormInputs) => {
        setIsLoading(true);
        const res: any = await ReportService.getSettlementWaiting(data.merchant, data.device, data?.serialNumber);
        if (res.codeNumber === 200) {
            setSettlementWaiting(res.data);
            setCurrentObj({
                merchant: data.merchant,
                device: data.device,
                serialNumber: data.serialNumber,
            });
            setCurrent(current + 1);
        } else {
            Message.error({ text: res.message });
        }
        setIsLoading(false);
    };

    const steps = [
        {
            title: "Merchant & Device",
            content: (
                <>
                    <h4 className="font-semibold text-blue-500 text-xl">Merchant & Device</h4>
                    <form>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <RHFSelect<FormInputs>
                                    className="w-full text-3.5"
                                    control={control}
                                    name={"merchant"}
                                    options={basics ? basics : []}
                                    placeholder="Merchant"
                                    label="Merchant"
                                />
                            </div>
                            <div>
                                <RHFSelect<FormInputs>
                                    className="w-full text-3.5"
                                    control={control}
                                    name={"device"}
                                    options={device}
                                    placeholder="Device"
                                    label="Device"
                                />
                            </div>
                            <div>
                                <RHFTextField<FormInputs>
                                    control={control}
                                    name={"serialNumber"}
                                    placeholder="Enter Serial number"
                                    label="Serial number"
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </form>
                </>
            ),
        },
        {
            title: "Submit",
            content: (
                <div>
                    <h2 className="mb-4 text-xl text-blue-500 font-medium">Submit</h2>
                    <div className="flex w-full">
                        <div className="w-1/2 pr-2 lg:pr-5 text-white font-medium">
                            <p className="mb-2 font-medium text-base text-black">Actual Amount</p>
                            <div className="flex items-center justify-between p-2.5 bg-blue-900">
                                <p>Nailsoft account</p>
                                <p>${settlementWaiting?.settlement?.paymentByHarmony}</p>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-blue-800">
                                <p>Credit card</p>
                                <p>${settlementWaiting?.settlement?.paymentByCreditCard}</p>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-blue-600">
                                <p>Cash</p>
                                <p>${settlementWaiting?.settlement?.paymentByCash}</p>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-blue-500">
                                <p>Gift Card</p>
                                <p>${settlementWaiting?.settlement?.paymentByGiftcard}</p>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-blue-400">
                                <p>Other</p>
                                <p>${settlementWaiting?.settlement?.otherPayment}</p>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-blue-300">
                                <p>Star redeem</p>
                                <p>${settlementWaiting?.settlement?.redeemStar}</p>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-blue-200">
                                <p>Discount</p>
                                <p>${settlementWaiting?.settlement?.discount}</p>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-blue-100 text-black font-semibold">
                                <p>Total</p>
                                <p className="text-green-500">${settlementWaiting?.settlement?.total}</p>
                            </div>
                        </div>
                        <div className="w-1/2 pl-2 lg:pl-5 text-white font-medium">
                            <p className="mb-2 font-medium text-base text-black">Open batch</p>
                            <div className="flex items-center justify-between p-2.5 bg-blue-800">
                                <p>Credit card transaction:</p>
                                <p>{settlementWaiting?.settlement?.paymentTransaction?.length}</p>
                            </div>

                            <div className="w-full text-black">
                                <div className="flex items-center">
                                    <p className="py-2 text-xs min-w-[20%] bg-gray-200">Trans ID</p>
                                    <p className="py-2 text-xs min-w-[20%] bg-gray-200">Invoice</p>
                                    <p className="py-2 text-xs min-w-[20%] bg-gray-200">Payments</p>
                                    <p className="py-2 text-xs min-w-[20%] bg-gray-200">Status</p>
                                    <p className="py-2 text-xs min-w-[20%] bg-gray-200">Amount</p>
                                </div>
                                {settlementWaiting &&
                                    settlementWaiting?.settlement?.paymentTransaction &&
                                    settlementWaiting?.settlement?.paymentTransaction?.map((item, index) => (
                                        <div className="flex items-center" key={index}>
                                            <p className="py-2 pr-0.5 text-xs min-w-[20%]">#{item?.transactionId}</p>
                                            <p className="py-2 pr-0.5 text-xs min-w-[20%]">#{item?.checkoutId}</p>
                                            <p className="py-2 pr-0.5 text-xs min-w-[20%]">
                                                <span className="p-1 rounded text-[10px] bg-blue-100 text-blue-500">
                                                    Other
                                                </span>{" "}
                                                x{item?.paymentData?.card_number}
                                            </p>
                                            <p className="py-2 pr-0.5 text-xs min-w-[20%]">{item?.status}</p>
                                            <p className="py-2 pr-0.5 text-xs min-w-[20%]">$ {item?.amount}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 w-1/2 pr-5">
                        <p className="mb-1 font-medium text-lg text-black">Note:</p>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="p-2 text-black text-base outline-none border border-black/20 w-full"
                        />
                    </div>
                </div>
            ),
        },
    ];

    const handleBack = () => {
        if (currentObj) {
            setValue("merchant", currentObj?.merchant);
            setValue("device", currentObj?.device);
            setValue("serialNumber", currentObj?.serialNumber);
            setCurrent(current - 1);
        }
    };

    const closeSettlement = async () => {
        if (currentObj && settlementWaiting) {
            setIsLoading(true);
            const res: any = await ReportService.closeSettlement(
                settlementWaiting?.settlement,
                terminal,
                note,
                currentObj
            );
            if (res.codeNumber === 200) {
                Message.success({ text: res.message });
                navigate("/reports/merchant-batch-settlement");
            } else {
                Message.error({ text: res.message });
            }
            setIsLoading(false);
        }
    };

    return (
        <Spin spinning={isLoading}>
            <Breadcrumb title="Close Settlement" breadcrumbs={BREAD_CRUMBS} />
            <div className="mb-4 text-lg w-full rounded-xl px-4 py-3 bg-white shadow-md">
                <div className={`w-full flex flex-wrap items-center demo my-5 text-white`}>
                    {steps.map((step, index) => {
                        let bgRec = "bg-gray-500";
                        let bg = "bg-gray-500 lg:bg-gray-500";
                        let border = "border-l-gray-500";
                        let width = "w-full md:w-1/3 lg:w-1/5";

                        if (index === current) {
                            border = "border-l-blue-500";
                            bgRec = "bg-blue-500";
                        }
                        if (index < current) {
                            border = "border-l-green-500";
                            bg = "bg-green-500 lg:bg-green-500";
                            bgRec = "bg-green-500";
                        }
                        if (index === current - 1) {
                            bg = "bg-blue-500 lg:bg-blue-500";
                        }
                        if (index === steps.length - 1) {
                            bg = "bg-white";
                        }

                        if (index > 2) {
                            width = "w-full md:w-1/2 lg:w-1/5";
                        }

                        if (index === 2) {
                            bg = bg + " md:bg-white";
                        }

                        return (
                            <div
                                className={`h-20 relative border-white ${width} border-b border-white md:border-0`}
                                key={index}
                            >
                                <div className={`w-full h-full text-center pr-8 flex flex-col justify-center ${bgRec}`}>
                                    <h4 className="text-white font-semibold">Step {index + 1}</h4>
                                    <p className="text-sm">{step.title}</p>
                                </div>
                                {/* arrow */}
                                <p
                                    className={`hidden md:block step-arrow absolute top-0 ${
                                        index === steps.length - 1 ? "right-[0]" : "right-[2px]"
                                    } w-0 h-0 z-10 border-b-[40px] border-t-[40px] border-b-transparent border-t-transparent ${border} border-l-[30px]`}
                                ></p>
                                {/* arrow white */}
                                <p className="hidden md:block step-arrow absolute top-0 right-0 w-0 h-0 z-[1] border-b-[40px] border-t-[40px] border-b-transparent border-t-transparent border-l-white border-l-[30px]"></p>
                                {/* bg */}
                                <p className={`aa hidden md:block w-[30px] h-20 ${bg} absolute top-0 right-0 z-0`}></p>
                            </div>
                        );
                    })}
                </div>
                <div className="steps-content">{steps[current]?.content}</div>
                <div className="steps-action mt-10">
                    {current < steps.length - 1 && (
                        <div className="flex items-center justify-between">
                            <Button title="Next" btnType="ok" onClick={handleSubmit(nextHandle)} />
                            <Button
                                title="Cancel"
                                btnType="cancel"
                                onClick={() => navigate("/reports/merchant-batch-settlement")}
                            />
                        </div>
                    )}
                    {current === steps.length - 1 && (
                        <div className="flex">
                            <Button title="Back" btnType="cancel" onClick={handleBack} moreClass="mr-5" />
                            {settlementWaiting?.settlement?.paymentTransaction.length === 0 &&
                            settlementWaiting?.settlement?.total === "0.00" ? (
                                <div />
                            ) : (
                                <Button title="Close Settlement" btnType="ok" onClick={closeSettlement} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Spin>
    );
};

export default CloseSettlement;
