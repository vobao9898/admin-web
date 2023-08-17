import Button from "components/Button";
import RHFTextAreaField from "components/Form/RHFTextAreaField";
import { RHFCurrencyInput, RHFSelect, RHFTextField, RHFUpload } from "components/Form";
import { API_BASE_URL } from "contants";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { DefaultOptionType } from "antd/es/select";
import ICategory from "interfaces/ICategory";
import IExtra from "interfaces/IExtra";
import IService from "interfaces/IService";
import MerchantService from "services/MerchantService";
import Message from "components/Message/Message";

const STATUS_OPTIONS = [
    { value: 0, label: "Active" },
    { value: 1, label: "Inactive" },
];

interface IProps {
    merchantId: number;
    categories: ICategory[];
    extras: IExtra[];
    service?: IService;
    onClose: () => void;
    onSuccess: () => void;
}

interface Extra {
    extraId: number;
    description: string;
    duration: string;
    isDisabled: number;
    name: string;
    price: string;
    supplyFee: string;
    merchantId: number;
    imageUrl: string;
    fileId: number;
}

type FormInputs = {
    name: string;
    imageUrl: string;
    description: string;
    categoryId: number;
    duration: number;
    openTime: number;
    secondTime: number;
    price: string;
    isDisabled: number;
    supplyFee: string;
    merchantId: number;
    fileId: number;
    extraId: number;
    extras: Extra[];
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

const getExtrasOptions = (extras: IExtra[]) => {
    const data: DefaultOptionType[] = extras.map((item) => {
        return {
            value: item.extraId,
            label: item.name,
        };
    });
    return data;
};

const EditForm: React.FC<IProps> = ({ merchantId, service, categories, extras, onClose, onSuccess }) => {
    const DEFAULT_EXTRA: Extra = {
        extraId: 0,
        description: "",
        duration: "",
        isDisabled: 0,
        name: "",
        price: "",
        supplyFee: "",
        imageUrl: "",
        fileId: 0,
        merchantId: merchantId,
    };

    const { control, handleSubmit, reset, setValue, watch } = useForm<FormInputs>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            name: service ? service.name : "",
            fileId: service ? service.fileId : undefined,
            imageUrl: service ? service?.imageUrl : "",
            description: service ? service.description : "",
            categoryId: service ? service.categoryId : undefined,
            duration: service ? service.duration : undefined,
            openTime: service ? service.openTime : undefined,
            secondTime: service ? service.secondTime : undefined,
            price: service ? service.price : "",
            isDisabled: service ? service.isDisabled : 0,
            supplyFee: service ? service.supplyFee : "",
            extras: service ? service.extras : [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "extras",
    });

    const watchExtraId = watch("extraId");

    useEffect(() => {
        if (watchExtraId) {
            if (extras) {
                const index = extras.findIndex((item) => item.extraId === watchExtraId);
                if (index !== -1) {
                    const data: Extra = {
                        description: extras[index].description,
                        duration: extras[index].duration,
                        isDisabled: extras[index].isDisabled,
                        name: extras[index].name,
                        price: extras[index].price,
                        supplyFee: extras[index].supplyFee,
                        merchantId: merchantId,
                        imageUrl: extras[index].imageUrl,
                        fileId: extras[index].fileId,
                        extraId: extras[index].extraId,
                    };
                    append(data);
                }
            }
        }
    }, [watchExtraId, append, extras, merchantId]);

    const onSubmit = async (data: FormInputs) => {
        const payload = {
            name: data.name,
            imageUrl: data.imageUrl,
            description: data.description,
            categoryId: data.categoryId,
            duration: data.duration,
            openTime: data.openTime ? data.openTime : 0,
            secondTime: data.secondTime ? data.secondTime : 0,
            price: data.price,
            isDisabled: data.isDisabled,
            supplyFee: data.supplyFee,
            merchantId: merchantId,
            fileId: data.fileId,
            extras: data.extras,
            categoryName: data.name,
        };

        if (service && service.serviceId) {
            handleUpdate(service.serviceId, data, payload);
        } else {
            handleCreate(data, payload);
        }
    };

    const handleCreate = async (data: FormInputs, payload: any) => {
        try {
            const message = await MerchantService.createService(payload);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const handleUpdate = async (serviceId: number, data: FormInputs, payload: any) => {
        try {
            const message = await MerchantService.editService(payload, serviceId);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const addMoreExtra = () => {
        append(DEFAULT_EXTRA);
    };

    const prefixMin = () => {
        return (
            <div className="h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                Min
            </div>
        );
    };

    const reRender = () => {
        return (
            <form>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12 ">
                    <div className="col-span-6 sm:col-span-6 lg:col-span-8 relative">
                        <div className="grid gap-x-5 gap-y-2 grid-cols-12 pb-10">
                            <div className="col-span-12">
                                <h3 className="font-bold text-lg text-blue-500">Edit Service</h3>
                            </div>
                            <div className="col-span-12">
                                <RHFTextField<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                    }}
                                    control={control}
                                    name={"name"}
                                    placeholder="Enter service name"
                                    label="Service Name"
                                />
                            </div>
                            <div className="col-span-12">
                                <RHFUpload<FormInputs>
                                    control={control}
                                    name="imageUrl"
                                    accept="image/*"
                                    allowPdf
                                    action={`${API_BASE_URL}File`}
                                    label="Image"
                                    onUploaded={function (fileId: number, path: string): void {
                                        setValue("fileId", fileId, { shouldValidate: true, shouldDirty: true });
                                        setValue("imageUrl", path, { shouldValidate: true, shouldDirty: true });
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
                            <div className="col-span-12">
                                <RHFSelect<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                    }}
                                    className="w-full"
                                    control={control}
                                    name={"categoryId"}
                                    options={getCategoriesOptions(categories)}
                                    label="Categories"
                                    placeholder="Enter Category"
                                />
                            </div>
                            <div className="col-span-12 mt-4">
                                <h3 className="font-bold text-lg text-blue-500">Duration</h3>
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                                <RHFCurrencyInput<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                    }}
                                    control={control}
                                    name={"duration"}
                                    label="Minutes"
                                    placeholder="Enter minutes"
                                    isTextRight={false}
                                    prefix={prefixMin()}
                                    allowNegative={false}
                                    decimalScale={0}
                                />
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                                <RHFCurrencyInput<FormInputs>
                                    control={control}
                                    name={"openTime"}
                                    label="Open Time"
                                    placeholder="Enter open time"
                                    isTextRight={false}
                                    labelRequired={false}
                                    allowNegative={false}
                                    decimalScale={0}
                                    prefix={prefixMin()}
                                />
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                                <RHFCurrencyInput<FormInputs>
                                    control={control}
                                    name={"secondTime"}
                                    label="Second Time"
                                    placeholder="Enter second time"
                                    isTextRight={false}
                                    labelRequired={false}
                                    allowNegative={false}
                                    decimalScale={0}
                                    prefix={prefixMin()}
                                />
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                                <RHFCurrencyInput<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                    }}
                                    control={control}
                                    name={"price"}
                                    label="Price"
                                    thousandSeparator=","
                                    decimalScale={2}
                                    placeholder="Enter price"
                                    isTextRight={false}
                                    allowNegative={false}
                                    fixedDecimalScale
                                />
                            </div>
                            <div className="col-span-12  lg:col-span-4">
                                <RHFSelect<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                    }}
                                    className="w-full"
                                    control={control}
                                    name={"isDisabled"}
                                    options={STATUS_OPTIONS}
                                    label="Status"
                                    placeholder="Enter Status"
                                />
                            </div>
                            <div className="col-span-12 lg:col-span-4 mb-5">
                                <RHFCurrencyInput<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                    }}
                                    control={control}
                                    name={"supplyFee"}
                                    label="Surcharged"
                                    thousandSeparator=","
                                    decimalScale={2}
                                    placeholder="0.00"
                                    isTextRight={false}
                                    allowNegative={false}
                                    fixedDecimalScale
                                />
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="flex items-center justify-between">
                                <Button
                                    title="Save"
                                    moreClass="absolute left-0 bottom-0"
                                    onClick={handleSubmit(onSubmit)}
                                />
                                <Button onClick={onClose} title="Cancel" moreClass="absolute right-0 bottom-0" />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6 sm:col-span-6 lg:col-span-4">
                        {fields.map((item, index) => {
                            return (
                                <div
                                    key={item.id}
                                    className="grid gap-x-5 gap-y-2 grid-cols-12 border border-gray-primary rounded-md p-5 mb-5 shadow-lg"
                                >
                                    <div className="col-span-12">
                                        <RHFTextField<FormInputs>
                                            rules={{
                                                required: "This is a required field!",
                                            }}
                                            control={control}
                                            name={`extras.${index}.name`}
                                            placeholder="Enter extra name"
                                            label="Extra Name"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <RHFTextAreaField<FormInputs>
                                            control={control}
                                            name={`extras.${index}.description`}
                                            placeholder="Enter description"
                                            label="Description"
                                            labelRequired={false}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <RHFCurrencyInput<FormInputs>
                                            rules={{
                                                required: "This is a required field!",
                                            }}
                                            control={control}
                                            name={`extras.${index}.duration`}
                                            placeholder="Enter min"
                                            label="Duration (Min)"
                                            isTextRight={false}
                                            allowNegative={false}
                                            prefix={prefixMin()}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <RHFCurrencyInput<FormInputs>
                                            rules={{
                                                required: "This is a required field!",
                                            }}
                                            control={control}
                                            name={`extras.${index}.price`}
                                            label="Price"
                                            thousandSeparator=","
                                            decimalScale={2}
                                            placeholder="0.00"
                                            isTextRight={false}
                                            fixedDecimalScale
                                            allowNegative={false}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <RHFCurrencyInput<FormInputs>
                                            rules={{
                                                required: "This is a required field!",
                                            }}
                                            control={control}
                                            name={`extras.${index}.supplyFee`}
                                            label="Surcharged"
                                            thousandSeparator=","
                                            decimalScale={2}
                                            placeholder="0.00"
                                            isTextRight={false}
                                            fixedDecimalScale
                                            allowNegative={false}
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <RHFSelect<FormInputs>
                                            className="w-full"
                                            control={control}
                                            name={`extras.${index}.isDisabled`}
                                            options={STATUS_OPTIONS}
                                            label="Status"
                                            placeholder="Enter status"
                                        />
                                    </div>
                                    <div className="col-span-12 mt-5">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <i
                                                    onClick={() => remove(index)}
                                                    className="las la-trash-alt text-red-500 hover:text-red-400 cursor-pointer text-3xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={addMoreExtra}
                                    className="rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-400 py-0.5 px-3 my-2"
                                >
                                    <i className="las la-plus mr-1 text-lg"></i>
                                    <span className="relative -top-0.5">Add more</span>
                                </button>
                            </div>
                            <div>
                                <div className="col-span-12 lg:col-span-6">
                                    <div className="col-span-12">
                                        <h3 className="font-bold text-lg text-blue-500">Select Extra Existing</h3>
                                    </div>
                                    <RHFSelect<FormInputs>
                                        className="w-full"
                                        control={control}
                                        name={`extraId`}
                                        options={getExtrasOptions(extras)}
                                        placeholder="Select..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    };

    return <div>{reRender()}</div>;
};

export default EditForm;
