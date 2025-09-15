from rest_framework import viewsets
from assets.models import Asset
from assets.serializer import AssetSerializer
from rest_framework.permissions import IsAuthenticated


class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Asset.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
