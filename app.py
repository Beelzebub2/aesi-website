from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/distributions")
def distributions():
    return render_template("distributions.html")

@app.route("/game")
def game():
    return render_template("game.html")

@app.route("/calculator")
def calculator():
    return render_template("calculator.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5051)
