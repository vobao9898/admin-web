import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Spin } from "antd";
import { RHFSelect, RHFSwitch, RHFTextField, RHFUpload } from "components/Form";
import { API_BASE_URL, STATUS_OPTIONS } from "contants";
import { useForm } from "react-hook-form";
import MarketPlaceService from "services/MarketPlaceService";
import ModalButton from "components/ModalButton";
import React from "react";
import * as yup from "yup";
import IMarketPlace from "interfaces/IMarketPlace";
import Message from "components/Message";

interface IProps {
    onClose: (isReload: boolean) => void;
}

type FormInputs = {
    name: string;
    link: string;
    isDisabled: number;
    onTop: boolean;
    fileURL: string;
    fileId: number;
};

const schema = yup.object({
    name: yup.string().required("This is a required field!"),
    link: yup.string().required("This is a required field!"),
    isDisabled: yup.number().required("This is a required field!"),
    onTop: yup.bool().required("This is a required field!"),
    fileURL: yup.string().required("This is a required field!"),
    fileId: yup.number().required("This is a required field!"),
});

const MarketPlaceModal: React.FC<IProps> = ({ onClose }) => {
    const {
        control,
        reset,
        setValue,
        handleSubmit,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            link: "",
            isDisabled: 0,
            onTop: false,
            fileURL: "",
            fileId: undefined,
        },
    });

    const onSubmit = async (data: FormInputs) => {
        const body: Partial<IMarketPlace> = {
            name: data.name,
            link: data.link,
            onTop: data.onTop,
            isDisabled: data.isDisabled,
            fileURL: data.fileURL,
            fileId: data.fileId,
        };
        try {
            const message = await MarketPlaceService.create(body);
            onClose(true);
            Message.success({ text: message });
        } catch (error) {
            reset(data);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose(false);
        }
    };

    return (
        <Spin spinning={isSubmitting}>
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={true}
                width={700}
                title={<p className="font-bold text-lg">New Brand</p>}
                onCancel={handleClose}
                footer={
                    <div className="flex justify-end gap-x-2">
                        <ModalButton
                            disabled={isSubmitting}
                            title="Cancel"
                            type={"button"}
                            btnType="cancel"
                            onClick={handleClose}
                        />
                        <ModalButton
                            loading={isSubmitting}
                            disabled={isSubmitting || !isDirty}
                            title="Save"
                            type={"submit"}
                            btnType="save"
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                }
            >
                <form>
                    <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                control={control}
                                name={"name"}
                                label="Name"
                                placeholder="Enter name"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                control={control}
                                name={"link"}
                                label="URL"
                                placeholder="Enter url"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFSelect<FormInputs>
                                className="w-full"
                                control={control}
                                options={STATUS_OPTIONS}
                                name={"isDisabled"}
                                label="Status"
                                placeholder="Select status"
                            />
                        </div>
                        <div className="col-span-12">
                            <RHFSwitch<FormInputs>
                                control={control}
                                name={"onTop"}
                                label="On Top"
                                labelRequired={false}
                            />
                        </div>
                        <div className="col-span-12">
                            <RHFUpload
                                control={control}
                                name="fileURL"
                                action={`${API_BASE_URL}File`}
                                label="Image"
                                onUploaded={function (fileId: number, path: string): void {
                                    setValue("fileId", fileId, { shouldValidate: true, shouldDirty: true });
                                    setValue("fileURL", path, { shouldValidate: true, shouldDirty: true });
                                }}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </Spin>
    );
};

export default MarketPlaceModal;
