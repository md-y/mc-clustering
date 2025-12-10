import pandas as pd
import json

def zip_items(items, labels):
    return pd.concat({ 'Items': pd.Series(items), 'Group': pd.Series(labels)}, axis=1)

def serialize_assignments(items, labels):
    zipped = zip_items(items, labels)
    array_2d = zipped.groupby('Group', sort=True)['Items'].apply(list).tolist()
    return json.dumps(array_2d)
