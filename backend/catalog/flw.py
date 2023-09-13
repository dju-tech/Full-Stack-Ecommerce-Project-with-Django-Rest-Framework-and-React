import requests

class FlutterwaveApi:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.flutterwave.com/v3/'
    def verify_transaction(self, transaction_id):
        url = f'{self.base_url}transactions/{transaction_id}/verify'
        headers = {
            'Authorization' : f'Bearer {self.api_key}'
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print(response.json())
            return response.json()
        else:
            raise Exception(f'Error verifying transaction: {response.status_code}')