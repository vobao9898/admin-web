import { Checkbox, Spin, Upload } from "antd";
import { API_BASE_URL, KEY_TOKEN } from "contants";
import { useState } from "react";
import Button from "components/Button";
import Message from "components/Message";
import ICallerLink from "interfaces/ICallerLink";
import IMerchant from "interfaces/IMerchant";
import MerchantService from "services/MerchantService";
import ActiveButton from "./Components/ActiveButton";
import InactiveButton from "./Components/InactiveButton";
import ModalLink from "./Components/ModalLink";
import ModalForm from "./Components/ModalLinkForm";
import ModalLinkTow from "./Components/ModalLinkTow";

interface IProps {
    merchantId: number;
    merchant: IMerchant | undefined;
    handleChange: () => void;
}

const Setting: React.FC<IProps> = ({ merchantId, merchant, handleChange }) => {
    const token = localStorage.getItem(KEY_TOKEN);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [link, setLink] = useState<string>("");
    const [linkCall, setLinkCall] = useState<ICallerLink>();
    const [modal, setModal] = useState<boolean>(false);
    const [modalCall, setModalCall] = useState<boolean>(false);
    const [modalBooking, setModalBooking] = useState<boolean>(false);
    const [modalEdit, setModalEdit] = useState<boolean>(false);

    const onClose = () => {
        setModal(!modal);
        setModalBooking(false);
    };

    const onCloseCall = () => {
        setModalCall(!modalCall);
    };

    const afterClose = () => {
        setLink("");
    };

    const afterCloseCall = () => {
        setLinkCall(undefined);
    };

    const generateCaller = async () => {
        if (merchant && merchant.merchantId) {
            try {
                setIsLoading(true);
                const data = await MerchantService.generateCallerLink(merchant?.merchantId);
                setLinkCall(data);
                setModalCall(true);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }
    };

    const generateBookingLink = async () => {
        if (merchant && merchant.merchantId) {
            try {
                setIsLoading(true);
                const link = await MerchantService.generateBookingLink(merchant?.merchantId);
                setModal(true);
                setModalBooking(true);
                setLink(link);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }
    };

    const generatePortalLink = async () => {
        if (merchant && merchant.merchantId) {
            try {
                setIsLoading(true);
                const data = await MerchantService.generatePortalLink(merchant?.merchantId);
                const url = `${data.url}&tokenReport=${data.tokenReport}`;
                setModal(true);
                setLink(url);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }
    };

    const downloadCustomerTemplate = async () => {
        try {
            setIsLoading(true);
            const data = await MerchantService.downloadCustomerTemplate();
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `customerTemplate.xlsx`);
            document.body.appendChild(link);
            link.click();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onCloseEdit = () => {
        setModalEdit(false);
    };

    const handleEdit = () => {
        setModalEdit(true);
    };

    const handleActive = async () => {
        if (merchantId) {
            try {
                setIsLoading(true);
                const message = await MerchantService.activeSetting(merchantId);
                Message.success({ text: message });
                handleChange();
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }
    };

    return (
        <Spin spinning={isLoading}>
            <ModalLink afterClose={afterClose} link={link} open={modal} modalBooking={modalBooking} onClose={onClose} />

            {linkCall && (
                <ModalLinkTow
                    afterCloseCall={afterCloseCall}
                    isLoading={isLoading}
                    linkCall={linkCall}
                    modalCall={modalCall}
                    onCloseCall={onCloseCall}
                />
            )}

            {merchant && (
                <ModalForm
                    fetchData={(id: string) => handleChange()}
                    merchant={merchant}
                    merchantId={merchantId}
                    modalEdit={modalEdit}
                    onCloseEdit={onCloseEdit}
                    setIsLoading={(value: boolean) => setIsLoading(value)}
                    setModalEdit={(value: boolean) => setModalEdit(value)}
                />
            )}

            <div className="font-bold text-lg mb-4 text-blue-500">Settings</div>
            <div className="grid grid-cols-12 gap-6 mb-4">
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Transactions Fee</div>
                    <div className="text-sm">% {merchant?.transactionsFee}</div>
                </div>
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Merchant ID</div>
                    <div className="text-sm">{merchant?.merchantCode}</div>
                </div>
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Discount Rate</div>
                    <div className="text-sm">{merchant?.discountRate}</div>
                </div>
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Point Rate</div>
                    <div className="text-sm">% {merchant?.pointRate}</div>
                </div>
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Turn Amount</div>
                    <div className="text-sm">{merchant?.turnAmount}</div>
                </div>
                <div className="sm:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2">Time Zone</div>
                    <div className="text-sm">{merchant?.timezone}</div>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mb-4">
                <div>
                    <div className="text-sm font-semibold mb-2">Apply Cash Discount Program</div>
                    <div className="text-sm mb-2">
                        <Checkbox checked={merchant?.isCashDiscount} />
                    </div>
                    {merchant?.isCashDiscount && (
                        <div className="sm:col-span-12 col-span-12">
                            <div className="text-sm font-semibold mb-2">Cash discount percent</div>
                            <div className="text-sm">{merchant?.cashDiscountPercent}</div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="text-sm font-semibold mb-2">Top Store</div>
                    <div className="text-sm mb-2">
                        <Checkbox checked={merchant?.isTop} />
                    </div>
                </div>
                <div>
                    <div className="text-sm font-semibold mb-2">Test Merchant</div>
                    <div className="text-sm mb-2">
                        <Checkbox checked={merchant?.isTest} />
                    </div>
                </div>
                {merchant?.type === "Retailer" && (
                    <div>
                        <div className="text-sm font-semibold mb-2">Is Warehouse</div>
                        <div className="text-sm mb-2">
                            <Checkbox checked={merchant?.isWareHouse} />
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap">
                <Button title="Edit" onClick={handleEdit} moreClass="mr-2 m-2" />
                {merchant && merchant?.isDisabled === 0 ? (
                    <InactiveButton merchantId={merchant.merchantId} onSuccess={handleChange} />
                ) : (
                    <ActiveButton disabledReason={merchant?.disabledReason} onActive={handleActive} />
                )}

                <Upload
                    accept=".xlsx"
                    method="put"
                    name="file"
                    action={`${API_BASE_URL}Customer/import/${merchant?.merchantId}`}
                    headers={{
                        Authorization: `Bearer ${token}`,
                    }}
                    showUploadList={false}
                    onChange={({ file }) => {
                        setIsLoading(true);
                        if (file?.response && file?.response?.codeStatus !== 1) {
                            if (file?.response && file?.response?.codeStatus === 4 && file?.response?.data?.path) {
                                if (file?.response?.data?.path) {
                                    window.open(file?.response?.data?.path);
                                }
                            } else {
                                Message.error({ text: file?.response?.message });
                            }
                            setIsLoading(false);
                        }
                        if (file?.response && file?.response?.codeStatus === 1) {
                            Message.success({ text: file?.response?.message });
                            handleChange();
                            setIsLoading(false);
                        }
                    }}
                >
                    <Button title="Import Customer" moreClass="mr-2 m-2" />
                </Upload>
                <Button
                    title="Download Customer Template"
                    moreClass="mr-2 m-2"
                    btnType="cancel"
                    onClick={downloadCustomerTemplate}
                />
                <Button title="Generate Booking Link" moreClass="mr-2 m-2" onClick={generateBookingLink} />
                <Button title="Generate Caller ID" moreClass="mr-2 m-2" btnType="cancel" onClick={generateCaller} />
                <Button title="Generate Portal Link" moreClass="mr-2 m-2" onClick={generatePortalLink} />
            </div>
        </Spin>
    );
};

export default Setting;
