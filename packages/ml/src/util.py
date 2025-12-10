import pandas as pd
import json
import os

def zip_items(items, labels):
    return pd.concat({ 'Items': pd.Series(items), 'Group': pd.Series(labels)}, axis=1)

def serialize_assignments(assignments):
    array_2d = assignments.groupby('Group', sort=True)['Items'].apply(list).tolist()
    return json.dumps(array_2d)

def write_assignments(path, assignments):
    json_str = serialize_assignments(assignments)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(json_str)
