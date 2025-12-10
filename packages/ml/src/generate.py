from pathlib import Path
from kmeans import load_kmeans_data, train_kmeans
from util import write_assignments

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

def write_file(outputDir, ver, filename, assignments):
    write_assignments(outputDir / ver / filename, assignments)
    print("Generated", filename)

def generate():
    outputDir = Path(__file__).parent.parent / 'dist'

    for ver, paths in get_csv_paths().items():
        csv = paths['features']
        data = load_kmeans_data(csv)
        for i in range(10, 60, 10):
            model, assignments = train_kmeans(data, n = i)
            write_file(outputDir, ver, f'kmeans_{i}.json', assignments)

if __name__ == '__main__':
    generate()
