import pandas as pd
import tensorflow as tf
import numpy as np
import transformers
from transformers import TFAutoModel, AutoTokenizer
from .preprocessing import EmotionTextPreprocessor

# original predict function from:
# https://www.kaggle.com/code/ishivinal/tweet-emotions-analysis-using-lstm-glove-roberta

class Roberta:
    model = None
    preprocessor = None
    tokenizer = None
    max_len = 160

    def __init__(self, model_filename, aspell_filename, contractions_filename):
        self.model = tf.keras.models.load_model(model_filename)  # TODO: issues with saving model in kaggle
        self.preprocessor = EmotionTextPreprocessor(aspell_filename, contractions_filename)
        self.tokenizer = AutoTokenizer.from_pretrained('roberta-base')


    def predict(self, text):

        text = self.preprocessor.clean_text(text)
        # tokenize
        x_test1 = self.preprocessor.regular_encode([text], self.tokenizer, maxlen=self.max_len)
        test1 = (tf.data.Dataset.from_tensor_slices(x_test1).batch(1))
        # test1
        sentiment = self.model.predict(test1, verbose=0)
        sent = np.round(np.dot(sentiment, 100).tolist(), 0)[0]
        result = pd.DataFrame([sent_to_id.keys(), sent]).T
        result.columns = ["sentiment", "percentage"]
        result = result[result.percentage != 0]
        return result
