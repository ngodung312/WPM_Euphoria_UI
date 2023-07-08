import React from 'react'
import { Button, Result } from 'antd'

const HomeButton = () => (
    <a href="/" className="d-flex justify-content-center" style={{ textDecoration: 'none' }}>
        <Button type="primary">Back Home</Button>
    </a>
);

export const PageNotFound = () => {
    return (
        <>
            <Result
                style={{ height: '100vh' }}
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<HomeButton />}
            />
        </>
    )
}

export const PageForbidden = () => {
    return (
        <>
            <Result
                style={{ height: '100vh' }}
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<HomeButton />}
            />
        </>
    )
}

export const PageErrorServer = () => {
    return (
        <>
            <Result
                style={{ height: '100vh' }}
                status="500"
                title="500"
                subTitle="Sorry, something went wrong."
                extra={<HomeButton />}
            />
        </>
    )
}
