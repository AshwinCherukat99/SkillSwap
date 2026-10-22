function PaymentTabs({
    activeTab,
    onTabChange
}){
    const tabs=[
        {
            key:'dahboard',
            lable:'Revenue Dashboard',
            path:'/payments/admin'
        },
        {
            key:'transactions',
            lable:'Transactions',
            path:'/payments/admin/transactions'
        },
        {
            key:'payments',
            lable:'Payments',
            path:''
        },
        {
            key:'refunds',
            lable:'Refund Requests',
            path:'/payments/admin/refunds'
        },
        {
            key:'payouts',
            lable:'Payout Requests',
            path:'/payments/admin/payouts'
        },
        {
            key:'mentor-earnings',
            lable:'Mentor Earnings',
            path:''
        },
        {
            key:'reports',
            lable:'Financial Reports',
            path:''
        },
    ]
    return (
        <div className="payment-tabs">

            {tabs.map((tab) => (

                <button
                    key={tab.key}
                    type="button"
                    className={
                        activeTab === tab.key
                            ? 'payment-tab active'
                            : 'payment-tab'
                    }
                    onClick={() => onTabChange(tab)}
                >
                    {tab.label}
                </button>

            ))}

        </div>
    )
}

export default PaymentTabs