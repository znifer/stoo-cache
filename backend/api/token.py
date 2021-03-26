import requests
#from api_secrets import api_username, api_password
api_username = ""
api_password = ""
_API_URL = 'https://dekanat.bstu.ru/api/v1/token/'


class Token():
    def __init__(self):
        self._token = ''
        #self.login()

    def login(self):
        resp = requests.post(_API_URL + 'auth/', json={
            'username': api_username,
            'password': api_password
        })
        self._token = resp.json()['token']

    def refresh(self):
        print('refreshing token')
        resp = requests.post(_API_URL + 'refresh/', json={
            'token': self._token
        })
        if resp.status_code == 200:
            self._token = resp.json()['token']
        else:
            self.login()

    def is_valid(self):
        resp = requests.post(_API_URL + 'verify/', json={
            'token': self._token
        })
        return resp.status_code == 200

    def get_headers(self):
        if not self.is_valid():
            self.refresh()
        return {'Authorization': 'Bearer {}'.format(self._token)}


api_token = Token()
