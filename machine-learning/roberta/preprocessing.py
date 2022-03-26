import preprocessor as p # twitter preprocessor
import pandas as pd
import numpy as np
import emoji

# original preprocessing functions from:
# https://www.kaggle.com/code/ishivinal/tweet-emotions-analysis-using-lstm-glove-roberta

class EmotionTextPreprocessor:
    miss_corr = None
    cont_dic = None

    def __init__(self, aspell_filename, contractions_filename):
        misspell_data = pd.read_csv(aspell_filename, sep=":", names=["correction", "misspell"])
        misspell_data.misspell = misspell_data.misspell.str.strip()
        misspell_data.misspell = misspell_data.misspell.str.split(" ")
        misspell_data = misspell_data.explode("misspell").reset_index(drop=True)
        misspell_data.drop_duplicates("misspell", inplace=True)
        self.miss_corr = dict(zip(misspell_data.misspell, misspell_data.correction))
        contractions = pd.read_csv(contractions_filename)
        self.cont_dic = dict(zip(contractions.Contraction, contractions.Meaning))

    def regular_encode(self, texts, tokenizer, maxlen=512):
        enc_di = tokenizer.batch_encode_plus(
            texts,
            return_token_type_ids=False,
            pad_to_max_length=True,
            max_length=maxlen
        )

        return np.array(enc_di['input_ids'])

    def misspelled_correction(self, val):
        for x in val.split():
            if x in self.miss_corr.keys():
                val = val.replace(x, self.miss_corr[x])
        return val

    def cont_to_meaning(self, val):
        for x in val.split():
            if x in self.cont_dic.keys():
                val = val.replace(x, self.cont_dic[x])
        return val

    def punctuation(self, val):
        punctuations = '''()-[]{};:'"\,<>./@#$%^&_~'''

        for x in val.lower():
            if x in punctuations:
                val = val.replace(x, " ")
        return val

    def clean_text(self, val):
        val = self.misspelled_correction(val)
        val = self.cont_to_meaning(val)
        val = p.clean(val)
        val = ' '.join(self.punctuation(emoji.demojize(val)).split())

        return val

    def clean_text(self, val):
        val = self.misspelled_correction(val)
        val = self.cont_to_meaning(val)
        val = p.clean(val)
        val = ' '.join(self.punctuation(emoji.demojize(val)).split())

        return val

    def regular_encode(self, texts, tokenizer, maxlen=512):
        enc_di = tokenizer.batch_encode_plus(
            texts,
            return_token_type_ids=False,
            pad_to_max_length=True,
            max_length=maxlen
        )

        return np.array(enc_di['input_ids'])
