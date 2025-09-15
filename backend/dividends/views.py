from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated
from .models import CardDividendMonth, ItemDividend
from .filters import CardDividendMonthFilter
from . serializer import ItemDividendSerializer, CardDividendMonthSerializer


class CardDividendMonthViewSet(viewsets.ModelViewSet):
    serializer_class = CardDividendMonthSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = CardDividendMonthFilter

    def get_queryset(self):
        return CardDividendMonth.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ItemDividendViewSet(viewsets.ModelViewSet):
    serializer_class = ItemDividendSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ItemDividend.objects.filter(card_month__user=self.request.user)

    def perform_create(self, serializer):
        card_month_id = self.request.data.get('card_month')
        if not card_month_id:
            raise serializers.ValidationError(
                {'card_month': 'este campo é obrigatório'}
            )
        try:
            parent_card = CardDividendMonth.objects.get(
                id=card_month_id, user=self.request.user
            )
        except CardDividendMonth.DoesNotExist:
            raise serializers.ValidationError(
                {'detail': 'card de Mês inválido ou não pertence a voce'}
            )
        serializer.save(card_month=parent_card)
