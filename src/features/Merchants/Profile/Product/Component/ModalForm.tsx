import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "antd";
import { API_BASE_URL } from "contants";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RHFCurrencyInput, RHFSelect, RHFTextField, RHFUpload, RHFTextAreaField } from "components/Form";
import type { DefaultOptionType } from "antd/es/select";
import Message from "components/Message";
import ModalButton from "components/ModalButton";
import IProduct from "interfaces/IProduct";
import MerchantService from "services/MerchantService";
import * as yup from "yup";
import ICategory from "interfaces/ICategory";

const STATUS_OPTIONS = [
    { value: 0, label: "Active" },
    { value: 1, label: "Inactive" },
];

interface IProps {
    merchantId: number;
    open: boolean;
    categories: ICategory[];
    product?: IProduct;
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
    name: string;
    barCode: string;
    minThreshold: string;
    maxThreshold: string;
    price: string;
    quantity: string;
    categoryId: number;
    isDisabled: number;
    fileId: number | undefined | null;
    imageUrl: string | undefined | null;
    description: string | undefined | null;
};

const testBarCode = (value: string) => {
    if (value.length > 5) {
        return true;
    }
    return false;
};

const schema = yup.object({
    name: yup.string().required("This is a required field!"),
    barCode: yup
        .string()
        .required("This is a required field!")
        .test("barCodeValid", `Minimum length of this field must be equal or greater than 6 symbols`, (value) => {
            return testBarCode(value);
        }),
    minThreshold: yup.string().required("This is a required field!"),
    maxThreshold: yup.string().required("This is a required field!"),
    price: yup.string().required("This is a required field!"),
    quantity: yup.string().required("This is a required field!"),
    categoryId: yup.number().required("This is a required field!"),
    isDisabled: yup.number().required("This is a required field!"),
    description: yup.string().notRequired(),
    fileId: yup.number().notRequired(),
    imageUrl: yup.string().notRequired(),
});

const getCategoriesOptions = (categories: ICategory[]) => {
    const data: DefaultOptionType[] = categories.map((item) => {
        return {
            value: item.categoryId,
            label: item.name,
        };
    });
    return data;
};

const ModalForm: React.FC<IProps> = ({ merchantId, product, open, categories, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            barCode: product ? product.barCode : "",
            categoryId: product ? product.categoryId : undefined,
            description: product ? product.description : "",
            fileId: product ? product.fileId : undefined,
            imageUrl: product ? product.imageUrl : "",
            isDisabled: product ? product.isDisabled : 0,
            maxThreshold: product ? product.maxThreshold?.toString() : "",
            minThreshold: product ? product.minThreshold?.toString() : "",
            name: product ? product.name : "",
            price: product ? product.price : "",
            quantity: product ? product.quantity?.toString() : "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                barCode: product ? product.barCode : "",
                categoryId: product ? product.categoryId : undefined,
                description: product ? product.description : "",
                fileId: product ? product.fileId : undefined,
                imageUrl: product ? product.imageUrl : "",
                isDisabled: product ? product.isDisabled : 0,
                maxThreshold: product ? product.maxThreshold?.toString() : "",
                minThreshold: product ? product.minThreshold?.toString() : "",
                name: product ? product.name : "",
                price: product ? product.price : "",
                quantity: product ? product.quantity?.toString() : "",
            });
        }
    }, [open, product, reset]);

    const onSubmit = async (data: FormInputs) => {
        const payload = {
            name: data.name,
            description: data.description,
            categoryId: data.categoryId,
            barCode: data.barCode,
            quantity: data.quantity,
            minThreshold: data.minThreshold,
            maxThreshold: data.maxThreshold,
            price: data.price,
            isDisabled: data.isDisabled,
            fileId: data.fileId,
            merchantId: merchantId,
            productId: product?.productId,
        };

        if (product && product.productId) {
            await handleEdit(product.productId, data, payload);
        } else {
            await handleCreate(data, payload);
        }
    };

    const handleEdit = async (productId: number, data: FormInputs, payload: any) => {
        try {
            const message = await MerchantService.editProduct(payload, productId);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const handleCreate = async (data: FormInputs, payload: any) => {
        try {
            const message = await MerchantService.createProduct(payload);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const afterClose = () => {
        reset();
    };

    return (
        <Modal
            centered={true}
            width={900}
            maskClosable={false}
            destroyOnClose={true}
            open={open}
            title={<p className="font-bold text-lg">Edit</p>}
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
            <form>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"name"}
                            placeholder="Enter product name"
                            label="Product Name"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFUpload<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={`imageUrl`}
                            accept="image/*"
                            action={`${API_BASE_URL}File?category=product`}
                            label="Image"
                            onUploaded={function (fileId: number, path: string): void {
                                setValue("fileId", fileId, { shouldValidate: true });
                                setValue("imageUrl", path, { shouldValidate: true });
                            }}
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFTextAreaField<FormInputs>
                            control={control}
                            name={"description"}
                            placeholder="Enter description"
                            label="Description"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"categoryId"}
                            options={getCategoriesOptions(categories)}
                            label="Categories"
                            placeholder="Enter category"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"barCode"}
                            placeholder="Enter barcode"
                            label="BarCode"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFCurrencyInput<FormInputs>
                            control={control}
                            name={"quantity"}
                            label="Items In Stock"
                            placeholder="Enter items in stock"
                            thousandSeparator=","
                            allowNegative={false}
                            isTextRight={false}
                            decimalScale={0}
                            prefix={
                                <div className="h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                                    Item
                                </div>
                            }
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFCurrencyInput<FormInputs>
                            control={control}
                            name={"minThreshold"}
                            label="Low Threshold"
                            placeholder="Enter low threshold"
                            thousandSeparator=","
                            allowNegative={false}
                            isTextRight={false}
                            decimalScale={0}
                            prefix={
                                <div className="h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                                    Item
                                </div>
                            }
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFCurrencyInput<FormInputs>
                            control={control}
                            name={"maxThreshold"}
                            label="High Threshold"
                            placeholder="Enter high threshold"
                            thousandSeparator=","
                            allowNegative={false}
                            isTextRight={false}
                            decimalScale={0}
                            prefix={
                                <div className="h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                                    Item
                                </div>
                            }
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFCurrencyInput<FormInputs>
                            control={control}
                            name={"price"}
                            label="Price"
                            thousandSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            placeholder="Enter price"
                            isTextRight={false}
                            fixedDecimalScale
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"isDisabled"}
                            options={STATUS_OPTIONS}
                            label="Status"
                            placeholder="Enter status"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ModalForm;
