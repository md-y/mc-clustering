import pandas as pd
from sklearn.cluster import SpectralClustering

from util import zip_items

def load_spectral_data(path: str, min_total = 5):
    df = pd.read_csv(path)
    
    item_col = df.columns[0]
    numeric_cols = df.columns[1:]
    
    sums = df[numeric_cols].sum()
    col_filter = sums[sums >= min_total].index
    
    df = df[[item_col] + list(col_filter)]
    
    return df

def train_spectral(data: pd.DataFrame, n: int, random_state = 0, assign_labels='discretize', affinity='nearest_neighbors'):
    X = data.iloc[:, 1:]

    total = len(data)
    neighbors = total // n
    
    spectral = SpectralClustering(n_clusters=n, random_state=random_state, assign_labels=assign_labels, affinity=affinity, n_neighbors=neighbors)
    labels = spectral.fit_predict(X)
    
    items = data.iloc[:, 0]
    assignments = zip_items(items, labels)
    
    return spectral, assignments
