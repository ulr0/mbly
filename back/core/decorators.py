import jwt

from django.http import JsonResponse

from accounts.models import Account
from my_settings import SECRET_KEY, ALGORITHM

def login_required(func):
    def wrapper(self, request, *arg, **kwargs):
        try:
            access_token = request.headers.get('Authorization', None)
            if not access_token:
                return JsonResponse({'message' : 'Unauthorized Access'}, status=401)
            
            payload = jwt.decode(access_token, SECRET_KEY, algorithms = ALGORITHM)
            account = Account.objects.get(id = payload['id'])
            
            if account.is_deleted:
                return JsonResponse({'message' : 'Invalid User'}, status = 401)
            
            request.account = account

            return func(self, request, *arg, **kwargs)
        except jwt.DecodeError:
            return JsonResponse({'message' : 'Unauthorized Token'}, status = 401)
        except Account.DoesNotExist:
            return JsonResponse({'message' : 'Invalid User'}, status = 401)
        
    return wrapper