'use client'

import { endTimeDisplayEncode } from "@/app/lib/utils";
import { Button, Result } from "antd";
import { ResultStatusType } from "antd/es/result";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


export default function pageWrapper() {
    return (
        <Suspense>
            <ReservationResultPage />
        </Suspense>
    );
}

function ReservationResultPage() {
    const searchParams = useSearchParams();

    let status: ResultStatusType;
    let title;
    let subTitle;
    let url;
    if (searchParams.get("type") === "success") {
        status = "success"
        url = "/my"
        title = "성공적으로 예약을 완료하였습니다."
        if (searchParams.get("reservation") === "onetime") {
            subTitle = (<div>
                <p>{`날짜: ${searchParams.get("date")}`}</p>
                <p>{`시간: ${searchParams.get("startTime")} ~ ${endTimeDisplayEncode(searchParams.get("endTime") as string)}`}</p>
            </div>)
        }
        else {
            subTitle = (<div>
                <p>{`요일: ${searchParams.get("dayInWeek")}`}</p>
                <p>{`시간: ${searchParams.get("startTime")} ~ ${endTimeDisplayEncode(searchParams.get("endTime") as string)}`}</p>
            </div>)
        }
    }
    else {
        status = "warning"
        title = "예약에 실패하였습니다. 잠시후에 다시 시도해 주세요."
        subTitle = (<div>
            <p>이미 다른 누군가가 이미 예약한 경우 또는 많은 사람이 동시에 예약하는 경우에 발생할 가능성이 있습니다.</p>
        </div>)
        url = "/"
    }

    return (
        <Result
            status={status}
            title={title}
            subTitle={subTitle}
            extra={[
                <Link key={1} href={url}>
                    <Button type="primary" key="confirm">
                        Confirm
                    </Button>
                </Link>

            ]}
        />
    )
}