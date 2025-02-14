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
                title="성공적으로 삭제되었습니다."
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
                status="500"
                title="삭제에 실패하였습니다"
                subTitle={<div>
                    <p>서버에서 오류가 발생하였습니다</p>
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