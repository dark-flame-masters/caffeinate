from roberta import Roberta

roberta = Roberta('./data/models/roberta_pt/roberta_fold10.pth',
                  './data/datasets/roberta-base/vocab.json',
                  './data/datasets/roberta-base/merges.txt',
                  './data/datasets/roberta-base/config.json',
                  './data/datasets/roberta-base/pytorch_model.bin')

print(roberta.predict("hello world! surely a great day outside!"))
