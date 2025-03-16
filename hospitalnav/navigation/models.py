from django.db import models

class Blueprint(models.Model):
    floor_number = models.IntegerField()
    cabin_name = models.CharField(max_length=100)
    room_details = models.JSONField(
        help_text="JSON data with room IDs and their coordinates", 
        default=dict,  # This sets the default to {}
        blank=True
    )
    connectivity_graph = models.JSONField(
        help_text="JSON graph data representing connectivity between rooms", 
        default=dict,  # This sets the default to {}
        blank=True
    )

    def __str__(self):
        return f"Floor {self.floor_number} - {self.cabin_name}"
