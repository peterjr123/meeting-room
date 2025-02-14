'use client'

import { Button, Result } from "antd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ReservationResultPage() {
    const searchParams = useSearchParams();

    return (
        (searchParams.get("type") === 'success')
            ?
            <Result
                status="success"
                title="성공적으로 예약을 완료하였습니다."
                subTitle={<div>
                    <p>{`날짜: ${searchParams.get("date")}`}</p>
                    <p>{`시간: ${searchParams.get("startTime")} ~ ${searchParams.get("endTime")}`}</p>
                </div>}
                extra={[
                    <Link key={1} href="/my">
                        <Button type="primary" key="confirm">
                            Confirm
                        </Button>
                    </Link>

                ]}
            />
            :
            <Result
                status="warning"
                title="예약에 실패하였습니다. 잠시후에 다시 시도해 주세요."
                subTitle={<div>
                    <p>이미 다른 누군가가 이미 예약한 경우 또는 많은 사람이 동시에 예약하는 경우에 발생할 가능성이 있습니다.</p>
                </div>}
                extra={[
                    <Link key={2} href="/">
                        <Button type="primary" key="confirm">
                            Confirm
                        </Button>
                    </Link>
                ]}
            />
    );
}