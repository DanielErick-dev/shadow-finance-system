from rest_framework.permissions import IsAuthenticated
from .models import CardInvestiment, ItemInvestiment
from .serializer import CardInvestimentSerializer, ItemInvestimentSerializer
from rest_framework import viewsets
from rest_framework import serializers
from .filters import CardInvestimentMonthFilter


class ItemInvestimentViewSet(viewsets.ModelViewSet):
    queryset = ItemInvestiment.objects.all()
    serializer_class = ItemInvestimentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ItemInvestiment.objects.filter(card__user=self.request.user)

    def perform_create(self, serializer):
        card_id = self.request.data.get('card')
        if not card_id:
            raise serializers.ValidationError({
                'card': 'este campo é obrigatório'
            })
        try:
            parent_card = CardInvestiment.objects.get(
                id=card_id,
                user=self.request.user
            )
            serializer.save(card=parent_card)
        except CardInvestiment.DoesNotExist:
            serializers.ValidationError({
                'detail': 'card de investimento inválido ou não pertence a você'
            })


class CardInvestimentViewSet(viewsets.ModelViewSet):
    queryset = CardInvestiment.objects.all()
    serializer_class = CardInvestimentSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = CardInvestimentMonthFilter

    def get_queryset(self):
        return CardInvestiment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
