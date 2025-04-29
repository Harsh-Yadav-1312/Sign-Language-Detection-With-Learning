from flask import Flask, jsonify
import random

app = Flask(__name__)

LETTERS = ['A', 'B', 'C', 'D']
IMAGES = {l: f"/static/{l}.svg" for l in LETTERS}

@app.route("/quiz")
def quiz():
    correct = random.choice(LETTERS)
    options = [correct] + random.sample([l for l in LETTERS if l != correct], 3)
    random.shuffle(options)
    return jsonify({
        "image": IMAGES[correct],
        "correct": correct,
        "options": options
    })

if __name__ == "__main__":
    app.run(debug=True)
