import { Alert } from "antd";

export default function FilckerAlert({ message, description, type, display, className = undefined }
    : { message: string, description: string, type: "success" | "info" | "warning" | "error" | undefined, display: boolean, className?: string | undefined}
) {
    return (
        <div className={className}>
            {
                (display)
                    ?
                    <div>
                        <Alert
                            message={message}
                            description={description}
                            type={type}
                            showIcon
                        />
                    </div>
                    :
                    null
            }
        </div>

    );
}