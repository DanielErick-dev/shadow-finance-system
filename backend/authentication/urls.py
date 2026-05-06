from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import CookieLoginView, CookieTokenRefreshView, LogoutView


urlpatterns = [
    path('login/', CookieLoginView.as_view(), name='login_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
