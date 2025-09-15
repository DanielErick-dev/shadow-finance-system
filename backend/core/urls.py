from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('api/v1/', include('expenses.urls')),
    path('api/v1/', include('authentication.urls')),
    path('api/v1/', include('costumers.urls')),
    path('api/v1/', include('dividends.urls')),
    path('api/v1/', include('assets.urls')),
    path('api/v1/', include('investiments.urls')),
    path("admin/", admin.site.urls),
]
