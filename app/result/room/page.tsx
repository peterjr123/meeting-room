'use client'

import { Button, Result } from "antd";
import { ResultStatusType } from "antd/es/result";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";



export default function pageWrapper() {
    return (
        <Suspense>
            <RoomApiResultPage />
        </Suspense>
    );
}


function RoomApiResultPage() {
    const searchParams = useSearchParams();

    let subTitle = (<div>
        <p>서버에서 오류가 발생하였습니다</p>
    </div>);
    let link = "/"
    let title;
    let status: ResultStatusType = "500"
    switch (searchParams.get("type")) {
        case "create":
            title = "회의실 등록에 실패하였습니다.";
            break;
        case "delete":
            title = "회의실 삭제에 실패하였습니다.";
            break;
        case "update":
            status = "info"
            title = "회의실 정보 수정에 실패하였습니다."
            if(searchParams.get("status") === "400"){
                subTitle = (<div><p>회의실 이름 중복입니다. 다시 시도해 주세요.</p></div>)
                link = "/config"
            }

            break;
    }
    return (
        <Suspense>
            <Result
                status={status}
                title={title}
                subTitle={subTitle}
                extra={[
                    <Link key={2} href={link}>
                        <Button type="primary" key="confirm">
                            Confirm
                        </Button>
                    </Link>
                ]}
            />
        </Suspense>
    )
} 