import React from 'react';

import { Button, Result } from 'antd';
import Link from 'next/link';

export default function errorPage() {
    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={<Link href="/"><Button type="primary">Back Home</Button></Link>}
        />
    );

}