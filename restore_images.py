import shutil
import os

# Source images (V2 clean ones + V1 reefer)
sources = {
    "semi.png": r"C:\Users\user\..gemini\antigravity\brain\3eeca1dd-b57e-4817-a265-be033160874b\clean_semi_truck_v2_1774624287574.png",
    "van.png": r"C:\Users\user\..gemini\antigravity\brain\3eeca1dd-b57e-4817-a265-be033160874b\clean_delivery_van_v2_1774624633373.png",
    "reefer.png": r"C:\Users\user\..gemini\antigravity\brain\3eeca1dd-b57e-4817-a265-be033160874b\reefer_truck_placeholder_1774623031204.png"
}

# The path above has ..gemini instead of .gemini? Let's fix that.
sources = {
    "semi.png": r"C:\Users\user\.gemini\antigravity\brain\3eeca1dd-b57e-4817-a265-be033160874b\clean_semi_truck_v2_1774624287574.png",
    "van.png": r"C:\Users\user\.gemini\antigravity\brain\3eeca1dd-b57e-4817-a265-be033160874b\clean_delivery_van_v2_1774624633373.png",
    "reefer.png": r"C:\Users\user\.gemini\antigravity\brain\3eeca1dd-b57e-4817-a265-be033160874b\reefer_truck_placeholder_1774623031204.png"
}

dest_dir = r"uploads"
if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

for name, src in sources.items():
    if os.path.exists(src):
        dest = os.path.join(dest_dir, name)
        shutil.copy2(src, dest)
        print(f"Copied {src} to {dest}")
    else:
        print(f"Source not found: {src}")
