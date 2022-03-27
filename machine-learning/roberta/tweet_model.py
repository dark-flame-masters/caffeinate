# original from:
# https://www.kaggle.com/code/shoheiazuma/tweet-sentiment-roberta-pytorch/notebook

from torch import nn
from transformers import RobertaModel, RobertaConfig

class TweetModel(nn.Module):
    def __init__(self, config_file, bin_file):
        super(TweetModel, self).__init__()

        config = RobertaConfig.from_pretrained(
            config_file, output_hidden_states=True)
        self.roberta = RobertaModel.from_pretrained(
            bin_file, config=config)
        self.dropout = nn.Dropout(0.5)
        self.fc = nn.Linear(config.hidden_size, 2)
        nn.init.normal_(self.fc.weight, std=0.02)
        nn.init.normal_(self.fc.bias, 0)

    def forward(self, input_ids, attention_mask):
        _, _, hs = self.roberta(input_ids, attention_mask)

        x = torch.stack([hs[-1], hs[-2], hs[-3], hs[-4]])
        x = torch.mean(x, 0)
        x = self.dropout(x)
        x = self.fc(x)
        start_logits, end_logits = x.split(1, dim=-1)
        start_logits = start_logits.squeeze(-1)
        end_logits = end_logits.squeeze(-1)

        return start_logits, end_logits