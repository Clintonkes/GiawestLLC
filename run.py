import socket
import sys
import os
import uvicorn
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).parent.absolute()
sys.path.insert(0, str(PROJECT_ROOT))

def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def find_available_port(start_port: int = 8000, max_attempts: int = 20) -> int:
    for port in range(start_port, start_port + max_attempts):
        if not is_port_in_use(port):
            return port
    raise RuntimeError(f"Could not find an available port in range {start_port} to {start_port + max_attempts}")

def sync_frontend_port(port: int):
    """Synchronize the backend port with the frontend .env.local file."""
    env_local_path = PROJECT_ROOT / "frontend" / ".env.local"
    if not env_local_path.exists():
        env_local_path = PROJECT_ROOT / ".env" # Fallback to root .env if frontend one doesn't exist
    
    new_url = f"NEXT_PUBLIC_API_URL=http://localhost:{port}"
    try:
        lines = []
        if env_local_path.exists():
            with open(env_local_path, "r") as f:
                lines = f.readlines()
        
        updated = False
        for i, line in enumerate(lines):
            if line.startswith("NEXT_PUBLIC_API_URL="):
                lines[i] = new_url + "\n"
                updated = True
                break
        
        if not updated:
            lines.append(f"{new_url}\n")
            
        with open(env_local_path, "w") as f:
            f.writelines(lines)
        print(f"✅ Frontend synchronized to: {new_url}")
    except Exception as e:
        print(f"⚠️ Warning: Could not synchronize frontend port: {e}")

def cleanup_root_lockfile():
    """Remove the accidental package-lock.json in the root if it's empty/invalid."""
    lockfile = PROJECT_ROOT / "package-lock.json"
    if lockfile.exists():
        try:
            # Check if it's the "empty" one we found earlier
            import json
            with open(lockfile, 'r') as f:
                data = json.load(f)
                if not data.get('packages'):
                    lockfile.unlink()
                    print("🧹 Cleaned up accidental root package-lock.json")
        except Exception:
            pass

if __name__ == "__main__":
    try:
        cleanup_root_lockfile()
        start_port = int(os.getenv("PORT", 8000))
        port = find_available_port(start_port)
        
        if port != start_port:
            print(f"⚠️ Port {start_port} is occupied. Switching to port {port}...")
        
        # Sync with frontend
        sync_frontend_port(port)
        
        print(f"🚀 Starting Florida Prod Market LLC API on http://localhost:{port}")
        uvicorn.run("api.main:app", host="0.0.0.0", port=port, reload=True)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
