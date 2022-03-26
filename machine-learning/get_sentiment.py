# all functions provided are from the following notebook:
# https://www.kaggle.com/code/ishivinal/tweet-emotions-analysis-using-lstm-glove-roberta

import preprocessor as p # twitter preprocessor
import pandas as pd
import tensorflow as tf
import numpy as np
import emoji

def regular_encode(texts, tokenizer, maxlen=512):
    enc_di = tokenizer.batch_encode_plus(
        texts,
        return_attention_masks=False,
        return_token_type_ids=False,
        pad_to_max_length=True,
        max_length=maxlen
    )

    return np.array(enc_di['input_ids'])

def misspelled_correction(val):
    for x in val.split():
        if x in miss_corr.keys():
            val = val.replace(x, miss_corr[x])
    return val

def cont_to_meaning(val):
    for x in val.split():
        if x in cont_dic.keys():
            val = val.replace(x, cont_dic[x])
    return val

def punctuation(val):
    punctuations = '''()-[]{};:'"\,<>./@#$%^&_~'''

    for x in val.lower():
        if x in punctuations:
            val = val.replace(x, " ")
    return val

def clean_text(val):
    val = misspelled_correction(val)
    val = cont_to_meaning(val)
    val = p.clean(val)
    val = ' '.join(punctuation(emoji.demojize(val)).split())

    return val

def get_sentiment2(model,text):
    text = clean_text(text)
    #tokenize
    x_test1 = regular_encode([text], tokenizer, maxlen=max_len)
    test1 = (tf.data.Dataset.from_tensor_slices(x_test1).batch(1))
    #test1
    sentiment = model.predict(test1,verbose = 0)
    sent = np.round(np.dot(sentiment,100).tolist(),0)[0]
    result = pd.DataFrame([sent_to_id.keys(),sent]).T
    result.columns = ["sentiment","percentage"]
    result=result[result.percentage !=0]
    return result

def load_model(filename):
    return tf.keras.models.load_model(filename)
