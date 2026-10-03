function RecentTransactions({transactions,onViewAll}){
    const formatAmount=(amount)=>{
        return Number(amount||0).toLocaleString(
            'en-IN',
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        )
    }
    
}