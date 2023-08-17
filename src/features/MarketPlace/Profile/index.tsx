import { yupResolver } from "@hookform/resolvers/yup";
import { Switch } from "antd";
import { RHFSelect, RHFSwitch, RHFTextField, RHFUpload } from "components/Form";
import { API_BASE_URL, STATUS_OPTIONS } from "contants";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IMarketPlace from "interfaces/IMarketPlace";
import Spin from "components/Spin";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import MarketPlaceService from "services/MarketPlaceService";
import * as yup from "yup";
import Message from "components/Message";

interface CustomizedState {
    marketPlace: IMarketPlace;
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

const MarketPlaceProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const [isEdit, setEdit] = useState<boolean>(false);

    const marketPlace = (state as CustomizedState)?.marketPlace || {};
    marketPlace.fileURL = marketPlace?.fileURL || "";

    const [brand] = useState(marketPlace);

    const BREAD_CRUMBS = [
        {
            name: "Market Place",
            path: "/market-place",
        },
        {
            name: isEdit ? "Edit" : "Detail",
            path: "/",
        },
    ];

    const {
        control,
        setValue,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            name: brand.name,
            link: brand.link,
            isDisabled: brand.isDisabled,
            onTop: brand.onTop,
            fileURL: brand.fileURL,
            fileId: brand.fileId,
        },
    });

    const onSubmit = async (data: FormInputs) => {
        if (!id) return false;

        const body: Partial<IMarketPlace> = {
            marketPlaceId: parseInt(id),
            name: data.name,
            link: data.link,
            onTop: data.onTop,
            isDisabled: data.isDisabled,
            fileURL: data.fileURL,
            fileId: data.fileId,
        };
        try {
            const message = await MarketPlaceService.update(body);
            Message.success({ text: message });
            navigate("/market-place");
        } catch (error) {
            reset(data);
        }
    };

    const toggleEdit = () => {
        setEdit((preVal) => !preVal);
    };

    return (
        <Spin spinning={isSubmitting}>
            <Breadcrumb title="Market Place" breadcrumbs={BREAD_CRUMBS} />
            <div className="px-4 py-5 rounded-xl shadow bg-gray-50">
                {isEdit ? (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                    <RHFSwitch<FormInputs> control={control} name={"onTop"} label="On Top" />
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
                                <div className="col-span-12">
                                    <div className="flex space-x-2">
                                        <Button type="reset" title="Cancel" onClick={toggleEdit} />
                                        <Button type="submit" title="SAVE" btnType="ok" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="mb-5 flex items-start justify-between">
                            <h2 className="w-1/2 text-lg font-semibold text-black">{brand?.name}</h2>
                            <Button title="BACK" onClick={() => window.history.back()} />
                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-1/3 mb-5">
                                <p className="mb-1 text-base font-medium text-black">Name</p>
                                <p className="text-sm leading-none text-cyan-blue font-normal">{brand?.name}</p>
                            </div>
                            <div className="w-1/3 mb-5">
                                <p className="mb-1 text-base font-medium text-black">URL</p>
                                <p className="w-full break-words text-sm leading-none text-cyan-blue font-normal">
                                    {brand?.link}
                                </p>
                            </div>
                            <div className="w-full mb-5">
                                <p className="mb-1 text-base font-medium text-black">Image</p>
                                <div className="w-36">
                                    <img className="w-full object-cover" src={brand?.fileURL} alt={"market place"} />
                                </div>
                            </div>
                            <div className="w-full mb-5">
                                <p className="mb-1 text-base font-medium text-black">Status</p>
                                <p className="text-sm leading-none text-cyan-blue font-normal">
                                    {brand?.isDisabled === 0 ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <div className="w-full mb-5 flex">
                                <p className="mb-1 text-base font-medium text-black mr-4">On Top</p>
                                <Switch checked={brand?.onTop} />
                            </div>
                        </div>
                        <div className="w-fit">
                            <Button onClick={toggleEdit} title="EDIT" btnType="ok" />
                        </div>
                    </>
                )}
            </div>
        </Spin>
    );
};

export default MarketPlaceProfile;
