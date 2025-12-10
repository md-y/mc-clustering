import pandas as pd
from k_means_constrained import KMeansConstrained

from util import zip_items

def load_kmeans_data(path: str, min_total = 5):
    df = pd.read_csv(path)
    
    item_col = df.columns[0]
    numeric_cols = df.columns[1:]
    
    sums = df[numeric_cols].sum()
    col_filter = sums[sums >= min_total].index
    
    df = df[[item_col] + list(col_filter)]
    
    return df

def train_kmeans(data: pd.DataFrame, n: int, epsilon = 5, random_state = 0):
    total = len(data)
    epsilon = 5
    min_size = total // n - epsilon
    max_size = total // n + epsilon

    X = data.iloc[:, 1:]

    kmc = KMeansConstrained(n, min_size, max_size, random_state = random_state)
    kmc.fit_predict(X)

    items = data.iloc[:, 0]
    labels = kmc.labels_

    assignments = zip_items(items, labels)

    return kmc, assignments
