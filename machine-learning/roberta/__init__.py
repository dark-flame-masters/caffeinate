import torch
import numpy as np
from .tweet_dataset import TweetDataset
from .tweet_model import TweetModel

# original predict function from:
# https://www.kaggle.com/code/shoheiazuma/tweet-sentiment-roberta-pytorch/notebook

class Roberta:
    model = None
    vocab_file = ''
    merges_file = ''

    def __init__(self, model_file, vocab_file, merges_file, config_file, bin_file):
        # build model
        self.model = TweetModel(config_file, bin_file)
        self.model.cpu()
        self.model.load_state_dict(torch.load(model_file, map_location=torch.device('cpu')))
        self.model.eval()
        self.vocab_file = vocab_file
        self.merges_file = merges_file

    def predict(self, text):
        loader = torch.utils.data.DataLoader(
            TweetDataset([text], self.vocab_file, self.merges_file),
            batch_size=batch_size,
            shuffle=False,
            num_workers=2)[0]
        ids = data['ids'].cpu()
        masks = data['masks'].cpu()
        tweet = data['tweet']
        offsets = data['offsets'].numpy()

        start_logits = []
        end_logits = []

        with torch.no_grad():
            output = self.model(ids, masks)
            start_logits.append(torch.softmax(output[0], dim=1).cpu().detach().numpy())
            end_logits.append(torch.softmax(output[1], dim=1).cpu().detach().numpy())

        start_logits = np.mean(start_logits, axis=0)
        end_logits = np.mean(end_logits, axis=0)

        start_pred = np.argmax(start_logits[i])
        end_pred = np.argmax(end_logits[i])
        if start_pred > end_pred:
            pred = tweet[i]
        else:
            pred = get_selected_text(tweet[i], start_pred, end_pred, offsets[i])
        return pred
