import { auth } from "@clerk/nextjs/server";
import Nav from "./nav";
import { Button, Card, Divider, Flex } from "antd";
import Link from "next/link";
export default async function Home() {
  return (
    <div className="flex justify-center">
      <Flex className="max-w-[80rem] w-full" vertical gap="middle">
        <Card title="Quick Reservation">

          버튼을 클릭하면 현재 예약 가능한 회의실에 빠르게 예약 가능합니다
          <Divider></Divider>
          <Link href="/quick">
            <Button className="float-end" type="primary">예약하기</Button>
          </Link>
        </Card>
        <Card title="Dashboard">
          대시보드에서는 현재 예약 현황을 확인하고, 세부적인 예약 정보를 설정할 수 있습니다.
          <Divider></Divider>
          <Link href="/dashboard">
            <Button className="float-end" type="primary">대시보드</Button>
          </Link>
        </Card>
      </Flex>
    </div>
  );
}
