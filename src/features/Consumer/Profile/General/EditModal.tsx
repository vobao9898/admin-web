import IConsumer from "interfaces/IConsumer";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import * as yup from "yup";
import { RHFTextField } from "components/Form";
import ModalButton from "components/ModalButton";
import ConsumerService from "services/ConsumerService";
import Message from "components/Message/Message";

type FormInputs = {
    firstName: string;
    lastName: string;
    email: string;
};

const schema = yup.object({
    firstName: yup.string().required("This is a required field!"),
    lastName: yup.string().required("This is a required field!"),
    email: yup.string().required("This is a required field!").email("Please enter a valid email address!"),
});

interface IProps {
    consumer: IConsumer;
    onClose: () => void;
    onSuccess: () => void;
}

const EditModal: React.FC<IProps> = ({ consumer, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: consumer?.firstName,
            lastName: consumer?.lastName,
            email: consumer?.email,
        },
    });

    const onSubmit = async (data: FormInputs) => {
        const payload: Partial<IConsumer> = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: consumer.phone, //TODO: Check phone format
        };
        try {
            const message = await ConsumerService.editUser(consumer.userId, payload);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    return (
        <Modal
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            open={true}
            width={600}
            title={<p className="font-bold text-lg">Edit General Information</p>}
            onCancel={onClose}
            footer={
                <div className="flex justify-end">
                    <ModalButton
                        type={"button"}
                        className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white mr-2 btn-cancel"
                        onClick={onClose}
                        disabled={isSubmitting}
                        btnType={"cancel"}
                        title={"Cancel"}
                    />
                    <ModalButton
                        type={"submit"}
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
            <form>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"firstName"}
                            placeholder="Enter first name"
                            label="First Name"
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"lastName"}
                            placeholder="Enter last name"
                            label="Last Name"
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"email"}
                            placeholder="Enter email address"
                            label="Email Address"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditModal;
