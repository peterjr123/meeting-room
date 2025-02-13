import { auth } from "@clerk/nextjs/server";
import Nav from "./nav";
import { Button, Card, Divider, Flex } from "antd";
export default async function Home() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <div className="flex justify-center">
      <Flex className="max-w-[80rem] w-full" vertical gap="middle">
        <Card title="Quick Reservation">
          
          버튼을 클릭하면 현재 예약 가능한 회의실에 빠르게 예약 가능합니다
          <Divider></Divider>
          <Button className="float-end" type="primary">예약하기</Button>
        </Card>
        <Card title="Check Reservation Schedule">
          현재 예약 현황을 확인할 수 있습니다.
          <Divider></Divider>
          <Button className="float-end" type="primary">예약현황</Button>
        </Card>
      </Flex>
    </div>
  );
}
