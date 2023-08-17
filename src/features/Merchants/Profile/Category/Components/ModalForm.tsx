import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { RHFSelect, RHFSwitch, RHFTextField } from "components/Form";
import type { DefaultOptionType } from "antd/es/select";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import ICategory from "interfaces/ICategory";
import IMerchant from "interfaces/IMerchant";
import ModalButton from "components/ModalButton";

interface IProps {
    merchantId: number;
    merchant: IMerchant;
    category?: ICategory;
    open: boolean;
    categories: ICategory[];
    onSuccess: () => void;
    onClose: () => void;
}

type FormInputs = {
    name: string;
    categoryType: string;
    isSubCategory: boolean;
    parentId?: number | undefined | null;
};

const getCategoriesOptions = (categories: ICategory[]) => {
    const data: DefaultOptionType[] = categories.map((item) => {
        return {
            value: item.categoryId,
            label: item.name,
        };
    });
    return data;
};

const ModalForm: React.FC<IProps> = ({ merchantId, merchant, category, open, categories, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            categoryType: category ? category.categoryType : undefined,
            name: category ? category.name : "",
            isSubCategory: category ? category.isSubCategory : undefined,
            parentId: category ? category?.parentId : undefined,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                categoryType: category ? category.categoryType : undefined,
                name: category ? category.name : "",
                isSubCategory: category ? category.isSubCategory : undefined,
                parentId: category && category?.parentId ? category.parentId : undefined,
            });
        }
    }, [open, category, reset]);

    const watchSubCategory = watch("isSubCategory");

    const onSubmit = async (data: FormInputs) => {
        const payload = {
            name: data.name,
            merchantId: merchantId,
            categoryType: data.categoryType,
            isSubCategory: data.isSubCategory,
            categoryId: category ? category.categoryId : undefined,
            parentId: data.isSubCategory ? data.parentId : undefined,
        };

        if (category && category.categoryId) {
            await handleEdit(category.categoryId, data, payload);
        } else {
            await handleCreate(data, payload);
        }
    };

    const handleEdit = async (categoryId: number, data: FormInputs, payload: any) => {
        try {
            const message = await MerchantService.editCategory(payload, categoryId);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const handleCreate = async (data: FormInputs, payload: any) => {
        try {
            const message = await MerchantService.createCategory(payload);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const afterClose = () => {
        reset();
    };

    const reRender = () => {
        return (
            <form>
                {merchant.type === "Retailer" ? (
                    <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                        <div className="col-span-12">
                            <RHFTextField<FormInputs>
                                control={control}
                                name={"name"}
                                placeholder="Enter category name"
                                label="Category Name"
                                rules={{
                                    required: "This is a required field!",
                                }}
                            />
                        </div>
                        <div className="col-span-12">
                            <RHFSwitch<FormInputs> control={control} name={"isSubCategory"} label="Is Subcategory" />
                        </div>
                        {watchSubCategory ? (
                            <div className="col-span-12">
                                <RHFSelect<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                    }}
                                    className="w-full"
                                    control={control}
                                    name={"parentId"}
                                    options={getCategoriesOptions(categories)}
                                    placeholder="Parent name"
                                    label="Parent Name"
                                />
                            </div>
                        ) : (
                            <div className="col-span-12">
                                <div className="flex mt-2">
                                    <div className="text-[red] mr-1">Note:</div>
                                    <div>products can only be added to subcategories</div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                        <div className="col-span-12">
                            <RHFTextField<FormInputs>
                                control={control}
                                name={"name"}
                                placeholder="Enter category name"
                                label="Category Name"
                                rules={{
                                    required: "This is a required field!",
                                }}
                            />
                        </div>
                        <div className="col-span-12">
                            <RHFSelect<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                className="w-full"
                                control={control}
                                name={"categoryType"}
                                options={[
                                    { value: "Product", label: "PRODUCT" },
                                    { value: "Service", label: "SERVICE" },
                                ]}
                                placeholder="Type"
                                label="Type"
                            />
                        </div>
                    </div>
                )}
            </form>
        );
    };

    return (
        <Modal
            centered={true}
            width={600}
            maskClosable={false}
            destroyOnClose={true}
            open={open}
            title={<p className="font-bold text-lg">{"Edit"}</p>}
            afterClose={afterClose}
            onCancel={onClose}
            footer={
                <div className="flex justify-end gap-x-2">
                    <ModalButton
                        disabled={isSubmitting}
                        title="Cancel"
                        type={"button"}
                        btnType="cancel"
                        onClick={onClose}
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
            {reRender()}
        </Modal>
    );
};

export default ModalForm;
