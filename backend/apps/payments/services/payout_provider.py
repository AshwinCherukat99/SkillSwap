from abc import ABC,abstractmethod

class PayoutProvider(ABC):
    @abstractmethod
    def create_transfer(self,payout):
        pass 
    @abstractmethod
    def fetch_transfer(self,transfer_id):
        pass
    @abstractmethod
    def webhook(self,payload,signature):
        pass 

class MockPayoutProvider(PayoutProvider):
    def create_transfer(self,payout):
        return {
            'transfer_id':f'mock_transfer_{payout.id}',
            'status':'processing',
            'reference':f'MOCK-{payout.id}'
        } 
    def fetch_transfer(self,transfer_id):
        return {
            'transfer_id':transfer_id,
            'status':'processing'
        }
    def verify_webhook(self,payload,signature):
        return True