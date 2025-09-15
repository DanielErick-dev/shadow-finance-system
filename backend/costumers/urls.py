from django.urls import path
from .views import ApiUserInfoView


urlpatterns = [
    path('me/', ApiUserInfoView.as_view(), name='user-info')
]
