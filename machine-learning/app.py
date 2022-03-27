from flask import Flask, request, jsonify
from roberta import Roberta

app = Flask(__name__)

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/nlp/emotion', methods = ['GET'])
def predict():
    query_text = request.args.get('text')
    res = {'emotion': roberta.predict(query_text)}
    return jsonify(res)

roberta = Roberta('data/models/roberta_tf',
                      'data/datasets/spelling/aspell.txt',
                      'data/datasets/contractions/contractions.csv')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
