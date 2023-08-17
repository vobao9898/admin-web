import { FC, useState } from "react";
import { Radio, Spin } from "antd";
import { getCodeAndPhoneNumber, maskPhone } from "utils";
import Button from "components/Button";
import GeneralModal from "./GeneralModal";
import IMerchant from "interfaces/IMerchant";
import IState from "interfaces/IState";

interface IProps {
    merchant: IMerchant;
    state: IState[];
    handleChange: () => void;
}

const General: FC<IProps> = ({ merchant, state, handleChange }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleOpenModal = () => {
        setOpenModal((preVal) => !preVal);
    };

    const handleSuccess = () => {
        setOpenModal(false);
        handleChange();
    };

    const [businessCodePhone, businessPhoneNumber] = getCodeAndPhoneNumber(merchant?.general?.phoneBusiness);
    const [contactCodePhone, contactPhoneNumber] = getCodeAndPhoneNumber(merchant?.general?.phoneContact);

    return (
        <Spin spinning={false}>
            {openModal && merchant ? (
                <GeneralModal
                    merchant={merchant}
                    state={state}
                    handleClose={toggleOpenModal}
                    handleSuccess={handleSuccess}
                />
            ) : null}
            <div className="font-bold text-lg mb-4 text-blue-500">General Information</div>
            <div className="grid grid-cols-12 gap-6 mb-4">
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Legal Business Name</div>
                    <div className="text-sm">{merchant?.general?.legalBusinessName}</div>
                </div>
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Doing Business As</div>
                    <div className="text-sm">{merchant?.general?.doBusinessName}</div>
                </div>
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Merchant type</div>
                    <div className="text-sm">{merchant?.type}</div>
                </div>
                <div className="lg:col-span-3 md:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Federal Tax ID</div>
                    <div className="text-sm">{merchant?.general?.tax}</div>
                </div>
                <div className="sm:col-span-12 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Business Address</div>
                    <div className="text-sm">{merchant?.general?.address}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">City</div>
                    <div className="text-sm">{merchant?.general?.city}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">State</div>
                    <div className="text-sm">{merchant?.state?.name}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Zip Code</div>
                    <div className="text-sm">{merchant?.general?.zip}</div>
                </div>
                <div className="sm:col-span-12 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">DBA Address</div>
                    <div className="text-sm">{merchant?.general?.dbaAddress?.Address}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">City</div>
                    <div className="text-sm">{merchant?.general?.dbaAddress?.City}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">State</div>
                    <div className="text-sm">{merchant?.general?.dbaAddress?.StateName}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Zip Code</div>
                    <div className="text-sm">{merchant?.general?.dbaAddress?.Zip}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Business Phone Number</div>
                    <div className="text-sm">{maskPhone(businessCodePhone, businessPhoneNumber)}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Contact Email Address</div>
                    <div className="text-sm">{merchant && merchant?.general?.emailContact}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Password</div>
                    <div className="text-sm flex items-center justify-between">
                        <div>{showPassword ? merchant && merchant?.password : "********"}</div>
                        <div onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <i className="las la-eye-slash"></i>
                            ) : (
                                <i className="las la-eye cursor-pointer"></i>
                            )}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Contact Name</div>
                    <div className="text-sm">
                        {merchant && merchant?.general?.firstName + " " + merchant?.general?.lastName}
                    </div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Title/Position</div>
                    <div className="text-sm">{merchant && merchant?.general?.title}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Contact Phone Number</div>
                    <div className="text-sm">{maskPhone(contactCodePhone, contactPhoneNumber)}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Review Link</div>
                    <div className="text-sm">{merchant && merchant?.general?.reviewLink}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Send Review Link Option</div>
                    <div className="text-sm capitalize">
                        {merchant && merchant?.general?.sendReviewLinkOption === "auto"
                            ? "Automatic"
                            : merchant?.general?.sendReviewLinkOption}
                    </div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Latitude</div>
                    <div className="text-sm">{merchant && merchant?.general?.latitude}</div>
                </div>
                <div className="lg:col-span-4 md:col-span-6 col-span-12">
                    <div className="text-sm font-semibold mb-2 text-black">Longitude</div>
                    <div className="text-sm">{merchant && merchant?.general?.longitude}</div>
                </div>
            </div>
            <div className="font-bold text-lg mb-4 text-blue-500">Business Information</div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-4">
                <div>
                    <div className="text-sm font-semibold mb-2 text-black">
                        {merchant && merchant?.business && merchant?.business[0]?.question}
                    </div>
                    <div className="text-sm mb-2">
                        <Radio.Group value={merchant && merchant?.business && merchant?.business[0]?.answer}>
                            <Radio value={false}>No</Radio>
                            <Radio value={true}>Yes (if yes, who was the processor)</Radio>
                        </Radio.Group>
                    </div>
                    <div className="text-sm font-semibold">
                        Answer: {merchant && merchant?.business && merchant?.business[0]?.answerReply}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-semibold mb-2 text-black">
                        {merchant && merchant?.business && merchant?.business[1]?.question}
                    </div>
                    <div className="text-sm mb-2">
                        <Radio.Group value={merchant && merchant?.business && merchant?.business[1]?.answer}>
                            <Radio value={false}>No</Radio>
                            <Radio value={true}>Yes (if yes, who was the processor)</Radio>
                        </Radio.Group>
                    </div>
                    <div className="text-sm font-semibold">
                        Answer: {merchant && merchant?.business && merchant?.business[1]?.answerReply}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-semibold mb-2 text-black">
                        {merchant && merchant?.business && merchant?.business[2]?.question}
                    </div>
                    <div className="text-sm mb-2">
                        <Radio.Group value={merchant && merchant?.business && merchant?.business[2]?.answer}>
                            <Radio value={false}>No</Radio>
                            <Radio value={true}>Yes (if yes, who was the processor)</Radio>
                        </Radio.Group>
                    </div>
                    <div className="text-sm font-semibold">
                        Answer: {merchant && merchant?.business && merchant?.business[2]?.answerReply}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-semibold mb-2 text-black">
                        {merchant && merchant?.business && merchant?.business[3]?.question}
                    </div>
                    <div className="text-sm mb-2">
                        <Radio.Group value={merchant && merchant?.business && merchant?.business[3]?.answer}>
                            <Radio value={false}>No</Radio>
                            <Radio value={true}>Yes (if yes, who was the processor)</Radio>
                        </Radio.Group>
                    </div>
                    <div className="text-sm font-semibold">
                        Answer: {merchant && merchant?.business && merchant?.business[3]?.answerReply}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-semibold mb-2 text-black">
                        {merchant && merchant?.business && merchant?.business[4]?.question}
                    </div>
                    <div className="text-sm mb-2">
                        <Radio.Group value={merchant && merchant?.business && merchant?.business[4]?.answer}>
                            <Radio value={false}>No</Radio>
                            <Radio value={true}>Yes (if yes, who was the processor)</Radio>
                        </Radio.Group>
                    </div>
                    <div className="text-sm font-semibold">
                        Answer: {merchant && merchant?.business && merchant?.business[4]?.answerReply}
                    </div>
                </div>
            </div>
            <Button onClick={toggleOpenModal} btnType="ok" title="Edit" />
        </Spin>
    );
};
export default General;
