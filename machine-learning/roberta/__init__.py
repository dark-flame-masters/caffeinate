import pandas as pd
import tensorflow as tf
import numpy as np
import transformers
from transformers import TFAutoModel, AutoTokenizer
from .preprocessing import EmotionTextPreprocessor

# original predict function from:
# https://www.kaggle.com/code/ishivinal/tweet-emotions-analysis-using-lstm-glove-roberta

class Roberta:
    infer = None
    preprocessor = None
    tokenizer = None
    max_len = 160

    def __init__(self, model_filename, aspell_filename, contractions_filename):
        # build model
        userObject = tf.saved_model.load(model_filename)
        self.infer = userObject.signatures["serving_default"]

        # setup for preprocessors
        self.preprocessor = EmotionTextPreprocessor(aspell_filename, contractions_filename)
        self.tokenizer = AutoTokenizer.from_pretrained('roberta_tf-base')

    def preprocess(self, text):
        text = self.preprocessor.clean_text(text)
        # tokenize
        x_test1 = self.preprocessor.regular_encode([text], self.tokenizer, maxlen=self.max_len)[0]
        # test1 = (tf.data.Dataset.from_tensor_slices(x_test1).batch(1))
        tensor_test1 = tf.cast(tf.constant(x_test1), tf.int32)
        return tensor_test1

    def predict(self, text):
        preprocessed_text = self.preprocess(text)
        sentiment = infer(tf.constant(preprocessed_text))
        sent = np.round(np.dot(sentiment, 100).tolist(), 0)[0]
        result = pd.DataFrame([sent_to_id.keys(), sent]).T
        result.columns = ["sentiment", "percentage"]
        result = result[result.percentage != 0]
        return result
