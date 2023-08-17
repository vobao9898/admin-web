import { Spin } from "antd";

const LoadingScreen = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Spin />
        </div>
    );
};

export default LoadingScreen;
