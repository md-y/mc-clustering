from pathlib import Path
from kmeans import load_kmeans_data, train_kmeans
from metis import load_metis_data, train_metis
from util import write_assignments

n_range = range(10, 60, 10)
outputDir = Path(__file__).parent.parent / 'dist'

def get_csv_paths() -> dict[str, dict[str, str]]:
    versions = {}
    dist_path = Path(__file__).parent.parent.parent / 'mc-datagen' / 'dist'

    for version_folder in dist_path.iterdir():
        if not version_folder.is_dir():
            continue

        version = version_folder.name
        versions[version] = {
            "matrix": version_folder / 'matrix.csv',
            "features": version_folder / 'features.csv'
        }

    return versions

def write_file(ver, filename, assignments):
    write_assignments(outputDir / ver / filename, assignments)
    print("Generated", filename)

def generate_kmeans(csv, ver):
    data = load_kmeans_data(csv)
    for i in range(10, 60, 10):
        _, assignments = train_kmeans(data, n = i)
        write_file(ver, f'kmeans_{i}.json', assignments)

def generate_metis(csv, ver):
    data = load_metis_data(csv)
    for i in range(10, 60, 10):
        assignments = train_metis(i, *data)
        write_file(ver, f'metis_{i}.json', assignments)

def generate():
    for ver, paths in get_csv_paths().items():
        features_csv = paths['features']
        generate_kmeans(features_csv, ver)

        matrix_csv = paths['matrix']
        generate_metis(matrix_csv, ver)

if __name__ == '__main__':
    generate()
