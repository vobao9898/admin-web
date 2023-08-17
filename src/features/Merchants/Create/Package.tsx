import * as yup from "yup";
import IPricingPlan from "interfaces/IPricingPlan";
import Button from "components/Button";
import { ID_PACKAGE_ALLOW_ADD_MORE_STAFF } from "contants";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RHFInputNumber, RHFRadioGroup } from "components/Form";
import { FC, useEffect } from "react";
import { getPackageOptions } from "utils";
import { yupResolver } from "@hookform/resolvers/yup";

export interface IPackage {
    packageId: number;
    additionStaff?: string;
}

type FormInputs = {
    packagePricing: number;
    additionStaff: string | undefined;
};

const schema = yup.object({
    packagePricing: yup.number().required("This is a required field!"),
    additionStaff: yup.string().when("packagePricing", {
        is: (packageId: number) => packageId === ID_PACKAGE_ALLOW_ADD_MORE_STAFF,
        then: (schema) =>
            schema.required("This is a required field!").matches(new RegExp("^[0-9]+$"), "Please enter only number!"),
    }),
});

interface IProps {
    packageData?: IPackage;
    packages: IPricingPlan[];
    onPreviousPackage: (data: IPackage) => void;
    onSubmitPackage: (data: IPackage) => void;
}

const Package: FC<IProps> = ({ packages, packageData, onPreviousPackage, onSubmitPackage }) => {
    const navigate = useNavigate();

    const { control, watch, setValue, handleSubmit, getValues } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            packagePricing: packageData?.packageId || undefined,
            additionStaff: packageData ? packageData.additionStaff : "",
        },
    });

    const packagePricingWatch = watch("packagePricing");

    useEffect(() => {
        if (packagePricingWatch !== ID_PACKAGE_ALLOW_ADD_MORE_STAFF) {
            setValue("additionStaff", undefined, { shouldValidate: true });
        }
    }, [packagePricingWatch, setValue]);

    const onSubmit = (data: FormInputs) => {
        const payload: IPackage = {
            packageId: data.packagePricing,
            additionStaff: data.additionStaff,
        };
        onSubmitPackage(payload);
    };

    const handlePrevious = () => {
        const values = getValues();
        const payload: IPackage = {
            packageId: values.packagePricing,
            additionStaff: values.additionStaff,
        };
        onPreviousPackage(payload);
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div>
            <div className="font-bold text-lg mb-4 text-blue-500">Package & Pricing</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12">
                        <RHFRadioGroup<FormInputs>
                            control={control}
                            name={"packagePricing"}
                            label="Try NailSoft Merchant free for 3 months , no credit card required"
                            options={getPackageOptions(packages)}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-3 lg:col-span-3">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"additionStaff"}
                            label="Addition staff"
                            allowNegative={false}
                            disabled={
                                packagePricingWatch === undefined ||
                                (packagePricingWatch && packagePricingWatch !== ID_PACKAGE_ALLOW_ADD_MORE_STAFF)
                                    ? true
                                    : false
                            }
                            placeholder="Enter addition staff"
                        />
                    </div>
                    <div className="col-span-12 flex justify-between">
                        <Button title="Submit" type="submit" btnType="ok" />
                        <div>
                            <Button onClick={handlePrevious} title="Previous" />
                            <Button onClick={handleCancel} title="Cancel" btnType="cancel" moreClass="ml-2" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Package;
