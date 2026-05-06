from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from decouple import config

SECURE_COOKIE = config('DJANGO_ENV', default='development') == 'PRODUCTION'


class CookieLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {'detail': 'Credenciais Inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        refresh = RefreshToken.for_user(user)

        response = Response({'detail': 'Login realizado com sucesso'})
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=SECURE_COOKIE,
            samesite='Lax',
            max_age=60 * 60,
            path='/',
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=SECURE_COOKIE,
            samesite='Lax',
            max_age=60 * 60 * 24,
            path='/',
        )
        return response


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response(
                {'detail': 'Refresh token não encontrado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
        
        except Exception:
            return Response(
                {'detail': 'Refresh token inválido ou expirado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        response = Response({'detail': 'Token Renovado'})
        response.set_cookie(
            key='access_token',
            value=new_access,
            httponly=True,
            secure=SECURE_COOKIE,
            samesite='Lax',
            max_age=60 * 60,
            path='/',
        )
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response = Response({'detail': 'Logout realizado com sucesso'})
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        return response
