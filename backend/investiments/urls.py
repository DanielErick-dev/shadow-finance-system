from rest_framework.routers import DefaultRouter
from .views import CardInvestimentViewSet, ItemInvestimentViewSet
from django.urls import path, include


router = DefaultRouter()
router.register(r'cards-investiments', CardInvestimentViewSet, basename='cardinvestiment')

item_investiment_list = ItemInvestimentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

item_investiment_detail = ItemInvestimentViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('', include(router.urls)),
    path('itens-investiments/', item_investiment_list, name='itens-investiments'),
    path('itens-investiments/<int:pk>/', item_investiment_detail, name='itens-investiments-detail')
]
