'use client'

import { Button } from "antd";

export default function notifyPage() {
    function onNotify() {
        Notification.requestPermission().then((result) => {
            console.log(result)

            if(result === "granted") {
                const notification = new Notification("Test Notification", { body: "body"});
            }
        })
    }
    return (
        <div>
            <Button onClick={onNotify}>Notify</Button>
        </div>
    );
}