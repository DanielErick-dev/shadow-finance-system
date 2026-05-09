from .models import Asset
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator


class AssetSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Asset
        fields = ['id', 'code', 'type', 'user']
        validators = [
            UniqueTogetherValidator(
                queryset=Asset.objects.all(),
                fields=['code', 'user'],
                message='Você já possui um ativo com este código.',
            )
        ]
