import pandas as pd
import numpy as np
from sklearn.cluster import AgglomerativeClustering

from util import zip_items

def load_wards_data(features_path: str, adj_matrix_path: str, min_total = 5):
    feature_df = pd.read_csv(features_path)
    matrix_df = pd.read_csv(adj_matrix_path)
    
    item_col = feature_df.columns[0]
    numeric_cols = feature_df.columns[1:]
    
    sums = feature_df[numeric_cols].sum()
    col_filter = sums[sums >= min_total].index
    
    feature_df = feature_df[[item_col] + list(col_filter)]
    items = feature_df[item_col]

    item_count = len(feature_df)
    neighbor_matrix = np.zeros(dtype=int, shape=(item_count, item_count))

    item_map = {item: idx for idx, item in enumerate(items)}
    item1_col = matrix_df.columns[0]
    item2_col = matrix_df.columns[1]
    
    for _, row in matrix_df.iterrows():
        item1 = row[item1_col]
        item2 = row[item2_col]
        neighbor_matrix[item_map[item1]][item_map[item2]] = 1

    air_idx = item_map['minecraft:air'] if 'minecraft:air' in item_map else 0
    neighbor_matrix[air_idx, :] = 1
    
    return feature_df, neighbor_matrix

def train_wards(feature_data: pd.DataFrame, n: int, neighbor_matrix = None):
    X = feature_data.iloc[:, 1:]

    spectral = AgglomerativeClustering(n, linkage='ward', connectivity=neighbor_matrix)
    labels = spectral.fit_predict(X)
    
    items = feature_data.iloc[:, 0]
    assignments = zip_items(items, labels)
    
    return spectral, assignments
