import { Modal } from "antd";
import { RHFTextAreaField } from "components/Form";
import { useForm } from "react-hook-form";
import Message from "components/Message/Message";
import ModalButton from "components/ModalButton";
import React from "react";
import ConsumerService from "services/ConsumerService";

interface IProps {
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
    reason: string;
};

const ArchiveModal: React.FC<IProps> = ({ userId, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            reason: "",
        },
    });

    const onSubmit = async (data: FormInputs) => {
        try {
            const message = await ConsumerService.putArchive(data.reason, userId);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        onClose();
    };

    return (
        <Modal
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            open={true}
            title={<p className="font-bold text-lg">Are you sure you want to Archive Consumer?</p>}
            onCancel={handleClose}
            footer={
                <div className="flex justify-end">
                    <ModalButton
                        className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white mr-2 btn-cancel"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        btnType={"cancel"}
                        title={"Cancel"}
                    />
                    <ModalButton
                        btnType={"save"}
                        title={"Save"}
                        disabled={isSubmitting || !isDirty}
                        loading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                        className="px-4 py-2.5 rounded-xl inline-flex items-center btn-save text-white bg-blue-500 hover:bg-blue-400"
                    />
                </div>
            }
        >
            <div className="col-span-12">
                <div className="col-span-12">
                    <RHFTextAreaField<FormInputs>
                        rules={{
                            required: "This is a required field!",
                        }}
                        control={control}
                        name={"reason"}
                        placeholder="Enter reasons for rejection"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ArchiveModal;
