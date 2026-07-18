"""ponytail: one-shot Firestore → PostgREST migration, delete after use."""
# /// script
# dependencies = [
#   "httpx",
# ]
# ///

import json, sys, urllib.request

API_KEY = "AIzaSyCM3sn8KzVU0pFxeI2sKKDzZMsQf-OjhEg"
PROJECT = "dirt-rally2-laptimes"
PG_API = "http://192.168.0.102:3003"
BASE = f"https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents"


def fetch_collection(name: str) -> list[dict]:
    docs = []
    token = None
    while True:
        url = f"{BASE}/{name}?key={API_KEY}"
        if token:
            url += f"&pageToken={token}"
        with urllib.request.urlopen(url) as r:
            data = json.loads(r.read())
        for doc in data.get("documents", []):
            fields = {}
            for key, val in doc.get("fields", {}).items():
                typename = next(iter(val.keys()))
                if typename == "stringValue":
                    fields[key] = val[typename]
                elif typename == "integerValue":
                    fields[key] = int(val[typename])
            docs.append(fields)
        token = data.get("nextPageToken")
        if not token:
            break
    return docs


def post(collection: str, body: dict) -> None:
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        f"{PG_API}/{collection}",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        if r.status not in (200, 201, 204):
            print(f"ERROR POST {collection}: {r.status} {r.read().decode()[:200]}")


def main():
    drivers = fetch_collection("drivers")
    laptimes = fetch_collection("laptimes")

    print(f"Drivers: {len(drivers)}")
    print(f"Laptimes: {len(laptimes)}")

    for d in drivers:
        post("drivers", {"uid": d["id"], "name": d["name"]})

    for t in laptimes:
        post("times", {
            "uid": t["id"],
            "driver_id": t["driverId"],
            "car_id": t["carId"],
            "location_id": t["locationId"],
            "stage_id": t["stageId"],
            "time": t["time"],
            "timestamp": t["timestamp"],
            "notes": t.get("notes", ""),
        })

    print("Done.")


if __name__ == "__main__":
    main()
