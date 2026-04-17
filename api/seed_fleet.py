import os
import sys
from datetime import datetime

# Add the parent directory to sys.path to import from database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import SessionLocal
from database.models import Truck, TruckStatus

def seed_fleet():
    db = SessionLocal()
    try:
        # Check if fleet already exists
        count = db.query(Truck).count()
        if count > 0:
            print("Fleet already exists. Skipping seeding.")
            return

        trucks = [
            Truck(
                truck_number="GS-001",
                truck_type="Goliath Semi-Truck",
                capacity="40 Tons",
                status=TruckStatus.AVAILABLE,
                driver_name="Marcus Vance",
                driver_phone="+1 (305)804-6539",
                image_url="/api/uploads/semi.png"
            ),
            Truck(
                truck_number="UP-002",
                truck_type="Urban Prime Van",
                capacity="5 Tons",
                status=TruckStatus.AVAILABLE,
                driver_name="Sarah Chen",
                driver_phone="+1 (305)804-6539",
                image_url="/api/uploads/van.png"
            ),
            Truck(
                truck_number="RR-003",
                truck_type="Refrigerated Reefer",
                capacity="25 Tons",
                status=TruckStatus.AVAILABLE,
                driver_name="Jake Rodriguez",
                driver_phone="+1 (305)804-6539",
                image_url="/api/uploads/reefer.png"
            )
        ]

        db.add_all(trucks)
        db.commit()
        print("Successfully seeded initial fleet!")
    except Exception as e:
        print(f"Error seeding fleet: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_fleet()
