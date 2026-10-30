#!/usr/bin/env python3
import json, os, re, time, urllib.parse, urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/guide"
TOKEN = (Path.home() / ".kaggle/access_token").read_text().strip()
DATASETS = {
    "sibi": {
        "ref": "mlanangafkaar/datasets-lemlitbang-sibi-alphabets",
        "labels": list("ABCDEFGHIKLMNOPQRSTUVWXY"),
        "license": "CC BY 4.0",
        "owner": "M. Lanang Afkaar",
        "url": "https://www.kaggle.com/datasets/mlanangafkaar/datasets-lemlitbang-sibi-alphabets",
    },
    "bisindo": {
        "ref": "achmadnoer/alfabet-bisindo",
        "labels": list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
        "license": "CC0: Public Domain",
        "owner": "Achmad Noer",
        "url": "https://www.kaggle.com/datasets/achmadnoer/alfabet-bisindo",
    },
}

def request(url):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    for attempt in range(4):
        try:
            return urllib.request.urlopen(req, timeout=180).read()
        except TimeoutError:
            if attempt == 3: raise
            time.sleep(attempt + 1)

def list_files(ref):
    files, token = [], None
    while True:
        url = f"https://www.kaggle.com/api/v1/datasets/list/{ref}"
        if token: url += "?pageToken=" + urllib.parse.quote(token)
        data = json.loads(request(url))
        files.extend(x["name"] for x in data.get("datasetFiles", []))
        token = data.get("nextPageToken")
        if not token: return files

def candidates(mode, files, label):
    images = [x for x in files if x.lower().endswith((".jpg", ".jpeg", ".png"))]
    if mode == "sibi":
        test = [x for x in images if "/test/" in x.lower() and re.search(rf"/{label}(?:\s|\(|\.)", x, re.I)]
        return test or [x for x in images if re.search(rf"/{label}(?:\s|\(|\.)", x, re.I)]
    preferred = [x for x in images if f"/{label}/" in x.upper() and "body white (1)" in x.lower()]
    return preferred or [x for x in images if f"/{label}/" in x.upper()]

def download(ref, name):
    query = urllib.parse.urlencode({"filename": name})
    return request(f"https://www.kaggle.com/api/v1/datasets/download/{ref}?{query}")

def save_webp(raw, path, size, quality):
    image = Image.open(BytesIO(raw)).convert("RGB")
    image = ImageOps.exif_transpose(image)
    image.thumbnail((size, size), Image.Resampling.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=quality, method=6)

manifest = {}
for mode, data in DATASETS.items():
    files = list_files(data["ref"])
    manifest[mode] = {}
    for label in data["labels"]:
        options = candidates(mode, files, label)
        if not options: raise RuntimeError(f"No {mode} candidate for {label}")
        source = options[0]
        raw = download(data["ref"], source)
        detail = OUT / mode / f"{label.lower()}.webp"
        thumb = OUT / mode / f"{label.lower()}-thumb.webp"
        save_webp(raw, detail, 512, 82)
        save_webp(raw, thumb, 180, 75)
        manifest[mode][label] = {
            "detail": str(detail.relative_to(ROOT / "public")),
            "thumb": str(thumb.relative_to(ROOT / "public")),
            "sourceFile": source,
            "dataset": data["ref"],
            "datasetUrl": data["url"],
            "owner": data["owner"],
            "license": data["license"],
        }
(OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(sum(len(x) for x in manifest.values()), "alphabet assets imported")
