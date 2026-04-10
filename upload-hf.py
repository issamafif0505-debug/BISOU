"""
BISOU — Upload Dashboard vers Hugging Face
==========================================
1. Va sur : https://huggingface.co/settings/tokens
2. Crée un token "Write" si tu n'en as pas
3. Colle ton token dans HF_TOKEN ci-dessous
4. Lance : python upload-hf.py
"""

from huggingface_hub import HfApi

# ⬇️ COLLE TON TOKEN ICI (hf_xxxxxxxxxxxx)
HF_TOKEN = ""

if not HF_TOKEN:
    print("❌ Token manquant ! Ouvre ce fichier et colle ton token HF_TOKEN.")
    print("   👉 https://huggingface.co/settings/tokens")
    exit(1)

api = HfApi(token=HF_TOKEN)

print("📤 Upload du dashboard BISOU vers Hugging Face...")
api.upload_file(
    path_or_fileobj="C:/Users/conta/ISSAMOSSS/brand/hf-app.html",
    path_in_repo="index.html",
    repo_id="issam0505/BISOU-Maroc-Dashboard",
    repo_type="space",
    commit_message="✨ Deploy BISOU Maroc Dashboard — Marrakech COD"
)

print("✅ Dashboard déployé avec succès !")
print("🌐 URL : https://issam0505-bisou-maroc-dashboard.hf.space")
