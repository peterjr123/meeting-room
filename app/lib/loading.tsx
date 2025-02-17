import { LoadingOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";

export default function Loading() {
    return  <div className="flex justify-center items-center h-full">
        <LoadingOutlined style={{ fontSize: "60px"}} />
    </div>
}