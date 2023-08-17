import React, { useState, useRef } from "react";
import { Upload as AntUpload, message } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ReactComponent as ChangeFileIcon } from "assets/images/reload.svg";
import { ReactComponent as PdfIcon } from "assets/images/pdf-icon.svg";
import { isPdfFile } from "utils";
import "./index.css";
import { KEY_TOKEN } from "contants";

export interface IUploadProps extends UploadProps {
    allowPdf?: boolean;
    disabled?: boolean;
    filePath?: string;
    content?: any;
    maxSize?: number;
    onUploaded: (fileId: number, path: string) => void;
}

const Upload: React.FC<IUploadProps> = ({
    filePath,
    accept = "image/*",
    name = "file",
    content,
    action,
    method,
    maxSize = 10,
    allowPdf = false,
    disabled = false,
    headers = {
        Authorization: `Bearer ${localStorage.getItem(KEY_TOKEN)}`,
    },
    onUploaded,
}) => {
    const [loading, setLoading] = useState(false);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            const { response } = info.file;
            setLoading(false);
            if (response && response.codeNumber === 200) {
                onUploaded(response?.data?.fileId, response?.data?.url);
            } else {
                // Upload fail
            }
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const beforeUpload = (file: RcFile) => {
        const isLt2M = file.size / 1024 / 1024 < maxSize;
        if (!isLt2M) {
            message.error(`File must smaller than ${maxSize}MB!`);
        }
        return isLt2M;
    };

    const renderPdf = (url: string) => {
        return (
            <>
                <div
                    onClick={() => {
                        window.open(url, "_blank");
                    }}
                    className="relative flex flex-col p-2 rounded-md w-full h-full"
                >
                    <div className="flex items-center justify-center flex-grow w-full">
                        <PdfIcon className="cursor-pointer" />
                        <ChangeFileIcon
                            onClick={(event) => {
                                event.stopPropagation();
                                if (triggerRef && triggerRef.current && triggerRef.current) {
                                    triggerRef.current?.click();
                                }
                            }}
                            width={25}
                            height={25}
                            className="absolute top-2 right-2 cursor-pointer"
                        />
                    </div>
                </div>
                <div ref={triggerRef} className="hidden" />
            </>
        );
    };

    const renderImage = (filePath?: string) => {
        return (
            <>
                {content ? (
                    content
                ) : filePath ? (
                    <img src={filePath} alt="avatar" style={{ width: "100%" }} />
                ) : (
                    uploadButton
                )}
            </>
        );
    };

    return (
        <div className="upload-container">
            <AntUpload
                accept={accept}
                name={name}
                listType={content ? "text" : "picture-card"}
                className="avatar-uploader"
                showUploadList={false}
                method={method}
                action={action}
                headers={headers}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                disabled={disabled}
            >
                {allowPdf && filePath && isPdfFile(filePath) ? renderPdf(filePath) : renderImage(filePath)}
            </AntUpload>
        </div>
    );
};

export default Upload;
