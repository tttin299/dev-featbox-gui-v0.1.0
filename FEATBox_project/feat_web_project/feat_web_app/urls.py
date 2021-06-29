from .api import BoardFarmViewSet, BoardViewSet, Board_LogViewSet
from django.urls import path
from rest_framework import routers

router = routers.DefaultRouter()
router.register('api/boardfarm', BoardFarmViewSet, 'boardfarm')
router.register('api/board', BoardViewSet, 'board')
router.register('api/board_log', Board_LogViewSet, 'board_log')
urlpatterns = router.urls
