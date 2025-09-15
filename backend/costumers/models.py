from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    pass

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self):
        return self.username
