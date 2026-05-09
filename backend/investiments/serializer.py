from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import CardInvestiment, ItemInvestiment
from assets.serializer import AssetSerializer
from assets.models import Asset


class ItemInvestimentSerializer(serializers.ModelSerializer):
    asset = AssetSerializer(read_only=True)
    asset_id = serializers.PrimaryKeyRelatedField(
        queryset=Asset.objects.all(),
        source='asset',
        write_only=True
    )

    class Meta:
        model = ItemInvestiment
        fields = [
            'id',
            'asset',
            'asset_id',
            'order_type',
            'quantity',
            'unit_price',
            'operation_date',
            'card'
        ]
        extra_kwargs = {
            'card': {'write_only': True}
        }


class CardInvestimentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    itens = ItemInvestimentSerializer(many=True, read_only=True)

    class Meta:
        model = CardInvestiment
        fields = ['id', 'month', 'year', 'user', 'itens']
        validators = [
            UniqueTogetherValidator(
                queryset=CardInvestiment.objects.all(),
                fields=['month', 'year', 'user'],
                message='Já existe um registro de investimentos para este mês e ano.',
            )
        ]
