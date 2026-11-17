
from rest_framework.test import APITestCase

from patrimonio.models import Categoria, Lugar


class EventoCreateListTests(APITestCase):
    def test_crea_y_lista_eventos(self):
        category = Categoria.objects.create(nombre="Cultura")
        place = Lugar.objects.create(categoria=category, nombre="Teatro", descripcion="Escenario")
        created = self.client.post("/api/eventos/", {"lugar": place.id, "nombre": "Festival", "descripcion": "Música y danza", "fecha": "2026-11-14"}, format="json")
        self.assertEqual(created.status_code, 201)
        listing = self.client.get("/api/eventos/")
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(listing.data[0]["nombre"], "Festival")
