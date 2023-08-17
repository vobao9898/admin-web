import HelperText from "components/HelperText";
import Label from "components/Label";
import Upload, { IUploadProps } from "components/Upload/Upload";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";

interface IProps<T extends Record<string, any>> extends IUploadProps {
    control: Control<T>;
    name: FieldPath<T>;
    fieldName?: string;
    placeholder?: string;
    label?: string;
    labelRequired?: boolean;
    showError?: boolean;
    disabled?: boolean;
    className?: string;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
    onUploaded: (fileId: number, path: string) => void;
}

const RHFUpload = <T extends Record<string, any>>({
    control,
    name,
    label,
    labelRequired = true,
    fieldName = "file",
    showError = true,
    className = "",
    accept = "image/*",
    action,
    allowPdf = false,
    rules,
    headers,
    disabled = false,
    onUploaded,
}: IProps<T>) => {
    return (
        <>
            {label && <Label title={label} htmlFor={name} required={labelRequired} />}
            <Controller
                rules={rules}
                name={name}
                control={control}
                render={({ field: { value, name }, fieldState: { error } }) => (
                    <>
                        <Upload
                            id={name}
                            headers={headers}
                            className={className}
                            filePath={value}
                            name={fieldName}
                            onUploaded={onUploaded}
                            action={action}
                            accept={accept}
                            allowPdf={allowPdf}
                            disabled={disabled}
                        />
                        {showError && <HelperText message={error?.message || ""} />}
                    </>
                )}
            />
        </>
    );
};

export default RHFUpload;
