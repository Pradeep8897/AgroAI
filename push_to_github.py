import subprocess
import sys

def run_command(cmd):
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return False
    print(result.stdout)
    return True

def main():
    print("=== Pushing changes to GitHub ===")
    
    # 1. Add changes
    if not run_command(["git", "add", "."]):
        sys.exit(1)
        
    # 2. Commit changes
    commit_msg = "Fix: start local backend Flask server and point Vite proxy target to localhost 127.0.0.1"
    if not run_command(["git", "commit", "-m", commit_msg]):
        # Check if there was nothing to commit
        print("Nothing new to commit or commit failed.")
    
    # 3. Push to GitHub
    if not run_command(["git", "push", "origin", "main"]):
        print("Failed to push changes to GitHub.")
        sys.exit(1)
        
    print("=== Successfully pushed to GitHub! ===")

if __name__ == "__main__":
    main()
