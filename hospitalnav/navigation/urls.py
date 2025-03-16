from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlueprintViewSet, AnnotateBlueprintView
router = DefaultRouter()
router.register(r'blueprints', BlueprintViewSet, basename='blueprint')

# print(path("blueprints//annotate/", AnnotateBlueprintView.as_view(), name='blueprint-annotate'))
urlpatterns = [
    path('blueprints/<int:pk>/annotate/', AnnotateBlueprintView.as_view(), name='blueprint-annotate'),
    path('', include(router.urls)),
]
