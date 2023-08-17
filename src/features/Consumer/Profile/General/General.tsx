import React, { useState } from "react";
import Button from "components/Button";
import Message from "components/Message";
import IConsumer from "interfaces/IConsumer";
import ConsumerService from "services/ConsumerService";
import ArchiveModal from "./ArchiveModal";
import EditModal from "./EditModal";

interface IProps {
    consumer?: IConsumer;
    loadData: () => void;
}

const General: React.FC<IProps> = ({ consumer, loadData }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openArchiveModal, setOpenArchiveModal] = useState<boolean>(false);

    const handleRestore = async () => {
        if (consumer) {
            try {
                const message = await ConsumerService.putRestore(consumer?.userId);
                Message.success({ text: message });
                loadData();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleGeneral = () => {
        if (!consumer?.isDisabled) {
            toggleOpenArchiveModal();
        } else {
            handleRestore();
        }
    };

    const toggleOpenModal = () => {
        setOpenModal((preVal) => !preVal);
    };

    const toggleOpenArchiveModal = () => {
        setOpenArchiveModal((preVal) => !preVal);
    };

    const handleSuccessEdit = () => {
        setOpenModal(false);
        loadData();
    };

    const handleSuccessArchive = () => {
        setOpenArchiveModal(false);
        loadData();
    };

    return (
        <div className="p-4 bg-gray-50 shadow rounded-xl">
            {openModal && consumer ? (
                <EditModal consumer={consumer} onClose={toggleOpenModal} onSuccess={handleSuccessEdit} />
            ) : null}
            {openArchiveModal && consumer ? (
                <ArchiveModal
                    userId={consumer.userId}
                    onClose={toggleOpenArchiveModal}
                    onSuccess={handleSuccessArchive}
                />
            ) : null}

            <div className="font-bold text-lg mb-4 text-blue-500">General Information</div>
            <div className="grid grid-cols-12 gap-6 mb-4">
                <div className="sm:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">First Name</div>
                    <div className="text-sm">{consumer?.firstName}</div>
                </div>
                <div className="sm:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Last Name</div>
                    <div className="text-sm">{consumer?.lastName}</div>
                </div>
                <div className="sm:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Contact Email</div>
                    <div className="text-sm break-words">{consumer?.email}</div>
                </div>
                <div className="sm:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Number Phone</div>
                    <div className="text-sm">{consumer?.phone}</div>
                </div>
            </div>
            <div className="flex space-x-4">
                <Button title="EDIT" btnType="ok" onClick={toggleOpenModal} />
                <Button
                    title={consumer?.isDisabled ? "ENABLE" : "ARCHIVE"}
                    btnType={consumer?.isDisabled ? "ok" : "cancel"}
                    onClick={handleGeneral}
                />
            </div>
        </div>
    );
};

export default General;
