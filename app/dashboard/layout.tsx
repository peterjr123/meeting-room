import '@ant-design/v5-patch-for-react-19';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='h-full'>
            {children}
        </div>
    );
}