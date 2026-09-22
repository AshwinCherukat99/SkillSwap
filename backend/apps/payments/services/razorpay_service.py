import razorpay
from django.conf import settings

def get_razorpay_client():
    return razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET,
        )
    )

def create_course_order(*,amount,receipt):
    client=get_razorpay_client()
    order=client.order.create({
        'amount':int(amount*100),
        'currency':'INR',
        'receipt':receipt,
        'payment_capture':1,
    })
    return order