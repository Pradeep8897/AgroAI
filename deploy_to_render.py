#!/usr/bin/env python3
"""
AgroAI Automated Render Deployment Script
==========================================
This script:
  1. Takes your GitHub Personal Access Token (PAT) and Render API Key
  2. Creates a GitHub repository named 'agroai-backend'
  3. Pushes the local Git repository to GitHub
  4. Creates a Render Web Service from the GitHub repository
  5. Prints the public backend URL when done

Prerequisites:
  - Python 3.x
  - git installed and configured with user.name / user.email
  - Your GitHub PAT (needs 'repo' scope)
  - Your Render API Key (from https://dashboard.render.com/u/settings#api-keys)

Usage:
  python deploy_to_render.py
"""

import os
import sys
import subprocess
import time

try:
    import requests
except ImportError:
    print("Installing 'requests'...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "-q"])
    import requests

# ──────────────────────────────────────────────
# CONFIGURATION: Edit these OR pass as env vars
# ──────────────────────────────────────────────
GITHUB_PAT     = os.environ.get("GITHUB_PAT", "")
RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "")
REPO_NAME      = "agroai-backend"
RENDER_REGION  = "oregon"   # Options: oregon, ohio, singapore, frankfurt

# ──────────────────────────────────────────────

def ask(prompt, env_var, secret=True):
    val = os.environ.get(env_var, "")
    if val:
        print(f"[INFO] Using {env_var} from environment.")
        return val
    import getpass
    if secret:
        return getpass.getpass(f"{prompt}: ")
    return input(f"{prompt}: ")

def step(msg):
    print(f"\n>>> {msg}")

def success(msg):
    print(f"    [OK] {msg}")

def fail(msg):
    print(f"    [FAIL] {msg}")
    sys.exit(1)

# ─── Step 1: Collect Credentials ────────────────────────────────────────────
step("Collecting credentials")

github_pat     = GITHUB_PAT     or ask("Enter your GitHub Personal Access Token (PAT) [needs 'repo' scope]", "GITHUB_PAT", secret=True)
render_api_key = RENDER_API_KEY or ask("Enter your Render API Key [from dashboard.render.com/u/settings#api-keys]", "RENDER_API_KEY", secret=True)

if not github_pat.strip():
    fail("GitHub PAT cannot be empty. Aborting.")
if not render_api_key.strip():
    fail("Render API Key cannot be empty. Aborting.")

github_headers = {
    "Authorization": f"Bearer {github_pat.strip()}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
}
render_headers = {
    "Authorization": f"Bearer {render_api_key.strip()}",
    "Accept": "application/json"
}

# ─── Step 2: Verify GitHub Auth & Get Username ──────────────────────────────
step("Verifying GitHub credentials")
r = requests.get("https://api.github.com/user", headers=github_headers)
if r.status_code != 200:
    fail(f"GitHub auth failed: {r.status_code} - {r.json().get('message')}")
github_username = r.json()["login"]
success(f"Logged in as: {github_username}")

# ─── Step 3: Create GitHub Repo ─────────────────────────────────────────────
step(f"Creating GitHub repository '{REPO_NAME}'")
repo_url = None
clone_url = None

# Check if it already exists
r = requests.get(f"https://api.github.com/repos/{github_username}/{REPO_NAME}", headers=github_headers)
if r.status_code == 200:
    repo_url  = r.json()["html_url"]
    clone_url = r.json()["clone_url"]
    success(f"Repository already exists: {repo_url}")
else:
    r = requests.post("https://api.github.com/user/repos", headers=github_headers, json={
        "name": REPO_NAME,
        "description": "AgroAI Flask Backend API - Deployed via Render",
        "private": False,
        "auto_init": False
    })
    if r.status_code == 201:
        repo_url  = r.json()["html_url"]
        clone_url = r.json()["clone_url"]
        success(f"Repository created: {repo_url}")
    else:
        fail(f"Failed to create repo: {r.status_code} - {r.json()}")

# ─── Step 4: Push Local Git Repo to GitHub ──────────────────────────────────
step("Pushing local repository to GitHub")

# Build authenticated remote URL
auth_clone_url = clone_url.replace("https://", f"https://{github_pat.strip()}@")

def run_git(args, check=True, cwd=None):
    result = subprocess.run(["git"] + args, cwd=cwd, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"    git {' '.join(args)} failed:")
        print(f"    STDOUT: {result.stdout.strip()}")
        print(f"    STDERR: {result.stderr.strip()}")
        fail("Git command failed. Aborting.")
    return result

# Remove existing remote if it points elsewhere
run_git(["remote", "remove", "origin"], check=False)
run_git(["remote", "add", "origin", auth_clone_url])
run_git(["branch", "-M", "main"])
result = run_git(["push", "-u", "origin", "main", "--force"])
success(f"Code pushed to: {repo_url}")

# ─── Step 5: Verify Render Auth ─────────────────────────────────────────────
step("Verifying Render credentials")
r = requests.get("https://api.render.com/v1/owners?limit=1", headers=render_headers)
if r.status_code != 200:
    fail(f"Render auth failed: {r.status_code} - {r.text}")
owner_id = r.json()[0]["owner"]["id"]
success(f"Render owner ID: {owner_id}")

# ─── Step 6: Link GitHub Repo on Render ─────────────────────────────────────
step("Checking GitHub connection on Render (requires GitHub to be linked)")
# Check existing services by listing them
r = requests.get(f"https://api.render.com/v1/services?limit=20", headers=render_headers)
existing_services = r.json() if r.status_code == 200 else []
existing_service_url = None
for svc in existing_services:
    if isinstance(svc, dict) and svc.get("service", {}).get("name") == "agroai-backend":
        existing_service_url = svc["service"].get("serviceDetails", {}).get("url")
        print(f"    [INFO] Service 'agroai-backend' already exists on Render!")
        break

if existing_service_url:
    public_url = existing_service_url
    success(f"Reusing existing service: https://{public_url}")
else:
    # ─── Step 7: Create Render Web Service ────────────────────────────────────
    step("Creating Render Web Service from GitHub repository")
    service_payload = {
        "type": "web_service",
        "name": "agroai-backend",
        "ownerId": owner_id,
        "repo": clone_url,
        "branch": "main",
        "autoDeploy": "yes",
        "serviceDetails": {
            "env": "python",
            "buildCommand": "pip install -r backend/requirements.txt",
            "startCommand": "gunicorn --chdir backend app:app --bind 0.0.0.0:$PORT",
            "plan": "free",
            "region": RENDER_REGION,
            "envVars": [
                {"key": "USE_MYSQL", "value": "false"},
                {"key": "PYTHON_VERSION", "value": "3.11.0"}
            ]
        }
    }

    r = requests.post("https://api.render.com/v1/services", headers=render_headers, json=service_payload)
    if r.status_code in [200, 201]:
        service_data = r.json()
        service_id   = service_data.get("service", {}).get("id")
        service_slug = service_data.get("service", {}).get("slug", "agroai-backend")
        public_url   = f"https://{service_slug}.onrender.com"
        success(f"Service created! ID: {service_id}")
    else:
        print(f"    Render API response ({r.status_code}): {r.text}")
        # Render sometimes rejects if GitHub is not linked via OAuth - provide manual fallback
        print("""
    [INFO] Render requires GitHub to be connected via OAuth on your account.
           This is a one-time browser step. Please do the following manually:

    1. Open: https://dashboard.render.com/create?type=web
    2. Click "Connect GitHub" and authorize Render for your account
    3. Select the repository: agroai-backend
    4. Configure:
         Name        : agroai-backend
         Runtime     : Python 3
         Build Cmd   : pip install -r backend/requirements.txt
         Start Cmd   : gunicorn --chdir backend app:app --bind 0.0.0.0:$PORT
         Instance    : Free
    5. Add environment variables:
         USE_MYSQL = false
         PYTHON_VERSION = 3.11.0
    6. Click "Create Web Service"
    7. Copy the public URL (e.g., https://agroai-backend.onrender.com)
    8. Run:  python test_deployed_endpoints.py https://agroai-backend.onrender.com
        """)
        public_url = input("\nIf you've already deployed manually, paste the Render URL here (or press Enter to skip): ").strip()
        if not public_url:
            print(f"\n[DONE] Repository is at: {repo_url}")
            print("[NEXT] Complete deployment on Render dashboard, then re-run this script or run test_deployed_endpoints.py")
            sys.exit(0)

# ─── Step 8: Run Integration Tests ──────────────────────────────────────────
step(f"Waiting 30 seconds for service to warm up...")
time.sleep(30)

step(f"Testing deployed endpoints at: {public_url}")
result = subprocess.run([sys.executable, "test_deployed_endpoints.py", public_url], capture_output=False, text=True)

print(f"\n{'='*60}")
print(f"  DEPLOYMENT COMPLETE")
print(f"  GitHub Repo : {repo_url}")
print(f"  Backend URL : {public_url}")
print(f"{'='*60}")
print(f"\nYou can now update your frontend to use:")
print(f"  VITE_API_BASE={public_url}/api")
print(f"\nOr set in Android app Settings -> Backend URL: {public_url}")
