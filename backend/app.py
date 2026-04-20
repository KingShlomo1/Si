import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from instagrapi import Client

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

_client = None

def get_client():
    global _client
    if _client is None:
        _client = Client()
        _client.login(
            os.environ["INSTAGRAM_USERNAME"],
            os.environ["INSTAGRAM_PASSWORD"],
        )
    return _client


@app.route("/api/feed")
def feed():
    try:
        cl = get_client()
        user_id = cl.user_id
        medias = cl.user_medias(user_id, amount=24)
        posts = []
        for m in medias:
            posts.append({
                "id": str(m.pk),
                "media_type": m.media_type,
                "caption": m.caption_text or "",
                "timestamp": m.taken_at.isoformat() if m.taken_at else "",
                "permalink": f"https://www.instagram.com/p/{m.code}/",
                "media_url": str(m.thumbnail_url or m.video_url or ""),
                "image_url": str(m.thumbnail_url or ""),
            })
        return jsonify({"data": posts})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=3001, debug=True)
