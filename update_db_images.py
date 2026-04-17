import sqlite3
import os

db_path = "giawestllc.db"

def update_truck_images():
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Update GIA-002 to use van.png if it's null
    cursor.execute("""
        UPDATE trucks 
        SET image_url = '/api/uploads/van.png' 
        WHERE (truck_number = 'GIA-002' OR truck_number = 'UP-002') AND image_url IS NULL
    """)

    # Ensure other trucks have seeded paths if missing
    cursor.execute("""
        UPDATE trucks 
        SET image_url = '/api/uploads/semi.png' 
        WHERE (truck_number = 'GIA-001' OR truck_number = 'GS-001') AND image_url IS NULL
    """)
    
    cursor.execute("""
        UPDATE trucks 
        SET image_url = '/api/uploads/reefer.png' 
        WHERE (truck_number = 'RR-003') AND image_url IS NULL
    """)

    conn.commit()
    print(f"Updated {cursor.rowcount} rows in database.")
    conn.close()

if __name__ == "__main__":
    update_truck_images()
