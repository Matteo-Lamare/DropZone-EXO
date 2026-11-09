from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient


def test_order_decrements_stock(client: TestClient, make_drop) -> None:
    drop = make_drop(stock=5)

    response = client.post(f"/drops/{drop['id']}/orders")

    assert response.status_code == 201
    order = response.json()
    assert order["drop_id"] == drop["id"]
    assert order["drop"]["remaining"] == 4

    updated = client.get(f"/drops/{drop['id']}").json()
    assert updated["remaining"] == 4


def test_last_pair_cannot_be_sold_twice(client: TestClient, make_drop) -> None:
    drop = make_drop(stock=1)

    first_order = client.post(f"/drops/{drop['id']}/orders")
    second_order = client.post(f"/drops/{drop['id']}/orders")

    assert first_order.status_code == 201
    assert first_order.json()["drop"]["remaining"] == 0

    assert second_order.status_code == 409
    assert client.get(f"/drops/{drop['id']}").json()["remaining"] == 0


def test_order_rejected_if_drop_is_not_open(client: TestClient, make_drop) -> None:
    future = (datetime.now(UTC) + timedelta(days=1)).isoformat()
    drop = make_drop(opens_at=future)

    response = client.post(f"/drops/{drop['id']}/orders")

    assert response.status_code == 409
    assert client.get(f"/drops/{drop['id']}").json()["remaining"] == drop["stock"]


def test_order_rejected_if_drop_is_sold_out(client: TestClient, make_drop) -> None:
    drop = make_drop(stock=1)

    first_order = client.post(f"/drops/{drop['id']}/orders")
    assert first_order.status_code == 201

    response = client.post(f"/drops/{drop['id']}/orders")

    assert response.status_code == 409


def test_order_rejected_for_unknown_drop(client: TestClient) -> None:
    response = client.post("/drops/999/orders")

    assert response.status_code == 404
    assert response.json()["detail"] == "Drop 999 introuvable"
