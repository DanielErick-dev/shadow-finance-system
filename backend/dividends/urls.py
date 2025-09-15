from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CardDividendMonthViewSet,
    ItemDividendViewSet
)


router = DefaultRouter()

router.register(r'cards-dividends', CardDividendMonthViewSet, basename='card-dividend')
item_dividend_list = ItemDividendViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

item_dividend_detail = ItemDividendViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('', include(router.urls)),
    path('itens-dividends/', item_dividend_list, name='item-dividend-list'),
    path('itens-dividends/<int:pk>/', item_dividend_detail, name='item-dividend-detail')
]
