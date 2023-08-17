import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Modal, Spin } from "antd";
import { RHFCheckBox, RHFSelect, RHFTextField, RHFUpload } from "components/Form";
import { API_BASE_URL, GIFT_CARD_TEMPLATE_OPTIONS, STATUS_OPTIONS } from "contants";
import ModalButton from "components/ModalButton";
import IGiftCardTemplate from "interfaces/IGiftCardTemplate";
import GiftCardService from "services/GiftCardService";
import React from "react";
import * as yup from "yup";
import Page from "components/Page";
import Message from "components/Message";

interface IProps {
    onClose: (isReload: boolean) => void;
    giftcard: IGiftCardTemplate | null;
}

type FormInputs = {
    giftCardTemplateName: string;
    isDisabled: number;
    giftCardType: string;
    isConsumer: boolean;
    fileId: number | null | undefined;
    fileURL: string | null | undefined;
};

const schema = yup.object({
    giftCardTemplateName: yup.string().required("This is a required field!"),
    isDisabled: yup.number().required("This is a required field!"),
    giftCardType: yup.string().required("This is a required field!"),
    isConsumer: yup.boolean().required("This is a required field!"),
    fileId: yup.number().notRequired(),
    fileURL: yup.string().notRequired(),
});

const TemplateModal: React.FC<IProps> = ({ onClose, giftcard }) => {
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
            giftCardTemplateName: giftcard?.giftCardTemplateName || "",
            isDisabled: giftcard?.isDisabled || 0,
            giftCardType: giftcard?.giftCardType || undefined,
            fileURL: giftcard?.imageUrl || "",
            fileId: giftcard?.fileId || undefined,
            isConsumer: giftcard?.isConsumer !== undefined ? Boolean(giftcard?.isConsumer) : false,
        },
    });

    const onSubmit = (data: FormInputs) => {
        const body: Partial<IGiftCardTemplate> = {
            fileId: data.fileId ? data.fileId : 4034,
            giftCardTemplateName: data.giftCardTemplateName,
            giftCardType: data.giftCardType,
            isConsumer: data.isConsumer ? 1 : 0,
            isDisabled: data.isDisabled,
        };

        return new Promise<void>((resolve, reject) => {
            if (giftcard) {
                onUpdate(giftcard.giftCardTemplateId, body, data);
            } else {
                onCreate(body, data);
            }
        });
    };

    const handleReset = (data: FormInputs) => {
        reset({
            fileId: data.fileId,
            giftCardTemplateName: data.giftCardTemplateName,
            giftCardType: data.giftCardType,
            isConsumer: data.isConsumer,
            isDisabled: data.isDisabled,
        });
    };

    const onCreate = (body: Partial<IGiftCardTemplate>, data: FormInputs) => {
        return new Promise<void>((resolve, reject) => {
            GiftCardService.create(body).then(
                (resp) => {
                    resolve();
                    onClose(true);
                    Message.success({ text: resp });
                },
                (err) => {
                    handleReset(data);
                }
            );
        });
    };

    const onUpdate = (id: number, body: Partial<IGiftCardTemplate>, data: FormInputs) => {
        return new Promise<void>((resolve, reject) => {
            GiftCardService.update(id, body).then(
                (resp) => {
                    resolve();
                    onClose(true);
                    Message.success({ text: resp });
                },
                (err) => {
                    handleReset(data);
                }
            );
        });
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose(false);
        }
    };

    const afterClose = () => {
        reset();
    };

    return (
        <Page title="Template">
            <Spin spinning={isSubmitting}>
                <Modal
                    centered={true}
                    maskClosable={false}
                    destroyOnClose={true}
                    open={true}
                    width={700}
                    afterClose={afterClose}
                    title={<p className="font-bold text-lg">{giftcard ? "Edit" : "New Template"}</p>}
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
                                    name={"giftCardTemplateName"}
                                    label="Name"
                                    placeholder="Enter subtitle"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFSelect<FormInputs>
                                    className="w-full"
                                    control={control}
                                    name={"giftCardType"}
                                    options={GIFT_CARD_TEMPLATE_OPTIONS}
                                    label="Group"
                                    placeholder="Enter group"
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
                                <RHFUpload<FormInputs>
                                    control={control}
                                    name="fileURL"
                                    action={`${API_BASE_URL}File`}
                                    label="Image"
                                    onUploaded={function (fileId: number, path: string): void {
                                        setValue("fileId", fileId, { shouldDirty: true });
                                        setValue("fileURL", path, { shouldDirty: true });
                                    }}
                                    labelRequired={false}
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFCheckBox<FormInputs>
                                    className="w-full"
                                    control={control}
                                    name={"isConsumer"}
                                    label="Visible On App"
                                    labelRequired={false}
                                />
                            </div>
                        </div>
                    </form>
                </Modal>
            </Spin>
        </Page>
    );
};

export default TemplateModal;
