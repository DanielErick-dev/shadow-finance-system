from .models import ItemDividend, CardDividendMonth
from rest_framework import serializers
from assets.serializer import AssetSerializer
from assets.models import Asset


class ItemDividendSerializer(serializers.ModelSerializer):
    asset = AssetSerializer(read_only=True)
    asset_id = serializers.PrimaryKeyRelatedField(
        queryset=Asset.objects.all(), source='asset', write_only=True
    )

    class Meta:
        model = ItemDividend
        fields = ['id', 'asset', 'asset_id', 'value', 'received_date', 'card_month']
        extra_kwargs = {
            'card_month': {'write_only': True}
        }


class CardDividendMonthSerializer(serializers.ModelSerializer):
    itens = ItemDividendSerializer(many=True, read_only=True)

    class Meta:
        model = CardDividendMonth
        fields = ['id', 'month', 'year', 'itens']
