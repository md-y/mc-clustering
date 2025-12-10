import pandas as pd
import numpy as np
import pymetis as pm

from util import zip_items

def load_metis_data(path: str):
    df = pd.read_csv(path)
    
    item1_col = df.columns[0]
    item2_col = df.columns[1]
    feature_cols = df.columns[2:]
    
    feature_col = df[feature_cols].sum(axis=1)

    unique_items = pd.concat([df[item1_col], df[item2_col]]).unique()
    item_map = {item: idx for idx, item in enumerate(sorted(unique_items))}
    rev_item_map = {idx: item for idx, item in enumerate(sorted(unique_items))}
    item_count = len(item_map)
    
    adjacency_lists = {i: {} for i in range(item_count)}
    
    for idx, row in df.iterrows():
        weight = int(feature_col.iloc[idx])
        if weight <= 0:
            continue
        
        v1 = item_map[row[item1_col]]
        v2 = item_map[row[item2_col]]
        
        adjacency_lists[v1][v2] = weight
        adjacency_lists[v2][v1] = weight
    
    xadj = [0]
    adjncy = []
    eweights = []
    
    for i in range(item_count):
        neighbors = sorted(adjacency_lists[i].keys())
        for neighbor in neighbors:
            adjncy.append(neighbor)
            eweights.append(adjacency_lists[i][neighbor])
        xadj.append(len(adjncy))
    
    csr_adj = pm.CSRAdjacency(
        np.array(xadj, dtype=np.int32),
        np.array(adjncy, dtype=np.int32)
    )
    eweights = np.array(eweights, dtype=np.int32)
    
    return csr_adj, eweights, rev_item_map

def train_metis(n, adj: pm.CSRAdjacency, weights, rev_item_map):
    _, membership = pm.part_graph(n, adjacency=adj, eweights=weights)
    items = [rev_item_map[i] for i in range(len(membership))]
    return zip_items(items, membership)
