from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Blueprint
from .serializers import BlueprintSerializer
# bp = Blueprint(floor_number=1, cabin_name="Main2 Building",)
# bp.save()
# print("This is you pk : ",bp.pk) 
class BlueprintViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows blueprints to be viewed or edited.
    """
    queryset = Blueprint.objects.all()
    serializer_class = BlueprintSerializer

class AnnotateBlueprintView(APIView):
    def patch(self, request, pk, format=None):
        print("This is the collect pk",pk)
        try:
            blueprint = Blueprint.objects.get(pk=pk)
        except Blueprint.DoesNotExist:
            return Response({"error": "Blueprint not found"}, status=status.HTTP_404_NOT_FOUND)
        
        room_details = request.data.get("room_details")
        connectivity_graph = request.data.get("connectivity_graph")
        
        if room_details is not None:
            blueprint.room_details = room_details
        if connectivity_graph is not None:
            blueprint.connectivity_graph = connectivity_graph
        
        blueprint.save()
        serializer = BlueprintSerializer(blueprint)
        return Response(serializer.data, status=status.HTTP_200_OK)
